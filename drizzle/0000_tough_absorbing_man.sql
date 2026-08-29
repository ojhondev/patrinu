CREATE TYPE "public"."document_kind" AS ENUM('art_rrt', 'atestado_capacidade_tecnica', 'acervo_tecnico', 'certidao', 'diploma', 'registro_profissional', 'outro');--> statement-breakpoint
CREATE TYPE "public"."opportunity_kind" AS ENUM('licitacao', 'edital', 'chamamento', 'credenciamento', 'bolsa', 'residencia', 'vaga', 'parceria', 'patrocinio');--> statement-breakpoint
CREATE TYPE "public"."opportunity_status" AS ENUM('aberta', 'encerrada', 'suspensa', 'homologada', 'fracassada', 'revogada');--> statement-breakpoint
CREATE TYPE "public"."organ_scope" AS ENUM('federal', 'estadual', 'municipal', 'privado', 'internacional');--> statement-breakpoint
CREATE TYPE "public"."response_status" AS ENUM('rascunho', 'manifestado', 'habilitacao_pendente', 'habilitacao_ok', 'enviado', 'resultado_aguardando', 'vencemos', 'nao_vencemos');--> statement-breakpoint
CREATE TYPE "public"."source_access" AS ENUM('api', 'scraping', 'monitorar');--> statement-breakpoint
CREATE TYPE "public"."verification_level" AS ENUM('nao_verificado', 'email', 'registro_profissional', 'projeto_documentado', 'completo');--> statement-breakpoint
CREATE TABLE "consortia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"lead_professional_id" uuid NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consortium_members" (
	"consortium_id" uuid NOT NULL,
	"professional_id" uuid NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid NOT NULL,
	"kind" "document_kind" NOT NULL,
	"title" text NOT NULL,
	"file_url" text,
	"issued_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "heritage_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"iphan_id" text,
	"kind" text,
	"uf" text,
	"city" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "heritage_assets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "interventions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"opportunity_id" uuid,
	"title" text NOT NULL,
	"summary" text,
	"technique" text,
	"materials" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"external_id" text NOT NULL,
	"url" text,
	"kind" "opportunity_kind" NOT NULL,
	"status" "opportunity_status" DEFAULT 'aberta' NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"object" text,
	"organ" text NOT NULL,
	"organ_scope" "organ_scope" NOT NULL,
	"uf" text,
	"city" text,
	"estimated_value" numeric(14, 2),
	"specialties" text[] DEFAULT '{}'::text[] NOT NULL,
	"techniques" text[] DEFAULT '{}'::text[] NOT NULL,
	"habilitacao" jsonb,
	"published_at" timestamp with time zone,
	"deadline_at" timestamp with time zone,
	"outcome" jsonb,
	"relevance_score" real,
	"relevance_confidence" real,
	"raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"professional_id" uuid NOT NULL,
	"status" "response_status" DEFAULT 'rascunho' NOT NULL,
	"checklist" jsonb,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_sightings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"external_id" text NOT NULL,
	"url" text,
	"seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid NOT NULL,
	"title" text NOT NULL,
	"asset_name" text,
	"technique" text,
	"materials" text,
	"year" integer,
	"role" text,
	"description" text,
	"images" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"display_name" text NOT NULL,
	"headline" text,
	"bio" text,
	"uf" text,
	"city" text,
	"specialties" text[] DEFAULT '{}'::text[] NOT NULL,
	"techniques" text[] DEFAULT '{}'::text[] NOT NULL,
	"registros" jsonb,
	"verified" boolean DEFAULT false NOT NULL,
	"verification_level" "verification_level" DEFAULT 'nao_verificado' NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "professionals_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "professionals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "saved_opportunities" (
	"professional_id" uuid NOT NULL,
	"opportunity_id" uuid NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid NOT NULL,
	"name" text NOT NULL,
	"specialties" text[] DEFAULT '{}'::text[] NOT NULL,
	"ufs" text[] DEFAULT '{}'::text[] NOT NULL,
	"kinds" text[] DEFAULT '{}'::text[] NOT NULL,
	"min_value" numeric(14, 2),
	"max_value" numeric(14, 2),
	"notify" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tier" integer NOT NULL,
	"access" "source_access" NOT NULL,
	"homepage" text,
	"active" boolean DEFAULT false NOT NULL,
	"last_ingested_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "consortia" ADD CONSTRAINT "consortia_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consortia" ADD CONSTRAINT "consortia_lead_professional_id_professionals_id_fk" FOREIGN KEY ("lead_professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consortium_members" ADD CONSTRAINT "consortium_members_consortium_id_consortia_id_fk" FOREIGN KEY ("consortium_id") REFERENCES "public"."consortia"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consortium_members" ADD CONSTRAINT "consortium_members_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_asset_id_heritage_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."heritage_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_responses" ADD CONSTRAINT "opportunity_responses_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_responses" ADD CONSTRAINT "opportunity_responses_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_sightings" ADD CONSTRAINT "opportunity_sightings_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunity_sightings" ADD CONSTRAINT "opportunity_sightings_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_opportunities" ADD CONSTRAINT "saved_opportunities_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_opportunities" ADD CONSTRAINT "saved_opportunities_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "consortium_member_pk" ON "consortium_members" USING btree ("consortium_id","professional_id");--> statement-breakpoint
CREATE UNIQUE INDEX "opportunities_source_external_idx" ON "opportunities" USING btree ("source_id","external_id");--> statement-breakpoint
CREATE INDEX "opportunities_status_deadline_idx" ON "opportunities" USING btree ("status","deadline_at");--> statement-breakpoint
CREATE INDEX "opportunities_uf_idx" ON "opportunities" USING btree ("uf");--> statement-breakpoint
CREATE UNIQUE INDEX "response_opp_prof_idx" ON "opportunity_responses" USING btree ("opportunity_id","professional_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sightings_source_external_idx" ON "opportunity_sightings" USING btree ("source_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_opp_pk" ON "saved_opportunities" USING btree ("professional_id","opportunity_id");