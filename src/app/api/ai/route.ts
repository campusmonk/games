import { getUserSession } from "@/lib/access/allowlist";

// Server-side proxy for the AI Assist arenas, so GROQ_API_KEY never reaches
// the browser. The arenas POST { provider, model, system, messages,
// maxTokens, temperature, reasoningEffort } and read back { text } or { error }.

const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
const defaultGroqModel = "openai/gpt-oss-120b";
const allowedGroqModels = new Set([defaultGroqModel, "openai/gpt-oss-20b"]);
const reasoningEfforts = new Set(["low", "medium", "high"]);
const maxMessages = 14;
const maxMessageLength = 14000;

type IncomingMessage = {
  role?: unknown;
  content?: unknown;
  text?: unknown;
};

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

function normalizeMessages(messages: unknown) {
  if (!Array.isArray(messages)) return [];

  return messages.slice(-maxMessages).flatMap((message: IncomingMessage) => {
    const content = String(message?.content ?? message?.text ?? "").slice(0, maxMessageLength);
    if (!content.trim()) return [];

    const role = message?.role === "assistant" ? "assistant" : "user";

    return [{ role, content }];
  });
}

export async function POST(request: Request) {
  // The arenas run for signed-in users only; without this check the route
  // would be an open, key-billed Groq proxy.
  if (!(await getUserSession())) return errorResponse("Sign in to use the AI assistant.", 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (body.provider !== "groq") {
    return errorResponse(`The ${String(body.provider || "requested")} provider is not configured.`, 503);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return errorResponse("GROQ_API_KEY is not set on the server.", 503);

  const messages = normalizeMessages(body.messages);
  if (messages.length === 0) return errorResponse("No messages to send.", 400);

  const system = String(body.system ?? "").slice(0, maxMessageLength);
  const model = typeof body.model === "string" && allowedGroqModels.has(body.model) ? body.model : defaultGroqModel;
  const maxTokens = Math.min(Math.max(Number(body.maxTokens) || 800, 1), 1200);
  const temperature = Math.min(Math.max(Number(body.temperature) || 0.55, 0), 1);

  const groqBody: Record<string, unknown> = {
    model,
    messages: system ? [{ role: "system", content: system }, ...messages] : messages,
    // gpt-oss spends part of the budget on reasoning, so leave headroom
    // beyond the visible answer the arena asked for.
    max_completion_tokens: maxTokens + 1500,
    temperature,
  };
  if (typeof body.reasoningEffort === "string" && reasoningEfforts.has(body.reasoningEffort)) {
    groqBody.reasoning_effort = body.reasoningEffort;
  }

  let groqResponse: Response;
  try {
    groqResponse = await fetch(groqEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groqBody),
      cache: "no-store",
      signal: request.signal,
    });
  } catch {
    return errorResponse("Could not reach Groq.", 502);
  }

  const data = await groqResponse.json().catch(() => null);

  if (!groqResponse.ok) {
    const detail = data?.error?.message ? ` ${data.error.message}` : "";
    return errorResponse(`Groq request failed with status ${groqResponse.status}.${detail}`, 502);
  }

  const text = String(data?.choices?.[0]?.message?.content ?? "").trim();
  if (!text) return errorResponse("Groq returned an empty response.", 502);

  return Response.json({ text });
}
