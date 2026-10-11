CREATE TYPE "public"."form_visibility_enum" AS ENUM('PUBLIC', 'UNLISTED');--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "visibility" "form_visibility_enum" DEFAULT 'UNLISTED' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;