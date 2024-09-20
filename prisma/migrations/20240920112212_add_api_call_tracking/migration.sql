-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiCallCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastApiCall" TIMESTAMP(3);
