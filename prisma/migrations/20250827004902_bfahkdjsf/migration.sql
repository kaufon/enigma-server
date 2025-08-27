/*
  Warnings:

  - You are about to drop the column `username` on the `credentials` table. All the data in the column will be lost.
  - Added the required column `login` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."credentials" DROP COLUMN "username",
ADD COLUMN     "login" TEXT NOT NULL;
