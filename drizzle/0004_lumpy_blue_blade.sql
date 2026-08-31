CREATE TABLE "financing_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"organization" text NOT NULL,
	"asset_name" text NOT NULL,
	"uf" text,
	"city" text,
	"project_stage" text,
	"funding_goal" text,
	"mechanism" text,
	"summary" text,
	"status" text DEFAULT 'novo' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "financing_requests" ADD CONSTRAINT "financing_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;