/*
  Warnings:

  - Added the required column `riskLevelAtSend` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "riskLevelAtSend" "RiskLevel" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastAlertSentAt" TIMESTAMP(3),
ADD COLUMN     "lastDistrictId" INTEGER,
ADD COLUMN     "lastLatitude" DOUBLE PRECISION,
ADD COLUMN     "lastLongitude" DOUBLE PRECISION,
ADD COLUMN     "lastRiskLevel" "RiskLevel";

-- CreateIndex
CREATE INDEX "User_lastDistrictId_idx" ON "User"("lastDistrictId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastDistrictId_fkey" FOREIGN KEY ("lastDistrictId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
