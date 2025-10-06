-- CreateTable
CREATE TABLE "public"."safe_notes" (
    "id" TEXT NOT NULL,
    "encrypted_title_iv" TEXT NOT NULL,
    "encrypted_title_content" TEXT NOT NULL,
    "encrypted_note_iv" TEXT NOT NULL,
    "encrypted_note_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "category_id" TEXT,

    CONSTRAINT "safe_notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."safe_notes" ADD CONSTRAINT "safe_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."safe_notes" ADD CONSTRAINT "safe_notes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
