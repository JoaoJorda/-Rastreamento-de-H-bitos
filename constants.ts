
import { Habit } from './types';

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Engolir o Sapo', active: true, createdAt: new Date().toISOString(), weeklyTarget: 5 },
  { id: '2', name: 'Ler 15 min', active: true, createdAt: new Date().toISOString(), weeklyTarget: 7 },
  { id: '3', name: 'Prospectar (30 contatos)', active: true, createdAt: new Date().toISOString(), weeklyTarget: 5 },
  { id: '4', name: 'Estudar automação', active: true, createdAt: new Date().toISOString(), weeklyTarget: 4 },
  { id: '5', name: 'Estudar Vendas', active: true, createdAt: new Date().toISOString(), weeklyTarget: 4 },
  { id: '6', name: 'Criar/Testar Workflow', active: true, createdAt: new Date().toISOString(), weeklyTarget: 3 },
  { id: '7', name: 'Alimentar-se bem', active: true, createdAt: new Date().toISOString(), weeklyTarget: 7 },
  { id: '8', name: 'Diário de Vitórias', active: true, createdAt: new Date().toISOString(), weeklyTarget: 7 },
  { id: '9', name: 'Organizar Agenda', active: true, createdAt: new Date().toISOString(), weeklyTarget: 6 },
  { id: '10', name: 'Dormir 6h', active: true, createdAt: new Date().toISOString(), weeklyTarget: 7 },
  { id: '11', name: 'Estudar APIs', active: true, createdAt: new Date().toISOString(), weeklyTarget: 3 }
];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
