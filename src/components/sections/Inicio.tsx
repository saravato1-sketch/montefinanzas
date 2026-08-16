import { TrendingUp, GraduationCap, LineChart, Trophy, Flame, Award, BookOpen, ChevronRight } from 'lucide-react';
import type { Section, ProgressState } from '@/lib/types';
import { getLevel, BADGES } from '@/lib/levels';
import { MODULES } from '@/lib/modules';
import { CHALLENGES } from '@/lib/challenges';

interface InicioProps {
  state: ProgressState;
  onNavigate: (s: Section) => void;
}

export default function Inicio({ state, onNavigate }: InicioProps) {
  const { current, progress, remaining } = getLevel(state.points);
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const learnPct = Math.round((state.completedLessons.length / totalLessons) * 100);
  const challengePct = Math.round((state.completedChallenges.length / CHALLENGES.length) * 100);
  const portfolioValue = state.holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const totalValue = state.cash + portfolioValue;
  const profit = totalValue - 10_000_000;
  const profitPct = (profit / 10_000_000) * 100;

  const quickCards: { id: Section; title: string; desc: string; icon: typeof TrendingUp; color: string }[] = [
    { id: 'aprende', title: 'Aprende', desc: 'Lecciones cortas y didácticas', icon: GraduationCap, color: 'from-sky-400 to-blue-500' },
    { id: 'mercado', title: 'Mercado', desc: 'Dólar, euro y acciones en vivo', icon: TrendingUp, color: 'from-emerald-400 to-teal-500' },
    { id: 'simula', title: 'Simula', desc: 'Invierte con dinero virtual', icon: LineChart, color: 'from-violet-400 to-indigo-500' },
    { id: 'retos', title: 'Retos', desc: 'Pon a prueba lo aprendido', icon: Trophy, color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-6 md:p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-sky-100 text-sm font-medium">¡Hola, {state.fullName.split(' ')[0]}! Bienvenido a</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">MONTEFINANZAS</h1>
            <p className="mt-2 text-sky-50 max-w-md text-sm md:text-base">
              Tu plataforma para aprender finanzas paso a paso, simular inversiones y convertirte en un estratega del dinero.
            </p>
            <button
              onClick={() => onNavigate('aprende')}
              className="mt-4 inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <BookOpen className="h-4 w-4" /> Empezar a aprender
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.14_PM_(1).jpeg"
              alt="Bolsa Millonaria"
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/40 shadow-lg"
            />
            <img
              src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.13_PM_(1).jpeg"
              alt="Colegio Monterrosales"
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/40 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={<Award className="h-5 w-5" />} label="Puntos" value={state.points.toLocaleString('es-CO')} color="text-amber-500" bg="bg-amber-50" />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Racha" value={`${state.streak} días`} color="text-orange-500" bg="bg-orange-50" />
        <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Lecciones" value={`${state.completedLessons.length}/${totalLessons}`} color="text-sky-500" bg="bg-sky-50" />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Retos" value={`${state.completedChallenges.length}/${CHALLENGES.length}`} color="text-violet-500" bg="bg-violet-50" />
      </div>

      {/* Level progress */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.emoji}</span>
            <div>
              <p className="font-bold text-slate-800">Nivel: {current.name}</p>
              <p className="text-xs text-slate-500">Te faltan {remaining.toLocaleString('es-CO')} puntos para {current.name === 'Maestro' ? 'el máximo' : 'subir de nivel'}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-blue-600">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-sky-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${current.color} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Acceso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {quickCards.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => onNavigate(c.id)}
                className="group text-left bg-white rounded-2xl p-4 border border-sky-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${c.color} text-white mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-bold text-slate-800">{c.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Ir <ChevronRight className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator mini-summary */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Tu simulador</h2>
          <button onClick={() => onNavigate('simula')} className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
            Abrir <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-sky-50 rounded-xl p-3">
            <p className="text-[11px] text-slate-500">Saldo</p>
            <p className="font-bold text-sky-700 text-sm">${state.cash.toLocaleString('es-CO')}</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-3">
            <p className="text-[11px] text-slate-500">Portafolio</p>
            <p className="font-bold text-violet-700 text-sm">${portfolioValue.toLocaleString('es-CO')}</p>
          </div>
          <div className={`rounded-xl p-3 ${profit >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            <p className="text-[11px] text-slate-500">Ganancia</p>
            <p className={`font-bold text-sm ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {profit >= 0 ? '+' : ''}{profit.toLocaleString('es-CO')} ({profitPct.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Badges preview */}
      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-3">Insignias</h2>
        <div className="flex flex-wrap gap-3">
          {BADGES.slice(0, 6).map((b) => {
            const earned = state.badges.includes(b.id);
            return (
              <div key={b.id} className={`flex flex-col items-center w-20 text-center ${earned ? '' : 'opacity-40 grayscale'}`}>
                <span className="text-3xl">{b.emoji}</span>
                <span className="text-[10px] font-semibold text-slate-600 mt-1">{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
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
