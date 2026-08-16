import { useState } from 'react';
import { TrendingUp, TrendingDown, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { MARKET_ASSETS } from '@/lib/market';
import type { MarketAsset } from '@/lib/types';
import Sparkline from '@/components/Sparkline';

export default function Mercado() {
  const [assets, setAssets] = useState<MarketAsset[]>(MARKET_ASSETS);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<MarketAsset | null>(null);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const move = (Math.random() - 0.5) * 0.03;
          const newPrice = Math.max(0.01, a.price * (1 + move));
          const change = newPrice - a.price;
          const changePercent = (change / a.price) * 100;
          return {
            ...a,
            price: newPrice,
            change,
            changePercent,
            history: [...a.history.slice(1), newPrice],
          };
        }),
      );
      setRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Mercado financiero</h1>
          <p className="text-sm text-slate-500">Observa cómo suben y bajan los precios en tiempo real.</p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <p>
          <strong>Modo demostración.</strong> Estos precios son simulados para que aprendas cómo se ve un mercado financiero.
          La estructura está lista para conectar una API real de datos más adelante, sin rehacer la app.
        </p>
      </div>

      {/* Asset grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((a) => {
          const up = a.change >= 0;
          const color = up ? '#10b981' : '#f43f5e';
          return (
            <button
              key={a.symbol}
              onClick={() => setSelected(a)}
              className="text-left bg-white rounded-2xl p-4 border border-sky-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{a.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{a.symbol}</p>
                    <p className="text-[11px] text-slate-500">{a.name}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {up ? '+' : ''}{a.changePercent.toFixed(2)}%
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-extrabold text-slate-800">
                    {a.currency === 'USD' ? 'US$' : '$'}{a.price.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {up ? '+' : ''}{a.change.toFixed(2)}
                  </p>
                </div>
                <Sparkline data={a.history} color={color} width={110} height={34} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Educational tip */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <p className="font-bold text-blue-700 mb-1">¿Qué significa que un activo suba o baje?</p>
            <p>
              Cuando un activo <span className="text-emerald-600 font-semibold">sube</span> (verde), su precio aumentó: si lo vendes ahora, ganas dinero.
              Cuando <span className="text-rose-600 font-semibold">baja</span> (rojo), su precio bajó: si lo vendes, pierdes dinero respecto a lo que pagaste.
              El porcentaje te dice qué tan grande fue el cambio.
            </p>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <p className="font-bold text-slate-800">{selected.symbol}</p>
                <p className="text-xs text-slate-500">{selected.name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{selected.explanation}</p>
            <div className="flex items-center justify-between bg-sky-50 rounded-xl p-3">
              <span className="text-sm font-semibold text-slate-600">Precio actual</span>
              <span className="font-extrabold text-blue-700">
                {selected.currency === 'USD' ? 'US$' : '$'}{selected.price.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 w-full bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl hover:bg-slate-200 transition">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
