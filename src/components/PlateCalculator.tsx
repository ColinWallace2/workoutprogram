import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PLATES = [45, 35, 25, 10, 5, 2.5];

export const PlateCalculator: React.FC = () => {
  const [targetWeight, setTargetWeight] = useState(135);
  const barWeight = 45;

  const calculatePlates = (weight: number) => {
    let remaining = (weight - barWeight) / 2;
    const result: number[] = [];

    if (remaining <= 0) return [];

    PLATES.forEach(plate => {
      while (remaining >= plate) {
        result.push(plate);
        remaining -= plate;
      }
    });

    return result;
  };

  const platesPerSide = calculatePlates(targetWeight);

  return (
    <div className="p-6 glass rounded-3xl space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Plate Calculator</h2>

      <div className="flex items-center gap-4">
        <input
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(Number(e.target.value))}
          className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-pastel-blue outline-none text-2xl font-bold"
        />
        <span className="text-gray-500 font-bold">LBS</span>
      </div>

      <div className="relative h-24 flex items-center justify-center">
        {/* The Bar */}
        <div className="absolute w-full h-4 bg-gray-300 rounded-full" />

        {/* Left Plates */}
        <div className="absolute left-1/4 flex flex-row-reverse items-center">
          {platesPerSide.map((p, i) => (
            <motion.div
              key={`l-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 bg-gray-600 rounded-sm border-r border-gray-400 mx-0.5"
              style={{ height: `${Math.max(40, p * 1.5)}px` }}
            />
          ))}
        </div>

        {/* Right Plates */}
        <div className="absolute right-1/4 flex items-center">
          {platesPerSide.map((p, i) => (
            <motion.div
              key={`r-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 bg-gray-600 rounded-sm border-l border-gray-400 mx-0.5"
              style={{ height: `${Math.max(40, p * 1.5)}px` }}
            />
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 font-medium">
        Per side: {platesPerSide.join(', ') || 'None'}
      </div>
    </div>
  );
};
