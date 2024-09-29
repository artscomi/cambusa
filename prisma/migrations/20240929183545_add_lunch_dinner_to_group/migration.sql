/*
  Warnings:

  - Added the required column `dinner` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lunch` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "dinner" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "lunch" TEXT NOT NULL DEFAULT '0';
