'use client';

import React, { useEffect } from 'react';

import { VitalsPane } from './VitalsPane';
import { WorldMap } from './WorldMap';
import { CommandCenter } from './CommandCenter';
import { useGameStore } from '@/store/gameStore';

export const SovereignLayout = () => {
  const { hydrateFromFirebase, isHydrated } = useGameStore();

  // Hydrate from Firebase on mount
  useEffect(() => {
    if (!isHydrated) {
      hydrateFromFirebase();
    }
  }, [hydrateFromFirebase, isHydrated]);

  return (
    <div className="relative w-screen h-screen bg-pixel-bg overflow-hidden flex font-sans selection:bg-pixel-accent selection:text-black">


      {/* Three Column Grid */}
      <div className="w-full h-full grid grid-cols-[200px_1fr_300px] z-10">
        {/* Left: HUD */}
        <div className="h-full z-20 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
            <VitalsPane />
        </div>

        {/* Center: The Core (World Map) */}
        <div className="h-full relative overflow-hidden">
            <WorldMap />
        </div>

        {/* Right: Command Center */}
        <div className="h-full z-20 shadow-[-4px_0_10px_rgba(0,0,0,0.5)]">
            <CommandCenter />
        </div>
      </div>
    </div>
  );
};
