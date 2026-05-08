import React, { useState } from 'react';
import { Plus, Zap, Star } from 'lucide-react';
import { QuadrantId } from '../types';

interface TaskInputProps {
  onAdd: (content: string, quadrantId: QuadrantId) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [isImportant, setIsImportant] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let quadrantId: QuadrantId = 'ELIMINATE';
    if (isUrgent && isImportant) quadrantId = 'DO_FIRST';
    else if (!isUrgent && isImportant) quadrantId = 'SCHEDULE';
    else if (isUrgent && !isImportant) quadrantId = 'DELEGATE';

    onAdd(content.trim(), quadrantId);
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm mb-8"
    >
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Drop a new task in the matrix..."
        className="flex-grow px-4 py-2.5 text-sm border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all font-medium"
      />
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsUrgent(!isUrgent)}
          className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border-2 ${
            isUrgent 
              ? 'bg-red-50 border-red-100 text-red-600 shadow-sm' 
              : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Zap size={14} fill={isUrgent ? 'currentColor' : 'none'} />
          Urgent
        </button>

        <button
          type="button"
          onClick={() => setIsImportant(!isImportant)}
          className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border-2 ${
            isImportant 
              ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' 
              : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Star size={14} fill={isImportant ? 'currentColor' : 'none'} />
          Important
        </button>
      </div>

      <button
        type="submit"
        className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 lg:ml-2"
      >
        <Plus size={18} strokeWidth={3} />
        Add Task
      </button>
    </form>
  );
}
