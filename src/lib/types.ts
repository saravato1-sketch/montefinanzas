export type Section = 'inicio' | 'mercado' | 'aprende' | 'simula' | 'retos' | 'perfil' | 'galeria';

export type Level = 'Principiante' | 'Aprendiz' | 'Estratega' | 'Maestro';

export interface LessonOption {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  example: string;
  question: string;
  options: LessonOption[];
  tip?: string;
  points: number;
}

export interface Module {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export interface ChallengeOption {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: Level;
  scenario: string;
  question: string;
  options: ChallengeOption[];
  points: number;
  badge?: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  emoji: string;
  price: number;
  currency: 'COP' | 'USD';
  change: number;
  changePercent: number;
  history: number[];
  explanation: string;
}

export interface SimAsset {
  symbol: string;
  name: string;
  emoji: string;
  price: number;
  volatility: number;
  drift: number;
  category: 'moneda' | 'accion' | 'fondo';
  risk: 'bajo' | 'medio' | 'alto';
  description: string;
}

export interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
}

export interface ProgressState {
  userId: string;
  fullName: string;
  points: number;
  streak: number;
  lastVisit: string;
  lastActivityDate: string;
  completedLessons: string[];
  completedChallenges: string[];
  badges: string[];
  cash: number;
  holdings: Holding[];
  simHistory: { day: number; value: number }[];
  simDay: number;
  simTrades: number;
  lastSimUpdate: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
}
