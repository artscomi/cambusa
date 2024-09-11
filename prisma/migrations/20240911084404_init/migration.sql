/*
  Warnings:

  - You are about to drop the column `preference` on the `FoodPreference` table. All the data in the column will be lost.
  - Added the required column `preferences` to the `FoodPreference` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "preferences" TEXT NOT NULL,
    CONSTRAINT "FoodPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FoodPreference_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FoodPreference" ("groupId", "id", "userId") SELECT "groupId", "id", "userId" FROM "FoodPreference";
DROP TABLE "FoodPreference";
ALTER TABLE "new_FoodPreference" RENAME TO "FoodPreference";
CREATE UNIQUE INDEX "FoodPreference_userId_groupId_preferences_key" ON "FoodPreference"("userId", "groupId", "preferences");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
