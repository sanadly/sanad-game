/**
 * Icon System for Terra Nova
 * 
 * Icons should be generated using Nano Banana with the following prompt style:
 * "16-bit pixel art icon of [description], retro game style, clean background, 64x64 pixels"
 * 
 * Place generated images in /public/icons/ directory
 */

export const iconPaths = {
  // Stat Icons
  sovereignty: '/icons/sovereignty.png',
  capital: '/icons/capital.png',
  intellect: '/icons/intellect.png',
  aesthetics: '/icons/aesthetics.png',
  kindred: '/icons/kindred.png',
  vitality: '/icons/vitality.png',
  
  // Relic Icons
  blauePass: '/icons/blaue-pass.png',
  libertyAutomaton: '/icons/liberty-automaton.png',
  scholarsDiploma: '/icons/scholars-diploma.png',
  locked: '/icons/locked.png',
  
  // Quest Icons
  quest: '/icons/quest.png',
  bossFight: '/icons/boss-fight.png',
  debuff: '/icons/debuff.png',
  completed: '/icons/completed.png',
  
  // UI Icons
  avatar: '/icons/avatar.png',
  base: '/icons/base.png',
  skillTree: '/icons/skill-tree.png',
  simulation: '/icons/simulation.png',
  chat: '/icons/chat.png',
  
  // Status Icons
  levelUp: '/icons/level-up.png',
  achievement: '/icons/achievement.png',
  warning: '/icons/warning.png',
  success: '/icons/success.png',
  error: '/icons/error.png',
  info: '/icons/info.png',
};

/**
 * Fallback emoji icons if images are not available
 */
export const iconFallbacks = {
  sovereignty: '👑',
  capital: '💰',
  intellect: '👁️',
  aesthetics: '🪞',
  kindred: '🔥',
  vitality: '🧪',
  blauePass: '📘',
  libertyAutomaton: '🤖',
  scholarsDiploma: '📜',
  locked: '🔒',
  quest: '⚔️',
  bossFight: '⚔️',
  debuff: '🏠',
  completed: '✓',
  avatar: '👤',
  base: '🏠',
  skillTree: '🌳',
  simulation: '🔮',
  chat: '💬',
  levelUp: '⬆️',
  achievement: '🏆',
  warning: '⚠️',
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

/**
 * Get icon with fallback
 */
export function getIcon(key: keyof typeof iconPaths, size: number = 32): string {
  // In production, check if image exists, otherwise use fallback
  // For now, we'll use a hybrid approach - try image, fallback to emoji
  return iconPaths[key] || iconFallbacks[key];
}

/**
 * Icon component props
 */
export interface IconProps {
  name: keyof typeof iconPaths;
  size?: number;
  className?: string;
  fallback?: string;
}

/**
 * Generate Nano Banana prompts for all icons
 */
export const nanoBananaPrompts = {
  sovereignty: '16-bit pixel art icon of a golden crown with German eagle, retro game style, clean background, 64x64 pixels, vibrant colors',
  capital: '16-bit pixel art icon of a treasure chest overflowing with gold coins and gems, retro game style, clean background, 64x64 pixels, vibrant colors',
  intellect: '16-bit pixel art icon of a glowing third eye with lightning, retro game style, clean background, 64x64 pixels, vibrant colors',
  aesthetics: '16-bit pixel art icon of a mirror with perfect reflection, retro game style, clean background, 64x64 pixels, vibrant colors',
  kindred: '16-bit pixel art icon of two connected hearts with flames, retro game style, clean background, 64x64 pixels, vibrant colors',
  vitality: '16-bit pixel art icon of a bubbling alchemist potion bottle, retro game style, clean background, 64x64 pixels, vibrant colors',
  blauePass: '16-bit pixel art icon of a German passport with golden cover, retro game style, clean background, 64x64 pixels, vibrant colors',
  libertyAutomaton: '16-bit pixel art icon of a clockwork robot with gears, retro game style, clean background, 64x64 pixels, vibrant colors',
  scholarsDiploma: '16-bit pixel art icon of a scroll tied with red ribbon, retro game style, clean background, 64x64 pixels, vibrant colors',
  locked: '16-bit pixel art icon of a padlock, retro game style, clean background, 64x64 pixels, dark colors',
  quest: '16-bit pixel art icon of a crossed swords, retro game style, clean background, 64x64 pixels, vibrant colors',
  bossFight: '16-bit pixel art icon of a boss battle symbol with exclamation mark, retro game style, clean background, 64x64 pixels, red and gold colors',
  debuff: '16-bit pixel art icon of a home with sad face, retro game style, clean background, 64x64 pixels, orange colors',
  completed: '16-bit pixel art icon of a checkmark in circle, retro game style, clean background, 64x64 pixels, green colors',
  avatar: '16-bit pixel art icon of a pixel character, retro game style, clean background, 64x64 pixels, vibrant colors',
  base: '16-bit pixel art icon of a house, retro game style, clean background, 64x64 pixels, vibrant colors',
  skillTree: '16-bit pixel art icon of a skill tree with branches, retro game style, clean background, 64x64 pixels, vibrant colors',
  simulation: '16-bit pixel art icon of a crystal ball with stars, retro game style, clean background, 64x64 pixels, purple colors',
  chat: '16-bit pixel art icon of a speech bubble, retro game style, clean background, 64x64 pixels, vibrant colors',
  levelUp: '16-bit pixel art icon of an upward arrow with stars, retro game style, clean background, 64x64 pixels, gold colors',
  achievement: '16-bit pixel art icon of a trophy, retro game style, clean background, 64x64 pixels, gold colors',
  warning: '16-bit pixel art icon of an exclamation mark in triangle, retro game style, clean background, 64x64 pixels, yellow colors',
  success: '16-bit pixel art icon of a checkmark, retro game style, clean background, 64x64 pixels, green colors',
  error: '16-bit pixel art icon of an X mark in circle, retro game style, clean background, 64x64 pixels, red colors',
  info: '16-bit pixel art icon of an information symbol, retro game style, clean background, 64x64 pixels, blue colors',
};

