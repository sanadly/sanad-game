import { GoogleGenerativeAI } from '@google/generative-ai';
import { StatType, Quest, SovereigntySimulation } from '@/types/game';
import { retryWithBackoff, sanitizeInput } from './utils';
import { toastManager } from './toast';
import { saveChatMessage, loadRecentChatHistory, FirestoreChatMessage } from './firestore';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Some features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ParsedUpdate {
  statChanges: Record<StatType, number>;
  quest?: Quest;
  message: string;
}

export async function parseUserInput(input: string, currentStats: Record<StatType, { value: number; max: number }>): Promise<ParsedUpdate> {
  if (!genAI) {
    const errorMsg = 'Gemini API not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env file.';
    toastManager.show(errorMsg, 'error', 5000);
    return {
      statChanges: {
        SOVEREIGNTY: 0,
        CAPITAL: 0,
        INTELLECT: 0,
        AESTHETICS: 0,
        KINDRED: 0,
        VITALITY: 0,
      },
      message: errorMsg,
    };
  }

  // Sanitize input
  const sanitizedInput = sanitizeInput(input);
  if (!sanitizedInput) {
    return {
      statChanges: {
        SOVEREIGNTY: 0,
        CAPITAL: 0,
        INTELLECT: 0,
        AESTHETICS: 0,
        KINDRED: 0,
        VITALITY: 0,
      },
      message: 'Please provide a valid input.',
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Load recent chat history for context (AI Memory)
  let chatHistoryContext = '';
  try {
    const recentChats = await loadRecentChatHistory(10);
    if (recentChats.length > 0) {
      chatHistoryContext = `\n\nRECENT CONVERSATION HISTORY (for context - remember what the player told you):\n${recentChats.map(msg => 
        `${msg.role === 'user' ? 'PLAYER' : 'NAVIGATOR'}: ${msg.content}`
      ).join('\n')}\n`;
    }
  } catch (e) {
    // Continue without history if Firebase is not configured
  }

  const prompt = `You are "The Navigator", the Game Master of Terra Nova. You have MEMORY of past conversations.
${chatHistoryContext}
Every time the user talks to you, you MUST return a JSON object with this EXACT structure. Do not include any text before or after the JSON. Return ONLY valid JSON.

{
  "statUpdates": {
    "SOVEREIGNTY": 0,
    "CAPITAL": 0,
    "INTELLECT": 0,
    "AESTHETICS": 0,
    "KINDRED": 0,
    "VITALITY": 0
  },
  "narrativeResponse": "Your response as The Navigator in pixel game style. Reference past conversations if relevant!",
  "newQuest": {
    "title": "Quest Title (or null if no quest needed)",
    "reward": "Reward description (or null)"
  }
}

The player has 6 stats (all 0-100):
- SOVEREIGNTY: German citizenship, legal status, visa progress, paperwork
- CAPITAL: Savings, passive income, wealth, financial independence
- INTELLECT: Deep work, philosophy, books read, skills learned, degree progress
- AESTHETICS: Physical fitness, grooming, fashion, environment quality, travel
- KINDRED: Relationship quality, social connections, emotional health, partner time
- VITALITY: Sleep quality, mood, energy levels, stress, mental health

Current stats:
${Object.entries(currentStats).map(([type, stat]) => `- ${type}: ${stat.value}/${stat.max}`).join('\n')}

User input: "${sanitizedInput}"

CRITICAL: Base the statUpdates on the effort and impact of their real-world actions.
- "I studied 5 hours" = +5 INTELLECT
- "I felt lazy" = -2 VITALITY
- "Completed my thesis" = +20-30 INTELLECT
- "Saved €200" = +5-10 CAPITAL
- "Had a great date" = +10 KINDRED

Generate a newQuest only if there's a significant imbalance or opportunity. Otherwise, set newQuest to null.
If the player references something from past conversations, acknowledge it!

Return ONLY the JSON object. No markdown, no code blocks, no explanations. Just the raw JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Map the new structure to our existing structure
    const statUpdates = parsed.statUpdates || parsed.statChanges || {};
    const narrativeResponse = parsed.narrativeResponse || parsed.message || 'Stats updated, Architect!';
    const newQuest = parsed.newQuest || parsed.quest;
    
    const quest: Quest | undefined = newQuest && newQuest.title ? {
      id: `quest-${Date.now()}`,
      title: newQuest.title,
      description: newQuest.description || 'Complete this quest to progress',
      objective: newQuest.objective || newQuest.title,
      reward: newQuest.reward || 'Stat points',
      rewardPoints: newQuest.rewardPoints || {
        SOVEREIGNTY: 0,
        CAPITAL: 0,
        INTELLECT: 0,
        AESTHETICS: 0,
        KINDRED: 0,
        VITALITY: 0,
      },
      specialType: newQuest.specialType || undefined,
      completed: false,
      createdAt: new Date(),
    } : undefined;

    // Save conversation to Firebase for AI memory
    try {
      await saveChatMessage({ role: 'user', content: sanitizedInput });
      await saveChatMessage({ 
        role: 'assistant', 
        content: narrativeResponse,
        statChanges: statUpdates 
      });
    } catch (e) {
      // Continue even if saving fails
    }

    return {
      statChanges: {
        SOVEREIGNTY: statUpdates.SOVEREIGNTY || 0,
        CAPITAL: statUpdates.CAPITAL || 0,
        INTELLECT: statUpdates.INTELLECT || 0,
        AESTHETICS: statUpdates.AESTHETICS || 0,
        KINDRED: statUpdates.KINDRED || 0,
        VITALITY: statUpdates.VITALITY || 0,
      },
      quest,
      message: narrativeResponse,
    };
  } catch (error) {
    console.error('Error parsing user input with Gemini:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    toastManager.show(`API Error: ${errorMsg}`, 'error');
    return {
      statChanges: {
        SOVEREIGNTY: 0,
        CAPITAL: 0,
        INTELLECT: 0,
        AESTHETICS: 0,
        KINDRED: 0,
        VITALITY: 0,
      },
      message: 'I had trouble understanding that, Architect. Could you rephrase?',
    };
  }
}

export async function generateQuest(currentStats: Record<StatType, { value: number; max: number }>): Promise<Quest | null> {
  if (!genAI) {
    return null;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Check for special conditions
  const sovereignty = currentStats.SOVEREIGNTY?.value || 0;
  const vitality = currentStats.VITALITY?.value || 0;
  
  let specialPrompt = '';
  let specialType: 'bureaucracy' | 'homesickness' | 'random' | undefined = undefined;

  // German Bureaucracy Boss Fight
  if (sovereignty > 0 && sovereignty < 50 && Math.random() < 0.3) {
    specialPrompt = `SPECIAL EVENT: "The German Bureaucracy Boss Fight"
The player is dealing with German paperwork/visa issues. Generate a quest to handle bureaucracy that gives a MASSIVE boost to SOVEREIGNTY (+15-25 points). Make it feel like a boss fight - challenging but rewarding.`;
    specialType = 'bureaucracy';
  }
  // Mediterranean Home-sickness Debuff
  else if (vitality < 30 && Math.random() < 0.4) {
    specialPrompt = `SPECIAL EVENT: "The Mediterranean Home-sickness Debuff"
The player's VITALITY is low, possibly due to homesickness or cultural disconnect. Generate a quest to cook a traditional Libyan meal or connect with their roots. This should restore VITALITY (+10-15 points) and boost KINDRED.`;
    specialType = 'homesickness';
  }

  const prompt = `You are "The Navigator," the Game Master analyzing the player's stats for imbalances.

Current stats:
${Object.entries(currentStats).map(([type, stat]) => `- ${type}: ${stat.value}/${stat.max}`).join('\n')}

${specialPrompt || `Identify the LOWEST stat(s) and generate a creative, pixel-art game-style quest to help the player improve it.`}

The quest should be:
- Specific and actionable
- Themed appropriately (e.g., if INTELLECT is low, suggest reading/learning)
- Rewarding (give 20-50 points to the relevant stat, or 15-25 for special events)
- Written in the voice of "The Navigator" addressing "The Architect"

Return JSON:
{
  "title": "Quest Title",
  "description": "Why this quest matters",
  "objective": "Specific action to take",
  "reward": "What they'll get",
  "rewardPoints": {
    "SOVEREIGNTY": 0,
    "CAPITAL": 0,
    "INTELLECT": 0,
    "AESTHETICS": 0,
    "KINDRED": 0,
    "VITALITY": 0
  },
  "specialType": ${specialType ? `"${specialType}"` : 'null'}
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      id: `quest-${Date.now()}`,
      title: parsed.title,
      description: parsed.description,
      objective: parsed.objective,
      reward: parsed.reward,
      rewardPoints: parsed.rewardPoints,
      specialType: parsed.specialType || specialType,
      completed: false,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating quest:', error);
    return null;
  }
}

export async function runSovereigntySimulation(
  currentStats: Record<StatType, { value: number; max: number }>,
  monthlySavingsRate: number,
  investmentYield: number
): Promise<SovereigntySimulation | null> {
  if (!genAI) {
    return null;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Calculate gap analysis
  const statValues = Object.entries(currentStats).map(([type, stat]) => ({
    type,
    value: stat.value,
    percentage: (stat.value / stat.max) * 100,
  }));
  
  const lowestStat = statValues.reduce((min, stat) => 
    stat.percentage < min.percentage ? stat : min
  );
  const highestStat = statValues.reduce((max, stat) => 
    stat.percentage > max.percentage ? stat : max
  );
  const gap = highestStat.percentage - lowestStat.percentage;

  const prompt = `You are "The Navigator" running a "Sovereignty Simulation" and "Gap Analysis" for the Architect.

Current stats:
${Object.entries(currentStats).map(([type, stat]) => `- ${type}: ${stat.value}/${stat.max} (${Math.round((stat.value / stat.max) * 100)}%)`).join('\n')}

Financial data:
- Monthly savings rate: €${monthlySavingsRate}
- Investment yield (annual): ${investmentYield}%

GAP ANALYSIS:
- Lowest stat: ${lowestStat.type} at ${Math.round(lowestStat.percentage)}%
- Highest stat: ${highestStat.type} at ${Math.round(highestStat.percentage)}%
- Gap: ${Math.round(gap)} percentage points

CRITICAL: Identify the "bottleneck" stat that will prevent sovereignty even if other stats are high.

Project the future state:
1. Calculate when passive income will exceed monthly expenses (assuming expenses of €2000/month)
2. Project stat growth based on current trajectory
3. Identify the BOTTLENECK stat and warn about it
4. Generate a vivid description of the future state (luxury pixel-villa, no "Job Mine", Golden Passport glowing, etc.)
5. If VITALITY is low, warn about "The Hollow Winner" scenario

Return JSON (ONLY JSON, no markdown):
{
  "projectedDate": "YYYY-MM-DD",
  "projectedStats": {
    "SOVEREIGNTY": 0,
    "CAPITAL": 0,
    "INTELLECT": 0,
    "AESTHETICS": 0,
    "KINDRED": 0,
    "VITALITY": 0
  },
  "description": "Vivid description of the future state",
  "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
  "gapAnalysis": {
    "bottleneck": "STAT_NAME",
    "warning": "Warning message about the bottleneck",
    "recommendation": "Specific recommendation to fix the bottleneck"
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      projectedDate: parsed.projectedDate,
      projectedStats: parsed.projectedStats,
      description: parsed.description,
      milestones: parsed.milestones || [],
      gapAnalysis: parsed.gapAnalysis || undefined,
    };
  } catch (error) {
    console.error('Error running simulation:', error);
    return null;
  }
}
