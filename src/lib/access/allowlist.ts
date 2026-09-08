import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  accessCookieNames,
  accessCookieOptions,
  createAccessToken,
  verifyAccessToken,
} from "./session";

type AllowlistFile = {
  emails?: string[];
  users?: AllowedUserRecord[];
};

const allowlistPath = path.join(process.cwd(), "data", "allowed-emails.json");
const allowlistRedisKey = process.env.ALLOWLIST_REDIS_KEY || "cognitive-games:allowed-emails";
const allowlistRedisInitializedKey = `${allowlistRedisKey}:initialized`;
const allowlistSupabaseTable = process.env.SUPABASE_ALLOWLIST_TABLE || "allowed_emails";
const supabasePageSize = 1000;

export type AdminList = {
  users: AllowedUserRecord[];
  emails: string[];
  total: number;
  demoEmail: string;
  storageMessage?: string;
};

type AdminListOptions = {
  limit?: number;
};

export type DailyLimits = {
  gamesPerDay: number | null;
  communicationPerDay: number | null;
};

export type AllowedUserRecord = {
  email: string;
  limits: DailyLimits;
};

const defaultLimits: DailyLimits = {
  gamesPerDay: null,
  communicationPerDay: null,
};

export function normalizeEmail(email: FormDataEntryValue | string | null | undefined) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getMessage(parts: string[]) {
  return parts.filter(Boolean).join(" ");
}

function parseEmailList(emailListValue: FormDataEntryValue | string | null | undefined) {
  const entries = String(emailListValue || "")
    .split(/[\s,;]+/)
    .map(normalizeEmail)
    .filter(Boolean);

  const validEmails = Array.from(new Set(entries.filter(isValidEmail)));
  const invalidCount = entries.length - validEmails.length;

  return { validEmails, invalidCount };
}

function parseEmailsFromCsv(csvText: string) {
  const matches = csvText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];

  return Array.from(new Set(matches.map(normalizeEmail).filter(isValidEmail)));
}

function normalizeLimit(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const limit = Math.floor(value);

  return limit >= 0 ? limit : null;
}

function createAllowedUser(email: string, limits: Partial<DailyLimits> = {}): AllowedUserRecord {
  return {
    email,
    limits: {
      gamesPerDay: normalizeLimit(limits.gamesPerDay),
      communicationPerDay: normalizeLimit(limits.communicationPerDay),
    },
  };
}

function normalizeAllowedUsers(users: AllowedUserRecord[]) {
  const userMap = new Map<string, AllowedUserRecord>();

  for (const user of users) {
    const email = normalizeEmail(user.email);
    if (!isValidEmail(email)) continue;

    userMap.set(email, createAllowedUser(email, user.limits));
  }

  return Array.from(userMap.values()).sort((first, second) => first.email.localeCompare(second.email));
}

function parseLimitInput(value: FormDataEntryValue | string | null | undefined) {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) return { ok: true as const, limit: null };

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 999) {
    return { ok: false as const, message: "Limits must be whole numbers from 0 to 999, or blank for unlimited." };
  }

  return { ok: true as const, limit: parsed };
}

async function readCsvUpload(csvValue: FormDataEntryValue | null) {
  if (!csvValue || typeof csvValue === "string" || !("text" in csvValue)) {
    return { ok: false as const, message: "Choose a CSV file." };
  }

  const csvFile = csvValue as File;

  if (csvFile.size === 0) {
    return { ok: false as const, message: "Choose a CSV file with at least one email address." };
  }

  if (csvFile.name && !csvFile.name.toLowerCase().endsWith(".csv")) {
    return { ok: false as const, message: "Upload a .csv file." };
  }

  return { ok: true as const, text: await csvFile.text() };
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  return { url: url.replace(/\/$/, ""), token };
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY_PUBLISHABLE ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  return { url: url.replace(/\/$/, ""), key };
}

function isVercelDeployment() {
  return Boolean(process.env.VERCEL);
}

