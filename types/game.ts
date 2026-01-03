export type StatType = 'SOVEREIGNTY' | 'CAPITAL' | 'INTELLECT' | 'AESTHETICS' | 'KINDRED' | 'VITALITY';

export interface Stat {
  type: StatType;
  value: number;
  max: number;
  label: string;
  icon: string;
  color: string;
  fillItems: string[];
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  image?: string;
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

