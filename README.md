# TERRA NOVA: The Sovereign Architect (Pixel Edition)

A gamified life tracking application that transforms your real-world progress into a beautiful pixel-art RPG experience. You are not just tracking your life—you are building a civilization where you are the civilization.

## The Vision

Your journey from Libya to Germany is the ultimate "Origin Story." Now, you move into the "Main Quest": Absolute Sovereignty. This is a Civilization-style strategy game where you are the civilization, rendered in the cozy, nostalgic aesthetic of a 16-bit pixel RPG like Stardew Valley.

## Features

### The Six Core Stats (Vertical HUD Bars)

- **SOVEREIGNTY** 👑: German citizenship, legal status, visa progress, paperwork
  - Fills with blue German stamps and ink seals
  - Max level: Glowing Golden Eagle crown
  - Real-world trigger: Citizenship countdown & paperwork

- **CAPITAL** 💰: Savings, passive income, wealth, financial independence
  - Fills with stacking gold coins and purple gems
  - Max level: Chest that overflows with light
  - Real-world trigger: Passive income vs. monthly burn

- **INTELLECT** 👁️: Deep work, philosophy, books read, skills learned, degree progress
  - Fills with floating crystals and ancient scrolls
  - Max level: "Third Eye" icon above the bar
  - Real-world trigger: Deep work, philosophy, and degree

- **AESTHETICS** 🪞: Physical fitness, grooming, fashion, environment quality, travel
  - Fills with dumbbells and designer watches
  - Max level: "Mirror of Perfection" frame
  - Real-world trigger: Physical fitness and style upgrades

- **KINDRED** 🔥: Relationship quality, social connections, emotional health
  - Fills with pixel-hearts and glowing embers
  - Max level: "Twin Flame" icon
  - Real-world trigger: Quality time with partner/friends

- **VITALITY** 🧪: Sleep quality, mood, energy levels, stress, mental health
  - Blue "Mana" liquid that fluctuates daily
  - Max level: Full, bubbling Alchemist Potion
  - Real-world trigger: Sleep, mood, and mental energy

### The Skill Tree: The Path to Sovereignty

10 levels from "The Student" to "The Absolute Sovereign":
1. **The Student**: Graduate from university
2. **The Resident**: Achieve Permanent Residence
3. **The Graduate**: Complete your degree
4. **The Professional**: Establish stable income
5. **The Citizen**: Achieve German Citizenship
6. **The Investor**: Build passive income streams
7. **The Sovereign**: Financial independence achieved
8. **The Architect**: Master all aspects
9. **The Traveler**: Unlock global freedom
10. **The Absolute Sovereign**: Ultimate achievement

### The Navigator (Gemini AI Integration)

The Navigator is your Game Master who translates your real life into game code:

- **Vibe-to-Stat Processing**: Talk to The Navigator like a journal. Describe your week in natural language, and it automatically updates your stats.
- **Active Quest Generation**: When The Navigator detects imbalances (e.g., high INTELLECT but low AESTHETICS), it generates personalized quests.
- **Sovereignty Simulation**: Ask "show me the map in 2 years if I keep this pace" and see your projected future state with calculated independence date.

### Visual Features

- **Animated Dream Background**: Starts as a stormy, grey sea. As you progress, it clears to show distant lands (Japan, Bali, New York). When you reach "Freedom," it becomes a vibrant, sunny world map.
- **Stardew-Style Avatar**: Your avatar upgrades from a tired student in a hoodie to a confident traveler with a glowing aura and Traveler's Cloak.
- **Relic Collection**: Unlock special pixel-art relics:
  - **The Blaue Pass (Golden Edition)**: German Citizenship Passport - 190+ Countries Unlocked
  - **The Liberty Automaton**: Passive Income Exceeds Expenses
  - **The Scholar's Diploma**: Graduation from German University

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local` file

## How to Use

### Weekly Check-in with The Navigator

Open the chat interface and describe your week in natural language:

**Example:**
> "Navigator, I finished my thesis today! I feel powerful. But I spent too much money on a fancy dinner, and I haven't talked to my partner in two days."

The Navigator will:
- Increase INTELLECT (+20-30 points for thesis completion)
- Decrease CAPITAL (-50 points for overspending)
- Decrease KINDRED (social decay warning)
- Generate a quest if imbalances are detected

### Running a Sovereignty Simulation

Click the "🔮 RUN SOVEREIGNTY SIMULATION" button in The Navigator interface. Enter your:
- Monthly savings rate (€)
- Investment yield (annual %)

The Navigator will project:
- Your independence date (when passive income exceeds expenses)
- Future stat projections
- Key milestones on your path
- A vivid description of your future state (luxury pixel-villa, no "Job Mine", Golden Passport glowing)

### Completing Quests

When The Navigator detects imbalances, it generates quests. Complete them to balance your stats and unlock rewards.

### Unlocking Relics

Achieve major milestones to unlock special relics:
- **The Blaue Pass**: Reach 100 SOVEREIGNTY
- **The Liberty Automaton**: Reach 80 CAPITAL
- **The Scholar's Diploma**: Reach 60 INTELLECT

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Zustand (State Management with localStorage persistence)
- Framer Motion (Animations)
- Tailwind CSS (Pixel-art styling)
- Google Gemini API (The Navigator AI)

## Project Structure

```
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout with pixel font
│   ├── page.tsx     # Main game dashboard
│   └── globals.css   # Pixel-art styling
├── components/       # React components
│   ├── StatBar.tsx           # Vertical stat bars
│   ├── DreamBackground.tsx   # Animated background
│   ├── AvatarBase.tsx        # Avatar and base display
│   ├── RelicShelf.tsx        # Relic collection
│   ├── ChatInterface.tsx     # The Navigator chat
│   ├── SimulationModal.tsx   # Sovereignty simulation
│   ├── QuestList.tsx         # Active quests
│   ├── SkillTree.tsx         # Skill tree display
│   └── SoundEffects.tsx      # Audio feedback
├── lib/             # Utilities and API integrations
│   └── gemini.ts    # Gemini API integration
├── store/           # Zustand state management
│   └── gameStore.ts # Game state and actions
├── types/           # TypeScript type definitions
│   └── game.ts      # Game types and interfaces
└── public/          # Static assets
```

## The Gameplay Loop

1. **Live your life** in the real world (Germany, soon the world)
2. **Feed data to The Navigator** via weekly check-ins or daily notes
3. **Watch your world grow** in beautiful pixel-art animations
4. **Receive strategic guidance** from The Navigator when imbalances are detected
5. **Achieve the Endgame**: When SOVEREIGNTY reaches 100 AND CAPITAL reaches 80, you unlock "The Absolute Sovereign" status—complete freedom in all aspects of life

## License

MIT

---

**Remember**: You are not building a simple tracker. You are building a civilization where you are the civilization. Every action you take in the real world shapes your digital realm. The goal is Absolute Sovereignty—freedom to roam, wealth to sustain, and wisdom to enjoy it all.
