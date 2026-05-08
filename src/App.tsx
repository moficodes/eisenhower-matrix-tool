/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { LayoutGrid, Target, Search, X, Calendar as CalendarIcon, Grid } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { Quadrant } from './components/Quadrant';
import { TaskCard } from './components/TaskCard';
import { TaskInput } from './components/TaskInput';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CalendarView } from './components/CalendarView';
import { QUADRANTS, QuadrantId, Task } from './types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('eisenhower-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'matrix' | 'calendar'>('matrix');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    localStorage.setItem('eisenhower-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(t => 
    t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddTask = (content: string, quadrantId: QuadrantId) => {
    const newTask: Task = {
      id: nanoid(),
      content,
      completed: false,
      quadrantId,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const confirmDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find the task and the goal container
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Is over a quadrant?
    const isOverAQuadrant = QUADRANTS.some((q) => q.id === overId);
    
    if (isOverAQuadrant) {
      if (activeTask.quadrantId !== overId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, quadrantId: overId as QuadrantId } : t
          )
        );
      }
      return;
    }

    // Is over another task?
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.quadrantId !== overTask.quadrantId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, quadrantId: overTask.quadrantId } : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId !== overId) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (overIndex !== -1) {
        setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden lg:block">Eisenhower Matrix Pro</h1>
          <h1 className="text-xl font-bold tracking-tight lg:hidden">EMP</h1>
        </div>

        <div className="flex-grow max-w-md mx-4 md:mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mr-4 lg:mr-8 border-l border-gray-100 pl-4 lg:pl-8">
          <button
            onClick={() => setView('matrix')}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 ${
              view === 'matrix' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100'
            }`}
            title="Matrix View"
          >
            <LayoutGrid size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Matrix</span>
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 ${
              view === 'calendar' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100'
            }`}
            title="Calendar View"
          >
            <CalendarIcon size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Calendar</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {tasks.filter(t => t.completed).length} Completed
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {tasks.filter(t => !t.completed).length} Pending
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <TaskInput onAdd={handleAddTask} />

        {view === 'matrix' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {QUADRANTS.map((quadrant) => (
                <Quadrant
                  key={quadrant.id}
                  config={quadrant}
                  tasks={filteredTasks.filter((t: Task) => t.quadrantId === quadrant.id)}
                  onDelete={confirmDeleteTask}
                  onToggle={handleToggleTask}
                  onEdit={setEditingTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="w-[300px] pointer-events-none">
                  <TaskCard
                    task={activeTask}
                    isOverlay
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="pb-20">
            <CalendarView tasks={filteredTasks} onEditTask={setEditingTask} />
          </div>
        )}
      </main>

      {editingTask && (
        <TaskDetailModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        taskTitle={taskToDelete?.content || ''}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />

      <footer className="h-12 bg-white border-t border-gray-200 px-6 md:px-12 fixed bottom-0 left-0 right-0 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest z-20">
        <div className="flex gap-4">
          <span>Priority Matrix v2.0</span>
          <span>{tasks.length} Total Tasks</span>
        </div>
        <div className="hidden sm:flex gap-4">
          <span>Drag to Categorize</span>
          <span>Focus on what matters</span>
        </div>
      </footer>
    </div>
  );
}

