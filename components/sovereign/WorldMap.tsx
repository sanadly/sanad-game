'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { CATEGORY_CONFIG, TaskCategory } from '@/types/tasks';
import TaskImporter from './TaskImporter';

export const WorldMap = () => {
  const { tasks, toggleTask } = useGameStore();

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { completed: 0, total: 0, tasks: [] };
    }
    acc[task.category].total++;
    acc[task.category].tasks.push(task);
    if (task.isCompleted) acc[task.category].completed++;
    return acc;
  }, {} as Record<TaskCategory, { completed: number; total: number; tasks: typeof tasks }>);

  // Active Quest (First incomplete task)
  const activeTask = tasks.find(t => !t.isCompleted);
  
  // Stats
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="relative w-full h-full bg-[#1a1a2e] overflow-hidden flex flex-col font-pixel">
      {/* Header / Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
        <div>
          <h2 className="text-[10px] text-[#d4b483] tracking-widest uppercase font-bold">The Sovereign&apos;s Realm</h2>
          <p className="text-[8px] text-gray-400">Territory Control</p>
        </div>
        <TaskImporter />
      </div>

      {/* Main Grid Map Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        
        {/* Active Quest Banner (Hero Section) */}
        {activeTask && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-[#d4b483]/30 bg-gradient-to-r from-[#d4b483]/10 to-transparent p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-4xl">⚔️</span>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#d4b483] text-[9px] uppercase tracking-wider font-bold">Current Focus</span>
                <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-500"></span>
              </div>
              <h3 className="text-sm text-white font-bold mb-2">{activeTask.title}</h3>
              
              <div className="flex items-center gap-3 text-[9px] text-gray-400">
                 <span className="flex items-center gap-1">
                   {CATEGORY_CONFIG[activeTask.category].icon} {CATEGORY_CONFIG[activeTask.category].label}
                 </span>
                 {activeTask.duration && <span>⏱️ {activeTask.duration}m</span>}
              </div>
            
              {/* Progress Bar for Active Task (Fake visual progress or timer could go here) */}
              <div className="mt-3 h-1.5 bg-black/40 rounded-full overflow-hidden w-full max-w-[200px]">
                <motion.div 
                  className="h-full bg-[#d4b483]"
                  initial={{ width: "0%" }}
                  animate={{ width: "20%" }} 
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Territory Grid (Categories) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const stats = tasksByCategory[cat] || { completed: 0, total: 0, tasks: [] };
            const isActive = stats.total > 0;
            
            if (!isActive) return null;

            return (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.02 }}
                className="bg-[#23233b] border border-white/5 rounded-lg p-3 relative group"
                style={{ borderLeft: `3px solid ${config.color}` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{stats.completed}/{stats.total}</span>
                </div>
                <div className="text-[10px] font-bold text-gray-200 mb-1">{config.label}</div>
                
                {/* Visual Building Blocks */}
                <div className="flex flex-wrap gap-0.5 mt-2">
                  {stats.tasks.map((t, idx) => (
                    <div 
                      key={t.id}
                      className={`w-1.5 h-1.5 rounded-[1px] ${t.isCompleted ? 'opacity-30' : 'opacity-100'}`}
                      style={{ backgroundColor: config.color }}
                      title={t.title}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Task List (The "Log") */}
        <div className="space-y-2">
           <h4 className="text-[9px] text-gray-500 uppercase tracking-wider mb-2">Quest Log</h4>
           {tasks.map((task) => {
             const config = CATEGORY_CONFIG[task.category];
             return (
               <motion.div
                 key={task.id}
                 layout
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 onClick={() => toggleTask(task.id)}
                 className={`
                   group flex items-center gap-3 p-2 rounded border border-white/5 
                   hover:bg-white/5 cursor-pointer transition-colors
                   ${task.isCompleted ? 'opacity-50 grayscale-[0.5]' : ''}
                 `}
               >
                 <div 
                   className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                     ${task.isCompleted ? 'bg-white/10 border-transparent' : 'border-gray-600 group-hover:border-gray-400'}
                   `}
                 >
                   {task.isCompleted && <span className="text-[8px] text-white">✓</span>}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <div className={`text-[11px] truncate ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                     {task.title}
                   </div>
                 </div>

                 <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: config.color }} 
                    title={config.label}
                 />
               </motion.div>
             );
           })}
        </div>
      </div>
      
      {/* Footer Stats */}
      <div className="bg-[#11111f] border-t border-white/10 p-3 pt-2">
        <div className="flex items-end justify-between text-[9px] text-gray-400 mb-1">
          <span>Daily Completion</span>
          <span className="text-white font-mono">{progressPercent}%</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#d4b483]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
