DO $$ BEGIN
 CREATE TYPE "public"."providers" AS ENUM('moralis', 'infura', 'alchemy');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "providers" "providers";