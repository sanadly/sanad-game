'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { STAT_CONFIGS, StatType } from '@/types/game';

// Stat max values for percentage calculation
const STAT_MAX: Record<string, number> = {
  capital: 10000,
  sovereignty: 100,
  aesthetics: 100,
  intellect: 100,
  kindred: 100,
  vitality: 100,
};

// Stat labels and icons
const STAT_LABELS: Record<string, { label: string; icon: string }> = {
  capital: { label: 'CAPITAL', icon: '🪙' },
  sovereignty: { label: 'SOVEREIGNTY', icon: '🦅' },
  aesthetics: { label: 'AESTHETICS', icon: '✨' },
  intellect: { label: 'INTELLECT', icon: '📜' },
  kindred: { label: 'KINDRED', icon: '❤️' },
  vitality: { label: 'VITALITY', icon: '💧' },
};

interface EssenceTubeProps {
  statKey: string;
  value: number;
  milestone?: number;
  onSetMilestone: (value: number) => void;
}

const EssenceTube = ({ statKey, value, milestone, onSetMilestone }: EssenceTubeProps) => {
  const config = STAT_CONFIGS[statKey.toUpperCase() as StatType];
  const meta = STAT_LABELS[statKey];
  const max = STAT_MAX[statKey];
  const heightPercent = Math.min((value / max) * 100, 100);
  const milestonePercent = milestone ? Math.min((milestone / max) * 100, 100) : null;
  
  const [isDragging, setIsDragging] = useState(false);
  const tubeRef = useRef<HTMLDivElement>(null);

  // Handle milestone drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!tubeRef.current) return;
      const rect = tubeRef.current.getBoundingClientRect();
      const y = moveEvent.clientY - rect.top;
      const percentage = 100 - (y / rect.height) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      const newValue = Math.round((clampedPercentage / 100) * max);
      onSetMilestone(newValue);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Determine if we hit the milestone
  const milestoneReached = milestone && value >= milestone;
  
  // Animation type specific styles
  const getAnimationStyles = () => {
    switch (config.animationType) {
      case 'liquid':
        return 'animate-[sloshing_3s_ease-in-out_infinite]';
      case 'coins':
        return milestoneReached ? 'animate-[sparkle_1s_ease-in-out_infinite]' : '';
      case 'hearts':
        return 'animate-[pulse_2s_ease-in-out_infinite]';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 w-full group">
      {/* Label */}
      <div className="text-[8px] text-gray-400 mb-1 font-pixel uppercase tracking-widest flex items-center gap-1">
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
      </div>
      
      {/* Tube Container - glass with wooden frame */}
      <div 
        ref={tubeRef}
        className="relative w-10 h-28 cursor-pointer"
        onDoubleClick={(e) => {
          if (!tubeRef.current) return;
          const rect = tubeRef.current.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const percentage = 100 - (y / rect.height) * 100;
          const newValue = Math.round((percentage / 100) * max);
          onSetMilestone(newValue);
        }}
      >
        {/* Wooden Frame */}
        <div className="absolute inset-0 border-4 rounded-lg z-30 pointer-events-none"
          style={{
            borderColor: '#8B4513',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
            background: 'linear-gradient(90deg, #5D3A1A 0%, #8B4513 50%, #5D3A1A 100%)',
          }}
        />
        
        {/* Glass Interior */}
        <div className="absolute inset-1 bg-gray-900/90 rounded overflow-hidden z-10">
          {/* Glass reflection */}
          <div className="absolute top-0 right-0 w-1/4 h-full bg-white/10 z-20 pointer-events-none" />
          
          {/* Liquid/Fill */}
          <motion.div
            className={`absolute bottom-0 left-0 w-full z-10 ${getAnimationStyles()}`}
            initial={{ height: 0 }}
            animate={{ height: `${heightPercent}%` }}
            transition={{ type: 'spring', bounce: 0.3, duration: 1.2 }}
            style={{ 
              background: `linear-gradient(to top, ${config.primaryColor}, ${config.secondaryColor})`,
              boxShadow: milestoneReached ? `0 0 20px ${config.glowColor}` : 'none',
            }}
          >
            {/* Fill item icons (floating inside) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-[10px] opacity-60"
                  initial={{ y: 0, x: `${20 + i * 30}%` }}
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 2 + i * 0.5, 
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  style={{ bottom: `${20 + i * 25}%` }}
                >
                  {config.fillIcon}
                </motion.span>
              ))}
            </div>
            
            {/* Surface shine */}
            <div className="absolute top-0 w-full h-1 bg-white/30" />
          </motion.div>
          
          {/* Measurement lines */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between py-1 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-gray-500/30 w-2 ml-auto" />
            ))}
          </div>
        </div>
        
        {/* Golden Arrow Milestone Marker */}
        {milestonePercent !== null && (
          <motion.div
            className={`absolute -right-4 z-40 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{ bottom: `${milestonePercent}%`, transform: 'translateY(50%)' }}
            onMouseDown={handleMouseDown}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="w-4 h-4 flex items-center justify-center"
              style={{
                filter: milestoneReached ? 'drop-shadow(0 0 4px gold)' : 'none'
              }}
            >
              <span className="text-lg">🏹</span>
            </div>
          </motion.div>
        )}
        
        {/* Add milestone hint on hover */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity z-30">
          {!milestone && (
            <span className="text-[8px] text-gray-400 whitespace-nowrap">
              Double-click to set goal
            </span>
          )}
        </div>
      </div>
      
      {/* Value display */}
      <div className="mt-1 font-pixel text-[10px] text-white text-shadow-pixel">
        {statKey === 'capital' ? `€${value.toLocaleString()}` : value}
      </div>
      
      {/* Milestone indicator */}
      {milestone && (
        <div className={`text-[8px] font-pixel ${milestoneReached ? 'text-pixel-gold' : 'text-gray-500'}`}>
          → {statKey === 'capital' ? `€${milestone.toLocaleString()}` : milestone}
        </div>
      )}
    </div>
  );
};

export const VitalsPane = () => {
  const { 
    capital, sovereignty, aesthetics, intellect, kindred, vitality,
    milestones, setMilestone, freedomDate 
  } = useGameStore();

  const stats = [
    { key: 'capital', value: capital },
    { key: 'sovereignty', value: sovereignty },
    { key: 'aesthetics', value: aesthetics },
    { key: 'intellect', value: intellect },
    { key: 'kindred', value: kindred },
    { key: 'vitality', value: vitality },
  ];

  const daysUntilFreedom = Math.ceil((freedomDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="h-full bg-pixel-dark border-r-4 border-gray-800 p-3 flex flex-col items-center overflow-y-auto noscroll">
      <h2 className="text-[10px] text-pixel-gold mb-4 font-pixel border-b-2 border-pixel-gold pb-2 w-full text-center uppercase tracking-wider">
        Essence Tubes
      </h2>
      
      {/* Stat Tubes Grid - 2 columns for compactness */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {stats.map((stat) => (
          <EssenceTube
            key={stat.key}
            statKey={stat.key}
            value={stat.value}
            milestone={milestones[stat.key as keyof typeof milestones]}
            onSetMilestone={(value) => setMilestone(stat.key as any, value)}
          />
        ))}
      </div>

      {/* Freedom Countdown */}
      <div className="mt-auto w-full bg-gray-900 border-2 border-gray-700 p-2 rounded text-center">
        <div className="text-[8px] text-gray-400 mb-1 uppercase tracking-wider">Freedom Countdown</div>
        <div className="font-pixel text-sm text-red-400 animate-pulse">
          {daysUntilFreedom} DAYS
        </div>
        <div className="text-[8px] text-gray-500 mt-1">
          {freedomDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
