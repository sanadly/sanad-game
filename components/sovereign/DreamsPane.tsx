'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { BucketListItem } from '@/types/game';

// Quest type icons
const QUEST_ICONS = {
  main: '⚔️',
  side: '📌',
};

interface DreamScrollItemProps {
  dream: BucketListItem;
  onToggle: () => void;
  onPin: () => void;
  onArchive: () => void;
  onRemove: () => void;
  isPinnable: boolean;
}

const DreamScrollItem = ({ dream, onToggle, onPin, onArchive, onRemove, isPinnable }: DreamScrollItemProps) => {
  const isArchived = !!dream.archivedAt;
  const questType = dream.questType || 'side';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isArchived ? 0.4 : 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={`relative flex items-start gap-3 p-3 mb-2 rounded transition-all group ${
        dream.completed 
          ? 'bg-amber-900/20 border border-amber-700/30' 
          : isArchived
            ? 'bg-gray-900/30 border border-gray-700/20'
            : dream.isPinned
              ? 'bg-pixel-gold/10 border-2 border-pixel-gold/40'
              : 'bg-amber-950/30 border border-amber-800/30 hover:border-amber-700/50'
      }`}
    >
      {/* Quest Type Badge */}
      <div className={`w-8 h-8 rounded flex items-center justify-center text-lg flex-shrink-0 ${
        questType === 'main' ? 'bg-pixel-gold/20' : 'bg-gray-800/50'
      }`}>
        {QUEST_ICONS[questType]}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h4 className={`text-xs font-bold leading-tight ${
            dream.completed 
              ? 'text-amber-600 line-through' 
              : isArchived 
                ? 'text-gray-500 italic' 
                : 'text-amber-200'
          }`}>
            {dream.title}
          </h4>
          {dream.isPinned && (
            <span className="text-[8px] bg-pixel-gold/30 text-pixel-gold px-1 py-0.5 rounded uppercase">
              Active
            </span>
          )}
        </div>
        
        {dream.description && (
          <p className={`text-[10px] mt-1 line-clamp-2 ${
            isArchived ? 'text-gray-600' : 'text-amber-400/60'
          }`}>
            {dream.description}
          </p>
        )}
        
        {/* Icon Preview */}
        {dream.iconUrl && !isArchived && (
          <div className="mt-2 w-8 h-8 rounded overflow-hidden border border-amber-700/30">
            <img src={dream.iconUrl} alt="" className="w-full h-full object-cover pixelated" />
          </div>
        )}
      </div>
      
      {/* Actions (visible on hover) */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!dream.completed && !isArchived && (
          <>
            <button
              onClick={onToggle}
              className="w-6 h-6 bg-pixel-accent/20 hover:bg-pixel-accent/40 text-pixel-accent rounded flex items-center justify-center text-xs"
              title="Complete"
            >
              ✓
            </button>
            {isPinnable && !dream.isPinned && (
              <button
                onClick={onPin}
                className="w-6 h-6 bg-pixel-gold/20 hover:bg-pixel-gold/40 text-pixel-gold rounded flex items-center justify-center text-xs"
                title="Pin to Active"
              >
                📍
              </button>
            )}
            {dream.isPinned && (
              <button
                onClick={onPin}
                className="w-6 h-6 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 rounded flex items-center justify-center text-xs"
                title="Unpin"
              >
                ✕
              </button>
            )}
          </>
        )}
        {!isArchived && (
          <button
            onClick={onArchive}
            className="w-6 h-6 bg-gray-700/30 hover:bg-gray-600/50 text-gray-500 rounded flex items-center justify-center text-xs"
            title="Archive"
          >
            📦
          </button>
        )}
        <button
          onClick={onRemove}
          className="w-6 h-6 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded flex items-center justify-center text-xs"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
};

