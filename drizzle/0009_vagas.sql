ALTER TABLE "projects" ADD COLUMN "entry_kind" text DEFAULT 'projeto' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "vaga_role" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "contract_type" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "seniority" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "work_mode" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "salary_min" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "salary_max" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "salary_confidential" boolean DEFAULT false NOT NULL;