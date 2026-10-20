CREATE TYPE "public"."form_field_type" AS ENUM('TEXT', 'NUMBER', 'EMAIL', 'PHONE', 'YES_NO', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(55) NOT NULL,
	"label_key" varchar(55) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"type" "form_field_type" NOT NULL,
	"options" jsonb,
	"index" numeric NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_fields_id_index_unique" UNIQUE("id","index")
);
--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_created_by_forms_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;