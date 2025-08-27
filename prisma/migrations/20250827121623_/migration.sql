/*
  Warnings:

  - You are about to drop the column `critical_key` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "critical_key";
