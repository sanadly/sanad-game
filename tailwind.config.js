/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        pixel: {
          bg: '#1a1a2e',
          dark: '#0f0f1e',
          accent: '#00ff88',
          gold: '#ffd700',
          blue: '#4a9eff',
          red: '#ff6b6b',
          purple: '#a855f7',
          // Liquid Assets
          'liquid-gold': '#FFD700',
          'liquid-blue': '#00BFFF', // Knowledge Mana
          'liquid-seal': '#1E90FF', // Passport Seals
        },
      },
      boxShadow: {
        'pixel-chunky': '4px 4px 0px 0px rgba(0,0,0,0.5)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}

