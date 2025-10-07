-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "is_emergency" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."safe_notes" ADD COLUMN     "is_emergency" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emergency_vault_master_key" TEXT;
