import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Welcome from '@/components/Welcome';
import Inicio from '@/components/sections/Inicio';
import Mercado from '@/components/sections/Mercado';
import Aprende from '@/components/sections/Aprende';
import Simula from '@/components/sections/Simula';
import Retos from '@/components/sections/Retos';
import Perfil from '@/components/sections/Perfil';
import Galeria from '@/components/sections/Galeria';
import { useProgress } from '@/lib/progress';
import type { Section } from '@/lib/types';

export default function App() {
  const [section, setSection] = useState<Section>('inicio');
  const {
    profile,
    state,
    loading,
    registerStudent,
    changeStudent,
    completeLesson,
    completeChallenge,
    addBadge,
    updateSim,
  } = useProgress();

  if (!profile || !state) {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 border-4 border-sky-200 border-t-blue-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-500 font-medium">Cargando MonteFinanzas...</p>
          </div>
        </div>
      );
    }
    return <Welcome onRegister={registerStudent} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-800">
      <div className="flex">
        <Sidebar
          active={section}
          onNavigate={setSection}
          points={state.points}
          streak={state.streak}
          fullName={state.fullName}
          onChangeStudent={changeStudent}
        />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-5 md:py-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
          {section === 'inicio' && <Inicio state={state} onNavigate={setSection} />}
          {section === 'mercado' && <Mercado />}
          {section === 'aprende' && <Aprende state={state} onCompleteLesson={completeLesson} />}
          {section === 'simula' && <Simula state={state} onUpdateSim={updateSim} onAddBadge={addBadge} />}
          {section === 'retos' && <Retos state={state} onCompleteChallenge={completeChallenge} />}
          {section === 'galeria' && <Galeria />}
          {section === 'perfil' && <Perfil state={state} onChangeStudent={changeStudent} />}
        </main>
      </div>
    </div>
  );
}
