/*
  Warnings:

  - You are about to drop the column `data` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `studyId` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sess` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_studyId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "data",
DROP COLUMN "expiresAt",
DROP COLUMN "studyId",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sess" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "Session_expire_idx" ON "Session"("expire");
