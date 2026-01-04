// Business types for Terra Nova - Merchant Guild

export type BusinessStage = 'construction' | 'stall' | 'shop' | 'tower';

export interface Business {
  id: string;
  name: string;
  type: 'passive' | 'active' | 'creative';
  stage: BusinessStage;
  revenue: number;           // Monthly revenue in EUR
  growthProgress: number;   // 0-100 progress to next stage
  foundedAt: Date;
  lastUpgradeAt?: Date;
}

// Business evolution requirements
export const BUSINESS_STAGES: Record<BusinessStage, {
  name: string;
  icon: string;
  description: string;
  revenueMultiplier: number;
  nextStageRequirement?: number;
}> = {
  construction: {
    name: 'Under Construction',
    icon: '🚧',
    description: 'Breaking ground on your venture.',
    revenueMultiplier: 0,
    nextStageRequirement: 100,
  },
  stall: {
    name: 'Market Stall',
    icon: '🏪',
    description: 'A humble beginning in the marketplace.',
    revenueMultiplier: 1,
    nextStageRequirement: 500,
  },
  shop: {
    name: 'Established Shop',
    icon: '🏬',
    description: 'A recognized presence in the market.',
    revenueMultiplier: 3,
    nextStageRequirement: 2000,
  },
  tower: {
    name: 'Commerce Tower',
    icon: '🏰',
    description: 'A landmark of entrepreneurial success.',
    revenueMultiplier: 10,
  },
};

// Business type configurations
export const BUSINESS_TYPES = {
  passive: {
    name: 'Passive Income',
    icon: '💰',
    description: 'Investment and dividend-based ventures.',
    examples: ['ETF Portfolio', 'Rental Property', 'Dividend Stocks'],
  },
  active: {
    name: 'Active Business',
    icon: '💼',
    description: 'Businesses requiring active management.',
    examples: ['Consulting', 'Freelancing', 'Agency'],
  },
  creative: {
    name: 'Creative Venture',
    icon: '🎨',
    description: 'Content and creative-based income.',
    examples: ['YouTube Channel', 'Digital Products', 'Course Creation'],
  },
};

// Sample quests for business growth
export const BUSINESS_QUESTS = [
  {
    id: 'biz-market-research',
    title: 'Market Research Sprint',
    description: 'Analyze competitors and identify your unique value proposition.',
    xpReward: 50,
    goldReward: 100,
    growthBonus: 10,
  },
  {
    id: 'biz-passive-setup',
    title: 'Passive Income Pipeline',
    description: 'Set up an automated revenue stream.',
    xpReward: 75,
    goldReward: 200,
    growthBonus: 20,
  },
  {
    id: 'biz-first-sale',
    title: 'First Customer Victory',
    description: 'Acquire your first paying customer.',
    xpReward: 100,
    goldReward: 150,
    growthBonus: 25,
  },
  {
    id: 'biz-scale-up',
    title: 'Scale Operations',
    description: 'Implement systems to handle 10x growth.',
    xpReward: 150,
    goldReward: 500,
    growthBonus: 30,
  },
];

// Calculate next stage based on growth progress
export const getNextStage = (currentStage: BusinessStage): BusinessStage | null => {
  const stages: BusinessStage[] = ['construction', 'stall', 'shop', 'tower'];
  const currentIndex = stages.indexOf(currentStage);
  if (currentIndex < stages.length - 1) {
    return stages[currentIndex + 1];
  }
  return null;
};
