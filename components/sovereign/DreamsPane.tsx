
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { BucketListItem } from '@/types/game';

export const DreamsPane = () => {
  const { bucketList, addDream, toggleDream, removeDream } = useGameStore();
  const [newDreamTitle, setNewDreamTitle] = useState('');
  const [newDreamDesc, setNewDreamDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDreamTitle.trim()) return;

    setIsAdding(true);
    await addDream(newDreamTitle, newDreamDesc);
    setNewDreamTitle('');
    setNewDreamDesc('');
    setIsAdding(false);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-scanline-black/20 text-sovereign-text">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">☁️</span> DREAMS_REGISTRY
        </h2>

      {/* Input Area */}
      <form onSubmit={handleAddDream} className="mb-6 bg-sovereign-bg-lighter/30 p-4 rounded border border-sovereign-border/30">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newDreamTitle}
            onChange={(e) => setNewDreamTitle(e.target.value)}
            placeholder="Dream Title (e.g. Visit Tokyo)"
            className="bg-black/50 border border-sovereign-highlight/20 p-2 rounded text-sovereign-text focus:outline-none focus:border-sovereign-highlight"
            disabled={isAdding}
          />
          <input
            type="text"
            value={newDreamDesc}
            onChange={(e) => setNewDreamDesc(e.target.value)}
            placeholder="Description (optional)"
            className="bg-black/50 border border-sovereign-highlight/20 p-2 rounded text-sovereign-text/70 text-sm focus:outline-none focus:border-sovereign-highlight"
            disabled={isAdding}
          />
          <button 
            type="submit" 
            disabled={isAdding || !newDreamTitle.trim()}
            className="mt-2 bg-sovereign-highlight/10 hover:bg-sovereign-highlight/20 border border-sovereign-highlight text-sovereign-highlight py-1 px-4 rounded transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isAdding ? (
               <span className="animate-pulse">GENERATING_ICONS...</span>
            ) : (
                <>
                    <span>+</span> INITIALIZE_DREAM
                </>
            )}
          </button>
        </div>
      </form>

      {/* Grid of Dreams */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {bucketList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 opacity-50">
                <span className="text-4xl mb-2">💤</span>
                <p>NO_DREAMS_REGISTERED</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
                {bucketList.map((dream) => (
                <DreamCard 
                    key={dream.id} 
                    dream={dream} 
                    onToggle={() => toggleDream(dream.id)}
                    onRemove={() => removeDream(dream.id)}
                />
                ))}
            </AnimatePresence>
            </div>
        )}
      </div>
    </div>
  );
};

const DreamCard = ({ dream, onToggle, onRemove }: { dream: BucketListItem; onToggle: () => void; onRemove: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative p-3 rounded flex gap-3 border transition-colors group ${
        dream.completed 
          ? 'bg-sovereign-success/10 border-sovereign-success/30' 
          : 'bg-black/40 border-sovereign-highlight/20 hover:border-sovereign-highlight/50'
      }`}
    >
      {/* Icon */}
      <div className="w-16 h-16 min-w-[4rem] bg-black/50 rounded flex items-center justify-center border border-white/5 overflow-hidden relative">
        {dream.iconUrl ? (
          <img src={dream.iconUrl} alt={dream.title} className="w-full h-full object-cover pixelated" />
        ) : (
          <div className="animate-pulse bg-sovereign-highlight/20 w-full h-full flex items-center justify-center">
            <span className="text-xs text-white/30">GEN...</span>
          </div>
        )}
        {dream.completed && (
            <div className="absolute inset-0 bg-sovereign-success/30 flex items-center justify-center backdrop-blur-[1px]">
                <span className="text-2xl">✓</span>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
            <h3 className={`font-bold truncate ${dream.completed ? 'text-sovereign-success line-through opacity-70' : 'text-sovereign-highlight'}`}>
            {dream.title}
            </h3>
            {dream.description && (
                <p className="text-xs text-white/50 truncate">{dream.description}</p>
            )}
        </div>
        
        <div className="flex justify-between items-end mt-2">
            <span className="text-[10px] text-white/30 font-mono">
                {new Date(dream.createdAt).toLocaleDateString()}
            </span>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={onToggle}
                    className={`text-xs px-2 py-0.5 rounded border ${
                        dream.completed 
                        ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' 
                        : 'border-sovereign-success/50 text-sovereign-success hover:bg-sovereign-success/10'
                    }`}
                >
                    {dream.completed ? 'UNDO' : 'COMPLETE'}
                </button>
                <button 
                    onClick={onRemove}
                    className="text-xs px-2 py-0.5 rounded border border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                    DEL
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};