export const DreamsPane = () => {
  const { bucketList, addDream, toggleDream, removeDream } = useGameStore();
  const [newDreamTitle, setNewDreamTitle] = useState('');
  const [newDreamDesc, setNewDreamDesc] = useState('');
  const [newQuestType, setNewQuestType] = useState<'main' | 'side'>('side');
  const [isAdding, setIsAdding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Local state for pinning and archiving (would be stored in Zustand in production)
  const [localMods, setLocalMods] = useState<Record<string, { isPinned?: boolean; archivedAt?: Date }>>({});

  // Combine store data with local modifications
  const enhancedList = useMemo(() => {
    return bucketList.map(d => ({
      ...d,
      isPinned: localMods[d.id]?.isPinned ?? d.isPinned,
      archivedAt: localMods[d.id]?.archivedAt ?? d.archivedAt,
    }));
  }, [bucketList, localMods]);

  // Categorize dreams
  const { activeDreams, pinnedDreams, archivedDreams } = useMemo(() => {
    const pinned = enhancedList.filter(d => d.isPinned && !d.archivedAt && !d.completed);
    const archived = enhancedList.filter(d => d.archivedAt);
    const active = enhancedList.filter(d => !d.isPinned && !d.archivedAt);
    return { pinnedDreams: pinned, activeDreams: active, archivedDreams: archived };
  }, [enhancedList]);

  const canPinMore = pinnedDreams.length < 3;

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDreamTitle.trim()) return;

    setIsAdding(true);
    await addDream(newDreamTitle, newDreamDesc);
    setNewDreamTitle('');
    setNewDreamDesc('');
    setIsAdding(false);
  };

  const handlePin = (id: string, currentlyPinned: boolean) => {
    if (!currentlyPinned && !canPinMore) return;
    setLocalMods(prev => ({
      ...prev,
      [id]: { ...prev[id], isPinned: !currentlyPinned }
    }));
  };

  const handleArchive = (id: string) => {
    setLocalMods(prev => ({
      ...prev,
      [id]: { ...prev[id], archivedAt: new Date(), isPinned: false }
    }));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Parchment Header */}
      <div 
        className="p-4 border-b-4"
        style={{
          background: 'linear-gradient(to bottom, #2d1f0f, #1a1206)',
          borderColor: '#3d2a14',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📜</span>
          <h2 className="text-sm font-pixel text-amber-400 uppercase tracking-widest">
            Scroll of Dreams
          </h2>
        </div>
        
        {/* Add Dream Form */}
        <form onSubmit={handleAddDream} className="space-y-2">
          <div className="flex gap-2">
            <select
              value={newQuestType}
              onChange={(e) => setNewQuestType(e.target.value as 'main' | 'side')}
              className="bg-amber-950/50 border border-amber-800/50 text-amber-300 text-[10px] px-2 py-1 rounded"
            >
              <option value="main">⚔️ Main</option>
              <option value="side">📌 Side</option>
            </select>
            <input
              type="text"
              value={newDreamTitle}
              onChange={(e) => setNewDreamTitle(e.target.value)}
              placeholder="Inscribe a new dream..."
              className="flex-1 bg-amber-950/30 border border-amber-800/30 text-amber-200 placeholder-amber-700/50 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-600"
              disabled={isAdding}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDreamDesc}
              onChange={(e) => setNewDreamDesc(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1 bg-amber-950/30 border border-amber-800/30 text-amber-200/70 placeholder-amber-700/40 text-[10px] px-3 py-1.5 rounded focus:outline-none focus:border-amber-600"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !newDreamTitle.trim()}
              className="px-4 py-1.5 bg-amber-700/30 hover:bg-amber-700/50 border border-amber-600/50 text-amber-400 text-[10px] font-pixel uppercase rounded transition-colors disabled:opacity-50"
            >
              {isAdding ? '...' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Scroll Content */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{
          background: 'linear-gradient(to bottom, #1a1206, #0f0a03)',
        }}
      >
        {/* Pinned Dreams (Active Quests) */}
        {pinnedDreams.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pixel-gold text-xs">★</span>
              <h3 className="text-[10px] font-pixel text-pixel-gold uppercase tracking-wider">
                Active Quests ({pinnedDreams.length}/3)
              </h3>
            </div>
            <AnimatePresence mode="popLayout">
              {pinnedDreams.map(dream => (
                <DreamScrollItem
                  key={dream.id}
                  dream={dream}
                  onToggle={() => toggleDream(dream.id)}
                  onPin={() => handlePin(dream.id, true)}
                  onArchive={() => handleArchive(dream.id)}
                  onRemove={() => removeDream(dream.id)}
                  isPinnable={false}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Main Content - Active Dreams */}
        <AnimatePresence mode="popLayout">
          {activeDreams.length === 0 && pinnedDreams.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 opacity-40"
            >
              <span className="text-4xl mb-2">📜</span>
              <p className="text-amber-600/60 text-xs">The scroll awaits your dreams...</p>
            </motion.div>
          ) : (
            activeDreams.map(dream => (
              <DreamScrollItem
                key={dream.id}
                dream={dream}
                onToggle={() => toggleDream(dream.id)}
                onPin={() => handlePin(dream.id, !!dream.isPinned)}
                onArchive={() => handleArchive(dream.id)}
                onRemove={() => removeDream(dream.id)}
                isPinnable={canPinMore}
              />
            ))
          )}
        </AnimatePresence>

        {/* Echoes of the Past (Archived) */}
        {archivedDreams.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700/30">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 mb-2 text-gray-500 hover:text-gray-400 transition-colors"
            >
              <span className="text-sm">{showArchived ? '▼' : '►'}</span>
              <span className="text-[10px] font-pixel uppercase tracking-wider">
                Echoes of the Past ({archivedDreams.length})
              </span>
            </button>
            
            <AnimatePresence>
              {showArchived && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {archivedDreams.map(dream => (
                    <DreamScrollItem
                      key={dream.id}
                      dream={dream}
                      onToggle={() => {}}
                      onPin={() => {}}
                      onArchive={() => {}}
                      onRemove={() => removeDream(dream.id)}
                      isPinnable={false}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Scroll Footer - Stats */}
      <div 
        className="p-3 border-t-4 flex justify-between text-[10px]"
        style={{
          background: 'linear-gradient(to top, #2d1f0f, #1a1206)',
          borderColor: '#3d2a14',
        }}
      >
        <span className="text-amber-600">
          {enhancedList.filter(d => d.completed).length} completed
        </span>
        <span className="text-amber-500/50">
          {enhancedList.filter(d => !d.completed && !d.archivedAt).length} remaining
        </span>
      </div>
    </div>
  );
};
