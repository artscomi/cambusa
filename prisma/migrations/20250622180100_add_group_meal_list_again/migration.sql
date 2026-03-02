-- AlterTable (mealList was dropped in 20250622175345; re-add as optional for group menu)
ALTER TABLE "Group" ADD COLUMN "mealList" TEXT;
