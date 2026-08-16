import { Home, TrendingUp, GraduationCap, LineChart, Trophy, User, Images, LogOut } from 'lucide-react';
import type { Section } from '@/lib/types';
import { getLevel } from '@/lib/levels';

interface SidebarProps {
  active: Section;
  onNavigate: (s: Section) => void;
  points: number;
  streak: number;
  fullName: string;
  onChangeStudent: () => void;
}

const ITEMS: { id: Section; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'mercado', label: 'Mercado', icon: TrendingUp },
  { id: 'aprende', label: 'Aprende', icon: GraduationCap },
  { id: 'simula', label: 'Simula', icon: LineChart },
  { id: 'retos', label: 'Retos', icon: Trophy },
  { id: 'galeria', label: 'Galería', icon: Images },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export default function Sidebar({ active, onNavigate, points, streak, fullName, onChangeStudent }: SidebarProps) {
  const { current } = getLevel(points);
  const firstName = fullName.split(' ')[0];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white/90 backdrop-blur border-r border-sky-100 h-screen sticky top-0">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-sky-50">
          <img
            src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.14_PM_(1).jpeg"
            alt="MonteFinanzas"
            className="h-12 w-12 rounded-xl object-cover ring-2 ring-sky-200"
          />
          <div>
            <p className="font-extrabold text-blue-700 leading-tight tracking-tight">MONTEFINANZAS</p>
            <p className="text-[11px] text-slate-500">Aprende. Simula. Crece.</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-blue-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-sky-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-sky-50 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{firstName}</p>
              <p className="text-[10px] text-slate-400">{current.emoji} {current.name}</p>
            </div>
            <button
              onClick={onChangeStudent}
              title="Cambiar de estudiante"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Puntos</span>
            <span className="font-bold text-amber-500">{points.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Racha</span>
            <span className="font-bold text-orange-500">🔥 {streak} días</span>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-sky-100 px-2 py-1.5 flex justify-around">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive ? 'text-blue-700' : 'text-slate-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-sky-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.14_PM_(1).jpeg"
            alt="MonteFinanzas"
            className="h-9 w-9 rounded-lg object-cover ring-2 ring-sky-200"
          />
          <div>
            <p className="font-extrabold text-blue-700 tracking-tight text-sm">MONTEFINANZAS</p>
            <p className="text-[10px] text-slate-400">Hola, {firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-amber-500">{points.toLocaleString('es-CO')}</span>
          <span className="text-orange-500">🔥 {streak}</span>
        </div>
      </header>
    </>
  );
}
