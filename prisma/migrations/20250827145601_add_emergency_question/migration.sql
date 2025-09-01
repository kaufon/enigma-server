/*
  Warnings:

  - Added the required column `emergency_passphrase_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emrgency_passphrase_salt` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `security_question_answer_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_encrypted_email_content_key";

-- DropIndex
DROP INDEX "public"."users_encrypted_email_iv_key";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "emergency_passphrase_hash" TEXT NOT NULL,
ADD COLUMN     "emrgency_passphrase_salt" TEXT NOT NULL,
ADD COLUMN     "securityQuestionId" TEXT,
ADD COLUMN     "security_question_answer_hash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."security_questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "security_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "security_questions_text_key" ON "public"."security_questions"("text");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_securityQuestionId_fkey" FOREIGN KEY ("securityQuestionId") REFERENCES "public"."security_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
