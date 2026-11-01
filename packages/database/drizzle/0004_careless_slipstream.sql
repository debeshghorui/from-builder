CREATE TABLE "form_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"index" numeric NOT NULL,
	"position_x" integer DEFAULT 0 NOT NULL,
	"position_y" integer DEFAULT 0 NOT NULL,
	"is_start" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_page_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"source_page_id" uuid NOT NULL,
	"target_page_id" uuid NOT NULL,
	"condition" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"respondent_email" varchar(255),
	"answers" jsonb NOT NULL,
	"flow_version" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "collect_email" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "allow_anonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "response_limit" integer;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "per_respondent_limit" integer;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "page_id" uuid;--> statement-breakpoint
INSERT INTO "form_pages" ("form_id", "title", "index", "is_start")
SELECT "id", 'Page 1', 0, true FROM "forms";--> statement-breakpoint
UPDATE "form_fields" AS field
SET "page_id" = page."id"
FROM "form_pages" AS page
WHERE field."created_by" = page."form_id" AND field."page_id" IS NULL;--> statement-breakpoint
ALTER TABLE "form_pages" ADD CONSTRAINT "form_pages_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_page_connections" ADD CONSTRAINT "form_page_connections_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_page_connections" ADD CONSTRAINT "form_page_connections_source_page_id_form_pages_id_fk" FOREIGN KEY ("source_page_id") REFERENCES "public"."form_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_page_connections" ADD CONSTRAINT "form_page_connections_target_page_id_form_pages_id_fk" FOREIGN KEY ("target_page_id") REFERENCES "public"."form_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "form_pages_one_start_per_form" ON "form_pages" USING btree ("form_id") WHERE "form_pages"."is_start" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "form_page_connections_one_default_per_source" ON "form_page_connections" USING btree ("form_id","source_page_id") WHERE "form_page_connections"."condition" IS NULL;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_page_id_form_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."form_pages"("id") ON DELETE cascade ON UPDATE no action;
