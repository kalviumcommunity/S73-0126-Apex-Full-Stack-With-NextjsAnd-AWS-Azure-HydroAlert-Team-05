import { RiskLevel } from "@prisma/client";

type AlertDecisionInput = {
  currentRisk: RiskLevel;
  lastRisk: RiskLevel | null;
  lastAlertSentAt: Date | null;
};

export function shouldSendAlert({
  currentRisk,
  lastRisk,
  lastAlertSentAt,
}: AlertDecisionInput): boolean {
  const now = new Date();

  // Cooldown: 6 hours
  if (lastAlertSentAt) {
    const hoursSinceLast =
      (now.getTime() - lastAlertSentAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLast < 6) return false;
  }

  // First-ever alert
  if (!lastRisk) return true;

  // Escalation logic
  const order: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];

  return order.indexOf(currentRisk) > order.indexOf(lastRisk);
}
