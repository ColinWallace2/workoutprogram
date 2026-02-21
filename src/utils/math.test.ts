import { describe, it, expect } from 'vitest';
import { calculateSetXP, getRank } from './gamification';
import { calculateBatteryChange } from './battery';
import { calculateE1RM } from './projections';

describe('Gamification Engine', () => {
  it('should calculate XP correctly', () => {
    const xp = calculateSetXP({
      weight: 100,
      reps: 10,
      rpe: 8,
      streakMultiplier: 1.1,
      batteryMultiplier: 1.0,
      isPR: false
    });
    // 100 * 10 * 0.8 * 1.1 * 1.0 = 880
    expect(xp).toBe(880);
  });

  it('should apply PR bonus', () => {
    const xp = calculateSetXP({
      weight: 100,
      reps: 10,
      rpe: 8,
      streakMultiplier: 1.1,
      batteryMultiplier: 1.0,
      isPR: true
    });
    // 880 * 1.5 = 1320
    expect(xp).toBe(1320);
  });

  it('should determine rank correctly', () => {
    const iron = getRank(500);
    expect(iron.name).toBe('Iron');

    const bronze = getRank(15000);
    expect(bronze.name).toBe('Bronze');
  });
});

describe('Battery Engine', () => {
  it('should calculate battery recovery and fatigue', () => {
    const result = calculateBatteryChange({
      previousBattery: 50,
      streak: 5,
      setsCompleted: [{ rpe: 10 }, { rpe: 10 }]
    });

    // Recovery: 20 (base) + 10 (streak bonus) = 30
    // Fatigue: (1 + 1) * 2 = 4
    // 50 + 30 - 4 = 76
    expect(result.newValue).toBe(76);
  });
});

describe('Projection Engine', () => {
  it('should calculate E1RM correctly', () => {
    const e1rm = calculateE1RM(100, 10);
    // 100 * (1 + 10/30) = 133.33
    expect(e1rm).toBeCloseTo(133.33, 2);
  });
});
