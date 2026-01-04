'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AvatarState = 'idle' | 'thinking' | 'speaking' | 'excited';

interface NavigatorAvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg';
  onAnimationComplete?: () => void;
}

// CSS-based pixel art owl using emoji and styled divs
const OwlSprite = ({ state, size }: { state: AvatarState; size: string }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const stateColors = {
    idle: '#4a9eff',
    thinking: '#9370DB',
    speaking: '#00ff88',
    excited: '#FFD700',
  };

  const eyeAnimation = {
    idle: {
      scaleY: [1, 0.1, 1],
      transition: { duration: 0.2, repeat: Infinity, repeatDelay: 3 }
    },
    thinking: {
      x: [-2, 2, -2],
      transition: { duration: 1, repeat: Infinity }
    },
    speaking: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.3, repeat: Infinity }
    },
    excited: {
      rotate: [-5, 5, -5],
      scale: [1, 1.2, 1],
      transition: { duration: 0.5, repeat: Infinity }
    },
  };

  return (
    <div className={`relative ${sizeClasses[size as keyof typeof sizeClasses]} flex items-center justify-center`}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{ backgroundColor: stateColors[state] }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main body */}
      <motion.div
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: '#1a1a2e',
          border: `3px solid ${stateColors[state]}`,
          width: '100%',
          height: '100%',
          boxShadow: `0 0 15px ${stateColors[state]}40`,
        }}
        animate={eyeAnimation[state]}
      >
        {/* Owl face */}
        <div className="relative">
          {/* Eyes container */}
          <div className="flex gap-1 justify-center">
            <motion.div 
              className="w-2 h-2 rounded-full bg-white"
              animate={state === 'idle' ? { scaleY: [1, 0.2, 1] } : {}}
              transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
            >
              <div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5" />
            </motion.div>
            <motion.div 
              className="w-2 h-2 rounded-full bg-white"
              animate={state === 'idle' ? { scaleY: [1, 0.2, 1] } : {}}
              transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4, delay: 0.05 }}
            >
              <div className="w-1 h-1 bg-black rounded-full mt-0.5 ml-0.5" />
            </motion.div>
          </div>
          
          {/* Beak */}
          <motion.div 
            className="mx-auto mt-0.5 w-0 h-0"
            style={{
              borderLeft: '3px solid transparent',
              borderRight: '3px solid transparent',
              borderTop: `4px solid ${stateColors[state]}`,
            }}
            animate={state === 'speaking' ? { scaleY: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
        </div>
        
        {/* Ear tufts */}
        <div 
          className="absolute -top-1 left-1 w-1.5 h-2 rounded-t-full"
          style={{ backgroundColor: stateColors[state] }}
        />
        <div 
          className="absolute -top-1 right-1 w-1.5 h-2 rounded-t-full"
          style={{ backgroundColor: stateColors[state] }}
        />
      </motion.div>
      
      {/* State indicator particles */}
      <AnimatePresence>
        {state === 'thinking' && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-purple-400"
                initial={{ opacity: 0, y: 0, x: 20 + i * 5 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: -20 - i * 5,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                style={{ right: 0, top: '50%' }}
              />
            ))}
          </>
        )}
        {state === 'excited' && (
          <>
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute text-xs"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  y: -30,
                  x: (i - 1.5) * 15,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                style={{ top: 0, left: '50%' }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NavigatorAvatar = ({ 
  state = 'idle', 
  size = 'md',
  onAnimationComplete 
}: NavigatorAvatarProps) => {
  const [currentState, setCurrentState] = useState<AvatarState>(state);

  useEffect(() => {
    setCurrentState(state);
    
    // Auto-return to idle after excited/speaking
    if (state === 'excited' || state === 'speaking') {
      const timer = setTimeout(() => {
        setCurrentState('idle');
        onAnimationComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, onAnimationComplete]);

  return (
    <div className="relative inline-flex">
      <OwlSprite state={currentState} size={size} />
      
      {/* State label (debug/demo) */}
      {process.env.NODE_ENV === 'development' && false && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 capitalize whitespace-nowrap">
          {currentState}
        </div>
      )}
    </div>
  );
};

// Compact inline version for chat bubbles
export const NavigatorAvatarInline = ({ state = 'idle' }: { state?: AvatarState }) => {
  return (
    <div className="inline-flex items-center gap-1">
      <NavigatorAvatar state={state} size="sm" />
    </div>
  );
};

export default NavigatorAvatar;
