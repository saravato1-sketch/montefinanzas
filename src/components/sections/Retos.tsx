import { useState } from 'react';
import { Trophy, Flame, Star, CheckCircle2, Lock, ChevronRight, Award } from 'lucide-react';
import { CHALLENGES } from '@/lib/challenges';
import { getLevel, BADGES } from '@/lib/levels';
import type { Challenge, Level, ProgressState } from '@/lib/types';

interface RetosProps {
  state: ProgressState;
  onCompleteChallenge: (id: string, points: number, badge?: string) => void;
}

const DIFF_ORDER: Level[] = ['Principiante', 'Aprendiz', 'Estratega', 'Maestro'];
const DIFF_COLOR: Record<Level, string> = {
  Principiante: 'from-emerald-400 to-teal-500',
  Aprendiz: 'from-sky-400 to-blue-500',
  Estratega: 'from-violet-400 to-indigo-500',
  Maestro: 'from-amber-400 to-orange-500',
};
const DIFF_EMOJI: Record<Level, string> = { Principiante: '🌱', Aprendiz: '⚡', Estratega: '🎯', Maestro: '👑' };

export default function Retos({ state, onCompleteChallenge }: RetosProps) {
  const [active, setActive] = useState<Challenge | null>(null);
  const { current, progress, remaining } = getLevel(state.points);

  const isUnlocked = (idx: number) => {
    if (idx === 0) return true;
    const prevDiff = DIFF_ORDER[idx - 1];
    const prevChallenges = CHALLENGES.filter((c) => c.difficulty === prevDiff);
    return prevChallenges.every((c) => state.completedChallenges.includes(c.id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Retos financieros</h1>
        <p className="text-sm text-slate-500">Pon a prueba lo que aprendes. Cada reto enseña y da puntos.</p>
      </div>

      {/* Gamification summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={<Star className="h-5 w-5" />} label="Puntos totales" value={state.points.toLocaleString('es-CO')} color="text-amber-500" bg="bg-amber-50" />
        <Stat icon={<Trophy className="h-5 w-5" />} label="Retos completados" value={`${state.completedChallenges.length}/${CHALLENGES.length}`} color="text-violet-500" bg="bg-violet-50" />
        <Stat icon={<Flame className="h-5 w-5" />} label="Racha" value={`${state.streak} días`} color="text-orange-500" bg="bg-orange-50" />
        <Stat icon={<Award className="h-5 w-5" />} label="Insignias" value={`${state.badges.length}/${BADGES.length}`} color="text-blue-500" bg="bg-blue-50" />
      </div>

      {/* Level progress */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{current.emoji}</span>
            <p className="font-bold text-slate-700 text-sm">Nivel: {current.name}</p>
          </div>
          <p className="text-xs text-slate-500">Te faltan {remaining.toLocaleString('es-CO')} puntos</p>
        </div>
        <div className="h-3 bg-sky-100 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${current.color} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Challenges by difficulty */}
      {DIFF_ORDER.map((diff, idx) => {
        const unlocked = isUnlocked(idx);
        const challenges = CHALLENGES.filter((c) => c.difficulty === diff);
        const doneCount = challenges.filter((c) => state.completedChallenges.includes(c.id)).length;
        return (
          <div key={diff} className={`bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden ${!unlocked ? 'opacity-60' : ''}`}>
            <div className={`bg-gradient-to-r ${DIFF_COLOR[diff]} text-white px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{DIFF_EMOJI[diff]}</span>
                <p className="font-bold">{diff}</p>
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-lg">{doneCount}/{challenges.length}</span>
            </div>
            <div className="p-3 space-y-1">
              {!unlocked && (
                <div className="flex items-center gap-2 text-xs text-slate-400 px-2 py-3">
                  <Lock className="h-4 w-4" /> Completa todos los retos de {DIFF_ORDER[idx - 1]} para desbloquear
                </div>
              )}
              {unlocked && challenges.map((c) => {
                const done = state.completedChallenges.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(c)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 transition text-left"
                  >
                    {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Trophy className="h-5 w-5 text-slate-300 shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{c.scenario}</p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-500">+{c.points}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Challenge modal */}
      {active && (
        <ChallengeView
          challenge={active}
          alreadyDone={state.completedChallenges.includes(active.id)}
          onClose={() => setActive(null)}
          onComplete={() => onCompleteChallenge(active.id, active.points, active.badge)}
        />
      )}
    </div>
  );
}

function ChallengeView({ challenge, alreadyDone, onClose, onComplete }: { challenge: Challenge; alreadyDone: boolean; onClose: () => void; onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (optId: string) => {
    if (answered) return;
    setSelected(optId);
    setAnswered(true);
    if (!alreadyDone) onComplete();
  };

  const selectedOpt = challenge.options.find((o) => o.id === selected);
  const correctOpt = challenge.options.find((o) => o.correct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className={`bg-gradient-to-r ${DIFF_COLOR[challenge.difficulty]} text-white p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{DIFF_EMOJI[challenge.difficulty]}</span>
              <p className="font-bold">{challenge.title}</p>
            </div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">+{challenge.points} pts</span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-sky-50 rounded-xl p-3">
            <p className="text-xs font-bold text-blue-600 mb-1">SITUACIÓN</p>
            <p className="text-sm text-slate-700">{challenge.scenario}</p>
          </div>
          <div>
            <p className="font-bold text-slate-800 mb-3">{challenge.question}</p>
            <div className="space-y-2">
              {challenge.options.map((o) => {
                const isSel = selected === o.id;
                const showResult = answered && (isSel || o.correct);
                let cls = 'border-slate-200 hover:border-blue-300 hover:bg-sky-50';
                if (showResult) {
                  if (o.correct) cls = 'border-emerald-400 bg-emerald-50';
                  else if (isSel) cls = 'border-rose-400 bg-rose-50';
                  else cls = 'border-slate-200 opacity-50';
                }
                return (
                  <button
                    key={o.id}
                    onClick={() => handleSelect(o.id)}
                    disabled={answered}
                    className={`w-full text-left p-3 rounded-xl border-2 transition ${cls}`}
                  >
                    <p className="text-sm font-medium text-slate-700">{o.text}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {answered && selectedOpt && (
            <div className={`rounded-xl p-4 ${selectedOpt.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
              <p className={`font-bold text-sm mb-1 ${selectedOpt.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                {selectedOpt.correct ? '¡Correcto!' : 'Respuesta incorrecta'}
              </p>
              <p className="text-sm text-slate-700">{selectedOpt.explanation}</p>
              {!selectedOpt.correct && correctOpt && (
                <p className="text-xs text-emerald-600 mt-2">La respuesta correcta era: <strong>{correctOpt.text}</strong></p>
              )}
              {!alreadyDone && (
                <p className="text-xs font-bold text-amber-500 mt-2">+{challenge.points} puntos ganados</p>
              )}
            </div>
          )}

          {answered && (
            <button onClick={onClose} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition">
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${bg} ${color}`}>{icon}</div>
      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
