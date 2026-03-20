-- CreateTable
CREATE TABLE "rateLimit" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rateLimit_identifier_idx" ON "rateLimit"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "rateLimit_identifier_key" ON "rateLimit"("identifier");
