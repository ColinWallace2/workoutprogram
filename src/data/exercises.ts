export interface Exercise {
  id: string;
  name: string;
  isCompound: boolean;
  category: 'Push' | 'Pull' | 'Legs' | 'Other';
  alternatives: string[];
}

export const EXERCISES: Exercise[] = [
  { id: 'bench_press', name: 'Bench Press', isCompound: true, category: 'Push', alternatives: ['dumbbell_press', 'chest_press'] },
  { id: 'squat', name: 'Squat', isCompound: true, category: 'Legs', alternatives: ['leg_press', 'hack_squat'] },
  { id: 'deadlift', name: 'Deadlift', isCompound: true, category: 'Pull', alternatives: ['romanian_deadlift', 'back_extension'] },
  { id: 'overhead_press', name: 'Overhead Press', isCompound: true, category: 'Push', alternatives: ['dumbbell_overhead_press', 'shoulder_press'] },
  { id: 'pull_up', name: 'Pull Up', isCompound: false, category: 'Pull', alternatives: ['lat_pulldown'] },
  { id: 'barbell_row', name: 'Barbell Row', isCompound: true, category: 'Pull', alternatives: ['seated_row'] },
  { id: 'leg_press', name: 'Leg Press', isCompound: true, category: 'Legs', alternatives: ['squat'] },
  { id: 'dip', name: 'Dip', isCompound: true, category: 'Push', alternatives: ['bench_press'] },
];
