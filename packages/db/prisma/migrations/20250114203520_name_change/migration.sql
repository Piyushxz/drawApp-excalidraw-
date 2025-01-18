/*
  Warnings:

  - You are about to drop the column `admin` on the `Room` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_admin_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "admin",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
