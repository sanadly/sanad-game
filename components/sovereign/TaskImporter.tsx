'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Task, TaskCategory } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';

export default function TaskImporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const importTasks = useGameStore(state => state.importTasks);

  const handleImport = () => {
    try {
      if (!jsonInput.trim()) return;

      let parsed = JSON.parse(jsonInput);
      
      // Ensure array
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      // Basic validation and transformation
      const tasks: Task[] = parsed.map((item: any) => ({
        id: item.id || uuidv4(),
        title: item.title || 'Untitled Task',
        startTime: item.startTime ? new Date(item.startTime) : undefined,
        endTime: item.endTime ? new Date(item.endTime) : undefined,
        duration: item.duration || 30,
        isAllDay: !!item.isAllDay,
        isCompleted: !!item.isCompleted,
        category: validateCategory(item.category),
        notes: item.notes
      }));

      importTasks(tasks);
      setJsonInput('');
      setError(null);
      setIsOpen(false);
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const validateCategory = (cat: string): TaskCategory => {
    const valid: TaskCategory[] = ['work', 'admin', 'study', 'health', 'personal', 'other'];
    if (valid.includes(cat as TaskCategory)) return cat as TaskCategory;
    return 'other';
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-amber-900/40 border border-amber-500/30 rounded text-xs text-amber-200 hover:bg-amber-800/50 transition-colors"
      >
        Import Tasks
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#1a1614] border border-[#d4b483] rounded p-6 shadow-2xl relative">
            <h2 className="text-xl font-medium text-[#d4b483] mb-4">Import Tasks (JSON)</h2>
            
            <p className="text-sm text-[#a89f91] mb-2">
              Paste JSON from Structured export or manual entry.
            </p>

            <textarea
              className="w-full h-48 bg-black/50 border border-[#4a4036] rounded p-3 text-sm text-[#e0d8cd] font-mono focus:border-[#d4b483] outline-none resize-none"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"title": "Deep Work", "category": "work", "duration": 60}]'
            />
            
            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-[#a89f91] hover:text-[#e0d8cd] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-[#d4b483] text-[#1a1614] text-sm font-medium rounded hover:bg-[#eacda3] transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
