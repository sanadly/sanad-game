import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { parseUserInput } from '@/lib/deepseek';
import { ChatMessage, StatType } from '@/types/game';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandCenter = () => {
  const { stats, updateStat, addQuest, activeQuests, completeQuest } = useGameStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Track expanded quest for details
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

    try {
      const currentStats: Record<StatType, { value: number; max: number }> = {
        SOVEREIGNTY: { value: stats.sovereignty, max: 100 },
        CAPITAL: { value: stats.capital, max: 10000 },
        INTELLECT: { value: stats.intellect, max: 100 },
        AESTHETICS: { value: 0, max: 100 },
        KINDRED: { value: 0, max: 100 },
        VITALITY: { value: 0, max: 100 },
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
      }

      const navigatorMessage: ChatMessage = {
        id: `navigator-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, navigatorMessage]);
    } catch (error) {
      console.error('Failed to get Navigator response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-pixel-dark border-l-4 border-gray-800 p-4 flex flex-col font-pixel">
      {/* Navigator Chat */}
      <div className="flex-1 min-h-0 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 mb-4 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full bg-gray-800 text-[10px] text-center text-gray-400 py-1 border-b border-gray-700 z-10">
          NAVIGATOR UPLINK v2.6
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto mt-6 mb-2 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
           {messages.length === 0 && (
             <div className="flex flex-col space-y-1">
               <span className="text-pixel-blue text-xs ml-1">SYSTEM</span>
               <div className="bg-pixel-blue/10 text-blue-200 text-xs p-2 rounded border border-pixel-blue/30 max-w-[90%]">
                 Welcome back, Sovereign. Adjusting Reality Parameters...
               </div>
             </div>
           )}
           
           {messages.map((msg, i) => (
             <div key={msg.id || i} className={`flex flex-col space-y-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
               <span className={`${msg.role === 'user' ? 'text-pixel-gold mr-1' : 'text-pixel-blue ml-1'} text-[10px]`}>
                 {msg.role === 'user' ? 'YOU' : 'NAVIGATOR'}
               </span>
               <div className={`${
                 msg.role === 'user' 
                   ? 'bg-pixel-gold/10 text-yellow-200 border-pixel-gold/30' 
                   : 'bg-pixel-blue/10 text-blue-200 border-pixel-blue/30'
                 } text-xs p-2 rounded border max-w-[90%]`}>
                 {msg.content}
               </div>
             </div>
           ))}

           {isLoading && (
             <div className="flex flex-col space-y-1">
                <span className="text-pixel-blue text-xs ml-1">NAVIGATOR</span>
                <div className="bg-pixel-blue/5 text-blue-400 text-xs p-2 rounded border border-pixel-blue/20 max-w-[90%] animate-pulse">
                  Processing Uplink...
                </div>
             </div>
           )}
        </div>

        {/* Vision/Input Area */}
        <div className="mt-auto flex items-center space-x-2 border-t border-gray-700 pt-2 z-10 bg-gray-900">
           <button 
             className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-400 hover:text-white transition-colors" 
             title="Upload Vision Data"
             disabled={isLoading}
           >
             📷
           </button>
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             disabled={isLoading}
             className="flex-1 bg-black border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-pixel-accent font-mono disabled:opacity-50"
             placeholder={isLoading ? "Analyzing..." : "Enter command..."}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           />
        </div>
      </div>

      {/* Quest Log */}
      <div className="h-1/3 bg-gray-900 border-2 border-gray-700 p-3 rounded-lg overflow-hidden flex flex-col">
        <div className="text-xs text-pixel-gold mb-2 border-b border-gray-700 pb-1 flex justify-between items-center">
            <span>ACTIVE QUESTS</span>
            <span className="text-[10px] text-gray-500">{activeQuests?.filter(q => q.status === 'active').length || 0} PENDING</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-600">
          {activeQuests && activeQuests.filter(q => q.status === 'active').map((quest) => {
            const isExpanded = expandedQuestId === quest.id;
            
            return (
                <div 
                    key={quest.id} 
                    className={`
                        rounded border transition-all duration-200 cursor-pointer overflow-hidden
                        ${isExpanded ? 'bg-white/10 border-pixel-accent' : 'bg-transparent border-transparent hover:bg-white/5'}
                    `}
                    onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
                >
                  <div className="flex items-center space-x-2 p-2">
                    <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-pixel-accent' : 'bg-pixel-accent/50 animate-pulse'}`} />
                    <div className={`text-xs flex-1 ${isExpanded ? 'text-white font-bold' : 'text-gray-300'}`}>
                        {quest.title}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/20"
                        >
                            <div className="p-2 pt-0 text-[10px] text-gray-400 border-t border-white/5 mx-2 mt-1">
                                <p className="mb-2 leading-relaxed">{quest.description || "No tactical data available."}</p>
                                
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-2">
                                        <span className="text-pixel-gold">+{quest.gold} Gold</span>
                                        <span className="text-pixel-blue">+{quest.xp} XP</span>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            completeQuest(quest.id);
                                        }}
                                        className="bg-pixel-accent/20 hover:bg-pixel-accent/40 text-pixel-accent border border-pixel-accent/50 rounded px-2 py-1 uppercase tracking-wider font-bold transition-colors"
                                    >
                                        Complete Mission
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            );
          })}
          
          {(!activeQuests || activeQuests.filter(q => q.status === 'active').length === 0) && (
            <div className="text-[10px] text-gray-600 italic text-center py-4">No active missions.</div>
          )}
        </div>
      </div>
    </div>
  );
};
