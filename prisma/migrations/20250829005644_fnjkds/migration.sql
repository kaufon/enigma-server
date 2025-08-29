/*
  Warnings:

  - You are about to drop the column `login` on the `credentials` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `credentials` table. All the data in the column will be lost.
  - Added the required column `encrypted_password_content` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_password_iv` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_title_content` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_title_iv` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_username_content` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_username_iv` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."credentials" DROP COLUMN "login",
DROP COLUMN "password",
ADD COLUMN     "encrypted_password_content" TEXT NOT NULL,
ADD COLUMN     "encrypted_password_iv" TEXT NOT NULL,
ADD COLUMN     "encrypted_title_content" TEXT NOT NULL,
ADD COLUMN     "encrypted_title_iv" TEXT NOT NULL,
ADD COLUMN     "encrypted_url_content" TEXT,
ADD COLUMN     "encrypted_url_iv" TEXT,
ADD COLUMN     "encrypted_username_content" TEXT NOT NULL,
ADD COLUMN     "encrypted_username_iv" TEXT NOT NULL;
