/*
  Warnings:

  - You are about to drop the column `securityQuestionId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `security_question_answer_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `security_questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_securityQuestionId_fkey";

-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "category_id" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "securityQuestionId",
DROP COLUMN "security_question_answer_hash";

-- DropTable
DROP TABLE "public"."security_questions";

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."credentials" ADD CONSTRAINT "credentials_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
