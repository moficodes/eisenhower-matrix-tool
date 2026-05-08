import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, Circle, GripVertical, Trash2, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onDelete, onToggle, onEdit, isDragging, isOverlay }, ref) => {
    return (
      <motion.div
        layout
        initial={!isOverlay ? { opacity: 0, y: 10 } : false}
        animate={{ 
          opacity: isDragging ? 0.2 : (task.completed ? 0.5 : 1), 
          y: 0,
          scale: isOverlay ? 1.05 : (task.completed ? 0.97 : 1),
          backgroundColor: task.completed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 1)',
          filter: task.completed ? 'grayscale(1)' : 'grayscale(0)',
          boxShadow: isOverlay ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        ref={ref}
        className={`group relative flex items-center gap-3 p-3 border border-gray-100 rounded-xl mb-2 transition-all ${
          isOverlay ? 'z-50 ring-2 ring-black/5' : (isDragging ? 'border-dashed border-gray-200' : 'shadow-sm hover:shadow-md')
        }`}
      >
        <div className="text-gray-300 hover:text-gray-500 p-1 cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </div>

        <button
          onClick={() => onToggle?.(task.id)}
          className={`flex-shrink-0 w-5 h-5 border-2 rounded transition-all duration-300 flex items-center justify-center ${
            task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <CheckCircle2 size={12} strokeWidth={3} />
            </motion.div>
          )}
        </button>

        <div className="flex-grow flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            {task.priority && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-amber-500' :
                'bg-gray-400'
              }`} />
            )}
            <span
              className={`text-sm font-medium leading-tight truncate ${
                task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}
            >
              {task.content}
            </span>
          </div>
          {(task.dueDate || task.priority) && (
            <div className="flex items-center gap-2 mt-1">
              {task.dueDate && (
                <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase font-mono">
                  {task.dueDate}
                </span>
              )}
              {task.priority && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  task.priority === 'high' ? 'bg-red-50 text-red-500' :
                  task.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {task.priority}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit?.(task)}
            className="text-gray-300 hover:text-black transition-colors p-1"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={() => onDelete?.(task.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>
    );
  }
);
