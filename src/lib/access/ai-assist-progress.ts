import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { getSupabaseConfig, supabaseRequest } from "./daily-limits";

export const aiAssistIds = ["assist-1", "assist-2", "assist-3"] as const;

export type AiAssistId = (typeof aiAssistIds)[number];

export type AiAssistProgress = {
  completed: AiAssistId[];
  storageError?: string;
};

type ProgressFile = {
  users?: Record<string, Partial<Record<AiAssistId, string>>>;
};

const progressPath = path.join(process.cwd(), "data", "ai-assist-progress.json");
const progressSupabaseTable = process.env.SUPABASE_AI_ASSIST_PROGRESS_TABLE || "ai_assist_progress";
const supabaseSetupMessage =
  "AI Assist progress needs a Supabase schema update. Run data/supabase-daily-limits.sql in Supabase SQL editor so a finished assist can unlock the next one.";

export function isAiAssistId(value: unknown): value is AiAssistId {
  return typeof value === "string" && (aiAssistIds as readonly string[]).includes(value);
}

export function getAiAssistLabel(assistId: AiAssistId) {
  return `AI Assist ${aiAssistIds.indexOf(assistId) + 1}`;
}

// Assists unlock in order: the first is always open, and each later one
// opens once the assist before it has been finished.
export function getPreviousAiAssist(assistId: AiAssistId) {
  const index = aiAssistIds.indexOf(assistId);

  return index > 0 ? aiAssistIds[index - 1] : null;
}

export function isAiAssistUnlocked(assistId: AiAssistId, completed: readonly AiAssistId[]) {
  const previous = getPreviousAiAssist(assistId);

  return previous === null || completed.includes(previous);
}

async function readProgressFile(): Promise<NonNullable<ProgressFile["users"]>> {
  try {
    const raw = await fs.readFile(progressPath, "utf8");
    const parsed = JSON.parse(raw) as ProgressFile;

    return parsed.users && typeof parsed.users === "object" ? parsed.users : {};
  } catch {
    return {};
  }
}

export async function getAiAssistProgress(email: string): Promise<AiAssistProgress> {
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRequest<Array<{ assist_id?: string | null }>>(
        `${progressSupabaseTable}?select=assist_id&email=eq.${encodeURIComponent(email)}`,
      );

      return { completed: (rows || []).map((row) => row.assist_id).filter(isAiAssistId) };
    } catch {
      return { completed: [], storageError: supabaseSetupMessage };
    }
  }

  const users = await readProgressFile();

  return { completed: aiAssistIds.filter((assistId) => Boolean(users[email]?.[assistId])) };
}

export async function markAiAssistComplete(email: string, assistId: AiAssistId) {
  const completedAt = new Date().toISOString();

  if (getSupabaseConfig()) {
    await supabaseRequest<null>(`${progressSupabaseTable}?on_conflict=email,assist_id`, {
      method: "POST",
      headers: {
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ email, assist_id: assistId, completed_at: completedAt }),
    });
    return;
  }

  const users = await readProgressFile();
  if (users[email]?.[assistId]) return;

  users[email] = { ...users[email], [assistId]: completedAt };

  await fs.mkdir(path.dirname(progressPath), { recursive: true });
  await fs.writeFile(progressPath, `${JSON.stringify({ users }, null, 2)}\n`);
}
