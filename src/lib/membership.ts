import { cookies } from "next/headers";

/**
 * Plano do visitante. Enquanto a autenticação própria não existe, o plano vem
 * de um cookie de demonstração (`patrinu_plan`), setado pelo onboarding e pelo
 * botão "Assinar Pro". Quando a auth entrar, isto passa a ler a sessão.
 *
 * - visitante  → só informações básicas; publica 1 projeto/mês
 * - cadastrado → vê valores de projeto; ainda não envia proposta nem usa o Radar
 * - pro        → acesso completo (Radar de Editais, enviar proposta, dados sensíveis)
 */
export type Plan = "visitante" | "cadastrado" | "pro";

const RANK: Record<Plan, number> = { visitante: 0, cadastrado: 1, pro: 2 };

export async function getPlan(): Promise<Plan> {
  const store = await cookies();
  if (store.get("patrinu_master")) return "pro"; // master vê tudo
  const raw = store.get("patrinu_plan")?.value;
  return raw === "pro" || raw === "cadastrado" ? raw : "visitante";
}

export async function has(min: Plan): Promise<boolean> {
  return RANK[await getPlan()] >= RANK[min];
}

export async function isMaster(): Promise<boolean> {
  const store = await cookies();
  return Boolean(store.get("patrinu_master"));
}
