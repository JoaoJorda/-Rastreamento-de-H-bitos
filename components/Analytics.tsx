
import React, { useState, useMemo } from 'react';
import { Habit, DailyLog, ReportData } from '../types';
import { getMonthlyAnalysis } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsProps {
  habits: Habit[];
  logs: DailyLog[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ habits, logs }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const reportData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const activeHabits = habits.filter(h => h.active);
    
    return activeHabits.map(habit => {
      const monthLogs = logs.filter(log => {
        const d = new Date(log.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      });

      const completedCount = monthLogs.filter(log => log.completions[habit.id]).length;
      
      return {
        habitId: habit.id,
        name: habit.name,
        successRate: monthLogs.length > 0 ? (completedCount / monthLogs.length) * 100 : 0,
        totalDays: monthLogs.length,
        completedDays: completedCount
      };
    }).sort((a, b) => b.successRate - a.successRate);
  }, [habits, logs, selectedMonth, selectedYear]);

  const champion = reportData.length > 0 ? reportData[0] : null;
  const critical = reportData.length > 0 ? reportData[reportData.length - 1] : null;

  const handleGenerateAIReport = async () => {
    setIsAnalyzing(true);
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString('pt-BR', { month: 'long' });
    const analysis = await getMonthlyAnalysis(reportData, monthName);
    setAiAnalysis(analysis || "Análise concluída.");
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-chart-line text-indigo-500"></i>
            Relatório de Performance
          </h2>
          <div className="flex gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-1 rounded border border-slate-300 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
              ))}
            </select>
            <button
              onClick={handleGenerateAIReport}
              disabled={reportData.length === 0 || isAnalyzing}
              className="bg-indigo-600 text-white px-4 py-1 rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
              Análise IA
            </button>
          </div>
        </div>

        {reportData.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Nenhum dado registrado para este período.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={120} style={{ fontSize: '12px' }} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Consistência']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="successRate" radius={[0, 4, 4, 0]} barSize={20}>
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.successRate > 70 ? '#10b981' : entry.successRate > 40 ? '#6366f1' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div className="text-emerald-600 text-sm font-bold uppercase mb-1">Hábito Campeão</div>
                  <div className="text-xl font-bold text-emerald-900">{champion?.name}</div>
                  <div className="text-emerald-700 font-medium">{champion?.successRate.toFixed(1)}% de consistência</div>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                  <div className="text-rose-600 text-sm font-bold uppercase mb-1">Hábito Crítico</div>
                  <div className="text-xl font-bold text-rose-900">{critical?.name}</div>
                  <div className="text-rose-700 font-medium">{critical?.successRate.toFixed(1)}% - requer atenção</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <i className="fas fa-robot text-indigo-500"></i>
                Insights Estratégicos
              </h3>
              {aiAnalysis ? (
                <div className="prose prose-sm prose-indigo max-h-[400px] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed italic">
                    {aiAnalysis}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                  <i className="fas fa-brain text-slate-300 text-3xl mb-3"></i>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Aguardando comando</p>
                  <p className="text-slate-500 text-sm mt-2">Clique em "Análise IA" para um relatório detalhado de performance.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <h3 className="font-bold text-slate-700 mb-4">Tabela de Resumo Mensal</h3>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-4 py-3">Hábito</th>
              <th className="px-4 py-3 text-center">Dias Concluídos</th>
              <th className="px-4 py-3 text-center">Taxa de Sucesso</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reportData.map((data) => (
              <tr key={data.habitId} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{data.name}</td>
                <td className="px-4 py-3 text-center">{data.completedDays} / {data.totalDays}</td>
                <td className="px-4 py-3 text-center">
                   <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px] mx-auto overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${data.successRate > 70 ? 'bg-emerald-500' : data.successRate > 40 ? 'bg-indigo-500' : 'bg-rose-500'}`} 
                      style={{ width: `${data.successRate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">{data.successRate.toFixed(0)}%</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    data.successRate > 80 ? 'bg-emerald-100 text-emerald-700' :
                    data.successRate > 60 ? 'bg-indigo-100 text-indigo-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {data.successRate > 80 ? 'Excelente' : data.successRate > 60 ? 'Bom' : 'Crítico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
