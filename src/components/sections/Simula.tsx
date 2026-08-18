import { useMemo, useState } from 'react';
import { Wallet, ShoppingCart, Tag, TrendingUp, TrendingDown, Info, AlertTriangle, RotateCcw } from 'lucide-react';
import { SIM_ASSETS, INITIAL_CASH } from '@/lib/market';
import type { ProgressState, SimAsset, Holding } from '@/lib/types';
import Sparkline from '@/components/Sparkline';

interface SimulaProps {
  state: ProgressState;
  onUpdateSim: (fn: (s: ProgressState) => ProgressState) => void;
  onAddBadge: (badge: string) => void;
}

const RISK_COLOR: Record<string, string> = { bajo: 'text-emerald-600 bg-emerald-50', medio: 'text-amber-600 bg-amber-50', alto: 'text-rose-600 bg-rose-50' };

export default function Simula({ state, onUpdateSim, onAddBadge }: SimulaProps) {
  const [selectedAsset, setSelectedAsset] = useState<SimAsset | null>(null);
  const [amount, setAmount] = useState('');
  const [tickPrices, setTickPrices] = useState<Record<string, number>>(() =>
    Object.fromEntries(SIM_ASSETS.map((a) => [a.symbol, a.price])),
  );
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(SIM_ASSETS.map((a) => [a.symbol, Array.from({ length: 20 }, () => a.price)])),
  );

  const portfolioValue = useMemo(
    () => state.holdings.reduce((sum, h) => sum + h.shares * (tickPrices[h.symbol] ?? 0), 0),
    [state.holdings, tickPrices],
  );
  const totalValue = state.cash + portfolioValue;
  const profit = totalValue - INITIAL_CASH;
  const profitPct = (profit / INITIAL_CASH) * 100;

  const advanceDay = () => {
    const newPrices: Record<string, number> = {};
    const newHistory: Record<string, number[]> = {};
    SIM_ASSETS.forEach((a) => {
      const move = (Math.random() - 0.5) * a.volatility * 2 + a.drift;
      const newPrice = Math.max(0.01, (tickPrices[a.symbol] ?? a.price) * (1 + move));
      newPrices[a.symbol] = newPrice;
      newHistory[a.symbol] = [...(priceHistory[a.symbol] ?? []).slice(-19), newPrice];
    });
    setTickPrices(newPrices);
    setPriceHistory(newHistory);

    const newPortfolioValue = state.holdings.reduce((sum, h) => sum + h.shares * (newPrices[h.symbol] ?? 0), 0);
    const newTotal = state.cash + newPortfolioValue;
    onUpdateSim((s) => ({
      ...s,
      simDay: s.simDay + 1,
      simHistory: [...s.simHistory, { day: s.simDay + 1, value: newTotal }],
    }));

    if (newTotal > INITIAL_CASH && !state.badges.includes('profit')) {
      onAddBadge('profit');
    }
  };

  const buy = () => {
    if (!selectedAsset) return;
    const qty = parseFloat(amount);
    if (!qty || qty <= 0) return;
    const price = tickPrices[selectedAsset.symbol];
    const cost = qty * price;
    if (cost > state.cash) return;

    onUpdateSim((s) => {
      const existing = s.holdings.find((h) => h.symbol === selectedAsset.symbol);
      let holdings: Holding[];
      if (existing) {
        const totalShares = existing.shares + qty;
        const avgPrice = (existing.shares * existing.avgPrice + qty * price) / totalShares;
        holdings = s.holdings.map((h) => (h.symbol === selectedAsset.symbol ? { ...h, shares: totalShares, avgPrice } : h));
      } else {
        holdings = [...s.holdings, { symbol: selectedAsset.symbol, shares: qty, avgPrice: price }];
      }
      const newBadges = s.badges.includes('first-trade') ? s.badges : [...s.badges, 'first-trade'];
      return { ...s, cash: s.cash - cost, holdings, simTrades: s.simTrades + 1, badges: newBadges };
    });
    setAmount('');
    setSelectedAsset(null);
  };

  const sell = (symbol: string) => {
    const holding = state.holdings.find((h) => h.symbol === symbol);
    if (!holding) return;
    const price = tickPrices[symbol];
    const value = holding.shares * price;
    onUpdateSim((s) => ({
      ...s,
      cash: s.cash + value,
      holdings: s.holdings.filter((h) => h.symbol !== symbol),
      simTrades: s.simTrades + 1,
    }));
  };

  const reset = () => {
    onUpdateSim((s) => ({
      ...s,
      cash: INITIAL_CASH,
      holdings: [],
      simHistory: [{ day: 0, value: INITIAL_CASH }],
      simDay: 0,
      simTrades: 0,
    }));
    setTickPrices(Object.fromEntries(SIM_ASSETS.map((a) => [a.symbol, a.price])));
    setPriceHistory(Object.fromEntries(SIM_ASSETS.map((a) => [a.symbol, Array.from({ length: 20 }, () => a.price)])));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Simulador de inversión</h1>
        <p className="text-sm text-slate-500">Practica invertir con dinero virtual. Sin riesgo, 100% educativo.</p>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl p-3 text-sm text-violet-800">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <p>
          <strong>Esto es un juego educativo.</strong> Usas dinero virtual ($10.000.000 COP), no dinero real.
          Los precios cambian de forma simulada para que practiques sin riesgo.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard icon={<Wallet className="h-5 w-5" />} label="Saldo disponible" value={`$${state.cash.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`} color="text-sky-600" bg="bg-sky-50" />
        <SummaryCard icon={<Tag className="h-5 w-5" />} label="Portafolio" value={`$${portfolioValue.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`} color="text-violet-600" bg="bg-violet-50" />
        <SummaryCard
          icon={profit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          label="Ganancia/Pérdida"
          value={`${profit >= 0 ? '+' : ''}$${profit.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`}
          sub={`${profitPct.toFixed(1)}%`}
          color={profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}
          bg={profit >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}
        />
        <SummaryCard icon={<TrendingUp className="h-5 w-5" />} label="Día simulado" value={`${state.simDay}`} sub={`${state.simTrades} operaciones`} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Portfolio chart */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-slate-700 text-sm">Valor total en el tiempo</p>
          <div className="flex gap-2">
            <button onClick={advanceDay} className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
              Avanzar 1 día
            </button>
            <button onClick={reset} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition inline-flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Reiniciar
            </button>
          </div>
        </div>
                <div className="w-full overflow-hidden">
          <Sparkline data={state.simHistory.map((h) => h.value)} color={profit >= 0 ? '#10b981' : '#f43f5e'} width={600} height={80} responsive />
        </div>
      </div>

      {/* Assets */}
      <div>
        <h2 className="font-bold text-slate-800 mb-3">Activos disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SIM_ASSETS.map((a) => {
            const price = tickPrices[a.symbol];
            const hist = priceHistory[a.symbol] ?? [];
            const holding = state.holdings.find((h) => h.symbol === a.symbol);
            return (
              <div key={a.symbol} className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{a.emoji}</span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{a.name}</p>
                      <p className="text-[11px] text-slate-500">{a.symbol} · Riesgo <span className={`font-semibold px-1.5 rounded ${RISK_COLOR[a.risk]}`}>{a.risk}</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <p className="font-extrabold text-slate-800">${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
                  <Sparkline data={hist} color="#6366f1" width={90} height={30} />
                </div>
                <p className="text-[11px] text-slate-500 mb-3">{a.description}</p>
                {holding ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">Tienes: <strong>{holding.shares.toLocaleString('es-CO')}</strong></span>
                    <button onClick={() => sell(a.symbol)} className="text-xs font-semibold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition">
                      Vender
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSelectedAsset(a)} className="w-full text-xs font-semibold bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center gap-1.5">
                    <ShoppingCart className="h-3.5 w-3.5" /> Comprar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700 space-y-2">
            <p className="font-bold text-blue-700">Conceptos clave</p>
            <p><strong>Diversificación:</strong> No pongas todo tu dinero en un solo activo. Repártelo para reducir el riesgo.</p>
            <p><strong>Riesgo:</strong> Activos de riesgo "alto" pueden dar más ganancia, pero también más pérdida.</p>
            <p><strong>Rentabilidad:</strong> Es el porcentaje de ganancia o pérdida de tu portafolio.</p>
          </div>
        </div>
      </div>

      {/* Buy modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedAsset(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{selectedAsset.emoji}</span>
              <p className="font-bold text-slate-800">Comprar {selectedAsset.name}</p>
            </div>
            <p className="text-xs text-slate-500 mb-3">Precio por unidad: <strong>${tickPrices[selectedAsset.symbol].toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong></p>
            <label className="text-xs font-semibold text-slate-600">¿Cuántas unidades quieres comprar?</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 10"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                Costo total: <strong>${(parseFloat(amount) * tickPrices[selectedAsset.symbol]).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</strong>
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setSelectedAsset(null)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl hover:bg-slate-200 transition text-sm">
                Cancelar
              </button>
              <button onClick={buy} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition text-sm">
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, sub, color, bg }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm">
      <div className={`inline-flex p-2 rounded-lg ${bg} ${color} mb-2`}>{icon}</div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`font-extrabold ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
