import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { requireUserAccess } from "./allowlist";
import { invalidateMemo, memoize, memoTtlMs } from "./memo";

export type DailyLimitKind = "game" | "communication" | "debug" | "quiz";

export type DailyLimitStatus = {
  allowed: boolean;
  email: string;
  kind: DailyLimitKind;
  itemId?: string;
  storageError?: string;
  used: number;
  limit: number | null;
  remaining: number | null;
  dateKey: string;
  resetAt: number;
};

type UsageWindow = {
  count: number;
  resetAt: number;
};

type StoredUsageValue = number | UsageWindow;

type UsageFile = {
  days?: Record<string, Record<string, Record<string, StoredUsageValue>>>;
};

function getUsageKey(kind: DailyLimitKind, itemId?: string) {
  if (itemId) return `${kind}:${itemId}`;

  return kind;
}

export type GlobalDailyLimits = {
  gamesPerDay: number | null;
  communicationPerDay: number | null;
  debugPerDay: number | null;
  quizPerDay: number | null;
};

type LimitSettingsFile = {
  limits?: Partial<GlobalDailyLimits>;
};

const usagePath = path.join(process.cwd(), "data", "daily-usage.json");
const limitSettingsPath = path.join(process.cwd(), "data", "daily-limits.json");
const limitSettingsSupabaseTable = process.env.SUPABASE_DAILY_LIMIT_SETTINGS_TABLE || "daily_limit_settings";
const limitUsageSupabaseTable = process.env.SUPABASE_DAILY_LIMIT_USAGE_TABLE || "daily_limit_usage";
const limitSettingsSupabaseId = "global";
const defaultLimits: GlobalDailyLimits = {
  gamesPerDay: null,
  communicationPerDay: null,
  debugPerDay: null,
  quizPerDay: null,
};
const quotaWindowMs = 24 * 60 * 60 * 1000;
const perGameSupabaseSetupMessage =
  "Daily limits need a Supabase schema update. Run data/supabase-daily-limits.sql in Supabase SQL editor so each game, communication round, debug assessment, and quiz can have its own daily attempt count.";
// Columns added after the first release: an older Supabase schema still
// answers for the original ones, so a missing column is recoverable.
const optionalLimitColumns = ["debug_per_day", "quiz_per_day"] as const;
const requiredLimitColumns = ["games_per_day", "communication_per_day"] as const;
const supabaseSetupMessageByColumn: Record<(typeof optionalLimitColumns)[number], string> = {
  debug_per_day:
    "Debug assessment limits need a Supabase schema update. Run data/supabase-daily-limits.sql in Supabase SQL editor, then reload the admin page.",
  quiz_per_day:
    "Quiz limits need a Supabase schema update. Run data/supabase-daily-limits.sql in Supabase SQL editor, then reload the admin page.",
};

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
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

async function supabaseRequest<T>(pathValue: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase daily limit storage is not configured.");

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

async function ensureUsageFile() {
  await fs.mkdir(path.dirname(usagePath), { recursive: true });

  try {
    await fs.access(usagePath);
  } catch {
    await fs.writeFile(usagePath, JSON.stringify({ days: {} }, null, 2));
  }
}

async function readUsageFile() {
  await ensureUsageFile();

  try {
    const raw = await fs.readFile(usagePath, "utf8");
    const parsed = JSON.parse(raw) as UsageFile;

    return parsed.days && typeof parsed.days === "object" ? parsed.days : {};
  } catch {
    return {};
  }
}

async function writeUsageFile(days: UsageFile["days"]) {
  await ensureUsageFile();
  await fs.writeFile(usagePath, `${JSON.stringify({ days: days || {} }, null, 2)}\n`);
}

async function ensureLimitSettingsFile() {
  await fs.mkdir(path.dirname(limitSettingsPath), { recursive: true });

  try {
    await fs.access(limitSettingsPath);
  } catch {
    await fs.writeFile(limitSettingsPath, `${JSON.stringify({ limits: defaultLimits }, null, 2)}\n`);
  }
}

function normalizeLimit(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const limit = Math.floor(value);

  return limit >= 0 ? limit : null;
}

function parseLimitInput(value: FormDataEntryValue | string | null | undefined) {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) return { ok: true as const, limit: null };

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 999) {
    return { ok: false as const, message: "Enter a whole number from 0 to 999, or leave blank for unlimited." };
  }

  return { ok: true as const, limit: parsed };
}

