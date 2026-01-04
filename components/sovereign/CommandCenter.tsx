'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { parseUserInput } from '@/lib/deepseek';
import { ChatMessage, StatType } from '@/types/game';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigatorAvatar } from './NavigatorAvatar';

// Check if today is Monday
const isMonday = () => new Date().getDay() === 1;

// Generate weekly strategy based on stats
const generateWeeklyStrategy = (stats: Record<string, number>): string => {
  const strategies: string[] = [];
  
  if (stats.capital < 2000) strategies.push("💰 Your Capital reserves are low. Prioritize income-generating tasks.");
  if (stats.vitality < 50) strategies.push("💧 Vitality levels critical. Schedule immediate health interventions.");
  if (stats.intellect < 40) strategies.push("📜 Intellect stagnation detected. Recommend data absorption sessions.");
  if (stats.kindred < 40) strategies.push("❤️ Social connection required. Initiate protocol: 'Hangout'.");
  if (stats.sovereignty > 70) strategies.push("🦅 Sovereignty index optimal. Freedom is within reach.");
  
  if (strategies.length === 0) {
    return "🌟 Systems nominal. Ready for next directive.";
  }
  
  return "Weekly Strategy Report:\n\n" + strategies.slice(0, 3).join("\n\n");
};

export const CommandCenter = () => {
  const { stats, updateStat, addQuest, activeQuests, completeQuest } = useGameStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'speaking' | 'excited'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [hasShownMondayStrategy, setHasShownMondayStrategy] = useState(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Monday Life Strategies
  useEffect(() => {
    if (isMonday() && !hasShownMondayStrategy && messages.length === 0) {
      const strategy = generateWeeklyStrategy({
        capital: stats.capital,
        sovereignty: stats.sovereignty,
        aesthetics: stats.aesthetics ?? 50,
        intellect: stats.intellect,
        kindred: stats.kindred ?? 30,
        vitality: stats.vitality ?? 70,
      });
      
      setAvatarState('speaking');
      setMessages([{
        id: 'monday-strategy',
        role: 'assistant',
        content: `Good morning, Architect.\n\n${strategy}`,
        timestamp: new Date(),
      }]);
      setHasShownMondayStrategy(true);
      setTimeout(() => setAvatarState('idle'), 3000);
    }
  }, [stats, hasShownMondayStrategy, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setAvatarState('thinking');

    try {
      const currentStats: Record<StatType, { value: number; max: number }> = {
        SOVEREIGNTY: { value: stats.sovereignty, max: 100 },
        CAPITAL: { value: stats.capital, max: 10000 },
        INTELLECT: { value: stats.intellect, max: 100 },
        AESTHETICS: { value: stats.aesthetics ?? 50, max: 100 },
        KINDRED: { value: stats.kindred ?? 30, max: 100 },
        VITALITY: { value: stats.vitality ?? 70, max: 100 },
      };

      const result = await parseUserInput(input, currentStats);

      Object.entries(result.statChanges).forEach(([stat, amount]) => {
        if (amount !== 0) {
          updateStat(stat.toLowerCase(), amount);
        }
      });

      if (result.quest) {
        addQuest({
          id: result.quest.id,
          title: result.quest.title,
          description: result.quest.description,
          xp: 25,
          gold: 50,
          type: result.quest.specialType || 'normal'
        });
        setAvatarState('excited');
      } else {
        setAvatarState('speaking');
      }

      setMessages(prev => [...prev, {
        id: `navigator-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Navigator Uplink Failed:', error);
      setAvatarState('idle');
    } finally {
      setIsLoading(false);
      setTimeout(() => setAvatarState('idle'), 2000);
    }
  };

  const activeMissionCount = activeQuests?.filter(q => q.status === 'active').length || 0;

  return (
    <div className="h-full bg-pixel-dark border-l-4 border-gray-800 flex flex-col font-pixel relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* --- Section 1: NAVIGATOR INTERFACE (Top 60%) --- */}
      <div className="flex-1 flex flex-col min-h-0 border-b-4 border-gray-800 bg-gray-900/90 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b border-gray-700 bg-black/40">
          <NavigatorAvatar state={avatarState} size="sm" />
          <div className="flex-1">
            <h2 className="text-xs text-pixel-blue font-bold tracking-widest uppercase">Navigator Uplink</h2>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[8px] text-gray-500 uppercase">{isLoading ? 'Processing' : 'Online'}</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-30 mt-10">
              <div className="text-4xl mb-2 grayscale">🦉</div>
              <p className="text-[10px] text-pixel-blue">Awaiting directive...</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] text-gray-600 mb-0.5 uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'Navigator'}</span>
              <div className={`max-w-[90%] text-xs p-2.5 rounded border leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-pixel-gold/5 text-pixel-gold border-pixel-gold/20 rounded-tr-none' 
                  : 'bg-pixel-blue/5 text-blue-200 border-pixel-blue/20 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-pixel-blue animate-pulse">
              <span>Thinking</span>
              <span className="typing-dots">...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-2 border-t border-gray-700 bg-black/60 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-pixel-blue/50 placeholder-gray-600"
            placeholder="Enter command..."
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-3 bg-pixel-blue/20 border border-pixel-blue/40 text-pixel-blue rounded hover:bg-pixel-blue/30 transition-colors disabled:opacity-50 text-xs font-bold uppercase"
          >
            Send
          </button>
        </div>
      </div>

      {/* --- Section 2: MISSION LOG (Bottom 40%) --- */}
      <div className="h-[40%] bg-gray-900/95 flex flex-col border-t-2 border-pixel-gold/20 relative z-10">
        {/* Header */}
        <div className="px-3 py-2 bg-black/40 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚔️</span>
            <h3 className="text-xs text-pixel-gold font-bold tracking-widest uppercase">Mission Log</h3>
          </div>
          <span className="text-[10px] bg-pixel-gold/10 text-pixel-gold px-1.5 py-0.5 rounded border border-pixel-gold/20">
            {activeMissionCount} Active
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
          {activeMissionCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
              <span className="text-2xl mb-1">🏁</span>
              <span className="text-[10px]">All systems clear. No active missions.</span>
              <span className="text-[8px] mt-1">Check Scroll of Dreams to initiate.</span>
            </div>
          ) : (
            activeQuests?.filter(q => q.status === 'active').map((quest) => {
              const isExpanded = expandedQuestId === quest.id;
              
              return (
                <motion.div 
                  key={quest.id}
                  onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
                  className={`
                    group relative overflow-hidden rounded border transition-all duration-300 cursor-pointer
                    ${isExpanded 
                      ? 'bg-pixel-gold/10 border-pixel-gold/40' 
                      : 'bg-black/40 border-gray-700 hover:border-gray-500 hover:bg-black/60'}
                  `}
                >
                  {/* Quest Item Header */}
                  <div className="p-2 flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${isExpanded ? 'bg-pixel-gold shadow-[0_0_8px_#fbbf24]' : 'bg-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold truncate ${isExpanded ? 'text-white' : 'text-gray-300'}`}>
                        {quest.title}
                      </div>
                    </div>
                    {quest.type !== 'normal' && (
                      <span className="text-[8px] px-1 bg-blue-900/50 text-blue-300 rounded border border-blue-800 uppercase">
                        {quest.type}
                      </span>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-3 pb-3 pt-0 text-[10px] text-gray-400 border-t border-white/5 mx-2 mt-1">
                          <p className="mb-3 leading-relaxed opacity-90">{quest.description || "Secure objective to claim bounty."}</p>
                          
                          <div className="flex items-center justify-between bg-black/30 p-2 rounded border border-white/5">
                            <div className="flex gap-3">
                              <span className="text-pixel-gold font-bold">+€{quest.gold}</span>
                              <span className="text-pixel-blue font-bold">+{quest.xp} XP</span>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                completeQuest(quest.id);
                                setAvatarState('excited');
                                setTimeout(() => setAvatarState('idle'), 2000);
                              }}
                              className="bg-pixel-gold/20 hover:bg-pixel-gold/30 text-pixel-gold border border-pixel-gold/50 rounded px-2 py-1 uppercase text-[9px] font-bold tracking-wider hover:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all"
                            >
                              Complete Mission
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
