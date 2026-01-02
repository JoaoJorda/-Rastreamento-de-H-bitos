
import React, { useState } from 'react';
import { AppState, DbConfig } from '../types';

interface DataManagementProps {
  state: AppState;
  onImport: (newState: AppState) => void;
  onUpdateDb: (config: DbConfig) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ state, onImport, onUpdateDb }) => {
  const [url, setUrl] = useState(state.dbConfig?.url || '');
  const [key, setKey] = useState(state.dbConfig?.anonKey || '');

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `backup-habitos-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (confirm('Isso irá substituir todos os dados atuais. Continuar?')) {
            onImport(imported);
          }
        } catch (err) {
          alert('Erro ao importar arquivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <i className="fas fa-database text-blue-500"></i>
        Gestão de Dados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-2">Backup Local</h3>
          <p className="text-xs text-slate-500 mb-4">Exporte seus dados para um arquivo JSON ou importe um backup anterior.</p>
          <div className="flex gap-2">
            <button onClick={exportData} className="flex-1 bg-white border border-slate-300 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              Exportar JSON
            </button>
            <label className="flex-1 bg-white border border-slate-300 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer text-center">
              Importar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-2">Sincronização Nuvem (Supabase)</h3>
          <p className="text-xs text-indigo-700 mb-4">Conecte seu banco de dados para salvar dados permanentemente.</p>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Supabase URL" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-xs p-2 rounded border border-indigo-200"
            />
            <input 
              type="password" 
              placeholder="Anon Key" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full text-xs p-2 rounded border border-indigo-200"
            />
            <button 
              onClick={() => onUpdateDb({ url, anonKey: key, enabled: true })}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700"
            >
              Conectar e Sincronizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
