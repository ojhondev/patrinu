"use server";

import { redirect } from "next/navigation";

import {
  endMasterSession,
  startMasterSession,
  verifyMasterCredentials,
} from "@/lib/auth";

export async function loginMaster(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyMasterCredentials(email, password)) {
    return { error: "E-mail ou senha incorretos." };
  }
  await startMasterSession();
  redirect("/master");
}

export async function logoutMaster() {
  await endMasterSession();
  redirect("/master/entrar");
}
