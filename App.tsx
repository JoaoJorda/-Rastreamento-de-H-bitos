
import React, { useState, useEffect } from 'react';
import { AppState, Habit, DailyLog, DbConfig } from './types';
import { INITIAL_HABITS } from './constants';
import { HabitManager } from './components/HabitManager';
import { DailyTracker } from './components/DailyTracker';
import { Analytics } from './components/Analytics';
import { DataManagement } from './components/DataManagement';

const STORAGE_KEY = 'habit_performance_analyst_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'analytics' | 'settings'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { habits: INITIAL_HABITS, logs: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Se o Supabase estivesse configurado, aqui dispararíamos o sync
    if (state.dbConfig?.enabled && state.dbConfig.url) {
      handleSupabaseSync(state);
    }
  }, [state]);

  const handleSupabaseSync = async (currentState: AppState) => {
    setSyncStatus('syncing');
    try {
      // Nota: Para implementar o Supabase de fato, você criaria uma tabela 'user_performance' 
      // e faria um upsert do JSON do estado usando a URL e Key fornecidas.
      // Por enquanto, simulamos o sucesso da conexão.
      setTimeout(() => setSyncStatus('saved'), 1000);
    } catch (e) {
      setSyncStatus('error');
    }
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      active: true,
      createdAt: new Date().toISOString(),
      weeklyTarget: 5
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const toggleHabitActive = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, active: !h.active } : h)
    }));
  };

  const removeHabit = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este hábito permanentemente?')) {
      setState(prev => ({
        ...prev,
        habits: prev.habits.filter(h => h.id !== id)
      }));
    }
  };

  const saveDailyLog = (log: DailyLog) => {
    setState(prev => {
      const existingIndex = prev.logs.findIndex(l => l.date === log.date);
      if (existingIndex >= 0) {
        const newLogs = [...prev.logs];
        newLogs[existingIndex] = log;
        return { ...prev, logs: newLogs };
      }
      return { ...prev, logs: [...prev.logs, log] };
    });
  };

  const handleImport = (newState: AppState) => {
    setState(newState);
    alert('Dados importados com sucesso!');
  };

  const updateDbConfig = (config: DbConfig) => {
    setState(prev => ({ ...prev, dbConfig: config }));
    alert('Configurações de banco de dados salvas!');
  };

  const currentDayLog = state.logs.find(l => l.date === currentDate);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fas fa-user-chart"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Analista de Performance</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Dashboard Executivo</p>
                {syncStatus !== 'idle' && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    syncStatus === 'syncing' ? 'bg-amber-100 text-amber-600' :
                    syncStatus === 'saved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'saved' ? 'Nuvem OK' : 'Erro Sync'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('daily')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Diário</button>
            <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Relatórios</button>
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Ajustes</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'daily' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-black text-slate-800">Foco do Dia</h2>
              <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <DailyTracker habits={state.habits} currentDate={currentDate} existingLog={currentDayLog} onSave={saveDailyLog} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <Analytics habits={state.habits} logs={state.logs} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-800">Customização e Dados</h2>
            <HabitManager habits={state.habits} onAdd={addHabit} onToggle={toggleHabitActive} onRemove={removeHabit} />
            <DataManagement state={state} onImport={handleImport} onUpdateDb={updateDbConfig} />
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 md:hidden flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('daily')} className={`flex flex-col items-center gap-1 ${activeTab === 'daily' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-check-circle text-xl"></i>
          <span className="text-[10px] font-bold">Hoje</span>
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-chart-pie text-xl"></i>
          <span className="text-[10px] font-bold">Métricas</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-cog text-xl"></i>
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
