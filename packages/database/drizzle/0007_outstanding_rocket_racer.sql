ALTER TABLE "forms" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password_salt" varchar(64);