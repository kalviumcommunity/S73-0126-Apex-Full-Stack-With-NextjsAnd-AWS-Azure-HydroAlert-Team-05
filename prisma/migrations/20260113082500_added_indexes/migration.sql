-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_districtId_idx" ON "Alert"("districtId");

-- CreateIndex
CREATE INDEX "Alert_userId_sentAt_idx" ON "Alert"("userId", "sentAt");

-- CreateIndex
CREATE INDEX "FloodRisk_districtId_idx" ON "FloodRisk"("districtId");

-- CreateIndex
CREATE INDEX "FloodRisk_districtId_predictedAt_idx" ON "FloodRisk"("districtId", "predictedAt");