// Read on every attempt claim but only written from the admin screen, so
// it is memoized and invalidated by updateGlobalDailyLimit().
export async function getGlobalDailyLimits(): Promise<GlobalDailyLimits> {
  return memoize("limits:global", memoTtlMs.limits, async () => {
    if (getSupabaseConfig()) return readSupabaseGlobalDailyLimits();

    await ensureLimitSettingsFile();

    try {
      const raw = await fs.readFile(limitSettingsPath, "utf8");
      const parsed = JSON.parse(raw) as LimitSettingsFile;

      return {
        gamesPerDay: normalizeLimit(parsed.limits?.gamesPerDay),
        communicationPerDay: normalizeLimit(parsed.limits?.communicationPerDay),
        debugPerDay: normalizeLimit(parsed.limits?.debugPerDay),
        quizPerDay: normalizeLimit(parsed.limits?.quizPerDay),
      };
    } catch {
      return defaultLimits;
    }
  });
}

async function writeGlobalDailyLimits(limits: GlobalDailyLimits) {
  if (getSupabaseConfig()) {
    await writeSupabaseGlobalDailyLimits({
      games_per_day: limits.gamesPerDay,
      communication_per_day: limits.communicationPerDay,
      debug_per_day: limits.debugPerDay,
      quiz_per_day: limits.quizPerDay,
    });
    return;
  }

  await ensureLimitSettingsFile();
  await fs.writeFile(limitSettingsPath, `${JSON.stringify({ limits }, null, 2)}\n`);
}

