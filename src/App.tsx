import { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { WorkoutLogger } from './components/WorkoutLogger';
import { PlateCalculator } from './components/PlateCalculator';
import { Analytics } from './components/Analytics';
import { BatteryVisual } from './components/BatteryVisual';
import { initDb } from './db/init';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/client';
import { motion } from 'framer-motion';

function App() {
  const stats = useLiveQuery(() => db.userStats.get('current'));

  useEffect(() => {
    initDb();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 max-w-md mx-auto">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">FITNESS PRO</h1>
        <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-400 border border-gray-100 shadow-sm">
          V1.0.0
        </div>
      </header>

      <main className="space-y-8">
        <Dashboard />

        <div className="px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 ml-2">Active Status</h2>
          <div className="glass rounded-3xl p-6">
            <BatteryVisual value={stats?.battery ?? 100} />
          </div>
        </div>

        <WorkoutLogger />

        <div className="px-4">
          <Analytics />
        </div>

        <div className="px-4 pb-8">
          <PlateCalculator />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass p-4 flex justify-around items-center rounded-t-3xl border-t border-white/40">
        <motion.div whileTap={{ scale: 0.9 }} className="text-pastel-blue font-bold">HOME</motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="text-gray-400 font-bold">HISTORY</motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="text-gray-400 font-bold">STATS</motion.div>
        <motion.div whileTap={{ scale: 0.9 }} className="text-gray-400 font-bold">SETTINGS</motion.div>
      </nav>
    </div>
  );
}

export default App;
