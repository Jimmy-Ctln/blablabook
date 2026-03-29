ALTER TABLE "refresh_token" RENAME COLUMN "token" TO "refresh_token";--> statement-breakpoint
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_token_unique";--> statement-breakpoint
ALTER TABLE "refresh_token" ADD COLUMN "expires_at" timestamp NOT NULL DEFAULT (NOW() + INTERVAL '30 days');--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_refresh_token_unique" UNIQUE("refresh_token");