-- CreateTable
CREATE TABLE "public"."SharedItem" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "encrypted_blob" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "delete_on_read" BOOLEAN NOT NULL DEFAULT false,
    "access_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SharedItem" ADD CONSTRAINT "SharedItem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
