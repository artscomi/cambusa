/*
  Warnings:

  - You are about to drop the column `dinner` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `lunch` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "dinner",
DROP COLUMN "lunch";
