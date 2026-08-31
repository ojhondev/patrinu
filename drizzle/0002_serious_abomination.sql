CREATE TYPE "public"."project_status" AS ENUM('rascunho', 'em_analise', 'recusado', 'vitrine', 'aberto', 'em_captacao', 'em_execucao', 'concluido');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('enviada', 'em_conversa', 'aceita', 'recusada');--> statement-breakpoint
CREATE TYPE "public"."user_plan" AS ENUM('visitante', 'cadastrado', 'pro');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'moderador', 'master');--> statement-breakpoint
CREATE TABLE "project_interests" (
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"owner_id" uuid,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"status" "project_status" DEFAULT 'rascunho' NOT NULL,
	"asset_name" text NOT NULL,
	"uf" text NOT NULL,
	"city" text NOT NULL,
	"year" integer,
	"specialties" text[] DEFAULT '{}'::text[] NOT NULL,
	"techniques" text[] DEFAULT '{}'::text[] NOT NULL,
	"materials" text[] DEFAULT '{}'::text[] NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"credits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"from_opportunity_id" uuid,
	"budget_range" text,
	"deadline_at" timestamp with time zone,
	"requirements" text[] DEFAULT '{}'::text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone,
	"moderated_at" timestamp with time zone,
	"rejection_reason" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text NOT NULL,
	"price_range" text,
	"status" "proposal_status" DEFAULT 'enviada' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "professionals" ALTER COLUMN "registros" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "professionals" ALTER COLUMN "registros" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "response_hours" integer;--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "score" real;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "user_plan" DEFAULT 'cadastrado' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "track" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_interests" ADD CONSTRAINT "project_interests_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_interests" ADD CONSTRAINT "project_interests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_from_opportunity_id_opportunities_id_fk" FOREIGN KEY ("from_opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_interest_pk" ON "project_interests" USING btree ("project_id","user_id");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "proposal_project_user_idx" ON "proposals" USING btree ("project_id","user_id");