import OpenAI from 'openai';
import { StatType, Quest, SovereigntySimulation } from '@/types/game';
import { sanitizeInput } from './utils';
import { toastManager } from './toast';
import { saveChatMessage, loadRecentChatHistory } from './firestore';

const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.warn('DeepSeek API key not found. AI features will be disabled.');
}

const openai = API_KEY ? new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
}) : null;

export interface ParsedUpdate {
  statChanges: Record<StatType, number>;
  quest?: Quest;
  message: string;
}

export async function parseUserInput(input: string, currentStats: Record<StatType, { value: number; max: number }>): Promise<ParsedUpdate> {
  if (!openai) {
    const errorMsg = 'DeepSeek API not configured. Please add NEXT_PUBLIC_DEEPSEEK_API_KEY to your .env file.';
    toastManager.show(errorMsg, 'error', 5000);
    return {
      statChanges: { SOVEREIGNTY: 0, CAPITAL: 0, INTELLECT: 0, AESTHETICS: 0, KINDRED: 0, VITALITY: 0 },
      message: errorMsg,
    };
  }

  const sanitizedInput = sanitizeInput(input);
  if (!sanitizedInput) {
    return {
      statChanges: { SOVEREIGNTY: 0, CAPITAL: 0, INTELLECT: 0, AESTHETICS: 0, KINDRED: 0, VITALITY: 0 },
      message: 'Please provide a valid input.',
    };
  }

  // Load recent chat history
  let chatHistoryContext: { role: 'user' | 'assistant' | 'system'; content: string }[] = [];
  try {
    const recentChats = await loadRecentChatHistory(10);
    if (recentChats.length > 0) {
      chatHistoryContext = recentChats.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
    }
  } catch (e) {
    // Continue without history
  }

  const systemPrompt = `You are "The Navigator", the Game Master of Terra Nova. 
You act as a cryptic but helpful guide in a pixel-art RPG simulation of real life.
Your goal is to parse the user's real-life actions and translate them into game stats.

The player has 6 stats (0-100):
- SOVEREIGNTY: German citizenship, legal status, paperwork
- CAPITAL: Wealth, savings, financial independence
- INTELLECT: Knowledge, deep work, philosophy, skills
- AESTHETICS: Fitness, grooming, fashion, environment
- KINDRED: Social, family, relationships
- VITALITY: Health, sleep, energy, mood

Current stats:
${Object.entries(currentStats).map(([type, stat]) => `- ${type}: ${stat.value}/${stat.max}`).join('\n')}

CRITICAL INSTRUCTION:
Return a JSON object with this EXACT structure. NO text outside the JSON.
{
  "statUpdates": { "SOVEREIGNTY": 0, "CAPITAL": 0, "INTELLECT": 0, "AESTHETICS": 0, "KINDRED": 0, "VITALITY": 0 },
  "narrativeResponse": "Your response as The Navigator (max 2 sentences, pixel-rpg style)",
  "newQuest": { "title": "Quest Title", "reward": "Reward" } // Optional, only if relevant
}

Base stat updates on impact:
- Small task: +1-5
- Major achievement: +10-20
- Negative event: -1 to -10

Example: "I read a book" -> +5 INTELLECT.
Example: "I partied all night" -> +5 KINDRED, -5 VITALITY.
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistoryContext as any,
        { role: 'user', content: sanitizedInput }
      ],
      model: 'deepseek-chat',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No content from DeepSeek');

    const parsed = JSON.parse(content);
    
    // Map response to our structure
    const statUpdates = parsed.statUpdates || {};
    const narrativeResponse = parsed.narrativeResponse || 'The simulation acknowledges your input.';
    const newQuest = parsed.newQuest;

    const quest: Quest | undefined = newQuest && newQuest.title ? {
      id: `quest-${Date.now()}`,
      title: newQuest.title,
      description: newQuest.description || 'Complete this quest to progress',
      objective: newQuest.objective || newQuest.title,
      reward: newQuest.reward || 'Stat points',
      rewardPoints: { SOVEREIGNTY: 0, CAPITAL: 0, INTELLECT: 0, AESTHETICS: 0, KINDRED: 0, VITALITY: 0 },
      completed: false,
      createdAt: new Date(),
    } : undefined;

    // Save to Firebase
    try {
      await saveChatMessage({ role: 'user', content: sanitizedInput });
      await saveChatMessage({ 
        role: 'assistant', 
        content: narrativeResponse,
        statChanges: statUpdates 
      });
    } catch (e) {}

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
    console.error('DeepSeek API Error:', error);
    toastManager.show('Navigator Uplink Failed', 'error');
    return {
      statChanges: { SOVEREIGNTY: 0, CAPITAL: 0, INTELLECT: 0, AESTHETICS: 0, KINDRED: 0, VITALITY: 0 },
      message: 'The Uplink is static... I could not process your request.',
    };
  }
}

export async function generateQuest(currentStats: Record<StatType, { value: number; max: number }>): Promise<Quest | null> {
  if (!openai) return null;

  // Check for special conditions (Restored from Gemini logic)
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

  const prompt = `Analyze these stats and generate a pixel-art RPG quest.
Stats: ${Object.entries(currentStats).map(([k, v]) => `${k}: ${v.value}`).join(', ')}

${specialPrompt || `Identify the LOWEST stat(s) and generate a creative, pixel-art game-style quest to help the player improve it.`}

Return JSON:
{
  "title": "Quest Title",
  "description": "Brief description",
  "objective": "Actionable goal",
  "reward": "Reward text",
  "rewardPoints": { "SOVEREIGNTY": 0, "CAPITAL": 0, "INTELLECT": 0, "AESTHETICS": 0, "KINDRED": 0, "VITALITY": 0 },
  "specialType": ${specialType ? `"${specialType}"` : '"random"'} 
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-chat',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    return {
      id: `quest-${Date.now()}`,
      title: parsed.title,
      description: parsed.description,
      objective: parsed.objective,
      reward: parsed.reward,
      rewardPoints: parsed.rewardPoints,
      specialType: parsed.specialType,
      completed: false,
      createdAt: new Date(),
    };
  } catch (e) {
    console.error('Quest generation failed', e);
    return null;
  }
}

export async function runSovereigntySimulation(
  currentStats: Record<StatType, { value: number; max: number }>,
  monthlySavingsRate: number,
  investmentYield: number
): Promise<SovereigntySimulation | null> {
  if (!openai) return null;

  const prompt = `Run a "Sovereignty Simulation" (Gap Analysis) based on these stats:
${Object.entries(currentStats).map(([k, v]) => `${k}: ${v.value}/${v.max}`).join('\n')}
Savings: €${monthlySavingsRate}/mo, Yield: ${investmentYield}%

Return JSON:
{
  "projectedDate": "YYYY-MM-DD",
  "description": "Vivid description of the future state",
  "milestones": ["Milestone 1", "Milestone 2"],
  "gapAnalysis": {
    "bottleneck": "STAT_NAME",
    "warning": "Warning text",
    "recommendation": "Recommendation text"
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'deepseek-chat',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) return null;
    const parsed = JSON.parse(content);

    return {
      projectedDate: parsed.projectedDate,
      projectedStats: parsed.projectedStats || {}, // DeepSeek might miss this if not explicit, handling safely
      description: parsed.description,
      milestones: parsed.milestones || [],
      gapAnalysis: parsed.gapAnalysis,
    };
  } catch (e) {
    console.error('Simulation failed', e);
    return null;
  }
}
