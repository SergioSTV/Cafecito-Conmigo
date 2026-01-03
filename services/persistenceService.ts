
import { JournalEntry, Goal, AnalysisReport, UserSettings } from "../types";

const KEYS = {
  ENTRIES: 'cafecito_entries',
  GOALS: 'cafecito_goals',
  REPORTS: 'cafecito_reports',
  SETTINGS: 'cafecito_settings'
};

export const PersistenceService = {
  getEntries: (): JournalEntry[] => {
    const data = localStorage.getItem(KEYS.ENTRIES);
    return data ? JSON.parse(data) : [];
  },
  saveEntry: (entry: JournalEntry) => {
    const entries = PersistenceService.getEntries();
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify([entry, ...entries]));
  },
  deleteEntry: (id: string) => {
    const entries = PersistenceService.getEntries();
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries.filter(e => e.id !== id)));
  },
  
  getGoals: (): Goal[] => {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },
  saveGoal: (goal: Goal) => {
    const goals = PersistenceService.getGoals();
    localStorage.setItem(KEYS.GOALS, JSON.stringify([goal, ...goals]));
  },
  updateGoal: (id: string, completed: boolean) => {
    const goals = PersistenceService.getGoals();
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals.map(g => g.id === id ? { ...g, completed } : g)));
  },
  deleteGoal: (id: string) => {
    const goals = PersistenceService.getGoals();
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals.filter(g => g.id !== id)));
  },

  getReports: (): AnalysisReport[] => {
    const data = localStorage.getItem(KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  },
  saveReport: (report: AnalysisReport) => {
    const reports = PersistenceService.getReports();
    localStorage.setItem(KEYS.REPORTS, JSON.stringify([report, ...reports]));
  },
  deleteReport: (id: string) => {
    const reports = PersistenceService.getReports();
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports.filter(r => r.id !== id)));
  },

  getSettings: (): UserSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  },
  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};
