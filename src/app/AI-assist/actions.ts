"use server";

import { revalidatePath } from "next/cache";

import { requireUserAccess } from "@/lib/access/allowlist";
import {
  getAiAssistProgress,
  isAiAssistId,
  isAiAssistUnlocked,
  markAiAssistComplete,
} from "@/lib/access/ai-assist-progress";

export async function completeAiAssistAction(assistId: string) {
  const session = await requireUserAccess();
  if (!isAiAssistId(assistId)) return { ok: false };

  // Server Functions are reachable by direct POST, so refuse to mark an
  // assist finished while it is still locked.
  const progress = await getAiAssistProgress(session.email);
  if (!isAiAssistUnlocked(assistId, progress.completed)) return { ok: false };

  await markAiAssistComplete(session.email, assistId);
  revalidatePath("/AI-assist");

  return { ok: true };
}
