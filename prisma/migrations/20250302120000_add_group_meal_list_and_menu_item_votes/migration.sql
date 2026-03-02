-- CreateTable
CREATE TABLE "MenuItemVote" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealTypeId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "MenuItemVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemVote_groupId_userId_mealTypeId_mealId_key" ON "MenuItemVote"("groupId", "userId", "mealTypeId", "mealId");

-- AddForeignKey
ALTER TABLE "MenuItemVote" ADD CONSTRAINT "MenuItemVote_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
