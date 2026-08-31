CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text[] DEFAULT '{}'::text[] NOT NULL,
	"category" text DEFAULT 'mercado' NOT NULL,
	"author" text DEFAULT 'Redação Patrinu' NOT NULL,
	"source_name" text,
	"source_url" text,
	"reading_minutes" integer DEFAULT 2 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"review_status" text DEFAULT 'pendente' NOT NULL,
	"matched_terms" text[] DEFAULT '{}'::text[] NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "opportunities" ADD COLUMN "review_status" text DEFAULT 'pendente' NOT NULL;--> statement-breakpoint
ALTER TABLE "opportunities" ADD COLUMN "matched_terms" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "kind" text DEFAULT 'edital' NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "feed_url" text;--> statement-breakpoint
CREATE UNIQUE INDEX "articles_source_url_idx" ON "articles" USING btree ("source_url");