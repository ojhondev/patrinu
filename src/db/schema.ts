import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const organScope = pgEnum("organ_scope", [
  "federal",
  "estadual",
  "municipal",
  "privado",
  "internacional",
]);

/** Tipo de oportunidade rastreada pelo Radar. */
export const opportunityKind = pgEnum("opportunity_kind", [
  "licitacao",
  "edital",
  "chamamento",
  "credenciamento",
  "bolsa",
  "residencia",
  "vaga",
  "parceria",
  "patrocinio",
]);

export const opportunityStatus = pgEnum("opportunity_status", [
  "aberta",
  "encerrada",
  "suspensa",
  "homologada",
  "fracassada",
  "revogada",
]);

/** Como a fonte é ingerida — ver docs/radar-fontes.md. */
export const sourceAccess = pgEnum("source_access", ["api", "scraping", "monitorar"]);

export const responseStatus = pgEnum("response_status", [
  "rascunho",
  "manifestado",
  "habilitacao_pendente",
  "habilitacao_ok",
  "enviado",
  "resultado_aguardando",
  "vencemos",
  "nao_vencemos",
]);

export const documentKind = pgEnum("document_kind", [
  "art_rrt",
  "atestado_capacidade_tecnica",
  "acervo_tecnico",
  "certidao",
  "diploma",
  "registro_profissional",
  "outro",
]);

export const verificationLevel = pgEnum("verification_level", [
  "nao_verificado",
  "email",
  "registro_profissional",
  "projeto_documentado",
  "completo",
]);

/* ------------------------------------------------------------------ */
/* Auth — sessão própria por cookie assinado + scrypt                  */
/* ------------------------------------------------------------------ */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Radar — fontes e oportunidades                                      */
/* ------------------------------------------------------------------ */

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** 0..5, ver docs/radar-fontes.md */
  tier: integer("tier").notNull(),
  access: sourceAccess("access").notNull(),
  homepage: text("homepage"),
  active: boolean("active").notNull().default(false),
  lastIngestedAt: timestamp("last_ingested_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id),
    /** id do processo/edital na fonte de origem */
    externalId: text("external_id").notNull(),
    url: text("url"),

    kind: opportunityKind("kind").notNull(),
    status: opportunityStatus("status").notNull().default("aberta"),

    title: text("title").notNull(),
    /** resumo gerado por IA em linguagem clara */
    summary: text("summary"),
    /** objeto do edital, texto original */
    object: text("object"),

    organ: text("organ").notNull(),
    organScope: organScope("organ_scope").notNull(),
    uf: text("uf"),
    city: text("city"),

    estimatedValue: numeric("estimated_value", { precision: 14, scale: 2 }),

    /** taxonomia interna: bens_moveis, bens_integrados, arquitetura,
     *  arqueologia, acervo, imaterial, paisagismo, urbanismo… */
    specialties: text("specialties")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    techniques: text("techniques")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    /** exigências de habilitação estruturadas pela IA */
    habilitacao: jsonb("habilitacao").$type<HabilitacaoRequirement[]>(),

    publishedAt: timestamp("published_at", { withTimezone: true }),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }),

    /** desfecho: vencedor, valor homologado — o dado mais defensável do Radar */
    outcome: jsonb("outcome").$type<OpportunityOutcome | null>(),

    /** classificação de relevância (é patrimônio?) 0..1 */
    relevanceScore: real("relevance_score"),
    relevanceConfidence: real("relevance_confidence"),

    /** payload bruto da fonte, para reprocessamento */
    raw: jsonb("raw"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("opportunities_source_external_idx").on(t.sourceId, t.externalId),
    index("opportunities_status_deadline_idx").on(t.status, t.deadlineAt),
    index("opportunities_uf_idx").on(t.uf),
  ],
);

/** Deduplicação: uma oportunidade canônica pode aparecer em várias fontes
 *  (PNCP + Comprasnet + DOU + Querido Diário se sobrepõem — ver radar-fontes.md §08). */
