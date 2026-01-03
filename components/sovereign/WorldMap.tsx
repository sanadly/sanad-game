'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const WorldMap = () => {
  return (
    <div className="relative w-full h-full bg-[#2c2c54] overflow-hidden perspective-1000 group">
      {/* Background Layers (Parallax) */}
      <div className="absolute inset-0 pointer-events-none">
      {/* Background Layers (Parallax) */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Distant Layer: Libyan Roots (Desert Gradient) */}
         <div className="absolute bottom-10 left-0 w-full h-48 opacity-30 bg-gradient-to-t from-orange-900 via-orange-500/20 to-transparent" />
         
         {/* Middle Layer: German Reality (Urban Skyline Silhouette) */}
         <div className="absolute bottom-0 left-0 w-full h-32 opacity-40 bg-gradient-to-t from-blue-900 via-indigo-900/40 to-transparent" />
         {/* Simple CSS Cityscape Placeholder */}
         <div className="absolute bottom-0 left-0 w-full h-16 bg-[length:50px_100%] bg-[linear-gradient(to_bottom,transparent_20%,#1a1a2e_20%),linear-gradient(to_right,#1a1a2e_5px,transparent_5px)] opacity-50" />
      </div>
      </div>

      {/* Isometric Grid Container */}
      <div className="absolute inset-x-0 bottom-[-100px] h-[600px] w-[800px] mx-auto transform rotate-x-60 rotate-z-45 bg-[#3a3a6a] border-4 border-white/10 shadow-2xl rounded-[40px]">
        {/* Floor Grid Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />

        {/* The Avatar */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-16 h-16 bg-red-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          {/* Avatar Sprite Placeholder */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-32 bg-gray-300 rounded-t-lg border-2 border-black flex items-center justify-center text-[10px] text-black font-bold">
            YOU
          </div>
        </motion.div>

        {/* Desk Object */}
        <div className="absolute top-1/3 left-1/3 w-32 h-20 bg-amber-800 border-2 border-black transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
           <div className="absolute -top-4 left-2 w-8 h-4 bg-white/80" /> {/* Papers */}
        </div>
      </div>

      {/* Relic Shelf (Overlay at bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4 bg-black/50 p-2 rounded-xl border border-white/20 backdrop-blur-sm">
        <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded bg-black/40 flex items-center justify-center hover:border-pixel-gold transition-colors cursor-pointer" title="Scholar's Cap (Locked)">🔒</div>
        <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded bg-black/40 flex items-center justify-center hover:border-pixel-gold transition-colors cursor-pointer" title="Golden Eagle (Locked)">🔒</div>
        <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded bg-black/40 flex items-center justify-center hover:border-pixel-gold transition-colors cursor-pointer" title="Passive Flow (Locked)">🔒</div>
      </div>
    </div>
  );
};
