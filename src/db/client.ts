import Dexie, { type Table } from 'dexie';

export interface Workout {
  id?: number;
  date: Date;
  exercises: {
    exerciseId: string;
    sets: {
      weight: number;
      reps: number;
      rpe: number;
      xp: number;
    }[];
  }[];
  totalXp: number;
  notes?: string;
}

export interface UserStats {
  id: string; // 'current'
  rank: string;
  currentXp: number;
  streak: number;
  lastWorkout: Date | null;
  battery: number;
}

export interface BatteryLog {
  id?: number;
  date: Date;
  value: number;
}

export interface Quote {
  id?: number;
  text: string;
  author: string;
  lastShown: Date | null;
}

export class AppDatabase extends Dexie {
  workouts!: Table<Workout>;
  userStats!: Table<UserStats>;
  batteryLogs!: Table<BatteryLog>;
  quotes!: Table<Quote>;

  constructor() {
    super('FitnessAppDB');
    this.version(1).stores({
      workouts: '++id, date, totalXp',
      userStats: 'id',
      batteryLogs: '++id, date',
      quotes: '++id, lastShown',
    });
  }
}

export const db = new AppDatabase();
