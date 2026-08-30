import type { Article } from "@/lib/types";

/** Notícias de demonstração. No v1 o pilar é leve: newsletter + curadoria + poucas matérias. */
export const MOCK_ARTICLES: Article[] = [
  {
    slug: "novo-pac-cidades-historicas-minas",
    title: "Novo PAC libera R$ 20 milhões para cidades históricas de Minas",
    excerpt:
      "IPHAN acompanha obras em Congonhas, Mariana, Ouro Preto e Belo Horizonte. Recursos vão para monumentos tombados e qualificação de conjuntos urbanos.",
    body: [
      "O IPHAN anunciou a liberação de mais de R$ 20 milhões, no âmbito do Novo PAC Cidades Históricas, para intervenções em municípios mineiros. Os recursos financiam recuperação de monumentos, requalificação urbana e projetos de restauro.",
      "O programa reúne 44 cidades em 20 estados, com investimento total previsto de cerca de R$ 1,6 bilhão. Para o setor, o pacote representa um dos maiores volumes de obra pública de patrimônio da década — e uma janela de licitações que a Patrinu acompanha no pilar Editais.",
      "Profissionais e ateliês interessados podem configurar alertas por região e especialidade para não perder as aberturas.",
    ],
    category: "politica",
    author: "Redação Patrinu",
    publishedAt: "2026-08-27",
    readingMinutes: 3,
    featured: true,
  },
  {
    slug: "argamassa-de-cal-o-que-mudou",
    title: "Argamassa de cal: o que mudou na prática de obra nos últimos anos",
    excerpt:
      "Retorno às argamassas de cal aérea em fachadas tombadas: traços, tempo de carbonatação e os erros mais comuns em canteiro.",
    body: [
      "A substituição de argamassas cimentícias por argamassas de cal em edificações históricas deixou de ser exceção e virou exigência recorrente em termos de referência. Mas a transição no canteiro ainda esbarra em falta de mão de obra treinada.",
      "Conversamos com três responsáveis técnicos sobre traços, cura, aditivos aceitáveis e os pontos onde a obra costuma falhar — em especial o tempo de carbonatação subestimado no cronograma.",
    ],
    category: "tecnica",
    author: "Redação Patrinu",
    publishedAt: "2026-08-20",
    readingMinutes: 6,
  },
  {
    slug: "museu-nacional-colecoes-reabertura",
    title: "Museu Nacional avança na conservação das coleções salvaguardadas",
    excerpt:
      "Equipes concluem etapa de higienização e acondicionamento de acervo resgatado; documentação alimenta o novo sistema de gestão de coleções.",
    body: [
      "O plano de reconstrução do Museu Nacional entrou em nova fase com a conclusão da conservação de um lote significativo das coleções salvaguardadas após o incêndio de 2018.",
      "O trabalho, executado por ateliê especializado, incluiu diagnóstico, higienização mecânica, controle integrado de pragas e reacondicionamento — com registro fotográfico sistemático que agora compõe o acervo digital da instituição.",
    ],
    category: "obra",
    author: "Redação Patrinu",
    publishedAt: "2026-08-14",
    readingMinutes: 4,
  },
  {
    slug: "edital-iphan-100-projetos",
    title: "Aberto: edital do IPHAN seleciona 100 projetos de recuperação de bens tombados",
    excerpt:
      "R$ 37 milhões do Novo PAC para entes públicos, dioceses e organizações da sociedade civil com bens sob guarda. Inscrições até 3 de novembro.",
    body: [
      "O IPHAN publicou chamada nacional para selecionar até 100 projetos de recuperação de bens tombados em nível federal, com recursos do Novo PAC.",
      "Podem propor entes públicos, dioceses, fundações e organizações da sociedade civil que detenham a posse ou guarda formal do bem. É exigido projeto básico assinado por responsável técnico habilitado e anuência da superintendência estadual.",
      "O edital completo e o checklist de habilitação estão no pilar Editais.",
    ],
    category: "edital",
    author: "Redação Patrinu",
    publishedAt: "2026-08-05",
    readingMinutes: 2,
    source: {
      name: "gov.br/iphan",
      url: "https://www.gov.br/iphan/pt-br/acesso-a-informacao/editais-e-selecoes",
    },
  },
  {
    slug: "mercado-de-restauro-2026",
    title: "O mercado de restauro em 2026: mais obra pública, mesma escassez de mão de obra",
    excerpt:
      "Volume de licitações cresce com o PAC, mas o gargalo continua sendo a formação. O que os ateliês estão fazendo para escalar equipe.",
    body: [
      "Um levantamento informal com ateliês e escritórios aponta um cenário paradoxal: nunca houve tanto edital de restauro aberto, e nunca foi tão difícil montar equipe qualificada para responder a eles.",
      "A formação de consórcios e a contratação de técnicos em treinamento aparecem como as saídas mais citadas. A Patrinu acompanha esse movimento no pilar Profissionais e na formação de consórcio dentro de Editais.",
    ],
    category: "mercado",
    author: "Redação Patrinu",
    publishedAt: "2026-07-30",
    readingMinutes: 5,
  },
  {
    slug: "olinda-portada-se",
    title: "Fundarpe abre chamamento para restauro da portada da Sé de Olinda",
    excerpt:
      "Intervenção em cantaria de calcário: limpeza, consolidação e substituição de próteses cimentícias por argamassa de cal.",
    body: [
      "A Fundação do Patrimônio Histórico e Artístico de Pernambuco publicou chamamento para serviços de conservação e restauração de elementos pétreos da fachada principal da Igreja da Sé de Olinda.",
      "O escopo inclui remoção de intervenções incompatíveis e tratamento de patologias de origem biológica e salina. Prazo de manifestação curto — detalhes no pilar Editais.",
    ],
    category: "edital",
    author: "Redação Patrinu",
    publishedAt: "2026-08-26",
    readingMinutes: 2,
  },
];
