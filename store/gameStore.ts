import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, SAMPLE_TASKS, TaskCategory } from '@/types/tasks';
import { 
  saveGameState, 
  saveTasks, 
  saveQuests, 
  saveRelics,
  loadGameState,
  loadTasks,
  loadQuests,
  loadRelics,
  isFirebaseConfigured 
} from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

// Debounce helper for Firebase sync
let syncTimeout: NodeJS.Timeout | null = null;
const debouncedFirebaseSync = (syncFn: () => void, delay = 1000) => {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncFn, delay);
};

// Reward multipliers by category
const CATEGORY_REWARDS: Record<TaskCategory, { capital: number; intellect: number; sovereignty: number }> = {
  work: { capital: 50, intellect: 5, sovereignty: 0 },
  admin: { capital: 10, intellect: 0, sovereignty: 5 },
  study: { capital: 0, intellect: 20, sovereignty: 0 },
  health: { capital: 0, intellect: 5, sovereignty: 10 },
  personal: { capital: 5, intellect: 5, sovereignty: 5 },
  other: { capital: 5, intellect: 5, sovereignty: 0 },
};

interface GameState {
  // Vitals
  capital: number;
  intellect: number;
  sovereignty: number;

  // Time
  freedomDate: Date;
  
  // Tasks (from Structured or manual)
  tasks: Task[];
  importTasks: (tasks: Task[]) => void;
  toggleTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  
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
  
  // Firebase sync
  syncToFirebase: () => void;
  hydrateFromFirebase: () => Promise<void>;
  isHydrated: boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  capital: 1250, // Initial dummy value
  intellect: 45, // Initial percentage or raw value
  sovereignty: 1, // Level or count

  freedomDate: new Date('2028-06-01'), // Example target date
  isHydrated: false,

  // Tasks from Structured or manual entry
  tasks: SAMPLE_TASKS,
  
  importTasks: (newTasks) => set((state) => ({
    tasks: [...state.tasks, ...newTasks]
  })),
  
  toggleTask: (taskId) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};
    
    const wasCompleted = task.isCompleted;
    const rewards = CATEGORY_REWARDS[task.category];
    
    // If marking complete, add rewards. If unchecking, remove them.
    const multiplier = wasCompleted ? -1 : 1;
    
    return {
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
      capital: state.capital + (rewards.capital * multiplier),
      intellect: state.intellect + (rewards.intellect * multiplier),
      sovereignty: state.sovereignty + (rewards.sovereignty * multiplier),
      stats: {
        capital: state.stats.capital + (rewards.capital * multiplier),
        intellect: state.stats.intellect + (rewards.intellect * multiplier),
        sovereignty: state.stats.sovereignty + (rewards.sovereignty * multiplier),
      }
    };
  }),
  
  clearCompletedTasks: () => set((state) => ({
    tasks: state.tasks.filter(t => !t.isCompleted)
  })),

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
    tasks: SAMPLE_TASKS,
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

  // Firebase sync - debounced to avoid too many writes
  syncToFirebase: () => {
    const state = get();
    debouncedFirebaseSync(() => {
      if (isFirebaseConfigured()) {
        // Sync game state
        saveGameState({
          capital: state.capital,
          intellect: state.intellect,
          sovereignty: state.sovereignty,
          freedomDate: Timestamp.fromDate(state.freedomDate),
          avatar: state.avatar,
          base: state.base,
        });
        // Sync tasks
        saveTasks(state.tasks);
        // Sync quests
        saveQuests(state.activeQuests);
        // Sync relics
        saveRelics(state.relics);
        console.log('🔥 Synced to Firebase');
      }
    });
  },

  // Load from Firebase on app start
  hydrateFromFirebase: async () => {
    if (!isFirebaseConfigured()) {
      set({ isHydrated: true });
      return;
    }

    try {
      const [gameState, tasks, quests, relics] = await Promise.all([
        loadGameState(),
        loadTasks(),
        loadQuests(),
        loadRelics(),
      ]);

      const updates: Partial<GameState> = { isHydrated: true };

      if (gameState) {
        updates.capital = gameState.capital;
        updates.intellect = gameState.intellect;
        updates.sovereignty = gameState.sovereignty;
        updates.freedomDate = gameState.freedomDate?.toDate?.() || new Date('2028-06-01');
        updates.avatar = gameState.avatar;
        updates.base = gameState.base;
        updates.stats = {
          capital: gameState.capital,
          intellect: gameState.intellect,
          sovereignty: gameState.sovereignty,
        };
      }

      if (tasks && tasks.length > 0) {
        updates.tasks = tasks;
      }

      if (quests && quests.length > 0) {
        updates.activeQuests = quests.map(q => ({ ...q, status: q.status as 'active' | 'completed' }));
      }

      if (relics && relics.length > 0) {
        updates.relics = relics;
      }

      set(updates as Partial<GameState>);
      console.log('🔥 Hydrated from Firebase');
    } catch (error) {
      console.error('Error hydrating from Firebase:', error);
      set({ isHydrated: true });
    }
  },
}));

// Auto-sync to Firebase on state changes (subscribe outside the store)
if (typeof window !== 'undefined') {
  useGameStore.subscribe((state, prevState) => {
    // Only sync if hydrated and state actually changed
    if (state.isHydrated && (
      state.capital !== prevState.capital ||
      state.intellect !== prevState.intellect ||
      state.sovereignty !== prevState.sovereignty ||
      state.tasks !== prevState.tasks ||
      state.activeQuests !== prevState.activeQuests ||
      state.relics !== prevState.relics
    )) {
      state.syncToFirebase();
    }
  });
}
