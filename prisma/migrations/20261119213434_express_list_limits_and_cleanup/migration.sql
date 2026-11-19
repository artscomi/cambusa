-- AlterTable
ALTER TABLE "ExpressList" ADD COLUMN     "creatorIpHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "ExpressList_creatorToken_createdAt_idx" ON "ExpressList"("creatorToken", "createdAt");

-- CreateIndex
CREATE INDEX "ExpressList_creatorIpHash_createdAt_idx" ON "ExpressList"("creatorIpHash", "createdAt");

-- CreateIndex
CREATE INDEX "ExpressList_updatedAt_idx" ON "ExpressList"("updatedAt");
