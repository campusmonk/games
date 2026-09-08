const USER_COOKIE = "cg_user_access";
const ADMIN_COOKIE = "cg_admin_access";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AccessSession = {
  email: string;
  kind: "user" | "admin";
  exp: number;
};

export const accessCookieNames = {
  user: USER_COOKIE,
  admin: ADMIN_COOKIE,
} as const;

function getSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-only-change-me";
}

function toBase64Url(input: ArrayBuffer | Uint8Array | string) {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : input instanceof Uint8Array
        ? input
        : new Uint8Array(input);

  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);

  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: string) {
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));

  return toBase64Url(signature);
}

export async function createAccessToken(
  data: Pick<AccessSession, "email" | "kind">,
  ttlSeconds = SESSION_TTL_SECONDS,
) {
  const payload = toBase64Url(
    JSON.stringify({
      ...data,
      email: data.email.toLowerCase().trim(),
      exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    } satisfies AccessSession),
  );
  const signature = await signPayload(payload);

  return `${payload}.${signature}`;
}

export async function verifyAccessToken(token: string | undefined, kind: AccessSession["kind"]) {
  if (!token || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = await signPayload(payload);
  if (signature !== expectedSignature) return null;

  try {
    const session = JSON.parse(fromBase64Url(payload)) as AccessSession;
    const now = Math.floor(Date.now() / 1000);

    if (session.kind !== kind || session.exp <= now || !session.email) return null;

    return session;
  } catch {
    return null;
  }
}

export const accessCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
