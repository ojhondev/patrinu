import type { OpportunitySource } from "@/lib/types";

/** Ver docs/radar-fontes.md para a lista completa e a ordem de implementação. */
export const SOURCES: Record<string, OpportunitySource> = {
  pncp: { slug: "pncp", name: "PNCP — Portal Nacional de Contratações Públicas", tier: 0, access: "api" },
  comprasgov: { slug: "comprasgov", name: "Compras.gov.br (Comprasnet)", tier: 0, access: "api" },
  dou: { slug: "dou", name: "Diário Oficial da União", tier: 0, access: "api" },
  querido_diario: { slug: "querido_diario", name: "Querido Diário", tier: 0, access: "api" },
  iphan_editais: { slug: "iphan_editais", name: "IPHAN — Editais e Seleções", tier: 1, access: "scraping" },
  minc_editais: { slug: "minc_editais", name: "Ministério da Cultura — Editais", tier: 1, access: "scraping" },
  salic: { slug: "salic", name: "SALIC / VerSalic — Lei Rouanet", tier: 2, access: "api" },
  iepha_mg: { slug: "iepha_mg", name: "IEPHA-MG", tier: 3, access: "scraping" },
  proac_sp: { slug: "proac_sp", name: "ProAC — Secretaria de Cultura SP", tier: 3, access: "scraping" },
  ipac_ba: { slug: "ipac_ba", name: "IPAC-BA", tier: 3, access: "scraping" },
  fundarpe_pe: { slug: "fundarpe_pe", name: "Fundarpe-PE (Funcultura)", tier: 3, access: "scraping" },
  bndes: { slug: "bndes", name: "BNDES — Patrimônio Cultural", tier: 4, access: "monitorar" },
};
