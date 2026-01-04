'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface AvatarDisplayProps {
  showDetails?: boolean;
}

// Level thresholds for avatar evolution
const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 7500, 10000];

// Calculate level from total stat points
const calculateLevel = (stats: { capital: number; sovereignty: number; intellect: number; aesthetics: number; kindred: number; vitality: number }): number => {
  const total = stats.capital / 100 + stats.sovereignty + stats.intellect + stats.aesthetics + stats.kindred + stats.vitality;
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (total >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 10);
};

// Appearance based on level
const getAppearance = (level: number, surgeryComplete: boolean) => {
  const base = {
    bodyColor: level <= 3 ? '#64748b' : level <= 6 ? '#4a9eff' : '#FFD700',
    clothesStyle: level <= 3 ? 'casual' : level <= 6 ? 'business' : 'elite',
    hasCloak: level >= 5,
    hasAura: level >= 8 || surgeryComplete,
    auraColor: surgeryComplete ? '#FFD700' : '#a855f7',
  };
  return base;
};

export const AvatarDisplay = ({ showDetails = true }: AvatarDisplayProps) => {
  const { avatar, stats } = useGameStore();
  
  const level = calculateLevel({
    capital: stats.capital,
    sovereignty: stats.sovereignty,
    intellect: stats.intellect,
    aesthetics: stats.aesthetics ?? 50,
    kindred: stats.kindred ?? 30,
    vitality: stats.vitality ?? 70,
  });
  
  const appearance = getAppearance(level, avatar.appearance.surgeryComplete ?? false);

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Container */}
      <div className="relative">
        {/* Aura effect */}
        {appearance.hasAura && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: appearance.auraColor }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Character sprite area */}
        <div 
          className="relative w-20 h-28 rounded-lg overflow-hidden border-2"
          style={{ 
            borderColor: appearance.bodyColor,
            background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1e)'
          }}
        >
          {/* Simple pixel avatar representation */}
          <div className="absolute inset-0 flex flex-col items-center pt-2">
            {/* Head */}
            <motion.div 
              className="w-8 h-8 rounded-full relative"
              style={{ 
                backgroundColor: '#f4d03f',
                boxShadow: avatar.appearance.surgeryComplete ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
              }}
              animate={avatar.appearance.surgeryComplete ? { 
                boxShadow: ['0 0 10px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.6)', '0 0 10px rgba(255,215,0,0.3)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Eyes */}
              <div className="absolute top-3 left-1.5 w-1.5 h-1.5 bg-gray-800 rounded-full" />
              <div className="absolute top-3 right-1.5 w-1.5 h-1.5 bg-gray-800 rounded-full" />
              {/* Mouth */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-gray-800 rounded" />
            </motion.div>
            
            {/* Body */}
            <div 
              className="w-10 h-10 mt-1 rounded-t-lg relative"
              style={{ backgroundColor: appearance.bodyColor }}
            >
              {/* Clothes detail */}
              {appearance.clothesStyle === 'business' && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-800" />
              )}
              {appearance.clothesStyle === 'elite' && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-pixel-gold" />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-pixel-gold rounded-full text-[6px] flex items-center justify-center">⭐</div>
                </>
              )}
            </div>
            
            {/* Cloak */}
            {appearance.hasCloak && (
              <motion.div 
                className="absolute bottom-0 left-1 right-1 h-8 rounded-b-lg opacity-60"
                style={{ backgroundColor: '#4a0080' }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </div>
        </div>
        
        {/* Level badge */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-pixel"
          style={{ 
            backgroundColor: appearance.bodyColor,
            color: level >= 7 ? '#000' : '#fff'
          }}
        >
          LV.{level}
        </div>
      </div>
      
      {/* Details */}
      {showDetails && (
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            {appearance.clothesStyle === 'casual' && 'Aspiring Architect'}
            {appearance.clothesStyle === 'business' && 'Rising Sovereign'}
            {appearance.clothesStyle === 'elite' && 'Grand Architect'}
          </div>
          {avatar.appearance.surgeryComplete && (
            <div className="text-[10px] text-pixel-gold mt-1 flex items-center justify-center gap-1">
              <span>✨</span>
              <span>Divine Glow Active</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;
