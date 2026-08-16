import { useState } from 'react';
import { Images, X } from 'lucide-react';

interface Photo {
  src: string;
  caption: string;
}

const PHOTOS: Photo[] = [
  { src: '/assets/gallery/IMG_9888.jpg', caption: 'Presentación del proyecto Bolsa Millonaria' },
  { src: '/assets/gallery/IMG_9872.jpg', caption: 'Estudiantes participando en la actividad' },
  { src: '/assets/gallery/IMG_9909.jpg', caption: 'Momento destacado del evento' },
  { src: '/assets/gallery/IMG_9906.jpg', caption: 'Colegio Monterrosales en acción' },
];

export default function Galeria() {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Galería</h1>
        <p className="text-sm text-slate-500">Revive los mejores momentos de Bolsa Millonaria.</p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Images className="h-5 w-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Fotos del proyecto</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PHOTOS.map((photo) => (
            <button
              key={photo.src}
              onClick={() => setSelected(photo)}
              className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-sky-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img src={selected.src} alt={selected.caption} className="w-full max-h-[70vh] object-contain bg-slate-900" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow"
              >
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-slate-700">{selected.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
