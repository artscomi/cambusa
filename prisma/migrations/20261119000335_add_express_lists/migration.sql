-- CreateTable
CREATE TABLE "ExpressList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "people" INTEGER,
    "creatorToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpressList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpressItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "addedByName" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpressItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpressVote" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "voter" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ExpressVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpressItem_listId_idx" ON "ExpressItem"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpressVote_itemId_voter_key" ON "ExpressVote"("itemId", "voter");

-- AddForeignKey
ALTER TABLE "ExpressItem" ADD CONSTRAINT "ExpressItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ExpressList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpressVote" ADD CONSTRAINT "ExpressVote_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ExpressItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
