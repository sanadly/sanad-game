#!/usr/bin/env node

/**
 * Icon Verification Script
 * 
 * Verifies that all required icons exist in the /public/icons/ directory
 * Run with: node scripts/verify-icons.js
 */

const fs = require('fs');
const path = require('path');

const iconPaths = {
  // Stat Icons
  sovereignty: 'sovereignty.png',
  capital: 'capital.png',
  intellect: 'intellect.png',
  aesthetics: 'aesthetics.png',
  kindred: 'kindred.png',
  vitality: 'vitality.png',
  
  // Relic Icons
  blauePass: 'blaue-pass.png',
  libertyAutomaton: 'liberty-automaton.png',
  scholarsDiploma: 'scholars-diploma.png',
  locked: 'locked.png',
  
  // Quest Icons
  quest: 'quest.png',
  bossFight: 'boss-fight.png',
  debuff: 'debuff.png',
  completed: 'completed.png',
  
  // UI Icons
  avatar: 'avatar.png',
  base: 'base.png',
  skillTree: 'skill-tree.png',
  simulation: 'simulation.png',
  chat: 'chat.png',
  
  // Status Icons
  levelUp: 'level-up.png',
  achievement: 'achievement.png',
  warning: 'warning.png',
  success: 'success.png',
};

const iconsDir = path.join(process.cwd(), 'public', 'icons');
const totalIcons = Object.keys(iconPaths).length;

console.log('🔍 Verifying Terra Nova Icons...\n');
console.log(`Expected icons: ${totalIcons}\n`);

let found = 0;
let missing = [];

Object.entries(iconPaths).forEach(([key, filename]) => {
  const filePath = path.join(iconsDir, filename);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${filename.padEnd(25)} (${(stats.size / 1024).toFixed(2)} KB)`);
    found++;
  } else {
    console.log(`❌ ${filename.padEnd(25)} MISSING`);
    missing.push(filename);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Summary: ${found}/${totalIcons} icons found (${Math.round((found/totalIcons)*100)}%)`);

if (missing.length > 0) {
  console.log(`\n⚠️  Missing icons (${missing.length}):`);
  missing.forEach(icon => console.log(`   - ${icon}`));
  console.log('\n💡 These icons will use emoji fallbacks until generated.');
} else {
  console.log('\n🎉 All icons are present!');
}

console.log('\n✨ Icon verification complete!\n');

