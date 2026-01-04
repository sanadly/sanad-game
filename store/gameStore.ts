'use client';

import { create } from 'zustand';
import { Task, SAMPLE_TASKS, TaskCategory } from '@/types/tasks';
import { 
  saveGameState, 
  saveTasks, 
  saveQuests, 
  saveRelics,
  saveBucketList,
  loadGameState,
  loadTasks,
  loadQuests,
  loadRelics,
  loadBucketList,
  isFirebaseConfigured 
} from '@/lib/firestore';
import { BucketListItem, StatType, Relic } from '@/types/game';
import { generatePixelArtIcon } from '@/lib/image-generation';
import { Timestamp } from 'firebase/firestore';

// Debounce helper for Firebase sync
let syncTimeout: NodeJS.Timeout | null = null;
const debouncedFirebaseSync = (syncFn: () => void, delay = 1000) => {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncFn, delay);
};

// Reward multipliers by category - now includes all 6 stats
const CATEGORY_REWARDS: Record<TaskCategory, Partial<Record<Lowercase<StatType>, number>>> = {
  work: { capital: 50, intellect: 5 },
  admin: { capital: 10, sovereignty: 5 },
  study: { intellect: 20, capital: 5 },
  health: { vitality: 15, sovereignty: 5 },
  personal: { kindred: 10, aesthetics: 5 },
  other: { capital: 5, intellect: 5 },
};

// All stat types in lowercase for easier manipulation
type LowercaseStatType = 'capital' | 'sovereignty' | 'aesthetics' | 'intellect' | 'kindred' | 'vitality';

// Default initial values and max for each stat
const STAT_DEFAULTS: Record<LowercaseStatType, { initial: number; max: number }> = {
  capital: { initial: 1250, max: 10000 },
  sovereignty: { initial: 1, max: 100 },
  aesthetics: { initial: 50, max: 100 },
  intellect: { initial: 45, max: 100 },
  kindred: { initial: 30, max: 100 },
  vitality: { initial: 70, max: 100 },
};

// Milestone relic rewards
const MILESTONE_RELICS: Relic[] = [
  { id: 'relic-capital-1000', name: 'Golden Coffer', description: 'A chest overflowing with gold coins.', unlocked: false, unlockedByStat: 'CAPITAL', requiredValue: 1000 },
  { id: 'relic-capital-5000', name: 'Merchant\'s Signet', description: 'A ring worn by the wealthiest merchants.', unlocked: false, unlockedByStat: 'CAPITAL', requiredValue: 5000 },
  { id: 'relic-sovereignty-25', name: 'Blue Seal of Authority', description: 'An official seal from the bureaucracy.', unlocked: false, unlockedByStat: 'SOVEREIGNTY', requiredValue: 25 },
  { id: 'relic-sovereignty-50', name: 'German Eagle Crest', description: 'The mark of true sovereignty.', unlocked: false, unlockedByStat: 'SOVEREIGNTY', requiredValue: 50 },
  { id: 'relic-aesthetics-75', name: 'Magic Mirror', description: 'Shows only the most refined reflection.', unlocked: false, unlockedByStat: 'AESTHETICS', requiredValue: 75 },
  { id: 'relic-intellect-60', name: 'Scholar\'s Quill', description: 'A quill that writes with wisdom.', unlocked: false, unlockedByStat: 'INTELLECT', requiredValue: 60 },
  { id: 'relic-intellect-90', name: 'Tome of Knowledge', description: 'Contains the secrets of the ancients.', unlocked: false, unlockedByStat: 'INTELLECT', requiredValue: 90 },
  { id: 'relic-kindred-50', name: 'Heart Locket', description: 'Holds the bonds of true friendship.', unlocked: false, unlockedByStat: 'KINDRED', requiredValue: 50 },
  { id: 'relic-vitality-80', name: 'Elixir of Life', description: 'Bubbling with pure vitality.', unlocked: false, unlockedByStat: 'VITALITY', requiredValue: 80 },
];

interface AllStats {
  capital: number;
  sovereignty: number;
  aesthetics: number;
  intellect: number;
  kindred: number;
  vitality: number;
}

interface Milestones {
  capital?: number;
  sovereignty?: number;
  aesthetics?: number;
  intellect?: number;
  kindred?: number;
  vitality?: number;
}

interface GameState {
  // All 6 vitals as individual properties
  capital: number;
  sovereignty: number;
  aesthetics: number;
  intellect: number;
  kindred: number;
  vitality: number;

