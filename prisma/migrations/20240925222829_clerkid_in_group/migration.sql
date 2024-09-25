-- DropForeignKey
ALTER TABLE "FoodPreference" DROP CONSTRAINT "FoodPreference_userId_fkey";

-- AddForeignKey
ALTER TABLE "FoodPreference" ADD CONSTRAINT "FoodPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