export async function updateGlobalDailyLimit(kind: DailyLimitKind, value: FormDataEntryValue | string | null | undefined) {
  const parsed = parseLimitInput(value);
  if (!parsed.ok) return parsed;

  const currentLimits = await getGlobalDailyLimits();
  const limitKeyByKind: Record<DailyLimitKind, keyof GlobalDailyLimits> = {
    game: "gamesPerDay",
    communication: "communicationPerDay",
    debug: "debugPerDay",
    quiz: "quizPerDay",
  };
  const nextLimits = {
    ...currentLimits,
    [limitKeyByKind[kind]]: parsed.limit,
  };

  try {
    if (getSupabaseConfig()) {
      const supabaseLimitColumnByKind: Record<DailyLimitKind, string> = {
        game: "games_per_day",
        communication: "communication_per_day",
        debug: "debug_per_day",
        quiz: "quiz_per_day",
      };

      await writeSupabaseGlobalDailyLimits({
        [supabaseLimitColumnByKind[kind]]: parsed.limit,
      });
    } else {
      await writeGlobalDailyLimits(nextLimits);
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown storage error.";

    const isSetupMessage = Object.values(supabaseSetupMessageByColumn).some((message) => detail.includes(message));

    return { ok: false, message: isSetupMessage ? detail : `Could not update the daily limit. ${detail}` };
  }

  invalidateMemo("limits:");

  return { ok: true, message: "Daily limit updated." };
}

function getLimitForKind(limits: GlobalDailyLimits, kind: DailyLimitKind) {
  if (kind === "communication") return limits.communicationPerDay;
  if (kind === "debug") return limits.debugPerDay;
  if (kind === "quiz") return limits.quizPerDay;

  return limits.gamesPerDay;
}

function createAllowedStatus(
  email: string,
  kind: DailyLimitKind,
  used: number,
  limit: number | null,
  resetAt: number,
  itemId?: string,
): DailyLimitStatus {
  return {
    allowed: true,
    email,
    kind,
    itemId,
    used,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
    dateKey: getDateKey(new Date()),
    resetAt,
  };
}

function createBlockedStatus(
  email: string,
  kind: DailyLimitKind,
  used: number,
  limit: number,
  resetAt: number,
  itemId?: string,
): DailyLimitStatus {
  return {
    allowed: false,
    email,
    kind,
    itemId,
    used,
    limit,
    remaining: 0,
    dateKey: getDateKey(new Date()),
    resetAt,
  };
}

function createStorageErrorStatus(
  email: string,
  kind: DailyLimitKind,
  resetAt: number,
  storageError: string,
  itemId?: string,
): DailyLimitStatus {
  return {
    allowed: false,
    email,
    kind,
    itemId,
    storageError,
    used: 0,
    limit: null,
    remaining: 0,
    dateKey: getDateKey(new Date()),
    resetAt,
  };
}

function isSupabaseCheckConstraintError(error: unknown) {
  return error instanceof Error && error.message.includes("violates check constraint");
}

function getMissingSupabaseLimitColumn(error: unknown) {
  if (!(error instanceof Error)) return null;

  return optionalLimitColumns.find((column) => error.message.includes(column)) || null;
}

async function readSupabaseGlobalDailyLimits(): Promise<GlobalDailyLimits> {
  let columns: string[] = [...requiredLimitColumns, ...optionalLimitColumns];

  // A schema that predates a column answers the select with an error naming
  // it, so drop that column and ask again instead of losing every limit.
  for (let attempt = 0; attempt <= optionalLimitColumns.length; attempt += 1) {
    try {
      const rows = await supabaseRequest<Array<Record<string, number | null | undefined>>>(
        `${limitSettingsSupabaseTable}?select=${columns.join(",")}&id=eq.${limitSettingsSupabaseId}&limit=1`,
      );
      const settings = rows[0];

      if (!settings) return defaultLimits;

      return {
        gamesPerDay: normalizeLimit(settings.games_per_day),
        communicationPerDay: normalizeLimit(settings.communication_per_day),
        debugPerDay: normalizeLimit(settings.debug_per_day),
        quizPerDay: normalizeLimit(settings.quiz_per_day),
      };
    } catch (error) {
      const missingColumn = getMissingSupabaseLimitColumn(error);
      if (!missingColumn) return defaultLimits;

      columns = columns.filter((column) => column !== missingColumn);
    }
  }

  return defaultLimits;
}

async function writeSupabaseGlobalDailyLimits(limits: Record<string, number | null>) {
  try {
    await supabaseRequest<null>(`${limitSettingsSupabaseTable}?on_conflict=id`, {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: limitSettingsSupabaseId,
        ...limits,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    const missingColumn = getMissingSupabaseLimitColumn(error);
    if (!missingColumn) throw error;

    throw new Error(supabaseSetupMessageByColumn[missingColumn]);
  }
}

async function claimSupabaseDailyAttemptForKey(
  email: string,
  kind: DailyLimitKind,
  limit: number | null,
  usageKey: string,
  now: number,
  itemId?: string,
): Promise<DailyLimitStatus> {
  const newResetAt = now + quotaWindowMs;

  const rows = await supabaseRequest<Array<{ count?: number | null; reset_at?: string | null }>>(
    `${limitUsageSupabaseTable}?select=count,reset_at&email=eq.${encodeURIComponent(email)}&kind=eq.${encodeURIComponent(usageKey)}&limit=1`,
  );
  const current = rows[0];
  const currentResetAt = current?.reset_at ? Date.parse(current.reset_at) : Number.NaN;
  const isActiveWindow = Number.isFinite(currentResetAt) && currentResetAt > now;
  const used = isActiveWindow ? Math.max(0, Math.floor(current?.count || 0)) : 0;
  const resetAt = isActiveWindow ? currentResetAt : newResetAt;

  if (limit !== null && used >= limit) {
    return createBlockedStatus(email, kind, used, limit, resetAt, itemId);
  }

  const nextUsed = used + 1;

  await supabaseRequest<null>(`${limitUsageSupabaseTable}?on_conflict=email,kind`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      email,
      kind: usageKey,
      count: nextUsed,
      reset_at: new Date(resetAt).toISOString(),
      updated_at: new Date(now).toISOString(),
    }),
  });

  return createAllowedStatus(email, kind, nextUsed, limit, resetAt, itemId);
}

