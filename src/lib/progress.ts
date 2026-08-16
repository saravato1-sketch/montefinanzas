import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { ProgressState, StudentProfile } from './types';
import { INITIAL_CASH } from './market';
import { MODULES } from './modules';
import { CHALLENGES } from './challenges';

const MODULES_LESSON_COUNT = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
const CHALLENGES_BY_DIFF: Record<string, number> = CHALLENGES.reduce((acc, c) => {
  acc[c.difficulty] = (acc[c.difficulty] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

const PROFILE_KEY = 'montefinanzas-profile';
const STATE_PREFIX = 'montefinanzas-state-';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function generateUserId(): string {
  return 'stu-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function loadProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

function saveProfile(profile: StudentProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function defaultState(userId: string, fullName: string): ProgressState {
  return {
    userId,
    fullName,
    points: 0,
    streak: 0,
    lastVisit: '',
    lastActivityDate: '',
    completedLessons: [],
    completedChallenges: [],
    badges: [],
    cash: INITIAL_CASH,
    holdings: [],
    simHistory: [{ day: 0, value: INITIAL_CASH }],
    simDay: 0,
    simTrades: 0,
    lastSimUpdate: '',
  };
}

function loadLocalState(userId: string): ProgressState | null {
  try {
    const raw = localStorage.getItem(STATE_PREFIX + userId);
    if (!raw) return null;
    return JSON.parse(raw) as ProgressState;
  } catch {
    return null;
  }
}

function saveLocalState(state: ProgressState) {
  localStorage.setItem(STATE_PREFIX + state.userId, JSON.stringify({ ...state, _savedAt: Date.now() }));
}

/**
 * Computes the real streak based on the last activity date.
 * - If the student was already active today, no change.
 * - If the last activity was yesterday, the streak increments.
 * - If more than one day was missed, the streak resets to 1.
 * - First-ever activity sets the streak to 1.
 */
function computeStreak(state: ProgressState): ProgressState {
  const today = todayStr();
  if (state.lastActivityDate === today) return state;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let streak: number;
  if (state.lastActivityDate === yesterday) {
    streak = state.streak + 1;
  } else if (state.lastActivityDate === '') {
    streak = 1;
  } else {
    streak = 1; // streak broken
  }

  const badges = new Set(state.badges);
  if (streak >= 3) badges.add('streak-3');
  if (streak >= 7) badges.add('streak-7');

  return { ...state, streak, lastActivityDate: today, lastVisit: today, badges: [...badges] };
}

export function useProgress() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => loadProfile());
  const [state, setState] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const saveTimer = useRef<number | null>(null);

  // Load state when a profile exists
  useEffect(() => {
    if (!profile) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const local = loadLocalState(profile.userId);
      let localDate = 0;
      try {
        const localRaw = localStorage.getItem(STATE_PREFIX + profile.userId);
        if (localRaw) localDate = (JSON.parse(localRaw)._savedAt as number) ?? 0;
      } catch {
        // ignore parse errors
      }

      try {
        setSyncing(true);
        const { data, error } = await supabase
          .from('student_progress')
          .select('payload, updated_at, full_name')
          .eq('id', profile.userId)
          .maybeSingle();

        if (error) throw error;

        if (!cancelled) {
          if (data?.payload) {
            const remote = data.payload as Partial<ProgressState>;
            const remoteDate = new Date(data.updated_at).getTime();
            const base =
              remoteDate > localDate
                ? { ...defaultState(profile.userId, profile.fullName), ...remote }
                : local ?? defaultState(profile.userId, profile.fullName);
            setState(computeStreak(base));
          } else {
            setState(computeStreak(local ?? defaultState(profile.userId, profile.fullName)));
          }
        }
      } catch {
        if (!cancelled) {
          setState(computeStreak(local ?? defaultState(profile.userId, profile.fullName)));
        }
      } finally {
        if (!cancelled) {
          setSyncing(false);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  // Persist state changes locally and to Supabase (debounced)
  useEffect(() => {
    if (!state) return;
    saveLocalState(state);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        await supabase.from('student_progress').upsert({
          id: state.userId,
          full_name: state.fullName,
          payload: state,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // ignore; local copy is the source of truth for UX
      }
    }, 800);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state]);

  const registerStudent = (fullName: string) => {
    const trimmed = fullName.trim();
    if (!trimmed) return;
    const userId = generateUserId();
    const newProfile: StudentProfile = { userId, fullName: trimmed };
    saveProfile(newProfile);
    setProfile(newProfile);
  };

  const changeStudent = () => {
    localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
    setState(null);
  };

  const update = (fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  };

  const completeLesson = (lessonId: string, points: number) => {
    setState((prev) => {
      if (!prev || prev.completedLessons.includes(lessonId)) return prev;
      const completedLessons = [...prev.completedLessons, lessonId];
      const badges = new Set(prev.badges);
      if (completedLessons.length === 1) badges.add('first-lesson');
      if (completedLessons.length >= MODULES_LESSON_COUNT / 2) badges.add('half-learn');
      if (completedLessons.length >= MODULES_LESSON_COUNT) badges.add('all-learn');
      return { ...prev, completedLessons, points: prev.points + points, badges: [...badges] };
    });
  };

  const completeChallenge = (challengeId: string, points: number, badge?: string) => {
    setState((prev) => {
      if (!prev || prev.completedChallenges.includes(challengeId)) return prev;
      const badges = new Set(prev.badges);
      if (badge) badges.add(badge);
      const completedChallenges = [...prev.completedChallenges, challengeId];
      const diff = CHALLENGES.find((c) => c.id === challengeId)?.difficulty;
      if (diff) {
        const done = completedChallenges.filter((id) => CHALLENGES.find((c) => c.id === id)?.difficulty === diff).length;
        if (done >= CHALLENGES_BY_DIFF[diff]) {
          const badgeMap: Record<string, string> = {
            Principiante: 'beginner-done',
            Aprendiz: 'apprentice-done',
            Estratega: 'strategist-done',
            Maestro: 'master-done',
          };
          badges.add(badgeMap[diff]);
        }
      }
      return {
        ...prev,
        completedChallenges,
        points: prev.points + points,
        badges: [...badges],
      };
    });
  };

  const addBadge = (badge: string) => {
    setState((prev) => {
      if (!prev || prev.badges.includes(badge)) return prev;
      return { ...prev, badges: [...prev.badges, badge] };
    });
  };

  const updateSim = (fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  };

  return {
    profile,
    state,
    loading,
    syncing,
    registerStudent,
    changeStudent,
    completeLesson,
    completeChallenge,
    addBadge,
    updateSim,
    update,
  };
}
