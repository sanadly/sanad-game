'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Relic, STAT_CONFIGS, StatType } from '@/types/game';

interface LevelUpModalProps {
  stat: string;
  relic: Relic;
  onClose: () => void;
}

const STAT_NAMES: Record<string, string> = {
  capital: 'Capital',
  sovereignty: 'Sovereignty',
  aesthetics: 'Aesthetics',
  intellect: 'Intellect',
  kindred: 'Kindred',
  vitality: 'Vitality',
};

const LevelUpModal = ({ stat, relic, onClose }: LevelUpModalProps) => {
  const { unlockRelic } = useGameStore();
  const [phase, setPhase] = useState<'flash' | 'reveal' | 'relic'>('flash');
  const config = STAT_CONFIGS[stat.toUpperCase() as StatType];

  useEffect(() => {
    // Phase transitions
    const flashTimer = setTimeout(() => setPhase('reveal'), 500);
    const revealTimer = setTimeout(() => setPhase('relic'), 1500);
    const unlockTimer = setTimeout(() => {
      unlockRelic(relic.id);
    }, 2000);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(revealTimer);
      clearTimeout(unlockTimer);
    };
  }, [relic.id, unlockRelic]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background overlay with particles */}
        <motion.div 
          className="absolute inset-0 bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Flash effect */}
        <AnimatePresence>
          {phase === 'flash' && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 50,
                opacity: 0 
              }}
              animate={{ 
                y: -100,
                opacity: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 1,
                repeat: Infinity,
              }}
            >
              {config?.fillIcon || '✨'}
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center p-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
        >
          {/* Level Up Text */}
          <motion.div
            className="font-pixel text-6xl mb-6"
            style={{ 
              color: config?.primaryColor || '#FFD700',
              textShadow: `0 0 20px ${config?.glowColor || 'rgba(255,215,0,0.6)'}`,
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              textShadow: [
                `0 0 20px ${config?.glowColor || 'rgba(255,215,0,0.6)'}`,
                `0 0 40px ${config?.glowColor || 'rgba(255,215,0,0.6)'}`,
                `0 0 20px ${config?.glowColor || 'rgba(255,215,0,0.6)'}`,
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            LEVEL UP!
          </motion.div>

          {/* Stat name */}
          <motion.div
            className="font-pixel text-2xl text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {STAT_NAMES[stat]} Milestone Reached!
          </motion.div>

          {/* Relic reveal */}
          <AnimatePresence>
            {phase === 'relic' && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="text-gray-400 text-sm mb-3 font-pixel uppercase tracking-widest">
                  New Relic Unlocked
                </div>
                
                {/* Relic card */}
                <motion.div
                  className="bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-pixel-gold rounded-lg p-6 shadow-2xl"
                  style={{ boxShadow: `0 0 30px ${config?.glowColor || 'rgba(255,215,0,0.3)'}` }}
                  animate={{ 
                    boxShadow: [
                      `0 0 30px ${config?.glowColor || 'rgba(255,215,0,0.3)'}`,
                      `0 0 50px ${config?.glowColor || 'rgba(255,215,0,0.6)'}`,
                      `0 0 30px ${config?.glowColor || 'rgba(255,215,0,0.3)'}`,
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Relic icon */}
                  <div className="text-6xl mb-4">
                    {relic.image || '🏆'}
                  </div>
                  
                  {/* Relic name */}
                  <div className="font-pixel text-xl text-pixel-gold mb-2">
                    {relic.name}
                  </div>
                  
                  {/* Relic description */}
                  <div className="text-sm text-gray-300 max-w-xs">
                    {relic.description}
                  </div>
                </motion.div>

                {/* Continue button */}
                <motion.button
                  className="mt-8 px-8 py-3 bg-pixel-gold/20 border-2 border-pixel-gold text-pixel-gold font-pixel uppercase tracking-wider rounded hover:bg-pixel-gold/30 transition-colors"
                  onClick={onClose}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Journey
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Wrapper component that listens for level-up events
export const LevelUpListener = () => {
  const { pendingLevelUp, clearPendingLevelUp } = useGameStore();
  
  if (!pendingLevelUp) return null;
  
  return (
    <LevelUpModal
      stat={pendingLevelUp.stat}
      relic={pendingLevelUp.relic}
      onClose={clearPendingLevelUp}
    />
  );
};

export default LevelUpModal;