async function claimSupabaseDailyAttempt(kind: DailyLimitKind, itemId?: string): Promise<DailyLimitStatus> {
  // Independent reads: resolve them together instead of back to back.
  const [session, limits] = await Promise.all([requireUserAccess(), getGlobalDailyLimits()]);
  const limit = getLimitForKind(limits, kind);
  const usageKey = getUsageKey(kind, itemId);
  const now = Date.now();
  const newResetAt = now + quotaWindowMs;

  try {
    return await claimSupabaseDailyAttemptForKey(session.email, kind, limit, usageKey, now, itemId);
  } catch (error) {
    if (isSupabaseCheckConstraintError(error) && itemId) {
      return createStorageErrorStatus(session.email, kind, newResetAt, perGameSupabaseSetupMessage, itemId);
    }

    const detail = error instanceof Error ? error.message : "Unknown storage error.";

    throw new Error(`Could not save the daily attempt for ${usageKey}. ${detail}`);
  }
}

function readUsageWindow(value: StoredUsageValue | undefined, now: number): UsageWindow {
  if (typeof value === "object" && value) {
    const count = Math.max(0, Math.floor(value.count || 0));
    const resetAt = Number.isFinite(value.resetAt) ? value.resetAt : now + quotaWindowMs;

    if (resetAt > now) return { count, resetAt };
  }

  if (typeof value === "number") {
    return {
      count: Math.max(0, Math.floor(value)),
      resetAt: now + quotaWindowMs,
    };
  }

  return {
    count: 0,
    resetAt: now + quotaWindowMs,
  };
}

function findActiveUsageWindow(
  days: NonNullable<UsageFile["days"]>,
  email: string,
  usageKey: string,
  currentDateKey: string,
  now: number,
) {
  const currentUsage = readUsageWindow(days[currentDateKey]?.[email]?.[usageKey], now);
  if (currentUsage.count > 0 || days[currentDateKey]?.[email]?.[usageKey] !== undefined) return currentUsage;

  for (const [dateKey, dayUsage] of Object.entries(days)) {
    if (dateKey === currentDateKey) continue;

    const storedValue = dayUsage[email]?.[usageKey];
    if (typeof storedValue !== "object" || !storedValue) continue;

    const usageWindow = readUsageWindow(storedValue, now);
    if (usageWindow.count > 0 && usageWindow.resetAt > now) return usageWindow;
  }

  return currentUsage;
}

export async function claimDailyAttempt(kind: DailyLimitKind, itemId?: string): Promise<DailyLimitStatus> {
  if (getSupabaseConfig()) return claimSupabaseDailyAttempt(kind, itemId);

  const [session, limits, days] = await Promise.all([
    requireUserAccess(),
    getGlobalDailyLimits(),
    readUsageFile(),
  ]);
  const limit = getLimitForKind(limits, kind);
  const usageKey = getUsageKey(kind, itemId);
  const now = Date.now();
  const dateKey = getDateKey(new Date(now));
  const dayUsage = days[dateKey] || {};
  const userUsage = dayUsage[session.email] || {};
  const usageWindow = findActiveUsageWindow(days, session.email, usageKey, dateKey, now);
  const used = usageWindow.count;

  if (limit !== null && used >= limit) {
    return {
      allowed: false,
      email: session.email,
      kind,
      itemId,
      used,
      limit,
      remaining: 0,
      dateKey,
      resetAt: usageWindow.resetAt,
    };
  }

  const nextUsed = used + 1;
  const nextUsageWindow = {
    count: nextUsed,
    resetAt: usageWindow.resetAt,
  };

  days[dateKey] = {
    ...dayUsage,
    [session.email]: {
      ...userUsage,
      [usageKey]: nextUsageWindow,
    },
  };

  await writeUsageFile(days);

  return {
    allowed: true,
    email: session.email,
    kind,
    itemId,
    used: nextUsed,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - nextUsed),
    dateKey,
    resetAt: nextUsageWindow.resetAt,
  };
}
