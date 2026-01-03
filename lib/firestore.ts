import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  Unsubscribe,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '@/types/tasks';
import { Quest, Relic, ChatMessage } from '@/types/game';

// Generate or retrieve a persistent user ID (device-based for now)
function getUserId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let userId = localStorage.getItem('terranova_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('terranova_user_id', userId);
  }
  return userId;
}

// ============ GAME STATE ============

export interface FirestoreGameState {
  capital: number;
  intellect: number;
  sovereignty: number;
  freedomDate: Timestamp;
  avatar: {
    level: number;
    appearance: {
      travelerCloak: boolean;
      aura: boolean;
      clothes: string;
    };
  };
  base: {
    type: string;
    description: string;
    level: number;
  };
  lastUpdated: Timestamp;
}

export async function saveGameState(state: Partial<FirestoreGameState>): Promise<void> {
  if (!db) return;
  
  const userId = getUserId();
  const stateRef = doc(db, 'users', userId, 'gameState', 'current');
  
  try {
    await setDoc(stateRef, {
      ...state,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

export async function loadGameState(): Promise<FirestoreGameState | null> {
  if (!db) return null;
  
  const userId = getUserId();
  const stateRef = doc(db, 'users', userId, 'gameState', 'current');
  
  try {
    const snapshot = await getDoc(stateRef);
    if (snapshot.exists()) {
      return snapshot.data() as FirestoreGameState;
    }
    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

export function subscribeToGameState(callback: (state: FirestoreGameState | null) => void): Unsubscribe | null {
  if (!db) return null;
  
  const userId = getUserId();
  const stateRef = doc(db, 'users', userId, 'gameState', 'current');
  
  return onSnapshot(stateRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as FirestoreGameState);
    } else {
      callback(null);
    }
  });
}

// ============ TASKS ============

export async function saveTasks(tasks: Task[]): Promise<void> {
  if (!db) return;
  
  const userId = getUserId();
  const tasksRef = doc(db, 'users', userId, 'data', 'tasks');
  
  try {
    await setDoc(tasksRef, { tasks, lastUpdated: serverTimestamp() });
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export async function loadTasks(): Promise<Task[]> {
  if (!db) return [];
  
  const userId = getUserId();
  const tasksRef = doc(db, 'users', userId, 'data', 'tasks');
  
  try {
    const snapshot = await getDoc(tasksRef);
    if (snapshot.exists()) {
      return snapshot.data().tasks as Task[];
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

// ============ QUESTS ============

export async function saveQuests(quests: { id: string; title: string; status: string }[]): Promise<void> {
  if (!db) return;
  
  const userId = getUserId();
  const questsRef = doc(db, 'users', userId, 'data', 'quests');
  
  try {
    await setDoc(questsRef, { quests, lastUpdated: serverTimestamp() });
  } catch (error) {
    console.error('Error saving quests:', error);
  }
}

export async function loadQuests(): Promise<{ id: string; title: string; status: string }[]> {
  if (!db) return [];
  
  const userId = getUserId();
  const questsRef = doc(db, 'users', userId, 'data', 'quests');
  
  try {
    const snapshot = await getDoc(questsRef);
    if (snapshot.exists()) {
      return snapshot.data().quests;
    }
    return [];
  } catch (error) {
    console.error('Error loading quests:', error);
    return [];
  }
}

// ============ RELICS ============

export async function saveRelics(relics: { id: string; unlocked: boolean }[]): Promise<void> {
  if (!db) return;
  
  const userId = getUserId();
  const relicsRef = doc(db, 'users', userId, 'data', 'relics');
  
  try {
    await setDoc(relicsRef, { relics, lastUpdated: serverTimestamp() });
  } catch (error) {
    console.error('Error saving relics:', error);
  }
}

export async function loadRelics(): Promise<{ id: string; unlocked: boolean }[]> {
  if (!db) return [];
  
  const userId = getUserId();
  const relicsRef = doc(db, 'users', userId, 'data', 'relics');
  
  try {
    const snapshot = await getDoc(relicsRef);
    if (snapshot.exists()) {
      return snapshot.data().relics;
    }
    return [];
  } catch (error) {
    console.error('Error loading relics:', error);
    return [];
  }
}

// ============ CHAT HISTORY (AI Memory) ============

export interface FirestoreChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
  statChanges?: Record<string, number>;
}

export async function saveChatMessage(message: Omit<FirestoreChatMessage, 'timestamp'>): Promise<void> {
  if (!db) return;
  
  const userId = getUserId();
  const chatRef = collection(db, 'users', userId, 'chatHistory');
  
  try {
    await addDoc(chatRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}

export async function loadRecentChatHistory(limitCount: number = 20): Promise<FirestoreChatMessage[]> {
  if (!db) return [];
  
  const userId = getUserId();
  const chatRef = collection(db, 'users', userId, 'chatHistory');
  const q = query(chatRef, orderBy('timestamp', 'desc'), limit(limitCount));
  
  try {
    const snapshot = await getDocs(q);
    const messages: FirestoreChatMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data() as FirestoreChatMessage);
    });
    // Return in chronological order
    return messages.reverse();
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

// ============ JOURNAL ENTRIES ============

export interface JournalEntry {
  id?: string;
  content: string;
  mood?: string;
  tags?: string[];
  timestamp: Timestamp;
}

export async function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<string | null> {
  if (!db) return null;
  
  const userId = getUserId();
  const journalRef = collection(db, 'users', userId, 'journal');
  
  try {
    const docRef = await addDoc(journalRef, {
      ...entry,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return null;
  }
}

export async function loadRecentJournalEntries(limitCount: number = 10): Promise<JournalEntry[]> {
  if (!db) return [];
  
  const userId = getUserId();
  const journalRef = collection(db, 'users', userId, 'journal');
  const q = query(journalRef, orderBy('timestamp', 'desc'), limit(limitCount));
  
  try {
    const snapshot = await getDocs(q);
    const entries: JournalEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() } as JournalEntry);
    });
    return entries;
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
}

// ============ UTILITY ============

export function isFirebaseConfigured(): boolean {
  return db !== null && db !== undefined;
}
