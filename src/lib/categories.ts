/**
 * Taxonomia de categorias — 2 níveis: grupo → especialidade.
 *
 * A unidade de armazenamento continua sendo a `key` da especialidade (kebab),
 * gravada em `projects.specialties`, `professionals.specialties`,
 * `opportunities.specialties`. As 9 keys antigas (`bens_moveis`, `arquitetura`,
 * `arqueologia`, `acervo`, `bens_integrados`, `paisagismo`, `urbanismo`,
 * `imaterial`, `documental`) seguem válidas — estão distribuídas nos grupos.
 */

export type CategoryGroup = {
  key: string;
  label: string;
  /** ícone lucide (resolvido em specialty-visual.tsx) */
  icon: string;
  specialties: { key: string; label: string }[];
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "bens-moveis",
    label: "Bens móveis",
    icon: "frame",
    specialties: [
      { key: "bens_moveis", label: "Bens móveis (geral)" },
      { key: "escultura-madeira", label: "Escultura em madeira e imaginária" },
      { key: "escultura-pedra", label: "Escultura em pedra" },
      { key: "mobiliario-historico", label: "Mobiliário histórico" },
      { key: "ex-votos", label: "Ex-votos e arte popular" },
      { key: "instrumentos-musicais", label: "Instrumentos musicais históricos" },
      { key: "relojoaria", label: "Relojoaria e mecanismos" },
    ],
  },
  {
    key: "pintura",
    label: "Pintura",
    icon: "brush",
    specialties: [
      { key: "pintura-cavalete", label: "Pintura de cavalete" },
      { key: "pintura-mural", label: "Pintura mural" },
      { key: "forro-pintado", label: "Forro pintado" },
      { key: "pintura-parietal", label: "Pintura parietal e caiações históricas" },
      { key: "retabulos", label: "Retábulos e talha pintada" },
      { key: "reintegracao-cromatica", label: "Reintegração cromática" },
      { key: "policromia", label: "Policromia sobre madeira" },
    ],
  },
  {
    key: "douramento",
    label: "Douramento e superfícies metálicas decorativas",
    icon: "sparkles",
    specialties: [
      { key: "douramento", label: "Douramento a folha" },
      { key: "prateamento-decorativo", label: "Prateamento e estanhado decorativo" },
      { key: "brunidura", label: "Brunidura e assentos" },
      { key: "remocao-purpurinas", label: "Remoção de purpurinas e repinturas" },
    ],
  },
  {
    key: "bens-integrados",
    label: "Bens integrados",
    icon: "landmark",
    specialties: [
      { key: "bens_integrados", label: "Bens integrados (geral)" },
      { key: "azulejaria", label: "Azulejaria histórica" },
      { key: "paineis-azulejo", label: "Painéis de azulejo" },
      { key: "estuque-ornatos", label: "Estuque e ornatos" },
      { key: "marmorite-fingidos", label: "Marmorite e fingidos de pedra" },
      { key: "lambris-boiseries", label: "Lambris e boiseries" },
      { key: "pisos-historicos", label: "Ladrilho hidráulico e pisos históricos" },
    ],
  },
  {
    key: "papel-livros",
    label: "Papel, livros e documentos",
    icon: "book",
    specialties: [
      { key: "documental", label: "Acervo documental e bibliográfico" },
      { key: "conservacao-papel", label: "Conservação de papel" },
      { key: "encadernacao", label: "Encadernação e restauro de livros" },
      { key: "obras-arte-papel", label: "Obras de arte sobre papel" },
      { key: "mapas-cartografia", label: "Mapas, plantas e cartografia" },
      { key: "pergaminho", label: "Pergaminho e suportes antigos" },
      { key: "desacidificacao", label: "Desacidificação e tratamento de massa" },
    ],
  },
  {
    key: "fotografia-midias",
    label: "Fotografia e mídias",
    icon: "camera",
    specialties: [
      { key: "fotografia-historica", label: "Fotografia histórica" },
      { key: "negativos-vidro-nitrato", label: "Negativos de vidro e nitrato" },
      { key: "audiovisual-sonoro", label: "Acervos audiovisuais e sonoros" },
      { key: "preservacao-digital", label: "Preservação digital e born-digital" },
    ],
  },
  {
    key: "texteis",
    label: "Têxteis e indumentária",
    icon: "shirt",
    specialties: [
      { key: "texteis-historicos", label: "Têxteis históricos" },
      { key: "indumentaria-paramentos", label: "Indumentária e paramentos" },
      { key: "tapecaria-bordados", label: "Tapeçaria e bordados" },
      { key: "bandeiras-estandartes", label: "Bandeiras e estandartes" },
    ],
  },
  {
    key: "metais",
    label: "Metais e ourivesaria",
    icon: "gem",
    specialties: [
      { key: "ourivesaria-prataria", label: "Ourivesaria e prataria" },
      { key: "bronze-monumentos", label: "Bronze e monumentos em metal" },
      { key: "ferro-forjado", label: "Ferro forjado e serralheria artística" },
      { key: "sinos-carrilhoes", label: "Sinos e carrilhões" },
      { key: "armaria-historica", label: "Armaria histórica" },
    ],
  },
  {
    key: "ceramica-vidro",
    label: "Cerâmica, vidro e vitrais",
    icon: "shapes",
    specialties: [
      { key: "ceramica-faianca", label: "Cerâmica e faiança" },
      { key: "porcelana", label: "Porcelana" },
      { key: "vidro-historico", label: "Vidro histórico" },
      { key: "vitrais", label: "Vitrais" },
      { key: "mosaico", label: "Mosaico" },
    ],
  },
  {
    key: "pedra-cantaria",
    label: "Pedra e cantaria",
    icon: "pyramid",
    specialties: [
      { key: "cantaria", label: "Cantaria e elementos em pedra" },
      { key: "alvenaria-pedra", label: "Alvenaria de pedra" },
      { key: "limpeza-consolidacao-pedra", label: "Limpeza e consolidação de pedra" },
      { key: "lapides-arte-funeraria", label: "Lápides e arte funerária" },
      { key: "rochas-ornamentais", label: "Rochas ornamentais e mármores" },
    ],
  },
  {
    key: "madeira-estruturas",
    label: "Madeira e estruturas",
    icon: "hammer",
    specialties: [
      { key: "carpintaria-restauro", label: "Carpintaria de restauro" },
      { key: "coberturas-madeira", label: "Estruturas e coberturas em madeira" },
      { key: "marcenaria-restauro", label: "Marcenaria de restauro" },
      { key: "esquadrias-caixilharia", label: "Esquadrias e caixilharia" },
      { key: "tratamento-xilofagos", label: "Tratamento de xilófagos" },
    ],
  },
  {
    key: "arquitetura",
    label: "Arquitetura e edificações",
    icon: "building",
    specialties: [
      { key: "arquitetura", label: "Arquitetura e restauro de edificações" },
      { key: "fachadas-historicas", label: "Fachadas históricas" },
      { key: "coberturas-telhados", label: "Coberturas e telhados" },
      { key: "argamassas-cal", label: "Argamassas e rebocos de cal" },
      { key: "reforco-estrutural", label: "Reforço estrutural e patologias" },
      { key: "instalacoes-tombados", label: "Instalações em edifícios tombados" },
      { key: "acessibilidade-patrimonio", label: "Acessibilidade em bens tombados" },
      { key: "conforto-eficiencia", label: "Conforto ambiental e eficiência" },
    ],
  },
  {
    key: "arqueologia",
    label: "Arqueologia",
    icon: "shovel",
    specialties: [
      { key: "arqueologia", label: "Arqueologia" },
      { key: "arqueologia-preventiva", label: "Arqueologia preventiva" },
      { key: "conservacao-material-arqueologico", label: "Conservação de material arqueológico" },
      { key: "arqueologia-subaquatica", label: "Arqueologia subaquática" },
      { key: "bioarqueologia", label: "Bioarqueologia" },
      { key: "arte-rupestre", label: "Arte rupestre" },
    ],
  },
  {
    key: "acervos-museologia",
    label: "Acervos e museologia",
    icon: "archive",
    specialties: [
      { key: "acervo", label: "Acervos e conservação preventiva" },
      { key: "conservacao-preventiva", label: "Conservação preventiva e controle ambiental" },
      { key: "reserva-tecnica", label: "Reserva técnica e acondicionamento" },
      { key: "gestao-colecoes", label: "Gestão e documentação de coleções" },
      { key: "conservacao-exposicoes", label: "Montagem e conservação em exposições" },
      { key: "manejo-integrado-pragas", label: "Manejo integrado de pragas" },
      { key: "plano-emergencia-acervo", label: "Planos de emergência e resgate de acervo" },
      { key: "transporte-obras", label: "Transporte e manuseio de obras" },
    ],
  },
  {
    key: "jardins-paisagem",
    label: "Jardins e paisagem",
    icon: "trees",
    specialties: [
      { key: "paisagismo", label: "Jardins e paisagismo histórico" },
      { key: "urbanismo", label: "Sítios urbanos e paisagem urbana" },
      { key: "jardins-historicos", label: "Jardins históricos e hortos" },
      { key: "arborizacao-patrimonial", label: "Arborização de valor patrimonial" },
      { key: "paisagem-cultural", label: "Paisagem cultural" },
    ],
  },
  {
    key: "imaterial",
    label: "Patrimônio imaterial",
    icon: "music",
    specialties: [
      { key: "imaterial", label: "Patrimônio imaterial" },
      { key: "saberes-oficios", label: "Saberes e ofícios tradicionais" },
      { key: "inventario-participativo", label: "Inventário participativo e registro" },
      { key: "planos-salvaguarda", label: "Planos de salvaguarda" },
    ],
  },
  {
    key: "documentacao-projeto",
    label: "Documentação, projeto e gestão",
    icon: "ruler",
    specialties: [
      { key: "levantamento-cadastral", label: "Levantamento cadastral e métrico" },
      { key: "digitalizacao-3d", label: "Digitalização 3D e fotogrametria" },
      { key: "diagnostico-conservacao", label: "Diagnóstico e mapa de danos" },
      { key: "projeto-restauro", label: "Projeto de restauro / executivo" },
      { key: "projeto-museografico", label: "Projeto museográfico" },
      { key: "fiscalizacao-obra-restauro", label: "Fiscalização e gestão de obra de restauro" },
      { key: "laudos-pericias", label: "Laudos e perícias em patrimônio" },
      { key: "captacao-incentivo", label: "Captação e gestão de leis de incentivo" },
      { key: "educacao-patrimonial", label: "Educação patrimonial" },
      { key: "dossies-tombamento", label: "Dossiês de tombamento e registro" },
    ],
  },
];

/* ---------------- índices derivados ---------------- */

/** map key→label de TODAS as especialidades (compat com o antigo SPECIALTIES). */
export const SPECIALTIES: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.specialties.map((s) => [s.key, s.label])),
);

export type SpecialtyKey = string;

const SPECIALTY_GROUP: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.specialties.map((s) => [s.key, g.key])),
);

const GROUP_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.map((g) => [g.key, g.label]),
);

export const CATEGORY_GROUP_KEYS = CATEGORY_GROUPS.map((g) => g.key);

export function specialtyLabel(key: string): string {
  return SPECIALTIES[key] ?? key;
}

export function groupOf(specialtyKey: string): string | undefined {
  return SPECIALTY_GROUP[specialtyKey];
}

export function groupLabel(groupKey: string): string {
  return GROUP_LABEL[groupKey] ?? groupKey;
}

/** todas as keys de especialidade de um grupo (para expandir filtros). */
export function specialtiesInGroup(groupKey: string): string[] {
  return CATEGORY_GROUPS.find((g) => g.key === groupKey)?.specialties.map((s) => s.key) ?? [];
}
