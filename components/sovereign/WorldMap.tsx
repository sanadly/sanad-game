'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { CATEGORY_CONFIG, TaskCategory } from '@/types/tasks';
import { Task } from '@/types/tasks';
import TaskImporter from './TaskImporter';

// --- Types ---
interface GridPoint {
  x: number;
  y: number;
}

// --- Helper Functions ---
// Deterministic placement generator
const generateGridPosition = (id: string, index: number, category: TaskCategory): GridPoint => {
  // Simple hashing to place similar categories near each other, but dispersed
  // Map size: 10x10
  const width = 10;
  const height = 10;
  
  // Quadrants
  // Work: Top Left
  // Study: Top Right
  // Health: Bottom Left
  // Personal/Other: Bottom Right
  
  let baseX = 0;
  let baseY = 0;
  
  switch(category) {
    case 'work': baseX = 1; baseY = 1; break;
    case 'study': baseX = 6; baseY = 1; break;
    case 'health': baseX = 1; baseY = 6; break;
    case 'personal': 
    case 'admin':
    default: baseX = 6; baseY = 6; break;
  }
  
  // Add some pseudo-random jitter based on ID
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const offsetX = (hash % 4); 
  const offsetY = (index % 4);
  
  return {
    x: Math.min(Math.max(baseX + offsetX, 0), width - 1),
    y: Math.min(Math.max(baseY + offsetY, 0), height - 1)
  };
};

// --- Sub-Components ---

const MapNode = ({ 
  task, 
  onClick, 
  isSelected 
}: { 
  task: Task; 
  onClick: (task: Task) => void;
  isSelected: boolean;
}) => {
  const config = CATEGORY_CONFIG[task.category];
  const isCompleted = task.isCompleted;

  // Visual variants based on completion
  const nodeVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.2, zIndex: 10 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.button
      onClick={() => onClick(task)}
      variants={nodeVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      className={`
        relative flex flex-col items-center justify-center p-1
        transition-all duration-300
        ${isSelected ? 'z-20' : 'z-0'}
      `}
    >
      {/* Structure Asset */}
      <div 
        className={`
          w-10 h-10 md:w-12 md:h-12 
          flex items-center justify-center 
          border-2 shadow-lg
          transition-colors duration-500
          ${isCompleted 
            ? 'bg-gray-800 border-gray-600 grayscale opacity-60' 
            : `bg-gray-900 ${isSelected ? 'border-white animate-pulse' : 'border-gray-500'}`
          }
          rounded-sm
        `}
        style={{ 
          borderColor: isCompleted ? undefined : config.color,
          boxShadow: isSelected ? `0 0 15px ${config.color}` : 'none'
        }}
      >
        <span className="text-xl md:text-2xl filter drop-shadow-md">
          {config.icon}
        </span>
        
        {/* Status Indicator Dot */}
        {isCompleted && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-black" />
        )}
      </div>

      {/* Label (Only visible on hover or selected) */}
      <AnimatePresence>
        {(isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`
              absolute -bottom-8 left-1/2 -translate-x-1/2 
              whitespace-nowrap px-2 py-1 
              bg-black/90 border border-white/20 
              text-[10px] text-white rounded z-30
              pointer-events-none
            `}
          >
            {task.title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const MapGridBackground = () => (
  <div 
    className="absolute inset-0 pointer-events-none opacity-20"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px'
    }}
  />
);

export const WorldMap = () => {
  const { tasks, toggleTask } = useGameStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Stats for the header
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const dominance = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Memoize positions so they don't jump around on re-renders unless tasks change
  // In a real app, storing position in the task object is better.
  const taskPositions = React.useMemo(() => {
    return tasks.map((task, idx) => ({
      task,
      pos: generateGridPosition(task.id, idx, task.category)
    }));
  }, [tasks]);

  return (
    <div className="relative w-full h-full bg-[#11111f] overflow-hidden flex flex-col font-pixel select-none">
      
      {/* --- HUD Header --- */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between p-4 pointer-events-none">
        
        {/* Title Block */}
        <div className="bg-black/80 border border-white/10 p-2 rounded backdrop-blur-sm pointer-events-auto">
          <h2 className="text-xs text-[#d4b483] uppercase tracking-widest font-bold mb-1">
            Realm Overview
          </h2>
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span>Dominance: <span className="text-white">{dominance}%</span></span>
            <span>Structures: <span className="text-white">{totalTasks}</span></span>
          </div>
        </div>

        {/* Tools */}
        <div className="pointer-events-auto">
          <TaskImporter />
        </div>
      </div>

      {/* --- Main Viewport (The World) --- */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-radial-gradient">
        <MapGridBackground />
        
        {/* The Grid Container */}
        {/* We use a fixed aspect ratio grid for the 'world' feeling */}
        <div 
          className="relative grid grid-cols-10 grid-rows-10 gap-2 p-10 transform scale-75 md:scale-100 transition-transform duration-500 ease-out"
          style={{ width: '800px', height: '800px' }}
        >
          {/* Render Empty Slots for grid visual structure (Optional, visual only) */}
          {Array.from({ length: 100 }).map((_, i) => (
             <div key={`grid-${i}`} className="border border-white/5 rounded-sm" />
          ))}

          {/* Render Task Nodes */}
          {taskPositions.map(({ task, pos }) => (
            <div 
              key={task.id}
              className="absolute flex items-center justify-center w-16 h-16 transition-all duration-500"
              style={{
                // Calculate position based on grid coordinates (0-9)
                left: `${(pos.x / 10) * 100}%`,
                top: `${(pos.y / 10) * 100}%`,
              }}
            >
              <MapNode 
                task={task} 
                onClick={setSelectedTask}
                isSelected={selectedTask?.id === task.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Context Panel (Slide up/over when task selected) --- */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#0f0f1e] border-t-2 border-[#d4b483] z-40 p-4 shadow-pixel-up"
          >
            <div className="flex justify-between items-start h-full">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{CATEGORY_CONFIG[selectedTask.category].icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{selectedTask.title}</h3>
                    <span className="text-[10px] text-[#d4b483] uppercase">{CATEGORY_CONFIG[selectedTask.category].label} Sector</span>
                  </div>
                </div>
                
                <p className="text-[10px] text-gray-400 mb-4 line-clamp-2">
                  {selectedTask.notes || "No additional intelligence data available for this structure."}
                </p>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                        toggleTask(selectedTask.id);
                        setSelectedTask(null);
                    }}
                    className={`
                      px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded
                      transition-colors
                      ${selectedTask.isCompleted 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50' 
                        : 'bg-pixel-accent/20 text-pixel-accent hover:bg-pixel-accent/40 border border-pixel-accent/50'}
                    `}
                  >
                    {selectedTask.isCompleted ? 'Revive Protocol' : 'Complete Protocol'}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-white p-2"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
