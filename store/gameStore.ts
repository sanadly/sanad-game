import { create } from 'zustand';

interface GameState {
  // Vitals
  capital: number;
  intellect: number;
  sovereignty: number;

  // Time
  freedomDate: Date;
  
  // Inventory/Relics & Quests
  relics: { id: string; unlocked: boolean }[];
  activeQuests: { id: string; title: string; status: 'active' | 'completed' }[];
  
  // Actions
  addCapital: (amount: number) => void;
  addIntellect: (amount: number) => void;
  addSovereignty: (amount: number) => void;

  // Legacy/Compatibility (to satisfy build of old components)
  avatar: {
    level: number;
    appearance: {
      travelerCloak: boolean;
      aura: boolean;
      clothes: string; // 'suit' | 'casual' | etc
    };
  };
  base: {
    type: string;
    description: string;
    level: number;
  };
  
  // More Compatibility (ChatInterface)
  stats: {
    capital: number;
    intellect: number;
    sovereignty: number;
  };
  updateStat: (stat: string, amount: number) => void;
  addQuest: (quest: { id: string; title: string; description: string; xp: number; gold: number; type: string }) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  capital: 1250, // Initial dummy value
  intellect: 45, // Initial percentage or raw value
  sovereignty: 1, // Level or count

  freedomDate: new Date('2028-06-01'), // Example target date

  relics: [],
  activeQuests: [
    { id: '1', title: 'The Bureaucrat’s Maze', status: 'active' },
    { id: '2', title: 'Deep Work Sprint', status: 'active' },
  ],

  // Legacy/Compatibility defaults
  avatar: {
    level: 1,
    appearance: {
      travelerCloak: false,
      aura: false,
      clothes: 'casual',
    },
  },
  base: {
    type: 'apartment',
    description: 'A modest starting point.',
    level: 1,
  },
  
  stats: {
    capital: 1250, 
    intellect: 45, 
    sovereignty: 1
  },

  addCapital: (amount) => set((state) => ({ capital: state.capital + amount, stats: { ...state.stats, capital: state.stats.capital + amount } })),
  addIntellect: (amount) => set((state) => ({ intellect: state.intellect + amount, stats: { ...state.stats, intellect: state.stats.intellect + amount } })), 
  addSovereignty: (amount) => set((state) => ({ sovereignty: state.sovereignty + amount, stats: { ...state.stats, sovereignty: state.stats.sovereignty + amount } })),

  updateStat: (stat, amount) => set((state) => {
    // Basic mapping for legacy updateStat
    const newStats = { ...state.stats, [stat]: (state.stats as any)[stat] + amount };
    return { 
        stats: newStats,
        // Also update flattened props if they match
        // Note: strict typing might require explicit checks, employing 'any' cast for brevity in legacy compat
        ...(stat === 'capital' ? { capital: state.capital + amount } : {}),
        ...(stat === 'intellect' ? { intellect: state.intellect + amount } : {}),
        ...(stat === 'sovereignty' ? { sovereignty: state.sovereignty + amount } : {}),
    };
  }),
  
  addQuest: (quest) => set((state) => ({ 
      activeQuests: [...state.activeQuests, { id: quest.id, title: quest.title, status: 'active' }] 
  })),

  reset: () => set({
    capital: 1250,
    intellect: 45,
    sovereignty: 1,
    relics: [],
    activeQuests: [
        { id: '1', title: 'The Bureaucrat’s Maze', status: 'active' },
        { id: '2', title: 'Deep Work Sprint', status: 'active' },
    ],
    stats: {
        capital: 1250, 
        intellect: 45, 
        sovereignty: 1
    },
    avatar: {
        level: 1,
        appearance: {
          travelerCloak: false,
          aura: false,
          clothes: 'casual',
        },
    },
    base: {
        type: 'apartment',
        description: 'A modest starting point.',
        level: 1,
    },
  }),
}));
