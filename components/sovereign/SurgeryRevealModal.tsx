'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface SurgeryRevealModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const SurgeryRevealModal = ({ isOpen, onComplete }: SurgeryRevealModalProps) => {
  const [phase, setPhase] = useState<'flash' | 'reveal' | 'complete'>('flash');
  
  useEffect(() => {
    if (!isOpen) return;
    
    // Phase transitions
    const flashTimer = setTimeout(() => setPhase('reveal'), 800);
    const revealTimer = setTimeout(() => setPhase('complete'), 3000);
    
    return () => {
      clearTimeout(flashTimer);
      clearTimeout(revealTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background */}
        <motion.div className="absolute inset-0 bg-black" />
        
        {/* Flash effect */}
        <AnimatePresence>
          {phase === 'flash' && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
            />
          )}
        </AnimatePresence>

        {/* Success reveal */}
        <AnimatePresence>
          {(phase === 'reveal' || phase === 'complete') && (
            <motion.div
              className="relative z-10 flex flex-col items-center text-center px-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              {/* Success sound indicator */}
              <motion.div
                className="text-6xl mb-6"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.div>
              
              {/* Title */}
              <motion.h2
                className="font-pixel text-4xl text-pixel-gold mb-4"
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(255,215,0,0.5)',
                    '0 0 40px rgba(255,215,0,0.8)',
                    '0 0 20px rgba(255,215,0,0.5)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                CHARACTER REMODEL
              </motion.h2>
              
              <motion.p
                className="text-xl text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Transformation Complete
              </motion.p>
              
              <motion.p
                className="text-sm text-gray-400 mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your avatar has been permanently enhanced with the Divine Glow effect.
                This marks a significant milestone in your sovereignty journey.
              </motion.p>
              
              {/* Before/After indicator */}
              <motion.div
                className="flex items-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-3xl opacity-50">
                    👤
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">Before</span>
                </div>
                
                <motion.span
                  className="text-2xl text-pixel-gold"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  →
                </motion.span>
                
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-pixel-gold/20 border-2 border-pixel-gold flex items-center justify-center text-3xl"
                    animate={{ 
                      boxShadow: [
                        '0 0 10px rgba(255,215,0,0.3)',
                        '0 0 30px rgba(255,215,0,0.6)',
                        '0 0 10px rgba(255,215,0,0.3)',
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                  <span className="text-[10px] text-pixel-gold mt-1 block">After</span>
                </div>
              </motion.div>
              
              {/* Stat bonuses */}
              <motion.div
                className="bg-black/50 border border-pixel-gold/30 rounded-lg p-4 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Permanent Bonuses</div>
                <div className="flex gap-6 text-sm">
                  <span className="text-pink-400">+20 Aesthetics</span>
                  <span className="text-pixel-gold">+10 Sovereignty</span>
                  <span className="text-purple-400">Divine Glow Aura</span>
                </div>
              </motion.div>
              
              {/* Continue button */}
              {phase === 'complete' && (
                <motion.button
                  className="px-8 py-3 bg-pixel-gold/20 border-2 border-pixel-gold text-pixel-gold font-pixel uppercase tracking-wider rounded hover:bg-pixel-gold/30 transition-colors"
                  onClick={onComplete}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Embrace New Form
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-pixel-gold"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 20,
                opacity: 0 
              }}
              animate={{ 
                y: -50,
                opacity: [0, 1, 0],
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook to trigger surgery reveal
export const useSurgeryReveal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { avatar } = useGameStore();
  
  const triggerReveal = () => {
    if (!avatar.appearance.surgeryComplete) {
      setIsOpen(true);
    }
  };
  
  const handleComplete = () => {
    setIsOpen(false);
    // The actual surgery completion should be saved via gameStore action
  };
  
  return { isOpen, triggerReveal, handleComplete };
};

export default SurgeryRevealModal;
