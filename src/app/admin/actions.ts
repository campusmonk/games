"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateGlobalDailyLimit } from "@/lib/access/daily-limits";
import {
  addAllowedEmail,
  addAllowedEmails,
  addAllowedEmailsFromCsv,
  clearAdminAccess,
  createAdminAccess,
  deleteAllowedEmail,
  getAdminSession,
} from "@/lib/access/allowlist";

export type AdminActionState = {
  message?: string;
};

export async function loginAdmin(_state: AdminActionState, formData: FormData) {
  const password = String(formData.get("password") || "");
  const expectedPassword = process.env.ADMIN_PASSWORD || "";

  if (!expectedPassword || password !== expectedPassword) {
    return { message: "Invalid admin password." };
  }

  await createAdminAccess();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminAccess();
  redirect("/admin/login");
}

export async function addEmailAction(_state: AdminActionState, formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const result = await addAllowedEmail(formData.get("email"));
  revalidatePath("/admin");

  return { message: result.message };
}

export async function addBulkEmailsAction(_state: AdminActionState, formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const result = await addAllowedEmails(formData.get("emails"));
  revalidatePath("/admin");

  return { message: result.message };
}

export async function uploadCsvEmailsAction(_state: AdminActionState, formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const result = await addAllowedEmailsFromCsv(formData.get("csv"));
  revalidatePath("/admin");

  return { message: result.message };
}

export async function deleteEmailAction(formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  await deleteAllowedEmail(formData.get("email"));
  revalidatePath("/admin");
}

export async function updateGameLimitAction(_state: AdminActionState, formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const result = await updateGlobalDailyLimit("game", formData.get("gamesPerDay"));
  revalidatePath("/admin");

  return { message: result.message };
}

export async function updateCommunicationLimitAction(_state: AdminActionState, formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const result = await updateGlobalDailyLimit("communication", formData.get("communicationPerDay"));
  revalidatePath("/admin");

  return { message: result.message };
}

export async function updateDebugLimitAction(_state: AdminActionState, formData: FormData) {
  if (!(await getAdminSession())) redirect("/admin/login");

  const result = await updateGlobalDailyLimit("debug", formData.get("debugPerDay"));
  revalidatePath("/admin");

  return { message: result.message };
}
