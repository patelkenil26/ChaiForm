ALTER TABLE "forms" ADD COLUMN "slug" varchar(60);--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_slug_unique" UNIQUE("slug");