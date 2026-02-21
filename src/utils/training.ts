import { EXERCISES } from '../data/exercises';

export interface TrainingHistory {
  exerciseId: string;
  weight: number;
  reps: number;
  targetReps: number;
  rpe: number;
  success: boolean;
}

export function calculateProgressiveOverload(history: TrainingHistory[]) {
  if (history.length === 0) return { weightChange: 0, repChange: 0 };

  const lastSet = history[history.length - 1];

  // If RPE was low and target reps met/exceeded
  if (lastSet.rpe < 8 && lastSet.reps >= lastSet.targetReps) {
    return { weightChange: 2.5, repChange: 0 };
  }

  // If target reps not met
  if (lastSet.reps < lastSet.targetReps) {
    return { weightChange: 0, repChange: 0, suggestion: 'Maintain weight, focus on form.' };
  }

  return { weightChange: 0, repChange: 1 };
}

export function suggestWarmupSets(targetWeight: number, isCompound: boolean) {
  if (!isCompound) return [];

  return [
    { weight: Math.round(targetWeight * 0.4 / 2.5) * 2.5, reps: 10 },
    { weight: Math.round(targetWeight * 0.6 / 2.5) * 2.5, reps: 5 },
    { weight: Math.round(targetWeight * 0.8 / 2.5) * 2.5, reps: 3 },
  ];
}

export function shouldSuggestDeload(recentSuccessRate: number, battery: number): boolean {
  if (battery < 20) return true;
  if (recentSuccessRate < 0.7) return true;
  return false;
}

export function getAlternatives(exerciseId: string) {
  const exercise = EXERCISES.find(e => e.id === exerciseId);
  return exercise ? exercise.alternatives : [];
}

export function autoAdjustNextSet(currentSet: TrainingHistory) {
  if (!currentSet.success) {
    return { weight: currentSet.weight * 0.9, targetReps: currentSet.targetReps };
  }
  if (currentSet.rpe >= 10) {
    return { weight: currentSet.weight, targetReps: currentSet.targetReps };
  }
  return null;
}
