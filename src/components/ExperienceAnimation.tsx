import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  xp: number;
  isVisible: boolean;
}

export const ExperienceAnimation: React.FC<Props> = ({ xp, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1.2, y: -100 }}
          exit={{ opacity: 0, scale: 1.5, y: -150 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        >
          <div className="bg-pastel-purple text-white px-6 py-3 rounded-full font-black text-2xl shadow-2xl flex items-center gap-2">
            +{xp} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
