-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "mealList" TEXT NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "WaterPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "preference" TEXT NOT NULL,

    CONSTRAINT "WaterPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaterPreference" ADD CONSTRAINT "WaterPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterPreference" ADD CONSTRAINT "WaterPreference_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
