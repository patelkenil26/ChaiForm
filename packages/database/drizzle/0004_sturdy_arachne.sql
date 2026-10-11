ALTER TYPE "public"."field_type_enum" ADD VALUE 'TEXTAREA' BEFORE 'NUMBER';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'PHONE' BEFORE 'YES_NO';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'URL' BEFORE 'YES_NO';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'DATE' BEFORE 'YES_NO';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'TIME' BEFORE 'YES_NO';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'SELECT';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'RADIO';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'CHECKBOX';--> statement-breakpoint
ALTER TYPE "public"."field_type_enum" ADD VALUE 'RATING';--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "options" json;