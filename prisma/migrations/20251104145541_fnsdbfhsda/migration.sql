-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "report_notification_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "report_notification_schedule" TEXT;
