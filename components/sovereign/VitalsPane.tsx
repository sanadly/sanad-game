'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const StatTube = ({ label, value, color, max = 100 }: { label: string; value: number; color: string; max?: number }) => {
  const heightPercent = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col items-center mb-6 w-full">
      <div className="text-[10px] text-gray-400 mb-1 font-pixel uppercase tracking-widest">{label}</div>
      <div className="relative w-12 h-32 bg-gray-900 border-2 border-gray-600 rounded-lg overflow-hidden shadow-inner">
        {/* Glass reflection */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 z-20 pointer-events-none" />
        
        {/* Liquid */}
        <motion.div
          className="absolute bottom-0 left-0 w-full z-10"
          initial={{ height: 0 }}
          animate={{ height: `${heightPercent}%` }}
          transition={{ type: 'spring', bounce: 0.2, duration: 1.5 }}
          style={{ backgroundColor: color }}
        >
          {/* Bubbles / Texture */}
          <div className="absolute top-0 w-full h-2 bg-white/20" />
        </motion.div>
        
        {/* Measurement lines */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between py-2 pointer-events-none opacity-30">
          <div className="border-b border-gray-500 w-full" />
          <div className="border-b border-gray-500 w-full" />
          <div className="border-b border-gray-500 w-full" />
        </div>
      </div>
      <div className="mt-2 font-pixel text-xs text-white text-shadow-pixel">{value}</div>
    </div>
  );
};

export const VitalsPane = () => {
  const { capital, intellect, sovereignty, freedomDate } = useGameStore();

  return (
    <div className="h-full bg-pixel-dark border-r-4 border-gray-800 p-4 flex flex-col items-center overflow-y-auto noscroll">
      <h2 className="text-sm text-pixel-gold mb-8 font-pixel border-b-2 border-pixel-gold pb-2 w-full text-center">VITALS</h2>
      
      <StatTube label="Capital" value={capital} color="#FFD700" max={5000} />
      <StatTube label="Intellect" value={intellect} color="#00BFFF" max={100} />
      <StatTube label="Sovereignty" value={sovereignty} color="#1E90FF" max={10} />

      <div className="mt-auto w-full bg-gray-900 border-2 border-gray-700 p-2 rounded text-center">
        <div className="text-[10px] text-gray-400 mb-1">FREEDOM COUNTDOWN</div>
        <div className="font-pixel text-[10px] text-red-400">
           {Math.ceil((freedomDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} DAYS
        </div>
      </div>
    </div>
  );
};
