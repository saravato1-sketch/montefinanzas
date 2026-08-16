import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeProps {
  onRegister: (fullName: string) => void;
}

export default function Welcome({ onRegister }: WelcomeProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setError('Por favor escribe tu nombre completo (al menos 3 letras).');
      return;
    }
    if (trimmed.length > 60) {
      setError('El nombre es demasiado largo. Usa máximo 60 caracteres.');
      return;
    }
    setError('');
    onRegister(trimmed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl animate-pulse" />
      </div>

      <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-2xl shadow-blue-500/10 max-w-md w-full p-6 md:p-8 animate-pop">
        {/* Logos */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.14_PM_(1).jpeg"
            alt="Bolsa Millonaria"
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-sky-200 shadow-md"
          />
          <img
            src="/assets/logos/WhatsApp_Image_2026-08-14_at_4.48.13_PM_(1).jpeg"
            alt="Colegio Monterrosales"
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-sky-200 shadow-md"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight">MONTEFINANZAS</h1>
          <p className="text-sm text-slate-500 mt-1">Aprende. Simula. Crece.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-1 w-8 rounded-full bg-sky-400" />
          <div className="h-1 w-8 rounded-full bg-blue-500" />
          <div className="h-1 w-8 rounded-full bg-cyan-400" />
        </div>

        <div className="bg-sky-50 rounded-2xl p-4 mb-5 flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            ¡Bienvenido! Vamos a aprender finanzas juntos, paso a paso. Primero, dinos tu nombre para personalizar tu experiencia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
              ¿Cuál es tu nombre completo?
            </label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María González Pérez"
              autoFocus
              maxLength={60}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.01] transition-all inline-flex items-center justify-center gap-2"
          >
            Continuar <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-5">
          Tus datos se guardan de forma privada. Solo tú puedes ver tu progreso.
        </p>
      </div>
    </div>
  );
}
