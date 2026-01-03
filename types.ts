
export interface MediaItem {
  id: string;
  type: 'image' | 'audio' | 'drawing';
  data: string; // Base64 string
  mimeType: string;
}

export interface Sugerencia {
  titulo: string;
  tipo: 'libro' | 'articulo' | 'video' | 'mindfulness' | 'gratitud' | 'inspiracion';
  descripcion: string;
  link?: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string; // ISO String
  media?: MediaItem[];
  isFavorite?: boolean;
  tags?: string[];
  category?: 'personal' | 'trabajo' | 'reflexion' | 'otro';
  emotion?: 'calma' | 'ansiedad' | 'alegria' | 'tristeza' | 'ira' | 'misterio';
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface EmotionalPoint {
  fecha: string;
  score: number; // -5 to 5
}

export interface AnalysisReport {
  id: string;
  resumen: string;
  evolucion: string;
  puntosEmocionales: EmotionalPoint[];
  pautas?: string[]; // Pasos a seguir o tips
  sugerencias: Sugerencia[];
  range: {
    start: string;
    end: string;
  };
  savedAt: string;
  groundingChunks?: any[];
}

export type TabType = 'editor' | 'calendar' | 'analysis' | 'goals' | 'metrics';

export interface UserSettings {
  pin?: string;
  highestStreak?: number;
  biometricsEnabled?: boolean;
  autoLockEnabled?: boolean;
}
