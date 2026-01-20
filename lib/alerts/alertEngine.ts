import { prisma } from "@/lib/prisma";
import { shouldSendAlert } from "./evaluateAlert";
import { sendAlertEmail } from "./sendEmail";
import { RiskLevel } from "@prisma/client";

export async function runAlertEngine() {
  const users = await prisma.user.findMany({
    where: {
      lastDistrictId: { not: null },
    },
    include: {
      lastDistrict: {
        include: {
          risks: {
            orderBy: { predictedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  for (const user of users) {
    const riskRecord = user.lastDistrict?.risks[0];
    if (!riskRecord) continue;

    const currentRisk = riskRecord.level;

    const shouldAlert = shouldSendAlert({
      currentRisk,
      lastRisk: user.lastRiskLevel,
      lastAlertSentAt: user.lastAlertSentAt,
    });

    if (!shouldAlert) continue;

    // Send email
    await sendAlertEmail(
      user.email,
      `⚠️ Flood Risk ${currentRisk}`,
      `Flood risk in ${user.lastDistrict?.name} is now ${currentRisk}. Please take precautions.`
    );

    // Log alert
    await prisma.alert.create({
      data: {
        message: `Flood risk escalated to ${currentRisk}`,
        userId: user.id,
        districtId: user.lastDistrictId!,
      },
    });

    // Update user state
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastRiskLevel: currentRisk,
        lastAlertSentAt: new Date(),
      },
    });
  }
}
