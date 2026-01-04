'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Business, BUSINESS_STAGES, BUSINESS_TYPES, BUSINESS_QUESTS, getNextStage } from '@/types/business';

interface ConstructionSiteProps {
  business: Business;
  onSelect: () => void;
  isSelected: boolean;
}

const ConstructionSite = ({ business, onSelect, isSelected }: ConstructionSiteProps) => {
  const stageInfo = BUSINESS_STAGES[business.stage];
  const typeInfo = BUSINESS_TYPES[business.type];
  
  return (
    <motion.button
      onClick={onSelect}
      className={`relative p-4 rounded-lg transition-all ${
        isSelected 
          ? 'bg-pixel-gold/20 border-2 border-pixel-gold' 
          : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Stage icon */}
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">{stageInfo.icon}</div>
        <div className="text-left">
          <div className="text-xs text-white font-bold">{business.name}</div>
          <div className="text-[10px] text-gray-400">{stageInfo.name}</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full bg-gradient-to-r from-pixel-gold/50 to-pixel-gold"
          initial={{ width: 0 }}
          animate={{ width: `${business.growthProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Type badge */}
      <div className="absolute top-2 right-2 text-lg" title={typeInfo.name}>
        {typeInfo.icon}
      </div>
      
      {/* Revenue indicator */}
      {business.stage !== 'construction' && (
        <div className="text-[10px] text-pixel-gold mt-2">
          €{business.revenue}/mo
        </div>
      )}
    </motion.button>
  );
};

export const MerchantGuild = () => {
  const { businesses = [], addBusiness, upgradeBusiness } = useGameStore() as any;
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessType, setNewBusinessType] = useState<'passive' | 'active' | 'creative'>('passive');

  const handleCreateBusiness = () => {
    if (!newBusinessName.trim()) return;
    
    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      name: newBusinessName,
      type: newBusinessType,
      stage: 'construction',
      revenue: 0,
      growthProgress: 0,
      foundedAt: new Date(),
    };
    
    if (addBusiness) {
      addBusiness(newBusiness);
    }
    setNewBusinessName('');
    setShowNewForm(false);
  };

  const availableQuests = BUSINESS_QUESTS.filter(q => 
    selectedBusiness && selectedBusiness.stage !== 'tower'
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-pixel text-pixel-gold uppercase tracking-widest flex items-center gap-2">
            <span>🏪</span>
            Merchant Guild
          </h2>
          <p className="text-[10px] text-gray-400 mt-1">
            {businesses.length} Ventures • €{businesses.reduce((sum: number, b: Business) => sum + b.revenue, 0)}/mo Total
          </p>
        </div>
        
        <button
          onClick={() => setShowNewForm(true)}
          className="px-3 py-1.5 bg-pixel-gold/10 border border-pixel-gold/50 text-pixel-gold text-[10px] font-pixel uppercase rounded hover:bg-pixel-gold/20 transition-colors"
        >
          + New Venture
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Island Map / Ventures List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Island visualization */}
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom, #1e3a5f, #0a1628)',
              border: '2px solid #2a4a7f'
            }}
          >
            {/* Ocean */}
            <div className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center bottom, #1e5a8f, transparent)'
              }}
            />
            
            {/* Island */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-24 rounded-t-full"
              style={{
                background: 'linear-gradient(to bottom, #2d5a1a, #1a3d0f)',
                boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.1)'
              }}
            >
              {/* Buildings on island */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
                {businesses.slice(0, 5).map((biz: Business, i: number) => {
                  const stage = BUSINESS_STAGES[biz.stage];
                  const height = biz.stage === 'tower' ? '60px' : biz.stage === 'shop' ? '45px' : biz.stage === 'stall' ? '30px' : '20px';
                  
                  return (
                    <motion.div
                      key={biz.id}
                      className="text-xl text-center cursor-pointer"
                      style={{ marginBottom: height }}
                      whileHover={{ scale: 1.2, y: -5 }}
                      onClick={() => setSelectedBusiness(biz)}
                    >
                      {stage.icon}
                    </motion.div>
                  );
                })}
                
                {/* Empty construction site placeholder */}
                {businesses.length < 5 && (
                  <motion.div
                    className="text-xl text-gray-600 cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowNewForm(true)}
                  >
                    🚧
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Clouds */}
            <motion.div
              className="absolute top-4 left-1/4 text-2xl opacity-50"
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              ☁️
            </motion.div>
          </div>

          {/* Ventures Grid */}
          <div className="grid grid-cols-2 gap-3">
            {businesses.map((biz: Business) => (
              <ConstructionSite
                key={biz.id}
                business={biz}
                isSelected={selectedBusiness?.id === biz.id}
                onSelect={() => setSelectedBusiness(biz)}
              />
            ))}
            
            {businesses.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <div className="text-4xl mb-2 opacity-30">🏝️</div>
                <p className="text-gray-500 text-xs">Your island awaits development</p>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="mt-3 text-pixel-gold text-xs underline hover:no-underline"
                >
                  Start your first venture
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-64 bg-gray-900/50 border-l border-gray-700/50 p-4">
          <AnimatePresence mode="wait">
            {selectedBusiness ? (
              <motion.div
                key={selectedBusiness.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                {/* Business Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{BUSINESS_STAGES[selectedBusiness.stage].icon}</div>
                  <div>
                    <h3 className="text-sm text-white font-bold">{selectedBusiness.name}</h3>
                    <p className="text-[10px] text-gray-400">{BUSINESS_STAGES[selectedBusiness.stage].name}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="bg-black/30 rounded p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-gray-500">Revenue</span>
                      <p className="text-pixel-gold">€{selectedBusiness.revenue}/mo</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type</span>
                      <p className="text-white">{BUSINESS_TYPES[selectedBusiness.type].name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Founded</span>
                      <p className="text-white">{selectedBusiness.foundedAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Growth</span>
                      <p className="text-pixel-accent">{selectedBusiness.growthProgress}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Growth Quests */}
                <div className="flex-1">
                  <h4 className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Growth Quests</h4>
                  <div className="space-y-2">
                    {availableQuests.slice(0, 3).map(quest => (
                      <div 
                        key={quest.id}
                        className="bg-black/20 border border-gray-700 rounded p-2 hover:border-pixel-gold/50 cursor-pointer transition-colors"
                      >
                        <div className="text-xs text-white">{quest.title}</div>
                        <div className="text-[10px] text-gray-500 mt-1">{quest.description}</div>
                        <div className="flex gap-2 mt-2 text-[10px]">
                          <span className="text-pixel-gold">+€{quest.goldReward}</span>
                          <span className="text-pixel-blue">+{quest.xpReward}XP</span>
                          <span className="text-pixel-accent">+{quest.growthBonus}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Next Stage */}
                {getNextStage(selectedBusiness.stage) && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-[10px] text-gray-400 mb-2">
                      Next: {BUSINESS_STAGES[getNextStage(selectedBusiness.stage)!].name}
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-pixel-gold h-full transition-all"
                        style={{ width: `${selectedBusiness.growthProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <p className="text-gray-500 text-[10px] text-center">
                  Select a venture<br/>to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Business Modal */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowNewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border-2 border-pixel-gold rounded-lg p-6 w-80"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-sm font-pixel text-pixel-gold mb-4 uppercase">New Venture</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Name</label>
                  <input
                    type="text"
                    value={newBusinessName}
                    onChange={e => setNewBusinessName(e.target.value)}
                    placeholder="My Business"
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-pixel-gold"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['passive', 'active', 'creative'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewBusinessType(type)}
                        className={`p-2 rounded border text-center transition-colors ${
                          newBusinessType === type 
                            ? 'bg-pixel-gold/20 border-pixel-gold' 
                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-xl">{BUSINESS_TYPES[type].icon}</div>
                        <div className="text-[8px] text-gray-400 mt-1">{BUSINESS_TYPES[type].name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 py-2 border border-gray-600 text-gray-400 text-xs rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBusiness}
                  disabled={!newBusinessName.trim()}
                  className="flex-1 py-2 bg-pixel-gold/20 border border-pixel-gold text-pixel-gold text-xs rounded hover:bg-pixel-gold/30 disabled:opacity-50"
                >
                  Found Venture
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MerchantGuild;
