import React, { useState } from 'react';
import { db } from '../db/client';
import { calculateSetXP } from '../utils/gamification';
import { autoAdjustNextSet } from '../utils/training';
import { EXERCISES } from '../data/exercises';
import { calculateBatteryChange, getBatteryXPMultiplier } from '../utils/battery';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Square } from 'lucide-react';
import { ExperienceAnimation } from './ExperienceAnimation';
import { useWorkoutStore } from '../hooks/useWorkoutStore';

export const WorkoutLogger: React.FC = () => {
  const {
    isActive,
    currentSets,
    startWorkout,
    endWorkout,
    addSet,
    lastXpGained,
    showXpAnimation,
    triggerXpAnimation,
    hideXpAnimation
  } = useWorkoutStore();

  const [currentExercise, setCurrentExercise] = useState(EXERCISES[0]);
  const [weight, setWeight] = useState(135);
  const [reps, setReps] = useState(10);
  const [targetReps, setTargetReps] = useState(10);
  const [rpe, setRpe] = useState(8);

  const handleLogSet = async () => {
    const stats = await db.userStats.get('current');
    const batteryMultiplier = stats ? getBatteryXPMultiplier(stats.battery) : 1.0;
    const streakMultiplier = stats ? 1 + (Math.min(stats.streak, 10) * 0.02) : 1.0;

    const xp = calculateSetXP({
      weight,
      reps,
      rpe,
      streakMultiplier,
      batteryMultiplier,
      isPR: false,
    });

    const newSet = { weight, reps, rpe, xp };
    addSet(newSet);
    triggerXpAnimation(xp);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]); // Short double pulse for set log
    }

    setTimeout(() => hideXpAnimation(), 2000);

    // Auto-adjust logic
    const adjustment = autoAdjustNextSet({
      exerciseId: currentExercise.id,
      weight,
      reps,
      targetReps,
      rpe,
      success: rpe < 10,
    });

    if (adjustment) {
      setWeight(adjustment.weight);
      setTargetReps(adjustment.targetReps);
    }
  };

  const handleFinishWorkout = async () => {
    const totalXp = currentSets.reduce((acc, s) => acc + s.xp, 0);
    await db.workouts.add({
      date: new Date(),
      exercises: [{ exerciseId: currentExercise.id, sets: currentSets }],
      totalXp,
    });

    const stats = await db.userStats.get('current');
    if (stats) {
      // Calculate new battery
      const batteryUpdate = calculateBatteryChange({
        previousBattery: stats.battery,
        streak: stats.streak,
        setsCompleted: currentSets
      });

      await db.userStats.update('current', {
        currentXp: stats.currentXp + totalXp,
        lastWorkout: new Date(),
        streak: stats.streak + 1,
        battery: batteryUpdate.newValue
      });

      // Log battery change
      await db.batteryLogs.add({
        date: new Date(),
        value: batteryUpdate.newValue
      });

      // Celebration haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }

    endWorkout();
  };

  return (
    <div className="p-4">
      <ExperienceAnimation xp={lastXpGained} isVisible={showXpAnimation} />
      {!isActive ? (
        <button
          onClick={startWorkout}
          className="w-full py-4 bg-pastel-blue text-white rounded-3xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <Play fill="white" /> Start Workout
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <select
              value={currentExercise.id}
              onChange={(e) => {
                const ex = EXERCISES.find(ex => ex.id === e.target.value);
                if (ex) setCurrentExercise(ex);
              }}
              className="text-xl font-bold text-gray-800 bg-transparent outline-none appearance-none"
            >
              {EXERCISES.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <button
              onClick={handleFinishWorkout}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-semibold flex items-center gap-1"
            >
              <Square size={16} fill="currentColor" /> End
            </button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {currentSets.map((set, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-3 rounded-2xl flex justify-between items-center"
                >
                  <span className="font-medium">Set {i + 1}</span>
                  <span className="text-gray-600">{set.weight}lbs × {set.reps} (RPE {set.rpe})</span>
                  <span className="text-pastel-green font-bold">+{set.xp} XP</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="glass rounded-3xl p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center flex flex-col items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Weight</label>
                <div className="flex items-center">
                  <button onClick={() => setWeight(w => Math.max(0, w - 2.5))} className="text-gray-300 px-1 font-bold">-</button>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-12 text-center text-xl font-bold bg-transparent outline-none"
                  />
                  <button onClick={() => setWeight(w => w + 2.5)} className="text-gray-300 px-1 font-bold">+</button>
                </div>
              </div>
              <div className="text-center flex flex-col items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Reps</label>
                <div className="flex items-center">
                  <button onClick={() => setReps(r => Math.max(0, r - 1))} className="text-gray-300 px-1 font-bold">-</button>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-12 text-center text-xl font-bold bg-transparent outline-none"
                  />
                  <button onClick={() => setReps(r => r + 1)} className="text-gray-300 px-1 font-bold">+</button>
                </div>
              </div>
              <div className="text-center flex flex-col items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase">RPE</label>
                <div className="flex items-center">
                  <button onClick={() => setRpe(r => Math.max(0, r - 0.5))} className="text-gray-300 px-1 font-bold">-</button>
                  <input
                    type="number"
                    value={rpe}
                    onChange={(e) => setRpe(Number(e.target.value))}
                    className="w-10 text-center text-xl font-bold bg-transparent outline-none"
                  />
                  <button onClick={() => setRpe(r => Math.min(10, r + 0.5))} className="text-gray-300 px-1 font-bold">+</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleLogSet}
                className="col-span-1 py-4 bg-pastel-green text-white rounded-2xl font-bold shadow-sm flex flex-col items-center justify-center"
              >
                <Check size={20} />
                <span className="text-[10px]">LOG</span>
              </button>
              <button className="py-4 glass rounded-2xl font-bold text-gray-500 text-xs">ALT</button>
              <button className="py-4 glass rounded-2xl font-bold text-gray-500 text-xs">REST</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
