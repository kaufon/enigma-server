/*
  Warnings:

  - You are about to drop the column `salt` on the `users` table. All the data in the column will be lost.
  - Added the required column `encrypted_data_key` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "salt",
ADD COLUMN     "encrypted_data_key" TEXT NOT NULL;
