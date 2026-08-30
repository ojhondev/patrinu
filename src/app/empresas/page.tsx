import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Para empresas" };

const PLANS = [
  {
    name: "Business",
    who: "Ateliês, escritórios e construtoras especializadas",
    price: "R$ 300–900",
    unit: "/assento/mês",
    features: [
      "Radar de licitações de todo o país",
      "Busca de especialistas e banco de talentos",
      "Cofre de documentos compartilhado",
      "Lista de interessados por projeto",
      "Publicação de projetos e vagas",
    ],
    cta: "Falar com vendas",
    highlight: true,
  },
  {
    name: "Institucional",
    who: "Museus, órgãos públicos, fundações e dioceses",
    price: "Sob medida",
    unit: "",
    features: [
      "Gestão de fornecedores e histórico",
      "Gestão de fornecedores e acervos",
      "Compliance e relatórios",
      "Apoio a termo de referência",
    ],
    cta: "Solicitar proposta",
    highlight: false,
  },
  {
    name: "Patrocinador / Vitrine",
    who: "Bancos, institutos e estatais",
    price: "Assinatura + curadoria",
    unit: "",
    features: [
      "Deal flow de projetos incentiváveis",
      "Dossiê e enquadramento fiscal prontos",
      "Filtros por tema, região e linha de incentivo",
    ],
    cta: "Conhecer a Vitrine",
    highlight: false,
  },
];

export default function EmpresasPage() {
  return (
    <>
      <PageHero
        eyebrow="Patrinu para empresas e ateliês"
        title={<>Uma equipe inteira monitorando editais. <span className="accent">Por assento.</span></>}
      >
        Cobre de quem tem orçamento: as empresas que disputam obra, as grandes instituições
        e o lado do dinheiro incentivado.
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-11">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "rounded-2xl border-2 border-green bg-surface p-6"
                  : "rounded-2xl border border-border bg-surface p-6"
              }
            >
              <h2 className="text-lg font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-ink-soft">{plan.who}</p>
              <p className="mt-4 font-display text-2xl font-extrabold">
                {plan.price}
                <span className="text-sm font-semibold text-ink-soft">{plan.unit}</span>
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-ink-soft">
                    <Check size={16} className="mt-0.5 shrink-0 text-green-ink" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className={
                  plan.highlight
                    ? "mt-6 block rounded-lg bg-green px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-green-hover"
                    : "mt-6 block rounded-lg border border-border-strong px-4 py-2.5 text-center text-sm font-bold hover:border-green-ink"
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">
          Faixas de preço indicativas, a confirmar.
        </p>
      </div>
    </>
  );
}
