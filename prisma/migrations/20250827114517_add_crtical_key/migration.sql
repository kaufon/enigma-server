/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email_hash]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[encrypted_email_iv]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[encrypted_email_content]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `critical_key` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_email_content` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_email_iv` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_email_key";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "email",
ADD COLUMN     "critical_key" TEXT NOT NULL,
ADD COLUMN     "email_hash" TEXT NOT NULL,
ADD COLUMN     "encrypted_email_content" TEXT NOT NULL,
ADD COLUMN     "encrypted_email_iv" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_hash_key" ON "public"."users"("email_hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_encrypted_email_iv_key" ON "public"."users"("encrypted_email_iv");

-- CreateIndex
CREATE UNIQUE INDEX "users_encrypted_email_content_key" ON "public"."users"("encrypted_email_content");
