import { prisma } from "@/lib/prisma";

export async function createFloodAlertTransaction() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const floodRisk = await tx.floodRisk.create({
        data: {
          level: "HIGH",
          districtId: 1,
        },
      });

      const alert = await tx.alert.create({
        data: {
          message: "High flood risk detected in your area",
          userId: 9999,
          districtId: 1,
        },
      });

      return { floodRisk, alert };
    });

    console.log("Transaction successful:", result);
  } catch (error) {
    console.error("Transaction failed. Rolling back.", error);
  }
}
