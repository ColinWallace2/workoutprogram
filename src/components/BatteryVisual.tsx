import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  value: number; // 0-100
}

export const BatteryVisual: React.FC<Props> = ({ value }) => {
  const getColor = (v: number) => {
    if (v > 70) return '#77DD77'; // pastel green
    if (v > 30) return '#AEC6CF'; // pastel blue
    return '#FFB7CE'; // pastel pink
  };

  return (
    <div className="relative w-full h-48 flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-40 border-4 border-gray-200 rounded-2xl overflow-hidden p-1">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${value}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="absolute bottom-1 left-1 right-1 rounded-xl"
          style={{ backgroundColor: getColor(value) }}
        >
          {/* Wave effect overlay */}
          <motion.div
            animate={{
              x: [-20, 0],
              y: [0, 2, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
            className="absolute -top-4 left-0 w-[200%] h-8 bg-white/20 blur-sm"
          />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-gray-700 mix-blend-overlay">
          {value}%
        </div>
      </div>
      <div className="w-8 h-3 bg-gray-200 rounded-t-lg -mt-4 z-0" />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Energy Level</span>
    </div>
  );
};
