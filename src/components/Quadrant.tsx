import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'motion/react';
import { QuadrantConfig, Task } from '../types';
import { SortableTaskCard } from './SortableTaskCard';

interface QuadrantProps {
  key?: React.Key;
  config: QuadrantConfig;
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function Quadrant({ config, tasks, onDelete, onToggle, onEdit }: QuadrantProps) {
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  
  const { setNodeRef } = useDroppable({
    id: config.id,
  });

  const filteredTasks = priorityFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.priority === priorityFilter);

  return (
    <div
      className={`flex flex-col h-full min-h-[350px] p-6 rounded-2xl border-2 ${config.id === 'ELIMINATE' ? 'border-dashed' : ''} ${config.borderClass} ${config.bgClass} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h2 className={`text-sm font-bold flex items-center gap-2 ${config.colorClass}`}>
            <span className={`w-2 h-2 rounded-full ${config.id === 'DO_FIRST' ? 'bg-red-600' : config.id === 'SCHEDULE' ? 'bg-blue-600' : config.id === 'DELEGATE' ? 'bg-orange-600' : 'bg-gray-500'}`}></span>
            {config.title.toUpperCase()}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {config.description}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.id === 'DO_FIRST' ? 'bg-red-50 text-red-600' : config.id === 'SCHEDULE' ? 'bg-blue-50 text-blue-600' : config.id === 'DELEGATE' ? 'bg-orange-50 text-orange-600' : 'bg-gray-200 text-gray-600'}`}>
          {config.id === 'DO_FIRST' ? 'Q1' : config.id === 'SCHEDULE' ? 'Q2' : config.id === 'DELEGATE' ? 'Q3' : 'Q4'}
        </span>
      </div>

      {/* Priority Filter */}
      <div className="flex justify-end gap-1 mb-4">
        {(['all', 'high', 'medium', 'low'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border transition-all ${
              priorityFilter === p
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div
        ref={setNodeRef}
        className="flex-grow overflow-y-auto custom-scrollbar pr-1"
      >
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col min-h-full">
            <AnimatePresence initial={false}>
              {filteredTasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onDelete={onDelete}
                  onToggle={onToggle}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow flex items-center justify-center p-8 text-slate-400 text-xs font-medium text-center border border-dashed border-slate-300 rounded-xl mt-2 select-none"
              >
                {priorityFilter === 'all' 
                  ? `Drop tasks here to ${config.title.toLowerCase()}`
                  : `No ${priorityFilter} priority tasks here`}
              </motion.div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
