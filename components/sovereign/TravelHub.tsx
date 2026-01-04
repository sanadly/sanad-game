'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { WORLD_COUNTRIES, Country, getCountryByCode } from '@/types/travel';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('./RealWorldMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0a0a1a] flex items-center justify-center text-gray-500">Loading Satellites...</div>
});

interface TrinketDisplayProps {
  trinketId: string;
  country: Country;
}

const TrinketDisplay = ({ trinketId, country }: TrinketDisplayProps) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      className="relative group"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 border-2 border-pixel-gold/30 rounded-lg flex items-center justify-center text-xl md:text-2xl hover:border-pixel-gold transition-colors cursor-pointer">
        {country.trinket.icon}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
        <div className="bg-black/90 border border-pixel-gold/50 rounded px-2 py-1 whitespace-nowrap">
          <div className="text-[10px] text-pixel-gold font-pixel">{country.trinket.name}</div>
          <div className="text-[8px] text-gray-400">{country.name}</div>
        </div>
      </div>
    </motion.div>
  );
};

export const TravelHub = () => {
  const { visitedCountries, travelDreams, capital, logVisit } = useGameStore();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  // Calculate freedom progress
  const freedomProgress = useMemo(() => {
    const totalCost = travelDreams?.reduce((sum, d) => sum + d.estimatedCost, 0) || 0;
    if (totalCost === 0) return capital >= 10000 ? 100 : (capital / 10000) * 100;
    const funded = travelDreams?.reduce((sum, d) => sum + d.fundedAmount, 0) || 0;
    return Math.min(Math.round((funded / totalCost) * 100), 100);
  }, [travelDreams, capital]);

  // Get collected trinkets
  const collectedTrinkets = useMemo(() => {
    return (visitedCountries || [])
      .map(code => getCountryByCode(code))
      .filter((c): c is Country => c !== undefined);
  }, [visitedCountries]);

  const handleLogVisit = (countryCode: string) => {
    logVisit(countryCode);
    setShowLogModal(false);
    setSelectedCountry(null);
  };

  return (
    <div className="relative w-full h-full bg-[#1a1a2e] overflow-hidden flex flex-col font-pixel">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 relative z-10 bg-[#1a1a2e]">
        <div>
          <h2 className="text-sm text-pixel-gold uppercase tracking-widest">Map Room</h2>
          <p className="text-[10px] text-gray-400 mt-1">
            {visitedCountries?.length || 0} / {WORLD_COUNTRIES.length} Discovered
          </p>
        </div>
        
        {/* Freedom Clock */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase">Freedom Clock</div>
            <div className={`text-sm font-bold ${freedomProgress >= 100 ? 'text-pixel-gold animate-pulse' : 'text-pixel-blue'}`}>
              {freedomProgress}%
            </div>
          </div>
          <div className="w-20 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
            <motion.div
              className="h-full bg-gradient-to-r from-pixel-blue to-pixel-gold"
              initial={{ width: 0 }}
              animate={{ width: `${freedomProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* World Map */}
        <div className="flex-1 relative bg-[#0a0a1a] overflow-hidden z-0">
           <MapWithNoSSR 
             countries={WORLD_COUNTRIES}
             visitedCodes={visitedCountries}
             onSelectCountry={setSelectedCountry}
             selectedCountry={selectedCountry}
           />
          
          {/* Map title overlay */}
          <div className="absolute top-4 left-14 bg-black/50 border border-pixel-gold/30 rounded px-3 py-1 z-[400] pointer-events-none">
            <span className="text-[10px] text-pixel-gold uppercase tracking-widest">Global Sat-View</span>
          </div>
        </div>

        {/* Right Panel - Traveler's Desk */}
        <div className="w-64 bg-[#0f0f1e] border-l border-gray-700/50 p-4 flex flex-col relative z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
          {/* Desk Surface */}
          <div className="relative bg-gradient-to-b from-amber-900/30 to-amber-950/30 border-2 border-amber-800/50 rounded-lg p-3 mb-4"
            style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.3)' }}
          >
            <div className="text-[10px] text-amber-400/70 mb-2 uppercase tracking-wider">Trinket Collection</div>
            
            {collectedTrinkets.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-3xl opacity-30">🧳</span>
                <p className="text-[10px] text-gray-500 mt-2">No trinkets yet</p>
                <p className="text-[8px] text-gray-600">Visit countries to collect!</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {collectedTrinkets.slice(0, 12).map(country => (
                    // ... trinket rendering ...
                    <div key={country.code} className="w-8 h-8 flex items-center justify-center bg-black/20 rounded border border-white/10 text-lg" title={country.trinket.name}>
                        {country.trinket.icon}
                    </div>
                ))}
                {collectedTrinkets.length > 12 && (
                  <div className="w-8 h-8 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center text-[10px] text-gray-400">
                    +{collectedTrinkets.length - 12}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Selected Country Info */}
          <AnimatePresence mode="wait">
            {selectedCountry && (
              <motion.div
                key={selectedCountry.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-3 overflow-y-auto"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedCountry.trinket.icon}</span>
                  <div>
                    <h3 className="text-xs text-white font-bold">{selectedCountry.name}</h3>
                    <p className="text-[10px] text-gray-400 capitalize">{selectedCountry.region.replace('-', ' ')}</p>
                  </div>
                </div>
                
                <p className="text-[10px] text-gray-300 mb-3">{selectedCountry.trinket.description}</p>
                
                {visitedCountries?.includes(selectedCountry.code) ? (
                  <div className="bg-pixel-accent/10 border border-pixel-accent/30 rounded p-2 text-center">
                    <span className="text-pixel-accent text-xs">✓ Discovered</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="w-full bg-pixel-gold/10 hover:bg-pixel-gold/20 border border-pixel-gold/50 text-pixel-gold text-xs py-2 rounded transition-colors uppercase tracking-wider"
                  >
                    Log Visit
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!selectedCountry && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[10px] text-gray-500 text-center">
                Select a location<br/>on the Global Map
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Log Visit Modal */}
      <AnimatePresence>
        {showLogModal && selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500]"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border-2 border-pixel-gold rounded-lg p-6 max-w-sm mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-sm text-pixel-gold mb-4 text-center uppercase">Confirm Discovery</h3>
              
              <div className="text-center mb-4">
                <span className="text-5xl">{selectedCountry.trinket.icon}</span>
                <p className="text-white mt-2">{selectedCountry.name}</p>
              </div>
              
              <p className="text-[10px] text-gray-400 text-center mb-4">
                You will receive the <strong className="text-pixel-gold">{selectedCountry.trinket.name}</strong> trinket!
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 border border-gray-600 text-gray-400 text-xs py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLogVisit(selectedCountry.code)}
                  className="flex-1 bg-pixel-gold/20 border border-pixel-gold text-pixel-gold text-xs py-2 rounded hover:bg-pixel-gold/30 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
