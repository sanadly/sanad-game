'use client';

import React, { useEffect, useState } from 'react';

import { VitalsPane } from './VitalsPane';
import { WorldMap } from './WorldMap';
import { TravelHub } from './TravelHub';
import { CommandCenter } from './CommandCenter';
import { LevelUpListener } from './LevelUpModal';
import { DreamsPane } from './DreamsPane';
import { useGameStore } from '@/store/gameStore';

type CenterView = 'tasks' | 'travel' | 'dreams';

export const SovereignLayout = () => {
  const { hydrateFromFirebase, isHydrated } = useGameStore();
  const [centerView, setCenterView] = useState<CenterView>('tasks');

  // Hydrate from Firebase on mount
  useEffect(() => {
    if (!isHydrated) {
      hydrateFromFirebase();
    }
  }, [hydrateFromFirebase, isHydrated]);

  return (
    <div className="relative w-screen h-screen bg-pixel-bg overflow-hidden flex font-sans selection:bg-pixel-accent selection:text-black">
      {/* Level Up Modal */}
      <LevelUpListener />

      {/* Three Column Grid */}
      <div className="w-full h-full grid grid-cols-[200px_1fr_300px] z-10">
        {/* Left: HUD */}
        <div className="h-full z-20 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
            <VitalsPane />
        </div>

        {/* Center: Main Content Area with Tab Switcher */}
        <div className="h-full relative overflow-hidden flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700/50 bg-pixel-dark/80 backdrop-blur-sm z-20">
            <button
              onClick={() => setCenterView('tasks')}
              className={`flex-1 py-3 px-4 text-[10px] font-pixel uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                centerView === 'tasks' 
                  ? 'bg-pixel-bg text-pixel-accent border-b-2 border-pixel-accent' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <span className="text-sm">🗺️</span>
              <span>Task Realm</span>
            </button>
            <button
              onClick={() => setCenterView('travel')}
              className={`flex-1 py-3 px-4 text-[10px] font-pixel uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                centerView === 'travel' 
                  ? 'bg-pixel-bg text-pixel-gold border-b-2 border-pixel-gold' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <span className="text-sm">✈️</span>
              <span>Map Room</span>
            </button>
            <button
              onClick={() => setCenterView('dreams')}
              className={`flex-1 py-3 px-4 text-[10px] font-pixel uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                centerView === 'dreams' 
                  ? 'bg-pixel-bg text-amber-500 border-b-2 border-amber-500' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <span className="text-sm">📜</span>
              <span>Scroll of Dreams</span>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
             {centerView === 'tasks' && <WorldMap />}
             {centerView === 'travel' && <TravelHub />}
             {centerView === 'dreams' && <div className="absolute inset-0 bg-pixel-dark"><div className="max-w-2xl mx-auto h-full shadow-2xl border-x border-amber-900/30"><DreamsPane /></div></div>}
          </div>
        </div>

        {/* Right: Command Center */}
        <div className="h-full z-20 shadow-[-4px_0_10px_rgba(0,0,0,0.5)]">
            <CommandCenter />
        </div>
      </div>
    </div>
  );
};
