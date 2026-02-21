export interface DataPoint {
  x: number; // timestamp or day index
  y: number; // E1RM
}

export function calculateE1RM(weight: number, reps: number): number {
  if (reps === 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function calculateLinearRegression(data: DataPoint[]) {
  const n = data.length;
  if (n < 5) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (const p of data) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
  }

  const denominator = (n * sumX2 - sumX * sumX);
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export function projectValue(slope: number, intercept: number, futureX: number): number {
  return slope * futureX + intercept;
}
