import { Star, Flame, Trophy, Award, BookOpen, LineChart, TrendingUp, TrendingDown, LogOut } from 'lucide-react';
import type { ProgressState } from '@/lib/types';
import { getLevel, BADGES } from '@/lib/levels';
import { MODULES } from '@/lib/modules';
import { CHALLENGES } from '@/lib/challenges';
import { INITIAL_CASH } from '@/lib/market';

interface PerfilProps {
  state: ProgressState;
  onChangeStudent: () => void;
}

export default function Perfil({ state, onChangeStudent }: PerfilProps) {
  const { current, progress, remaining } = getLevel(state.points);
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const learnPct = Math.round((state.completedLessons.length / totalLessons) * 100);
  const challengePct = Math.round((state.completedChallenges.length / CHALLENGES.length) * 100);
  const portfolioValue = state.holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const totalValue = state.cash + portfolioValue;
  const profit = totalValue - INITIAL_CASH;
  const profitPct = (profit / INITIAL_CASH) * 100;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Tu perfil</h1>
        <p className="text-sm text-slate-500">Mira todo lo que has logrado en MonteFinanzas.</p>
      </div>

      {/* Profile header */}
      <div className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            {current.emoji}
          </div>
          <div className="flex-1">
            <p className="text-xs text-sky-100">{state.fullName}</p>
            <p className="text-xl font-extrabold">Nivel {current.name}</p>
            <p className="text-xs text-sky-100">{state.points.toLocaleString('es-CO')} puntos · 🔥 {state.streak} días de racha</p>
          </div>
          <button
            onClick={onChangeStudent}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Cambiar
          </button>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progreso al siguiente nivel</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[11px] text-sky-100 mt-1">Te faltan {remaining.toLocaleString('es-CO')} puntos para subir de nivel</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={<Star className="h-5 w-5" />} label="Puntos totales" value={state.points.toLocaleString('es-CO')} color="text-amber-500" bg="bg-amber-50" />
        <Stat icon={<Flame className="h-5 w-5" />} label="Racha" value={`${state.streak} días`} color="text-orange-500" bg="bg-orange-50" />
        <Stat icon={<BookOpen className="h-5 w-5" />} label="Lecciones" value={`${state.completedLessons.length}/${totalLessons}`} sub={`${learnPct}%`} color="text-sky-500" bg="bg-sky-50" />
        <Stat icon={<Trophy className="h-5 w-5" />} label="Retos" value={`${state.completedChallenges.length}/${CHALLENGES.length}`} sub={`${challengePct}%`} color="text-violet-500" bg="bg-violet-50" />
      </div>

      {/* Simulator stats */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <LineChart className="h-5 w-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Estadísticas del simulador</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat label="Saldo" value={`$${state.cash.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`} />
          <MiniStat label="Portafolio" value={`$${portfolioValue.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`} />
          <MiniStat label="Operaciones" value={`${state.simTrades}`} />
          <MiniStat
            label="Rendimiento"
            value={`${profit >= 0 ? '+' : ''}${profitPct.toFixed(1)}%`}
            color={profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}
            icon={profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-5 w-5 text-amber-500" />
          <h2 className="font-bold text-slate-800">Insignias ({state.badges.length}/{BADGES.length})</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {BADGES.map((b) => {
            const earned = state.badges.includes(b.id);
            return (
              <div key={b.id} className={`flex flex-col items-center text-center p-2 rounded-xl ${earned ? 'bg-amber-50' : 'bg-slate-50 opacity-50 grayscale'}`}>
                <span className="text-3xl">{b.emoji}</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">{b.name}</p>
                <p className="text-[9px] text-slate-400 leading-tight">{b.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Institutional logos */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-3">Identidad institucional</h2>
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <img src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.14_PM_(1).jpeg" alt="Bolsa Millonaria" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-sky-200" />
            <p className="text-[11px] font-semibold text-slate-500">Bolsa Millonaria</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.13_PM_(1).jpeg" alt="Colegio Monterrosales" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-sky-200" />
            <p className="text-[11px] font-semibold text-slate-500">Colegio Monterrosales</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, sub, color, bg }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${bg} ${color}`}>{icon}</div>
      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="font-bold text-slate-800">{value}</p>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color, icon }: { label: string; value: string; color?: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-sky-50 rounded-xl p-3 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`font-bold ${color ?? 'text-slate-800'} flex items-center justify-center gap-1`}>
        {icon}{value}
      </p>
    </div>
  );
}
