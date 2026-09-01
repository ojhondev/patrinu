CREATE TABLE "mp_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mp_id" text NOT NULL,
	"topic" text NOT NULL,
	"action" text,
	"status" text,
	"payer_email" text,
	"amount" numeric(12, 2),
	"granted_user_id" uuid,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pending_pro_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"track" text,
	"mp_ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pending_pro_grants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan_source" text DEFAULT 'paid' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pro_granted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pro_note" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mp_ref" text;--> statement-breakpoint
ALTER TABLE "mp_events" ADD CONSTRAINT "mp_events_granted_user_id_users_id_fk" FOREIGN KEY ("granted_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;