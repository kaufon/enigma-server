-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "emergency_passphrase_hash" DROP NOT NULL,
ALTER COLUMN "emrgency_passphrase_salt" DROP NOT NULL;
