import type { Level } from './types';

export const LEVELS: { name: Level; min: number; max: number; emoji: string; color: string }[] = [
  { name: 'Principiante', min: 0, max: 500, emoji: '🌱', color: 'from-sky-400 to-blue-500' },
  { name: 'Aprendiz', min: 500, max: 1500, emoji: '⚡', color: 'from-blue-500 to-indigo-500' },
  { name: 'Estratega', min: 1500, max: 3500, emoji: '🎯', color: 'from-indigo-500 to-violet-500' },
  { name: 'Maestro', min: 3500, max: 10000, emoji: '👑', color: 'from-amber-400 to-orange-500' },
];

export function getLevel(points: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? LEVELS[i];
    }
  }
  const range = current.max - current.min;
  const progress = range > 0 ? Math.min(100, ((points - current.min) / range) * 100) : 100;
  const remaining = Math.max(0, current.max - points);
  return { current, next, progress, remaining };
}

export const BADGES: { id: string; name: string; emoji: string; description: string }[] = [
  { id: 'first-lesson', name: 'Primer Paso', emoji: '🎓', description: 'Completaste tu primera lección' },
  { id: 'first-challenge', name: 'Explorador', emoji: '🧭', description: 'Respondiste tu primer reto' },
  { id: 'first-trade', name: 'Inversor', emoji: '📈', description: 'Hiciste tu primera operación en el simulador' },
  { id: 'streak-3', name: 'Constante', emoji: '🔥', description: 'Mantuviste una racha de 3 días' },
  { id: 'streak-7', name: 'Disciplinado', emoji: '💎', description: 'Mantuviste una racha de 7 días' },
  { id: 'beginner-done', name: 'Base Sólida', emoji: '🌱', description: 'Completaste todos los retos Principiante' },
  { id: 'apprentice-done', name: 'En Marcha', emoji: '⚡', description: 'Completaste todos los retos Aprendiz' },
  { id: 'strategist-done', name: 'Pensador', emoji: '🎯', description: 'Completaste todos los retos Estratega' },
  { id: 'master-done', name: 'Maestría', emoji: '👑', description: 'Completaste todos los retos Maestro' },
  { id: 'half-learn', name: 'Estudioso', emoji: '📚', description: 'Completaste el 50% de las lecciones' },
  { id: 'all-learn', name: 'Sabio', emoji: '🦉', description: 'Completaste todas las lecciones' },
  { id: 'profit', name: 'Ojo de Águila', emoji: '🦅', description: 'Lograste ganancias en el simulador' },
];
