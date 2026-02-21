export interface BatteryParams {
  previousBattery: number;
  streak: number;
  sleepScore?: number;
  setsCompleted: { rpe: number }[];
}

export function calculateBatteryChange({
  previousBattery,
  streak,
  sleepScore = 80,
  setsCompleted,
}: BatteryParams) {
  // Recovery calculations
  const baseRecovery = 20;
  const streakBonus = Math.min(10, streak * 2);
  const sleepImpact = (sleepScore - 80) * 0.5;
  const totalRecovery = baseRecovery + streakBonus + sleepImpact;

  // Fatigue calculations
  const fatigue = setsCompleted.reduce((acc, set) => acc + (set.rpe / 10), 0) * 2; // Scaled to 2% per max RPE set

  const newBattery = Math.max(0, Math.min(100, previousBattery + totalRecovery - fatigue));

  return {
    newValue: Math.round(newBattery),
    recovery: Math.round(totalRecovery),
    fatigue: Math.round(fatigue),
  };
}

export function getBatteryXPMultiplier(battery: number): number {
  if (battery > 80) return 1.2;
  if (battery > 50) return 1.0;
  if (battery > 20) return 0.8;
  return 0.5;
}
