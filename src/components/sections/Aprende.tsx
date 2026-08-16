import { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Lightbulb, Sparkles, Lock } from 'lucide-react';
import { MODULES } from '@/lib/modules';
import type { Lesson, ProgressState } from '@/lib/types';
import Sparkline from '@/components/Sparkline';

interface AprendeProps {
  state: ProgressState;
  onCompleteLesson: (lessonId: string, points: number) => void;
}

export default function Aprende({ state, onCompleteLesson }: AprendeProps) {
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ module: string; lesson: Lesson } | null>(null);

  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const overallPct = Math.round((state.completedLessons.length / totalLessons) * 100);

  const open = (moduleId: string) => setOpenModule(openModule === moduleId ? null : moduleId);

  const startLesson = (moduleId: string, lesson: Lesson) => {
    setActiveLesson({ module: moduleId, lesson });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Aprende finanzas paso a paso</h1>
        <p className="text-sm text-slate-500">Lecciones cortas, con ejemplos y preguntas para practicar.</p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-slate-700">Progreso general</p>
          <p className="text-sm font-bold text-blue-600">{state.completedLessons.length}/{totalLessons} lecciones ({overallPct}%)</p>
        </div>
        <div className="h-3 bg-sky-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        {MODULES.map((m, idx) => {
          const completedInModule = m.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
          const modulePct = Math.round((completedInModule / m.lessons.length) * 100);
          const prevModule = idx > 0 ? MODULES[idx - 1] : null;
          const prevDone = !prevModule || prevModule.lessons.every((l) => state.completedLessons.includes(l.id));
          const unlocked = idx === 0 || prevDone;

          return (
            <div key={m.id} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
              <button
                onClick={() => unlocked && open(m.id)}
                className={`w-full flex items-center gap-4 p-4 text-left ${unlocked ? 'hover:bg-sky-50/50' : 'cursor-not-allowed'}`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${m.color} text-white shrink-0`}>
                  <span className="text-2xl">{m.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800">{m.title}</p>
                  <p className="text-xs text-slate-500 truncate">{m.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-sky-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all`} style={{ width: `${modulePct}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{completedInModule}/{m.lessons.length}</span>
                  </div>
                </div>
                {unlocked ? (
                  <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${openModule === m.id ? 'rotate-90' : ''}`} />
                ) : (
                  <Lock className="h-5 w-5 text-slate-300" />
                )}
              </button>

              {openModule === m.id && unlocked && (
                <div className="px-4 pb-4 space-y-2">
                  {m.lessons.map((l) => {
                    const done = state.completedLessons.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => startLesson(m.id, l)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-sky-50/60 hover:bg-sky-100 transition text-left"
                      >
                        {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Circle className="h-5 w-5 text-slate-300 shrink-0" />}
                        <span className="text-lg">{l.emoji}</span>
                        <span className="flex-1 text-sm font-semibold text-slate-700">{l.title}</span>
                        <span className="text-[11px] font-bold text-amber-500">+{l.points}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson modal */}
      {activeLesson && (
        <LessonView
          lesson={activeLesson.lesson}
          alreadyDone={state.completedLessons.includes(activeLesson.lesson.id)}
          onClose={() => setActiveLesson(null)}
          onComplete={() => onCompleteLesson(activeLesson.lesson.id, activeLesson.lesson.points)}
        />
      )}
    </div>
  );
}

function LessonView({ lesson, alreadyDone, onClose, onComplete }: { lesson: Lesson; alreadyDone: boolean; onClose: () => void; onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (optId: string) => {
    if (answered) return;
    setSelected(optId);
    setAnswered(true);
    if (!alreadyDone) onComplete();
  };

  const correct = lesson.options.find((o) => o.correct);
  const selectedOpt = lesson.options.find((o) => o.id === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{lesson.emoji}</span>
            <p className="font-bold">{lesson.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition">
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Intro */}
          <div className="bg-sky-50 rounded-xl p-4">
            <p className="text-sm text-slate-700">{lesson.intro}</p>
          </div>

          {/* Example */}
          <div className="border-l-4 border-amber-400 bg-amber-50/60 pl-3 pr-4 py-3 rounded-r-xl">
            <p className="text-xs font-bold text-amber-600 mb-1">EJEMPLO DE LA VIDA REAL</p>
            <p className="text-sm text-slate-700">{lesson.example}</p>
          </div>

          {/* Tip */}
          {lesson.tip && (
            <div className="flex items-start gap-2 bg-violet-50 rounded-xl p-3">
              <Lightbulb className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600"><strong>¿Sabías que?</strong> {lesson.tip}</p>
            </div>
          )}

          {/* Question */}
          <div>
            <p className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> {lesson.question}
            </p>
            <div className="space-y-2">
              {lesson.options.map((o) => {
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

          {/* Explanation */}
          {answered && selectedOpt && (
            <div className={`rounded-xl p-4 ${selectedOpt.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
              <p className={`font-bold text-sm mb-1 ${selectedOpt.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                {selectedOpt.correct ? '¡Correcto!' : 'Respuesta incorrecta'}
              </p>
              <p className="text-sm text-slate-700">{selectedOpt.explanation}</p>
              {!selectedOpt.correct && correct && (
                <p className="text-xs text-emerald-600 mt-2">La respuesta correcta era: <strong>{correct.text}</strong></p>
              )}
              {!alreadyDone && (
                <p className="text-xs font-bold text-amber-500 mt-2">+{lesson.points} puntos ganados</p>
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
