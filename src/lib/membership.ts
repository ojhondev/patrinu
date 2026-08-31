import { cookies } from "next/headers";

import { getCurrentUser, isMasterSession } from "@/lib/auth";

/**
 * Plano do visitante:
 *  - visitante  → só informações básicas; publica 1 projeto/mês
 *  - cadastrado → vê valores de projeto; ainda não envia proposta nem usa o Radar
 *  - pro        → acesso completo
 *
 * Ordem de resolução: sessão master → conta de usuário logada → cookie de
 * demonstração `patrinu_plan` (enquanto não há checkout real).
 */
export type Plan = "visitante" | "cadastrado" | "pro";

const RANK: Record<Plan, number> = { visitante: 0, cadastrado: 1, pro: 2 };

export async function getPlan(): Promise<Plan> {
  if (await isMasterSession()) return "pro";

  const user = await getCurrentUser();
  if (user) return user.plan;

  const store = await cookies();
  const raw = store.get("patrinu_plan")?.value;
  return raw === "pro" || raw === "cadastrado" ? raw : "visitante";
}

export async function has(min: Plan): Promise<boolean> {
  return RANK[await getPlan()] >= RANK[min];
}

export async function isMaster(): Promise<boolean> {
  return isMasterSession();
}