  // Milestones (Golden Arrow targets)
  milestones: Milestones;
  setMilestone: (stat: LowercaseStatType, target: number) => void;
  checkMilestones: () => { stat: LowercaseStatType; relic: Relic } | null;

  // Time
  freedomDate: Date;
  
  // Tasks (from Structured or manual)
  tasks: Task[];
  importTasks: (tasks: Task[]) => void;
  toggleTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  
  // Inventory/Relics & Quests
  relics: Relic[];
  unlockRelic: (relicId: string) => void;
  activeQuests: { 
    id: string; 
    title: string; 
    description?: string;
    xp: number;
    gold: number;
    type: string;
    status: 'active' | 'completed';
  }[];
  completeQuest: (questId: string) => void;

  // Bucket List
  bucketList: BucketListItem[];
  addDream: (title: string, description: string) => Promise<void>;
  toggleDream: (id: string) => void;
  removeDream: (id: string) => void;
  
  // Travel Hub
  visitedCountries: string[];
  travelDreams: { id: string; destination: string; estimatedCost: number; fundedAmount: number; priority: 'high' | 'medium' | 'low' }[];
  logVisit: (countryCode: string) => void;
  addTravelDream: (destination: string, estimatedCost: number, priority: 'high' | 'medium' | 'low') => void;
  
  // Actions for each stat
  addCapital: (amount: number) => void;
  addSovereignty: (amount: number) => void;
  addAesthetics: (amount: number) => void;
  addIntellect: (amount: number) => void;
  addKindred: (amount: number) => void;
  addVitality: (amount: number) => void;
  
  // Generic stat update
  updateStat: (stat: string, amount: number) => void;

  // Character systems
  avatar: {
    level: number;
    appearance: {
      travelerCloak: boolean;
      aura: boolean;
      clothes: string;
      surgeryComplete?: boolean;
    };
  };
  base: {
    type: string;
    description: string;
    level: number;
    items: string[];
    hasPet: boolean;
  };
  
  // Legacy compatibility
  stats: AllStats;
  
  // Quest management
  addQuest: (quest: { id: string; title: string; description: string; xp: number; gold: number; type: string }) => void;
  reset: () => void;
  
  // Firebase sync
  syncToFirebase: () => void;
  hydrateFromFirebase: () => Promise<void>;
  isHydrated: boolean;

  // Level up notification state
  pendingLevelUp: { stat: LowercaseStatType; relic: Relic } | null;
  clearPendingLevelUp: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initialize all 6 stats
  capital: STAT_DEFAULTS.capital.initial,
  sovereignty: STAT_DEFAULTS.sovereignty.initial,
  aesthetics: STAT_DEFAULTS.aesthetics.initial,
  intellect: STAT_DEFAULTS.intellect.initial,
  kindred: STAT_DEFAULTS.kindred.initial,
  vitality: STAT_DEFAULTS.vitality.initial,

  // Milestones
  milestones: {},
  
  setMilestone: (stat, target) => set((state) => ({
    milestones: { ...state.milestones, [stat]: target }
  })),

  checkMilestones: () => {
    const state = get();
    
    for (const relic of MILESTONE_RELICS) {
      if (relic.unlocked) continue;
      if (!relic.unlockedByStat || !relic.requiredValue) continue;
      
      const statKey = relic.unlockedByStat.toLowerCase() as LowercaseStatType;
      const currentValue = state[statKey];
      
      if (currentValue >= relic.requiredValue) {
        // Check if we have a milestone set for this stat
        const milestone = state.milestones[statKey];
        if (milestone && currentValue >= milestone) {
          return { stat: statKey, relic };
        }
        // Also trigger if no milestone but we hit a relic threshold
        if (!milestone) {
          return { stat: statKey, relic };
        }
      }
    }
    return null;
  },

  freedomDate: new Date('2028-06-01'),
  isHydrated: false,

  // Tasks
  tasks: SAMPLE_TASKS,
  
  importTasks: (newTasks) => set((state) => ({
    tasks: [...state.tasks, ...newTasks]
  })),
  