function hasDurableStorageConfig() {
  return Boolean(getSupabaseConfig() || getRedisConfig());
}

function getDurableStorageMessage() {
  if (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return "Supabase allowlist storage needs an API key. Set SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY, then restart/redeploy.";
  }

  return "Email changes need durable storage in Vercel. Set Supabase allowlist env vars or Redis env vars, then redeploy.";
}

function getStorageErrorMessage(error: unknown) {
  const detail = error instanceof Error ? error.message : "Unknown storage error.";

  return `Could not update the email list. ${detail}`;
}

async function redisCommand<T>(command: string, ...args: string[]) {
  const config = getRedisConfig();
  if (!config) throw new Error("Redis allowlist storage is not configured.");

  const url = new URL(`${config.url}/${command.toLowerCase()}/${args.map(encodeURIComponent).join("/")}`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis ${command} failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) throw new Error(payload.error);

  return payload.result;
}

async function supabaseRequest<T>(pathValue: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase allowlist storage is not configured.");

  const response = await fetch(`${config.url}/rest/v1/${pathValue}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed with status ${response.status}.${detail ? ` ${detail}` : ""}`);
  }

  const responseText = await response.text();
  if (!responseText) return null as T;

  return JSON.parse(responseText) as T;
}

async function ensureAllowlistFile() {
  await fs.mkdir(path.dirname(allowlistPath), { recursive: true });

  try {
    await fs.access(allowlistPath);
  } catch {
    await fs.writeFile(allowlistPath, JSON.stringify({ emails: [], users: [] }, null, 2));
  }
}

async function readAllowedUsersFile() {
  await ensureAllowlistFile();

  try {
    const raw = await fs.readFile(allowlistPath, "utf8");
    const parsed = JSON.parse(raw) as AllowlistFile;
    const users = Array.isArray(parsed.users) ? parsed.users : [];
    const emailUsers = Array.isArray(parsed.emails) ? parsed.emails.map((email) => createAllowedUser(email)) : [];

    return normalizeAllowedUsers([...emailUsers, ...users]);
  } catch {
    return [];
  }
}

async function readAllowlistFile() {
  return (await readAllowedUsersFile()).map((user) => user.email);
}

async function writeAllowedUsersFile(users: AllowedUserRecord[]) {
  const normalizedUsers = normalizeAllowedUsers(users);
  const emails = normalizedUsers.map((user) => user.email);

  await ensureAllowlistFile();
  await fs.writeFile(allowlistPath, `${JSON.stringify({ emails, users: normalizedUsers }, null, 2)}\n`);

  return normalizedUsers;
}

async function isRedisAllowlistInitialized() {
  return Boolean(await redisCommand<number>("exists", allowlistRedisInitializedKey));
}

async function markRedisAllowlistInitialized() {
  await redisCommand<string>("set", allowlistRedisInitializedKey, "1");
}

async function readRedisAllowlist() {
  if (!(await isRedisAllowlistInitialized())) {
    const seedEmails = await readAllowlistFile();

    if (seedEmails.length > 0) {
      await redisCommand<number>("sadd", allowlistRedisKey, ...seedEmails);
    }

    await markRedisAllowlistInitialized();
  }

  const emails = (await redisCommand<string[]>("smembers", allowlistRedisKey)) || [];

  return Array.from(new Set(emails.map(normalizeEmail).filter(isValidEmail))).sort();
}

async function addEmailsToRedisAllowlist(emails: string[]) {
  const uniqueEmails = Array.from(new Set(emails.map(normalizeEmail).filter(isValidEmail))).sort();

  if (!(await isRedisAllowlistInitialized())) {
    await readRedisAllowlist();
  }

  if (uniqueEmails.length > 0) {
    await redisCommand<number>("sadd", allowlistRedisKey, ...uniqueEmails);
  }

  return readRedisAllowlist();
}

