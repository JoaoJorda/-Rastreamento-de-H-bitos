
export interface Habit {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  weeklyTarget: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completions: Record<string, boolean>; // habitId -> completed
}

export interface DbConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export interface AppState {
  habits: Habit[];
  logs: DailyLog[];
  dbConfig?: DbConfig;
}

export interface ReportData {
  habitId: string;
  name: string;
  successRate: number;
  totalDays: number;
  completedDays: number;
}