  toggleTask: (taskId) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};
    
    const wasCompleted = task.isCompleted;
    const rewards = CATEGORY_REWARDS[task.category] || {};
    const multiplier = wasCompleted ? -1 : 1;
    
    const updates: Partial<GameState> = {
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    };
    
    // Apply rewards to each stat
    const statKeys: LowercaseStatType[] = ['capital', 'sovereignty', 'aesthetics', 'intellect', 'kindred', 'vitality'];
    const newStats = { ...state.stats };
    
    for (const key of statKeys) {
      const reward = rewards[key] || 0;
      if (reward !== 0) {
        (updates as any)[key] = state[key] + (reward * multiplier);
        newStats[key] = state.stats[key] + (reward * multiplier);
      }
    }
    
    updates.stats = newStats;
    return updates;
  }),
  
  clearCompletedTasks: () => set((state) => ({
    tasks: state.tasks.filter(t => !t.isCompleted)
  })),

  // Relics with milestone unlock capability
  relics: MILESTONE_RELICS,
  
  unlockRelic: (relicId) => set((state) => ({
    relics: state.relics.map(r => 
      r.id === relicId ? { ...r, unlocked: true, unlockedAt: new Date() } : r
    )
  })),

  activeQuests: [
    { 
      id: '1', 
      title: 'The Bureaucrat\'s Maze', 
      description: 'Navigate the complex web of administrative tasks to establish your sovereignty.',
      xp: 100,
      gold: 50,
      type: 'main',
      status: 'active' 
    },
    { 
      id: '2', 
      title: 'Deep Work Sprint', 
      description: 'Complete 3 tasks in the "Work" category to boost your productivity.',
      xp: 50,
      gold: 25,
      type: 'daily',
      status: 'active' 
    },
  ],
  
  completeQuest: (questId) => set((state) => {
    const quest = state.activeQuests.find(q => q.id === questId);
    if (!quest || quest.status === 'completed') return {};
    
    return {
      activeQuests: state.activeQuests.map(q => 
        q.id === questId ? { ...q, status: 'completed' } : q
      ),
      capital: state.capital + quest.gold,
      stats: { ...state.stats, capital: state.stats.capital + quest.gold }
    };
  }),

  // Bucket List
  bucketList: [],
  
  addDream: async (title, description) => {
    const id = `dream-${Date.now()}`;
    const newDream: BucketListItem = {
      id,
      title,
      description,
      iconUrl: '',
      completed: false,
      createdAt: new Date(),
    };

    set((state) => ({ bucketList: [...state.bucketList, newDream] }));

    try {
      const iconUrl = await generatePixelArtIcon(title + " " + description);
      if (iconUrl) {
         set((state) => ({
           bucketList: state.bucketList.map(d => 
             d.id === id ? { ...d, iconUrl } : d
           )
         }));
      }
    } catch (e) {
      console.error("Failed to generate dream icon", e);
    }
  },

  toggleDream: (id) => set((state) => ({
    bucketList: state.bucketList.map(d => {
      if (d.id === id) {
        const completed = !d.completed;
         return { ...d, completed, completedAt: completed ? new Date() : undefined };
      }
      return d;
    })
  })),

  removeDream: (id) => set((state) => ({
    bucketList: state.bucketList.filter(d => d.id !== id)
  })),

  // Travel Hub
  visitedCountries: [],
  travelDreams: [],
  
  logVisit: (countryCode) => set((state) => {
    // Don't add duplicates
    if (state.visitedCountries.includes(countryCode)) return {};
    
    return {
      visitedCountries: [...state.visitedCountries, countryCode],
      // Award sovereignty for each new country discovered
      sovereignty: state.sovereignty + 2,
      stats: { ...state.stats, sovereignty: state.stats.sovereignty + 2 }
    };
  }),
  
  addTravelDream: (destination, estimatedCost, priority) => set((state) => ({
    travelDreams: [...state.travelDreams, {
      id: `travel-${Date.now()}`,
      destination,
      estimatedCost,
      fundedAmount: 0,
      priority,
    }]
  })),

  // Avatar and Base
  avatar: {
    level: 1,
    appearance: {
      travelerCloak: false,
      aura: false,
      clothes: 'casual',
      surgeryComplete: false,
    },
  },
  
  base: {
    type: 'dorm',
    description: 'A small student dorm in Germany. Messy desk, instant ramen.',
    level: 1,
    items: ['desk', 'bed', 'ramen'],
    hasPet: false,
  },
  
  // Unified stats object for compatibility
  stats: {
    capital: STAT_DEFAULTS.capital.initial,
    sovereignty: STAT_DEFAULTS.sovereignty.initial,
    aesthetics: STAT_DEFAULTS.aesthetics.initial,
    intellect: STAT_DEFAULTS.intellect.initial,
    kindred: STAT_DEFAULTS.kindred.initial,
    vitality: STAT_DEFAULTS.vitality.initial,
  },

  // Individual stat adders
  addCapital: (amount) => set((state) => ({ 
    capital: state.capital + amount, 
    stats: { ...state.stats, capital: state.stats.capital + amount } 
  })),
  
  addSovereignty: (amount) => set((state) => ({ 
    sovereignty: state.sovereignty + amount, 
    stats: { ...state.stats, sovereignty: state.stats.sovereignty + amount } 
  })),
  
  addAesthetics: (amount) => set((state) => ({ 
    aesthetics: state.aesthetics + amount, 
    stats: { ...state.stats, aesthetics: state.stats.aesthetics + amount } 
  })),
  
  addIntellect: (amount) => set((state) => ({ 
    intellect: state.intellect + amount, 
    stats: { ...state.stats, intellect: state.stats.intellect + amount } 
  })),
  
  addKindred: (amount) => set((state) => ({ 
    kindred: state.kindred + amount, 
    stats: { ...state.stats, kindred: state.stats.kindred + amount } 
  })),
  
  addVitality: (amount) => set((state) => ({ 
    vitality: state.vitality + amount, 
    stats: { ...state.stats, vitality: state.stats.vitality + amount } 
  })),

  // Generic stat update
  updateStat: (stat, amount) => set((state) => {
    const key = stat.toLowerCase() as LowercaseStatType;
    const validKeys: LowercaseStatType[] = ['capital', 'sovereignty', 'aesthetics', 'intellect', 'kindred', 'vitality'];
    
    if (!validKeys.includes(key)) return {};
    
    return { 
      [key]: state[key] + amount,
      stats: { ...state.stats, [key]: state.stats[key] + amount },
    };
  }),
  
  addQuest: (quest) => set((state) => ({ 
    activeQuests: [...state.activeQuests, { 
      id: quest.id, 
      title: quest.title, 
      description: quest.description,
      xp: quest.xp,
      gold: quest.gold,
      type: quest.type,
      status: 'active' 
    }] 
  })),

  // Level up notification
  pendingLevelUp: null,
  clearPendingLevelUp: () => set({ pendingLevelUp: null }),

  reset: () => set({
    capital: STAT_DEFAULTS.capital.initial,
    sovereignty: STAT_DEFAULTS.sovereignty.initial,
    aesthetics: STAT_DEFAULTS.aesthetics.initial,
    intellect: STAT_DEFAULTS.intellect.initial,
    kindred: STAT_DEFAULTS.kindred.initial,
    vitality: STAT_DEFAULTS.vitality.initial,
    milestones: {},
    tasks: SAMPLE_TASKS,
    relics: MILESTONE_RELICS,
    activeQuests: [
      { id: '1', title: 'The Bureaucrat\'s Maze', description: 'Navigate administrative tasks.', xp: 100, gold: 50, type: 'main', status: 'active' },
      { id: '2', title: 'Deep Work Sprint', description: 'Complete 3 work tasks.', xp: 50, gold: 25, type: 'daily', status: 'active' },
    ],
    stats: {
      capital: STAT_DEFAULTS.capital.initial,
      sovereignty: STAT_DEFAULTS.sovereignty.initial,
      aesthetics: STAT_DEFAULTS.aesthetics.initial,
      intellect: STAT_DEFAULTS.intellect.initial,
      kindred: STAT_DEFAULTS.kindred.initial,
      vitality: STAT_DEFAULTS.vitality.initial,
    },
    avatar: {
      level: 1,
      appearance: { travelerCloak: false, aura: false, clothes: 'casual', surgeryComplete: false },
    },
    base: {
      type: 'dorm',
      description: 'A small student dorm in Germany.',
      level: 1,
      items: ['desk', 'bed', 'ramen'],
      hasPet: false,
    },
    pendingLevelUp: null,
  }),

  // Firebase sync
  syncToFirebase: () => {
    const state = get();
    debouncedFirebaseSync(() => {
      if (isFirebaseConfigured()) {
        saveGameState({
          capital: state.capital,
          sovereignty: state.sovereignty,
          aesthetics: state.aesthetics,
          intellect: state.intellect,
          kindred: state.kindred,
          vitality: state.vitality,
          freedomDate: Timestamp.fromDate(state.freedomDate),
          avatar: state.avatar,
          base: state.base,
          milestones: state.milestones,
        });
        saveTasks(state.tasks);
        saveQuests(state.activeQuests);
        saveRelics(state.relics);
        saveBucketList(state.bucketList);
        console.log('🔥 Synced to Firebase');
      }
    });
  },

  hydrateFromFirebase: async () => {
    if (!isFirebaseConfigured()) {
      set({ isHydrated: true });
      return;
    }

    try {
      const [gameState, tasks, quests, relics, bucketList] = await Promise.all([
        loadGameState(),
        loadTasks(),
        loadQuests(),
        loadRelics(),
        loadBucketList(),
      ]);

      const updates: Partial<GameState> = { isHydrated: true };

      if (gameState) {
        updates.capital = gameState.capital ?? STAT_DEFAULTS.capital.initial;
        updates.sovereignty = gameState.sovereignty ?? STAT_DEFAULTS.sovereignty.initial;
        updates.aesthetics = gameState.aesthetics ?? STAT_DEFAULTS.aesthetics.initial;
        updates.intellect = gameState.intellect ?? STAT_DEFAULTS.intellect.initial;
        updates.kindred = gameState.kindred ?? STAT_DEFAULTS.kindred.initial;
        updates.vitality = gameState.vitality ?? STAT_DEFAULTS.vitality.initial;
        updates.freedomDate = gameState.freedomDate?.toDate?.() || new Date('2028-06-01');
        updates.avatar = gameState.avatar ? {
          ...gameState.avatar,
          appearance: {
            ...gameState.avatar.appearance,
            surgeryComplete: gameState.avatar.appearance?.surgeryComplete ?? false,
          }
        } : undefined;
        updates.base = gameState.base ? {
          type: gameState.base.type,
          description: gameState.base.description,
          level: gameState.base.level,
          items: gameState.base.items ?? ['desk', 'bed', 'ramen'],
          hasPet: gameState.base.hasPet ?? false,
        } : undefined;
        updates.milestones = gameState.milestones || {};
        updates.stats = {
          capital: updates.capital as number,
          sovereignty: updates.sovereignty as number,
          aesthetics: updates.aesthetics as number,
          intellect: updates.intellect as number,
          kindred: updates.kindred as number,
          vitality: updates.vitality as number,
        };
      }

      if (tasks && tasks.length > 0) {
        updates.tasks = tasks;
      }

      if (quests && quests.length > 0) {
        updates.activeQuests = quests.map(q => ({ 
          ...q, 
          xp: q.xp ?? 25,
          gold: q.gold ?? 50,
          type: q.type ?? 'normal',
          status: q.status as 'active' | 'completed' 
        }));
      }

      if (relics && relics.length > 0) {
        updates.relics = relics.map(r => ({
          id: r.id,
          name: r.name ?? 'Unknown Relic',
          description: r.description ?? 'A mysterious artifact.',
          unlocked: r.unlocked,
          unlockedAt: r.unlockedAt,
          unlockedByStat: r.unlockedByStat as any,
          requiredValue: r.requiredValue,
        }));
      }

      if (bucketList && bucketList.length > 0) {
        updates.bucketList = bucketList.map(item => ({
          ...item,
          createdAt: item.createdAt instanceof Timestamp ? item.createdAt.toDate() : new Date(item.createdAt),
          completedAt: item.completedAt ? (item.completedAt instanceof Timestamp ? item.completedAt.toDate() : new Date(item.completedAt)) : undefined
        }));
      }

      set(updates as Partial<GameState>);
      console.log('🔥 Hydrated from Firebase');
    } catch (error) {
      console.error('Error hydrating from Firebase:', error);
      set({ isHydrated: true });
    }
  },
}));

// Auto-sync to Firebase on state changes
if (typeof window !== 'undefined') {
  useGameStore.subscribe((state, prevState) => {
    if (state.isHydrated && (
      state.capital !== prevState.capital ||
      state.sovereignty !== prevState.sovereignty ||
      state.aesthetics !== prevState.aesthetics ||
      state.intellect !== prevState.intellect ||
      state.kindred !== prevState.kindred ||
      state.vitality !== prevState.vitality ||
      state.tasks !== prevState.tasks ||
      state.activeQuests !== prevState.activeQuests ||
      state.relics !== prevState.relics ||
      state.bucketList !== prevState.bucketList ||
      state.milestones !== prevState.milestones
    )) {
      state.syncToFirebase();
    }
  });
}