async function deleteEmailFromRedisAllowlist(email: string) {
  if (!(await isRedisAllowlistInitialized())) {
    await readRedisAllowlist();
  }

  await redisCommand<number>("srem", allowlistRedisKey, email);

  return readRedisAllowlist();
}

async function readSupabaseAllowlist() {
  const emails: string[] = [];
  let offset = 0;

  while (true) {
    const rows = await supabaseRequest<Array<{ email?: string }>>(
      `${allowlistSupabaseTable}?select=email&order=email.asc&limit=${supabasePageSize}&offset=${offset}`,
    );

    if (!rows?.length) break;

    emails.push(...rows.map((row) => row.email || ""));
    if (rows.length < supabasePageSize) break;

    offset += supabasePageSize;
  }

  return Array.from(new Set(emails.map(normalizeEmail).filter(isValidEmail))).sort();
}

async function countSupabaseAllowlist() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase allowlist storage is not configured.");

  const response = await fetch(`${config.url}/rest/v1/${allowlistSupabaseTable}?select=email`, {
    method: "HEAD",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      Prefer: "count=exact",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase count failed with status ${response.status}.${detail ? ` ${detail}` : ""}`);
  }

  const contentRange = response.headers.get("content-range");
  const total = contentRange?.split("/").at(-1);

  return total && total !== "*" ? Number(total) || 0 : 0;
}

async function readSupabaseAllowlistPreview(limit: number) {
  const rows = await supabaseRequest<Array<{ email?: string }>>(
    `${allowlistSupabaseTable}?select=email&order=email.asc&limit=${limit}`,
  );

  return Array.from(new Set((rows || []).map((row) => normalizeEmail(row.email)).filter(isValidEmail))).sort();
}

async function isEmailInSupabaseAllowlist(email: string) {
  const rows = await supabaseRequest<Array<{ email?: string }>>(
    `${allowlistSupabaseTable}?select=email&email=eq.${encodeURIComponent(email)}&limit=1`,
  );

  return rows.some((row) => normalizeEmail(row.email) === email);
}

async function addEmailsToSupabaseAllowlist(emails: string[]) {
  const uniqueEmails = Array.from(new Set(emails.map(normalizeEmail).filter(isValidEmail))).sort();
  if (uniqueEmails.length === 0) return readSupabaseAllowlist();

  await supabaseRequest<Array<{ email?: string }>>(`${allowlistSupabaseTable}?on_conflict=email`, {
    method: "POST",
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify(uniqueEmails.map((email) => ({ email }))),
  });

  return readSupabaseAllowlist();
}

async function deleteEmailFromSupabaseAllowlist(email: string) {
  await supabaseRequest<null>(`${allowlistSupabaseTable}?email=eq.${encodeURIComponent(email)}`, {
    method: "DELETE",
  });

  return readSupabaseAllowlist();
}

async function readAllowlist() {
  if (getSupabaseConfig()) return readSupabaseAllowlist();
  if (getRedisConfig()) return readRedisAllowlist();

  return readAllowlistFile();
}

async function readAllowedUsers() {
  if (getSupabaseConfig() || getRedisConfig()) {
    return (await readAllowlist()).map((email) => createAllowedUser(email));
  }

  return readAllowedUsersFile();
}

async function addEmailsToAllowlist(emails: string[]) {
  if (getSupabaseConfig()) return addEmailsToSupabaseAllowlist(emails);
  if (getRedisConfig()) return addEmailsToRedisAllowlist(emails);

  const currentUsers = await readAllowedUsersFile();
  const currentEmails = currentUsers.map((user) => user.email);
  const newUsers = emails
    .map(normalizeEmail)
    .filter((email) => isValidEmail(email) && !currentEmails.includes(email))
    .map((email) => createAllowedUser(email));

  return (await writeAllowedUsersFile([...currentUsers, ...newUsers])).map((user) => user.email);
}

async function deleteEmailFromAllowlist(email: string) {
  if (getSupabaseConfig()) return deleteEmailFromSupabaseAllowlist(email);
  if (getRedisConfig()) return deleteEmailFromRedisAllowlist(email);

  const currentUsers = await readAllowedUsersFile();

  return (await writeAllowedUsersFile(currentUsers.filter((user) => user.email !== email))).map((user) => user.email);
}

export async function getAllowedEmails(options: AdminListOptions = {}): Promise<AdminList> {
  const demoEmail = normalizeEmail(process.env.DEMO_EMAIL);
  const limit = options.limit && options.limit > 0 ? Math.floor(options.limit) : undefined;

  try {
    if (getSupabaseConfig() && limit) {
      const [emails, total] = await Promise.all([readSupabaseAllowlistPreview(limit), countSupabaseAllowlist()]);

      return {
        users: emails.map((email) => createAllowedUser(email)),
        emails,
        total,
        demoEmail,
        storageMessage: !hasDurableStorageConfig() && isVercelDeployment() ? getDurableStorageMessage() : undefined,
      };
    }

    const users = await readAllowedUsers();
    const allEmails = users.map((user) => user.email);
    const emails = limit ? allEmails.slice(0, limit) : allEmails;

    return {
      users: limit ? users.slice(0, limit) : users,
      emails,
      total: allEmails.length,
      demoEmail,
      storageMessage: !hasDurableStorageConfig() && isVercelDeployment() ? getDurableStorageMessage() : undefined,
    };
  } catch (error) {
    return {
      users: [],
      emails: [],
      total: 0,
      demoEmail,
      storageMessage: getStorageErrorMessage(error),
    };
  }
}

export async function addAllowedEmail(emailValue: FormDataEntryValue | string | null | undefined) {
  const email = normalizeEmail(emailValue);
  if (!isValidEmail(email)) return { ok: false, message: "Enter a valid email address." };

  if (!hasDurableStorageConfig() && isVercelDeployment()) {
    return { ok: false, message: getDurableStorageMessage() };
  }

  try {
    const emails = await readAllowlist();
    if (emails.includes(email)) return { ok: true, message: "Email is already allowed." };

    await addEmailsToAllowlist([email]);
  } catch (error) {
    return { ok: false, message: getStorageErrorMessage(error) };
  }

  return { ok: true, message: "Email added." };
}

async function addAllowedEmailValues(validEmails: string[], invalidCount = 0) {
  if (validEmails.length === 0) return { ok: false, message: "Enter at least one valid email address." };

  if (!hasDurableStorageConfig() && isVercelDeployment()) {
    return { ok: false, message: getDurableStorageMessage() };
  }

  try {
    const emails = await readAllowlist();
    const newEmails = validEmails.filter((email) => !emails.includes(email));

    if (newEmails.length > 0) {
      await addEmailsToAllowlist(newEmails);
    }

    const skippedCount = validEmails.length - newEmails.length;
    const message = getMessage([
      newEmails.length ? `Added ${newEmails.length} email${newEmails.length === 1 ? "" : "s"}.` : "",
      skippedCount ? `Skipped ${skippedCount} already allowed.` : "",
      invalidCount ? `Ignored ${invalidCount} invalid entr${invalidCount === 1 ? "y" : "ies"}.` : "",
    ]);

    return { ok: true, message: message || "No new emails to add." };
  } catch (error) {
    return { ok: false, message: getStorageErrorMessage(error) };
  }
}

export async function addAllowedEmails(emailListValue: FormDataEntryValue | string | null | undefined) {
  const { validEmails, invalidCount } = parseEmailList(emailListValue);

  return addAllowedEmailValues(validEmails, invalidCount);
}

export async function addAllowedEmailsFromCsv(csvValue: FormDataEntryValue | null) {
  const csvUpload = await readCsvUpload(csvValue);
  if (!csvUpload.ok) return csvUpload;

  const validEmails = parseEmailsFromCsv(csvUpload.text);
  if (validEmails.length === 0) return { ok: false, message: "No email addresses found in CSV." };

  return addAllowedEmailValues(validEmails);
}

export async function deleteAllowedEmail(emailValue: FormDataEntryValue | string | null | undefined) {
  const email = normalizeEmail(emailValue);
  if (!isValidEmail(email)) return { ok: false, message: "Enter a valid email address." };

  if (!hasDurableStorageConfig() && isVercelDeployment()) {
    return { ok: false, message: getDurableStorageMessage() };
  }

  try {
    await deleteEmailFromAllowlist(email);
  } catch (error) {
    return { ok: false, message: getStorageErrorMessage(error) };
  }

  return { ok: true, message: "Email removed." };
}

export async function updateUserDailyLimits(
  emailValue: FormDataEntryValue | string | null | undefined,
  gamesValue: FormDataEntryValue | string | null | undefined,
  communicationValue: FormDataEntryValue | string | null | undefined,
) {
  const email = normalizeEmail(emailValue);
  if (!isValidEmail(email)) return { ok: false, message: "Enter a valid email address." };

  const gamesLimit = parseLimitInput(gamesValue);
  if (!gamesLimit.ok) return gamesLimit;

  const communicationLimit = parseLimitInput(communicationValue);
  if (!communicationLimit.ok) return communicationLimit;

  if (getSupabaseConfig() || getRedisConfig()) {
    return {
      ok: false,
      message: "Per-user limits are available with local JSON storage. Add matching columns before using Supabase or Redis.",
    };
  }

  if (!hasDurableStorageConfig() && isVercelDeployment()) {
    return { ok: false, message: getDurableStorageMessage() };
  }

  try {
    const users = await readAllowedUsersFile();
    const existingUser = users.find((user) => user.email === email);
    if (!existingUser) return { ok: false, message: "User is not in the allowed list." };

    await writeAllowedUsersFile(
      users.map((user) =>
        user.email === email
          ? createAllowedUser(email, {
              gamesPerDay: gamesLimit.limit,
              communicationPerDay: communicationLimit.limit,
            })
          : user,
      ),
    );
  } catch (error) {
    return { ok: false, message: getStorageErrorMessage(error) };
  }

  return { ok: true, message: "Daily limits updated." };
}

export async function isEmailAllowed(emailValue: FormDataEntryValue | string | null | undefined) {
  const email = normalizeEmail(emailValue);
  if (!isValidEmail(email)) return false;

  try {
    if (getSupabaseConfig()) return isEmailInSupabaseAllowlist(email);

    return (await readAllowlist()).includes(email);
  } catch {
    return false;
  }
}

export async function getUserDailyLimits(emailValue: FormDataEntryValue | string | null | undefined) {
  const email = normalizeEmail(emailValue);
  if (!isValidEmail(email)) return defaultLimits;

  try {
    const user = (await readAllowedUsers()).find((allowedUser) => allowedUser.email === email);

    return user?.limits || defaultLimits;
  } catch {
    return defaultLimits;
  }
}

export async function createUserAccess(email: string) {
  const cookieStore = await cookies();
  const token = await createAccessToken({ email, kind: "user" });

  cookieStore.set(accessCookieNames.user, token, accessCookieOptions);
}

export async function createAdminAccess() {
  const cookieStore = await cookies();
  const token = await createAccessToken({ email: "admin", kind: "admin" });

  cookieStore.set(accessCookieNames.admin, token, accessCookieOptions);
}

export async function clearAdminAccess() {
  const cookieStore = await cookies();

  cookieStore.delete(accessCookieNames.admin);
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(accessCookieNames.user)?.value;
  const session = await verifyAccessToken(token, "user");

  if (!session || !(await isEmailAllowed(session.email))) return null;

  return session;
}

export async function requireUserAccess() {
  const session = await getUserSession();

  if (!session) redirect("/access");

  return session;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(accessCookieNames.admin)?.value;

  return verifyAccessToken(token, "admin");
}

export async function requireAdminAccess() {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return session;
}
