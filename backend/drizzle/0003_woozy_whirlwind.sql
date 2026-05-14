ALTER TABLE "list" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "list" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "unique_user_list" UNIQUE("user_id");