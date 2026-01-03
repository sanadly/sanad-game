# Terra Nova Styling Guide

## Design System

### Colors
- **Background**: `--pixel-bg: #0a0a1a` (Dark navy)
- **Dark**: `--pixel-dark: #050510` (Almost black)
- **Accent**: `--pixel-accent: #00ff88` (Neon green)
- **Gold**: `--pixel-gold: #ffd700` (Golden yellow)
- **Blue**: `--pixel-blue: #4a9eff` (Bright blue)
- **Red**: `--pixel-red: #ff6b6b` (Coral red)
- **Purple**: `--pixel-purple: #a855f7` (Vibrant purple)
- **Orange**: `--pixel-orange: #ff8c42` (Warm orange)
- **Cyan**: `--pixel-cyan: #00d4ff` (Bright cyan)
- **Pink**: `--pixel-pink: #ff6b9d` (Hot pink)

### Typography
- **Primary Font**: 'Press Start 2P' (Pixel font)
- **Fallback**: 'Courier New', monospace
- **Text Shadow**: `2px 2px 0px rgba(0, 0, 0, 0.8)`
- **Letter Spacing**: `1px` for headings

### Components

#### Pixel Border
- 3px solid white border
- Inset shadows for depth
- Outer shadows for elevation
- Gradient background overlay

#### Pixel Button
- Gradient background (accent color)
- Hover: Lift effect with enhanced shadow
- Active: Pressed effect
- Shine animation on hover

#### Pixel Card
- Dark gradient background
- Pixel border styling
- Top accent line
- Padding: 20px

#### Icons
- Use Icon component from `/components/Icon.tsx`
- Falls back to emoji if image not available
- Size: 32px default, customizable
- Pixel-perfect rendering

## Icon Generation with Nano Banana

### Process
1. Go to [Nano Banana](https://nanobanana.ai)
2. Use prompts from `/lib/icons.ts` → `nanoBananaPrompts`
3. Generate 64x64 pixel images
4. Save with exact filenames from `iconPaths`
5. Place in `/public/icons/` directory

### Style Requirements
- 16-bit pixel art style
- Clean, transparent backgrounds
- Vibrant, retro game colors
- 64x64 pixels
- Match Terra Nova aesthetic

## Spacing System
- Small: 4px (gap-1)
- Medium: 8px (gap-2)
- Large: 16px (gap-4)
- XLarge: 24px (gap-6)
- XXLarge: 32px (gap-8)

## Effects

### Glow Effects
- `.pixel-glow`: Pulsing brightness
- `.text-glow`: Text with glow shadow
- `.glow-pulse`: Pulsing box shadow

### Animations
- Fill bars: Smooth height transition
- Lightning: Flashing effect
- Overflow: Sparkle animation
- Screen shake: Relic unlock effect

## Responsive Design
- Mobile: Smaller fonts, adjusted padding
- Tablet: 2-column layouts
- Desktop: Full layout with all features

## Best Practices
1. Always use pixel-border for containers
2. Use Icon component instead of emoji when possible
3. Apply text-pixel class for pixel font
4. Use gradient backgrounds for depth
5. Add glow effects for important elements
6. Maintain consistent spacing
7. Use motion animations for interactions

