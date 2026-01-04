export type StatType = 'SOVEREIGNTY' | 'CAPITAL' | 'INTELLECT' | 'AESTHETICS' | 'KINDRED' | 'VITALITY';

// Configuration for each stat's essence tube visual
export interface EssenceFillConfig {
  primaryColor: string;
  secondaryColor: string;
  fillIcon: string;       // Emoji or sprite key for fill items
  glowColor: string;
  animationType: 'coins' | 'liquid' | 'scrolls' | 'hearts' | 'seals' | 'mirrors';
}

export interface Stat {
  type: StatType;
  value: number;
  max: number;
  label: string;
  icon: string;
  color: string;
  fillItems: string[];
  milestone?: number;      // Target milestone (Golden Arrow position)
  milestoneReached?: boolean;
}

// Default configurations for all 6 essence tubes
export const STAT_CONFIGS: Record<StatType, EssenceFillConfig> = {
  CAPITAL: {
    primaryColor: '#FFD700',
    secondaryColor: '#FFA500',
    fillIcon: '🪙',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    animationType: 'coins',
  },
  SOVEREIGNTY: {
    primaryColor: '#1E90FF',
    secondaryColor: '#4169E1',
    fillIcon: '🦅',
    glowColor: 'rgba(30, 144, 255, 0.6)',
    animationType: 'seals',
  },
  AESTHETICS: {
    primaryColor: '#FFB6C1',
    secondaryColor: '#FF69B4',
    fillIcon: '✨',
    glowColor: 'rgba(255, 182, 193, 0.6)',
    animationType: 'mirrors',
  },
  INTELLECT: {
    primaryColor: '#9370DB',
    secondaryColor: '#8A2BE2',
    fillIcon: '📜',
    glowColor: 'rgba(147, 112, 219, 0.6)',
    animationType: 'scrolls',
  },
  KINDRED: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#DC143C',
    fillIcon: '❤️',
    glowColor: 'rgba(255, 107, 107, 0.6)',
    animationType: 'hearts',
  },
  VITALITY: {
    primaryColor: '#00CED1',
    secondaryColor: '#20B2AA',
    fillIcon: '💧',
    glowColor: 'rgba(0, 206, 209, 0.6)',
    animationType: 'liquid',
  },
};

export interface Relic {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  image?: string;
  unlockedByStat?: StatType;  // Which stat milestone unlocked this
  requiredValue?: number;      // Milestone value required
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objective: string;
  reward: string;
  rewardPoints: Record<StatType, number>;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  specialType?: 'bureaucracy' | 'homesickness' | 'random';
}

export interface Avatar {
  level: number;
  appearance: {
    clothes: string;
    posture: string;
    aura: boolean;
    travelerCloak: boolean;
  };
}

export interface SkillTreeLevel {
  level: number;
  title: string;
  description: string;
  requirements: {
    SOVEREIGNTY?: number;
    CAPITAL?: number;
    INTELLECT?: number;
    AESTHETICS?: number;
    KINDRED?: number;
    VITALITY?: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface SovereigntySimulation {
  projectedDate: string;
  projectedStats: Record<StatType, number>;
  description: string;
  milestones: string[];
  gapAnalysis?: {
    bottleneck: string;
    warning: string;
    recommendation: string;
  };
}

export interface Base {
  level: number;
  type: 'dorm' | 'apartment' | 'penthouse';
  description: string;
}



export interface BucketListItem {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  // Scroll of Dreams enhancements
  questType?: 'main' | 'side';  // Main Quest vs Side Quest classification
  isPinned?: boolean;            // Up to 3 can be pinned as Active Quests
  archivedAt?: Date;             // Legacy goals moved to "Echoes of the Past"
  category?: string;             // Optional category for grouping
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface GameState {
  stats: Record<StatType, Stat>;
  relics: Relic[];
  quests: Quest[];
  bucketList: BucketListItem[];
  avatar: Avatar;
  base: Base;
  totalProgress: number; // 0-100, affects dream background clarity
  lastUpdated: Date;
  freeRoamMode: boolean; // Endgame state
}

