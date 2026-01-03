import React from 'react';

export const CrtOverlay = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      
      {/* Moving Scanline Bar */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(32,32,32,0.2)_50%,transparent_100%)] opacity-10 animate-[scanline_8s_linear_infinite] pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      
      {/* Flicker effect disabled - was causing visibility issues */}
    </div>
  );
};
