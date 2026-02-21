export const RANKS = [
  { name: 'Iron', threshold: 0 },
  { name: 'Bronze', threshold: 10000 },
  { name: 'Silver', threshold: 25000 },
  { name: 'Gold', threshold: 60000 },
  { name: 'Platinum', threshold: 150000 },
  { name: 'Diamond', threshold: 400000 },
  { name: 'Master', threshold: 1000000 },
  { name: 'Grandmaster', threshold: 2500000 },
];

export interface XPParams {
  weight: number;
  reps: number;
  rpe: number;
  streakMultiplier: number;
  batteryMultiplier: number;
  isPR: boolean;
}

export function calculateSetXP({
  weight,
  reps,
  rpe,
  streakMultiplier,
  batteryMultiplier,
  isPR,
}: XPParams): number {
  const baseXP = weight * reps * (rpe / 10);
  const prMultiplier = isPR ? 1.5 : 1.0;
  return Math.round(baseXP * streakMultiplier * batteryMultiplier * prMultiplier);
}

export function getRank(totalXP: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].threshold) {
      return {
        ...RANKS[i],
        nextThreshold: RANKS[i + 1]?.threshold ?? null,
        progress: RANKS[i + 1]
          ? (totalXP - RANKS[i].threshold) / (RANKS[i + 1].threshold - RANKS[i].threshold)
          : 1.0,
      };
    }
  }
  return { ...RANKS[0], nextThreshold: RANKS[1].threshold, progress: 0 };
}

export function calculateDecay(totalXP: number, daysInactive: number): number {
  if (daysInactive <= 7) return 0;
  const weeks = Math.floor(daysInactive / 7);
  return Math.round(totalXP * 0.05 * weeks);
}
