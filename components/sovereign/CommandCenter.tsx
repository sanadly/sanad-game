'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export const CommandCenter = () => {
  const { activeQuests } = useGameStore();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    // Placeholder for Gemini integration
    console.log('User sent:', input);
    setInput('');
  };

  return (
    <div className="h-full bg-pixel-dark border-l-4 border-gray-800 p-4 flex flex-col font-pixel">
      {/* Navigator Chat */}
      <div className="flex-1 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 mb-4 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full bg-gray-800 text-[10px] text-center text-gray-400 py-1 border-b border-gray-700">
          NAVIGATOR UPLINK v2.6
        </div>
        
        <div className="flex-1 overflow-y-auto mt-6 mb-2 space-y-3">
           <div className="flex flex-col space-y-1">
             <span className="text-pixel-blue text-xs ml-1">SYSTEM</span>
             <div className="bg-pixel-blue/10 text-blue-200 text-xs p-2 rounded border border-pixel-blue/30 max-w-[90%]">
               Welcome back, Sovereign. Adjusting Reality Parameters...
             </div>
           </div>
           {/* Example User Message */}
           {/* <div className="flex flex-col space-y-1 items-end">
             <span className="text-pixel-gold text-xs mr-1">YOU</span>
             <div className="bg-pixel-gold/10 text-yellow-200 text-xs p-2 rounded border border-pixel-gold/30 max-w-[90%]">
               Upload tax documents.
             </div>
           </div> */}
        </div>

        {/* Vision/Input Area */}
        <div className="mt-auto flex items-center space-x-2 border-t border-gray-700 pt-2">
           <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-400 hover:text-white transition-colors" title="Upload Vision Data">
             📷
           </button>
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 bg-black border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-pixel-accent font-mono"
             placeholder="Enter command..."
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           />
        </div>
      </div>

      {/* Quest Log */}
      <div className="h-1/3 bg-gray-900 border-2 border-gray-700 p-3 rounded-lg overflow-y-auto">
        <div className="text-xs text-pixel-gold mb-2 border-b border-gray-700 pb-1 sticky top-0 bg-gray-900">ACTIVE QUESTS</div>
        <div className="space-y-2">
          {activeQuests.map((quest) => (
            <div key={quest.id} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded cursor-pointer group">
              <div className="w-2 h-2 bg-pixel-accent rounded-full animate-pulse" />
              <div className="text-xs text-gray-300 group-hover:text-white">{quest.title}</div>
            </div>
          ))}
          {activeQuests.length === 0 && (
            <div className="text-[10px] text-gray-600 italic">No active quests.</div>
          )}
        </div>
      </div>
    </div>
  );
};
