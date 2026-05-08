import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function CalendarView({ tasks, onEditTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const tasksWithDates = tasks.filter(task => task.dueDate);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-lg text-white">
            <CalendarIcon size={18} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all text-gray-500 hover:text-black"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all text-gray-500 hover:text-black"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 grid-rows-6">
        {calendarDays.map((day, i) => {
          const dayTasks = tasksWithDates.filter(task => 
            task.dueDate && isSameDay(parseISO(task.dueDate), day)
          );
          
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] p-2 border-r border-b border-gray-50 last:border-r-0 flex flex-col gap-1 transition-colors hover:bg-gray-50/50 ${
                !isCurrentMonth ? 'bg-gray-50/30' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday 
                    ? 'bg-black text-white' 
                    : isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold text-gray-400">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => onEditTask(task)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md text-left truncate transition-transform active:scale-95 ${
                      task.completed ? 'opacity-50 line-through bg-gray-100 text-gray-500' : 
                      task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-100' :
                      task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {task.content}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
