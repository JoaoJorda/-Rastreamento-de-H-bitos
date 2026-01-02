
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitManagerProps {
  habits: Habit[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const HabitManager: React.FC<HabitManagerProps> = ({ habits, onAdd, onToggle, onRemove }) => {
  const [newHabit, setNewHabit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAdd(newHabit.trim());
      setNewHabit('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-tasks text-indigo-500"></i>
        Gerenciar Hábitos
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Novo hábito (ex: Meditar 10min)"
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Adicionar
        </button>
      </form>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onToggle(habit.id)}
                className={`w-6 h-6 rounded flex items-center justify-center border ${habit.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'}`}
              >
                {habit.active && <i className="fas fa-check text-xs"></i>}
              </button>
              <span className={`${!habit.active ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                {habit.name}
              </span>
            </div>
            <button 
              onClick={() => onRemove(habit.id)}
              className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