export const opportunitySightings = pgTable(
  "opportunity_sightings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id),
    externalId: text("external_id").notNull(),
    url: text("url"),
    seenAt: timestamp("seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("sightings_source_external_idx").on(t.sourceId, t.externalId)],
);

/* ------------------------------------------------------------------ */
/* Perfil & portfólio profissional                                     */
/* ------------------------------------------------------------------ */

export const professionals = pgTable("professionals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  headline: text("headline"),
  bio: text("bio"),
  uf: text("uf"),
  city: text("city"),
  specialties: text("specialties")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  techniques: text("techniques")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  /** { cau?: string, crea?: string, artRrt?: string[] } */
  registros: jsonb("registros").$type<Record<string, unknown>>(),
  verified: boolean("verified").notNull().default(false),
  verificationLevel: verificationLevel("verification_level")
    .notNull()
    .default("nao_verificado"),
  plan: text("plan").notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  professionalId: uuid("professional_id")
    .notNull()
    .references(() => professionals.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  assetName: text("asset_name"),
  technique: text("technique"),
  materials: text("materials"),
  year: integer("year"),
  role: text("role"),
  description: text("description"),
  /** { antes: string[], durante: string[], depois: string[] } */
  images: jsonb("images").$type<{ antes?: string[]; durante?: string[]; depois?: string[] }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Radar personalizado — buscas salvas e alertas                       */
/* ------------------------------------------------------------------ */

export const savedSearches = pgTable("saved_searches", {
  id: uuid("id").primaryKey().defaultRandom(),
  professionalId: uuid("professional_id")
    .notNull()
    .references(() => professionals.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  specialties: text("specialties")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  ufs: text("ufs")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  kinds: text("kinds")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  minValue: numeric("min_value", { precision: 14, scale: 2 }),
  maxValue: numeric("max_value", { precision: 14, scale: 2 }),
  notify: boolean("notify").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const savedOpportunities = pgTable(
  "saved_opportunities",
  {
    professionalId: uuid("professional_id")
      .notNull()
      .references(() => professionals.id, { onDelete: "cascade" }),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("saved_opp_pk").on(t.professionalId, t.opportunityId)],
);

/* ------------------------------------------------------------------ */
/* Marketplace — camada A: responder a oportunidades públicas          */
/* ------------------------------------------------------------------ */

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  professionalId: uuid("professional_id")
    .notNull()
    .references(() => professionals.id, { onDelete: "cascade" }),
  kind: documentKind("kind").notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url"),
  issuedAt: timestamp("issued_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const opportunityResponses = pgTable(
  "opportunity_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    professionalId: uuid("professional_id")
      .notNull()
      .references(() => professionals.id, { onDelete: "cascade" }),
    status: responseStatus("status").notNull().default("rascunho"),
    /** checklist de habilitação: item -> { required, met, documentId? } */
    checklist: jsonb("checklist").$type<ChecklistItem[]>(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("response_opp_prof_idx").on(t.opportunityId, t.professionalId)],
);

/** Lista de interessados por oportunidade — quem manifesta "quero participar". */
export const consortia = pgTable("consortia", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  leadProfessionalId: uuid("lead_professional_id")
    .notNull()
    .references(() => professionals.id, { onDelete: "cascade" }),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const consortiumMembers = pgTable(
  "consortium_members",
  {
    consortiumId: uuid("consortium_id")
      .notNull()
      .references(() => consortia.id, { onDelete: "cascade" }),
    professionalId: uuid("professional_id")
      .notNull()
      .references(() => professionals.id, { onDelete: "cascade" }),
    accepted: boolean("accepted").notNull().default(false),
    invitedAt: timestamp("invited_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("consortium_member_pk").on(t.consortiumId, t.professionalId)],
);

/* ------------------------------------------------------------------ */
/* Tipos auxiliares (jsonb)                                            */
/* ------------------------------------------------------------------ */

export type HabilitacaoRequirement = {
  label: string;
  category: "juridica" | "tecnica" | "fiscal" | "economica" | "outra";
  detail?: string;
};

export type ChecklistItem = HabilitacaoRequirement & {
  met: boolean;
  documentId?: string;
};

export type OpportunityOutcome = {
  winner?: string;
  winnerValue?: number;
  homologatedAt?: string;
};
