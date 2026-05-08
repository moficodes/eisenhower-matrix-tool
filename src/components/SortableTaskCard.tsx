import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface SortableTaskCardProps {
  key?: React.Key;
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function SortableTaskCard({ task, onDelete, onToggle, onEdit }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} className="relative">
        <TaskCard
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
          isDragging={isDragging}
        />
      </div>
    </div>
  );
}
