-- CreateTable
CREATE TABLE "AlcoholPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "preference" TEXT NOT NULL,

    CONSTRAINT "AlcoholPreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlcoholPreference" ADD CONSTRAINT "AlcoholPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlcoholPreference" ADD CONSTRAINT "AlcoholPreference_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
