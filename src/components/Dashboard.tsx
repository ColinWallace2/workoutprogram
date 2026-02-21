import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/client';
import { getRank } from '../utils/gamification';
import { motion } from 'framer-motion';
import { Trophy, Zap, Quote } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = useLiveQuery(() => db.userStats.get('current'));
  const quote = useLiveQuery(() => db.quotes.orderBy('lastShown').first());

  if (!stats) return <div className="p-8 text-center">Loading stats...</div>;

  const rankInfo = getRank(stats.currentXp);

  return (
    <div className="space-y-6 p-4">
      {/* Rank Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Current Rank</h2>
          <p className="text-4xl font-black text-gray-900">{rankInfo.name}</p>
          <div className="mt-2 w-48 h-3 bg-gray-300 rounded-full overflow-hidden border border-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rankInfo.progress * 100}%` }}
              className="h-full bg-pastel-blue"
            />
          </div>
        </div>
        <div className="bg-pastel-blue/20 p-4 rounded-2xl">
          <Trophy className="w-8 h-8 text-pastel-blue" />
        </div>
      </motion.div>

      {/* Body Battery Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Body Battery</h2>
          <p className="text-4xl font-black text-gray-900">{stats.battery}%</p>
        </div>
        <div className="bg-pastel-green/20 p-4 rounded-2xl">
          <Zap className="w-8 h-8 text-pastel-green" />
        </div>
      </motion.div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="neumorph rounded-3xl p-6 italic text-gray-800 relative"
      >
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-400 opacity-30" />
        <p className="text-lg font-medium relative z-10 leading-relaxed">"{quote?.text}"</p>
        <p className="text-sm mt-3 text-right not-italic font-bold text-gray-600">— {quote?.author}</p>
      </motion.div>
    </div>
  );
};
