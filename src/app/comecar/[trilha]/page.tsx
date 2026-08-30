import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TRACKS } from "@/lib/pro";
import type { ProTrack } from "@/lib/types";
import { OnboardingFlow, type OnboardingStep } from "@/components/onboarding-flow";

export function generateStaticParams() {
  return (["contratar", "oferecer", "financiamento"] as ProTrack[]).map((trilha) => ({
    trilha,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trilha: string }>;
}): Promise<Metadata> {
  const { trilha } = await params;
  const t = TRACKS[trilha as ProTrack];
  return { title: t ? `Começar — ${t.label}` : "Começar" };
}

const STEPS: Record<ProTrack, OnboardingStep[]> = {
  contratar: [
    {
      title: "Quem é a organização",
      fields: [
        { label: "Nome da organização", type: "text", placeholder: "Ex.: Arquidiocese de Mariana" },
        {
          label: "Tipo",
          type: "select",
          options: ["Instituição pública", "Museu / fundação", "Diocese / paróquia", "Empresa", "Proprietário particular"],
        },
        { label: "Cidade / UF", type: "text", placeholder: "Ouro Preto / MG" },
      ],
    },
    {
      title: "O que precisa restaurar",
      hint: "Fotos ajudam o match — você anexa depois, no painel.",
      fields: [
        { label: "Bem", type: "text", placeholder: "Ex.: Igreja Matriz do Pilar" },
        {
          label: "Tipo de intervenção",
          type: "chips",
          options: ["Talha e douramento", "Pintura / policromia", "Fachada", "Cantaria", "Cobertura", "Acervo", "Diagnóstico / projeto"],
        },
        { label: "Descrição do problema", type: "textarea", placeholder: "O que está acontecendo com o bem?" },
      ],
    },
    {
      title: "Recurso e prazo",
      fields: [
        {
          label: "Fonte de recurso",
          type: "select",
          options: ["Orçamento próprio", "Lei de incentivo (Rouanet / estadual)", "Edital / licitação", "Ainda buscando"],
        },
        { label: "Faixa de investimento", type: "text", placeholder: "R$ 200 mil – R$ 500 mil" },
        { label: "Urgência", type: "select", options: ["Emergencial", "Este ano", "Sem prazo definido"] },
      ],
    },
    {
      title: "Como quer começar",
      fields: [
        {
          label: "Publicar o projeto",
          type: "select",
          options: ["Publicar como projeto aberto (recebe propostas)", "Só prospectar profissionais por enquanto"],
        },
      ],
    },
  ],
  oferecer: [
    {
      title: "Seu cadastro",
      fields: [
        { label: "Você é", type: "select", options: ["Pessoa física", "Ateliê / empresa (PJ)"] },
        { label: "Nome / razão social", type: "text", placeholder: "Ex.: Helena Braga" },
        { label: "Cidade / UF", type: "text", placeholder: "Mariana / MG" },
      ],
    },
    {
      title: "Especialidades e técnicas",
      fields: [
        {
          label: "Especialidades",
          type: "chips",
          options: ["Bens móveis", "Bens integrados", "Arquitetura", "Acervos", "Arqueologia", "Paisagismo", "Documental"],
        },
        {
          label: "Técnicas",
          type: "chips",
          options: ["Talha", "Douramento", "Policromia", "Argamassa de cal", "Cantaria", "Vitral", "Conservação preventiva"],
        },
        { label: "Anos de experiência", type: "select", options: ["Até 2", "3–5", "6–10", "Mais de 10"] },
      ],
    },
    {
      title: "Registros e certificações",
      hint: "Isso alimenta o selo verificado e o checklist de habilitação dos editais.",
      fields: [
        { label: "Registros", type: "chips", options: ["CAU", "CREA", "ABRACOR", "IPHAN — projetistas", "SAB (arqueologia)"] },
        { label: "Nº de ART/RRT (opcional)", type: "text", placeholder: "20250148820" },
      ],
    },
    {
      title: "Portfólio e disponibilidade",
      fields: [
        { label: "Um projeto de destaque", type: "text", placeholder: "Título da obra" },
        { label: "Regiões onde atende", type: "chips", options: ["MG", "SP", "RJ", "BA", "PE", "RS", "Todo o Brasil"] },
        { label: "Disponibilidade", type: "select", options: ["Aberto a novos projetos", "Com agenda apertada", "Só como parte de equipe"] },
      ],
    },
  ],
  financiamento: [
    {
      title: "O detentor do bem",
      fields: [
        { label: "Organização proponente", type: "text", placeholder: "Ex.: Fundação de Cultura do Estado da Bahia" },
        {
          label: "Vínculo com o bem",
          type: "select",
          options: ["Proprietária", "Cessão de uso / comodato", "Órgão de tutela", "Parceira do proprietário"],
        },
        { label: "Cidade / UF", type: "text", placeholder: "Salvador / BA" },
      ],
    },
    {
      title: "O bem e o projeto",
      fields: [
        { label: "Bem", type: "text", placeholder: "Ex.: Solar do Marquês de Abrantes" },
        {
          label: "Status do projeto",
          type: "select",
          options: ["Ideia inicial", "Projeto básico em elaboração", "Projeto executivo pronto", "Aprovado em órgão de tutela"],
        },
        { label: "Escopo resumido", type: "textarea", placeholder: "Fachadas, coberturas e forros pintados…" },
      ],
    },
    {
      title: "Captação",
      fields: [
        { label: "Meta de captação", type: "text", placeholder: "R$ 4,2 mi" },
        {
          label: "Lei / mecanismo pretendido",
          type: "chips",
          options: ["Lei Rouanet", "Lei estadual (ICMS)", "Edital de banco / BNDES", "Fundo internacional", "Ainda avaliando"],
        },
      ],
    },
    {
      title: "Documentação e contrapartidas",
      fields: [
        { label: "Documentos que já tem", type: "chips", options: ["Projeto de restauro", "Anuência do IPHAN / órgão", "Certidão de propriedade", "Planilha orçamentária", "Nenhum ainda"] },
        { label: "Contrapartidas ao patrocinador", type: "textarea", placeholder: "Placa, visitação, material de divulgação…" },
      ],
    },
  ],
};

export default async function ComecarPage({
  params,
}: {
  params: Promise<{ trilha: string }>;
}) {
  const { trilha } = await params;
  const track = TRACKS[trilha as ProTrack];
  if (!track) notFound();

  return (
    <OnboardingFlow
      steps={STEPS[trilha as ProTrack]}
      finishHref={`/painel?perfil=${track.perfil}&novo=1`}
      trackLabel={track.label}
    />
  );
}
