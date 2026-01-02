
import React, { useState, useEffect } from 'react';
import { Habit, DailyLog } from '../types';
import { getDailyFeedback } from '../services/geminiService';

interface DailyTrackerProps {
  habits: Habit[];
  currentDate: string;
  existingLog?: DailyLog;
  onSave: (log: DailyLog) => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({ habits, currentDate, existingLog, onSave }) => {
  const [completions, setCompletions] = useState<Record<string, boolean>>(existingLog?.completions || {});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    setCompletions(existingLog?.completions || {});
    setFeedback(null);
  }, [currentDate, existingLog]);

  const toggleHabit = (id: string) => {
    setCompletions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = async () => {
    const log: DailyLog = { date: currentDate, completions };
    onSave(log);
    
    setLoadingFeedback(true);
    const aiFeedback = await getDailyFeedback(habits.filter(h => h.active), log);
    setFeedback(aiFeedback || "Feedback gerado.");
    setLoadingFeedback(false);
  };

  const activeHabits = habits.filter(h => h.active);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-calendar-day text-emerald-500"></i>
          Registro Diário: {new Date(currentDate).toLocaleDateString('pt-BR')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {activeHabits.map((habit) => (
          <div 
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
              completions[habit.id] 
                ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`font-medium ${completions[habit.id] ? 'text-emerald-700' : 'text-slate-600'}`}>
              {habit.name}
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl`}>
              {completions[habit.id] ? '✅' : '❌'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleSave}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-save"></i>
          Registrar e Receber Feedback
        </button>

        {loadingFeedback && (
          <div className="flex items-center justify-center py-4 text-slate-500 gap-2">
            <i className="fas fa-circle-notch fa-spin"></i>
            Analista está avaliando seu dia...
          </div>
        )}

        {feedback && (
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
              <i className="fas fa-robot"></i>
              Feedback do Analista
            </div>
            <p className="text-indigo-900 italic leading-relaxed">"{feedback}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
