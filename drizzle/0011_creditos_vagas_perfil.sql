CREATE TABLE "credit_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"ref_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "whatsapp" text;--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "project_interests" ADD COLUMN "applicant_name" text;--> statement-breakpoint
ALTER TABLE "project_interests" ADD COLUMN "applicant_email" text;--> statement-breakpoint
ALTER TABLE "project_interests" ADD COLUMN "applicant_city" text;--> statement-breakpoint
ALTER TABLE "project_interests" ADD COLUMN "nationwide" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project_interests" ADD COLUMN "cv_url" text;--> statement-breakpoint
ALTER TABLE "project_interests" ADD COLUMN "availability" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "contact_whatsapp" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location_note" text;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;