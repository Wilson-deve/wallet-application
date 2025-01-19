-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_subcategory_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "subcategory_id" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
