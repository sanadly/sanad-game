'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// Base evolution stages
const BASE_STAGES = {
  dorm: {
    name: 'Student Dorm',
    description: 'A small, messy room in Germany. Ramen and dreams.',
    bgColor: '#1a1a2e',
    borderColor: '#4a4a6a',
    items: [
      { id: 'desk', name: 'Messy Desk', icon: '🖥️', x: 20, y: 60 },
      { id: 'bed', name: 'Simple Bed', icon: '🛏️', x: 70, y: 70 },
      { id: 'ramen', name: 'Instant Ramen', icon: '🍜', x: 45, y: 45 },
    ],
  },
  apartment: {
    name: 'Modern Apartment',
    description: 'A clean, organized space. The Great Setup achieved.',
    bgColor: '#1e2a3a',
    borderColor: '#4a9eff',
    items: [
      { id: 'desk', name: 'Gaming Setup', icon: '💻', x: 15, y: 55 },
      { id: 'couch', name: 'Comfy Couch', icon: '🛋️', x: 60, y: 70 },
      { id: 'plant', name: 'Indoor Plant', icon: '🪴', x: 85, y: 40 },
      { id: 'coffee', name: 'Coffee Machine', icon: '☕', x: 40, y: 40 },
    ],
  },
  penthouse: {
    name: 'Luxury Villa',
    description: 'Peak sovereignty. A testament to your journey.',
    bgColor: '#2a1a2e',
    borderColor: '#FFD700',
    items: [
      { id: 'desk', name: 'Executive Desk', icon: '🖥️', x: 10, y: 50 },
      { id: 'lounge', name: 'Luxury Lounge', icon: '🛋️', x: 55, y: 65 },
      { id: 'art', name: 'Art Collection', icon: '🖼️', x: 80, y: 30 },
      { id: 'bar', name: 'Private Bar', icon: '🍷', x: 35, y: 35 },
      { id: 'window', name: 'City View', icon: '🌃', x: 50, y: 15 },
    ],
  },
};

// Pet component
const Pet = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="absolute text-xl"
        initial={{ x: -20, opacity: 0 }}
        animate={{ 
          x: [0, 60, 30, 80, 0],
          y: [0, -5, 0, -5, 0],
          opacity: 1
        }}
        transition={{ 
          x: { duration: 8, repeat: Infinity, ease: 'linear' },
          y: { duration: 0.5, repeat: Infinity }
        }}
        style={{ bottom: '75%', left: '10%' }}
      >
        🐕
      </motion.div>
    )}
  </AnimatePresence>
);

interface BaseDisplayProps {
  compact?: boolean;
}

export const BaseDisplay = ({ compact = false }: BaseDisplayProps) => {
  const { base } = useGameStore();
  
  const stage = BASE_STAGES[base.type as keyof typeof BASE_STAGES] || BASE_STAGES.dorm;
  const allItems = stage.items;
  const unlockedItems = base.items || [];
  
  if (compact) {
    return (
      <div 
        className="w-full h-16 rounded border-2 relative overflow-hidden"
        style={{ 
          backgroundColor: stage.bgColor,
          borderColor: stage.borderColor
        }}
      >
        {/* Simplified room view */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg">
          {allItems.slice(0, 4).map(item => (
            <span 
              key={item.id} 
              className={unlockedItems.includes(item.id) ? '' : 'opacity-30'}
            >
              {item.icon}
            </span>
          ))}
        </div>
        
        {/* Level indicator */}
        <div 
          className="absolute bottom-0 right-0 px-1.5 py-0.5 text-[8px] font-pixel"
          style={{ backgroundColor: stage.borderColor }}
        >
          LV.{base.level}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Room Container - Isometric-ish view */}
      <div 
        className="relative w-full h-48 rounded-lg border-2 overflow-hidden"
        style={{ 
          backgroundColor: stage.bgColor,
          borderColor: stage.borderColor,
          boxShadow: `inset 0 -20px 40px rgba(0,0,0,0.3), 0 0 20px ${stage.borderColor}40`
        }}
      >
        {/* Floor */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/4"
          style={{ 
            background: `linear-gradient(to top, ${stage.bgColor}, transparent)`,
            borderTop: `1px solid ${stage.borderColor}30`
          }}
        />
        
        {/* Items */}
        {allItems.map(item => {
          const isUnlocked = unlockedItems.includes(item.id);
          return (
            <motion.div
              key={item.id}
              className={`absolute text-2xl ${isUnlocked ? '' : 'opacity-20 grayscale'}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              whileHover={isUnlocked ? { scale: 1.2 } : {}}
              title={item.name}
            >
              {item.icon}
            </motion.div>
          );
        })}
        
        {/* Pet */}
        <Pet isVisible={base.hasPet} />
        
        {/* Window/Lighting effect */}
        <div 
          className="absolute top-2 right-2 w-16 h-12 rounded opacity-20"
          style={{ 
            background: `radial-gradient(ellipse at center, ${stage.borderColor}, transparent)`
          }}
        />
      </div>
      
      {/* Room Info */}
      <div className="mt-3 text-center">
        <h3 className="text-sm text-white font-pixel">{stage.name}</h3>
        <p className="text-[10px] text-gray-400 mt-1">{stage.description}</p>
        
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
          <span className="text-gray-500">
            Level {base.level}
          </span>
          <span className="text-gray-500">
            {unlockedItems.length}/{allItems.length} Items
          </span>
          {base.hasPet && (
            <span className="text-pixel-gold flex items-center gap-1">
              🐕 Pet Unlocked
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseDisplay;
