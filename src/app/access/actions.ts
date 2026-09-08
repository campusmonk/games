"use server";

import { redirect } from "next/navigation";

import { createUserAccess, isEmailAllowed, normalizeEmail } from "@/lib/access/allowlist";

export type AccessState = {
  message?: string;
};

function cleanNextPath(next: FormDataEntryValue | null) {
  const value = String(next || "");

  if (!value.startsWith("/") || value.startsWith("//")) return "/moreGames";
  if (value.startsWith("/access") || value.startsWith("/admin")) return "/moreGames";

  return value;
}

export async function requestAccess(_state: AccessState, formData: FormData): Promise<AccessState> {
  const email = normalizeEmail(formData.get("email"));
  const next = cleanNextPath(formData.get("next"));

  if (!(await isEmailAllowed(email))) {
    return { message: "This email is not allowed to access the games." };
  }

  await createUserAccess(email);
  redirect(next);
}
