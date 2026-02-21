import { create } from 'zustand';

interface WorkoutSet {
  weight: number;
  reps: number;
  rpe: number;
  xp: number;
}

interface WorkoutState {
  isActive: boolean;
  currentSets: WorkoutSet[];
  lastXpGained: number;
  showXpAnimation: boolean;

  startWorkout: () => void;
  endWorkout: () => void;
  addSet: (set: WorkoutSet) => void;
  triggerXpAnimation: (xp: number) => void;
  hideXpAnimation: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  isActive: false,
  currentSets: [],
  lastXpGained: 0,
  showXpAnimation: false,

  startWorkout: () => set({ isActive: true, currentSets: [] }),
  endWorkout: () => set({ isActive: false }),
  addSet: (newSet) => set((state) => ({
    currentSets: [...state.currentSets, newSet]
  })),
  triggerXpAnimation: (xp) => set({
    lastXpGained: xp,
    showXpAnimation: true
  }),
  hideXpAnimation: () => set({ showXpAnimation: false }),
}));
