CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(55) NOT NULL,
	"description" varchar(255),
	"created_by" uuid,
	"is_protected" boolean DEFAULT false NOT NULL,
	"password" varchar(255),
	"password_salt" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"published_by" uuid,
	"published_at" timestamp,
	"unpublished_at" timestamp,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_by" uuid,
	"deleted_at" timestamp,
	"participant_limit" integer,
	"participant_limit_unit" varchar(10),
	"total_submissions" integer,
	"unsubmitted_submissions" integer,
	"time_limit" integer,
	"time_limit_unit" varchar(255),
	"form_link" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;