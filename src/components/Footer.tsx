import { Instagram } from 'lucide-react';

const SOCIALS = [
  { label: 'Colegio Monterrosales', href: 'https://www.instagram.com/monterrosales.homeschool' },
  { label: 'Bolsa Millonaria', href: 'https://www.instagram.com/montefinanzas' },
  { label: 'Valentina Torres', href: 'https://www.instagram.com/valentinatorres468' },
];

export default function Footer() {
  return (
    <footer className="mt-8 pb-24 md:pb-6 pt-5 border-t border-sky-100">
      <div className="flex flex-col items-center gap-3">
        <p className="text-[11px] text-slate-400">Síguenos en Instagram</p>
        <div className="flex items-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-700 transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span className="text-[11px] font-medium">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
