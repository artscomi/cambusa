/*
  Warnings:

  - Added the required column `people` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "people" TEXT NOT NULL DEFAULT '0';
