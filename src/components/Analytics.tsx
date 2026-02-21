import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/client';
import { calculateE1RM, calculateLinearRegression, projectValue } from '../utils/projections';
import { EXERCISES } from '../data/exercises';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Analytics: React.FC = () => {
  const workouts = useLiveQuery(() => db.workouts.orderBy('date').toArray());

  if (!workouts || workouts.length < 3) {
    return (
      <div className="p-8 glass rounded-3xl text-center text-gray-500 font-medium italic">
        Log at least 3 workouts to see performance projections.
      </div>
    );
  }

  // Process data for the chart
  const data = workouts.map((w, index) => {
    // Just using the first exercise's first set for simplicity in this visualization
    const set = w.exercises[0]?.sets[0];
    const e1rm = set ? calculateE1RM(set.weight, set.reps) : 0;
    return {
      day: index + 1,
      date: new Date(w.date).toLocaleDateString(),
      e1rm: Math.round(e1rm),
    };
  });

  const regressionData = data.map(d => ({ x: d.day, y: d.e1rm }));
  const regression = calculateLinearRegression(regressionData);

  let projection = null;
  if (regression) {
    projection = Math.round(projectValue(regression.slope, regression.intercept, data.length + 5));
  }

  // PPL Imbalance logic
  const total = workouts.length || 1;
  const categoryCounts = workouts.reduce((acc: any, w) => {
    const exId = w.exercises[0]?.exerciseId;
    const cat = exId ? (EXERCISES.find(e => e.id === exId)?.category || 'Other') : 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 glass rounded-3xl space-y-4">
      <h2 className="text-xl font-black text-gray-800 tracking-tight">Performance Trend</h2>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="day" hide />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="e1rm"
              stroke="#AEC6CF"
              strokeWidth={4}
              dot={{ r: 6, fill: '#AEC6CF', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {projection && (
        <div className="bg-pastel-blue/10 p-4 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">30-Day Projection</p>
            <p className="text-2xl font-black text-pastel-blue">{projection} LBS</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Trend</p>
            <p className="text-sm font-bold text-pastel-green">+{regression?.slope.toFixed(1)} / session</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-white/50 rounded-2xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Volume Distribution</p>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden">
          <div className="bg-pastel-blue h-full" style={{ width: `${(categoryCounts['Push'] || 0) / total * 100}%` }} />
          <div className="bg-pastel-pink h-full" style={{ width: `${(categoryCounts['Pull'] || 0) / total * 100}%` }} />
          <div className="bg-pastel-green h-full" style={{ width: `${(categoryCounts['Legs'] || 0) / total * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[8px] font-bold text-gray-400">
          <span>PUSH</span>
          <span>PULL</span>
          <span>LEGS</span>
        </div>
      </div>
    </div>
  );
};
