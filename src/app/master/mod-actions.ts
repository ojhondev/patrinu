"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { isMasterSession } from "@/lib/auth";
import {
  banUser,
  deleteProfessional,
  deleteUser,
  setUserPlan,
  setVerification,
  unbanUser,
  VERIF_LEVELS,
  type VerifLevel,
} from "@/lib/master";

async function guard() {
  if (!(await isMasterSession())) redirect("/master/entrar");
}

function refresh() {
  revalidatePath("/master", "layout");
  revalidatePath("/profissionais");
  revalidatePath("/", "layout");
}

export async function actSetVerification(formData: FormData) {
  await guard();
  const proId = String(formData.get("proId") ?? "");
  const level = String(formData.get("level") ?? "") as VerifLevel;
  if (!proId || !VERIF_LEVELS.includes(level)) return;
  await setVerification(proId, level);
  refresh();
}

export async function actDeleteProfessional(formData: FormData) {
  await guard();
  const proId = String(formData.get("proId") ?? "");
  if (!proId) return;
  await deleteProfessional(proId);
  refresh();
}

export async function actBanUser(formData: FormData) {
  await guard();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  await banUser(userId, String(formData.get("reason") ?? ""));
  refresh();
}

export async function actUnbanUser(formData: FormData) {
  await guard();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  await unbanUser(userId);
  refresh();
}

export async function actDeleteUser(formData: FormData) {
  await guard();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  await deleteUser(userId);
  refresh();
}

export async function actSetPlan(formData: FormData) {
  await guard();
  const userId = String(formData.get("userId") ?? "");
  const plan = String(formData.get("plan") ?? "");
  if (!userId || (plan !== "cadastrado" && plan !== "pro")) return;
  await setUserPlan(userId, plan);
  refresh();
}
