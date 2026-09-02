import { getCurrentUser, isMasterSession } from "@/lib/auth";

/**
 * Plano do usuário:
 *  - visitante  → só informações básicas
 *  - cadastrado → conta gratuita (vê valores de projeto, 3 créditos/mês)
 *  - pro        → assinatura ativa; acesso completo
 *
 * Ordem de resolução: sessão master → conta de usuário logada → visitante.
 * O plano vem SEMPRE do servidor (`users.plan`), nunca de cookie do cliente.
 */
export type Plan = "visitante" | "cadastrado" | "pro";

const RANK: Record<Plan, number> = { visitante: 0, cadastrado: 1, pro: 2 };

export async function getPlan(): Promise<Plan> {
  if (await isMasterSession()) return "pro";

  const user = await getCurrentUser();
  if (user) return user.plan;

  return "visitante";
}

export async function has(min: Plan): Promise<boolean> {
  return RANK[await getPlan()] >= RANK[min];
}

export async function isMaster(): Promise<boolean> {
  return isMasterSession();
}
