-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
