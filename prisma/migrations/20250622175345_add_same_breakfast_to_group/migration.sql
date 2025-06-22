/*
  Warnings:

  - You are about to drop the column `mealList` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "mealList",
ADD COLUMN     "sameBreakfast" BOOLEAN NOT NULL DEFAULT false;
