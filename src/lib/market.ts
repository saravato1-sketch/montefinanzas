import type { MarketAsset, SimAsset } from './types';

const seed = (n: number) => {
  let x = n;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
};

const genHistory = (base: number, start: number, points = 24) => {
  const r = seed(start);
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v *= 1 + (r() - 0.5) * 0.04;
    arr.push(Math.round(v * 100) / 100);
  }
  return arr;
};

export const MARKET_ASSETS: MarketAsset[] = [
  {
    symbol: 'USD/COP',
    name: 'Dólar (Estados Unidos)',
    emoji: '💵',
    price: 4150,
    currency: 'COP',
    change: 35,
    changePercent: 0.85,
    history: genHistory(4150, 11),
    explanation: 'El dólar es la moneda de Estados Unidos. Su precio frente al peso colombiano sube o baja según la economía global.',
  },
  {
    symbol: 'EUR/COP',
    name: 'Euro (Unión Europea)',
    emoji: '💶',
    price: 4500,
    currency: 'COP',
    change: -20,
    changePercent: -0.44,
    history: genHistory(4500, 23),
    explanation: 'El euro es la moneda de varios países de Europa. También se compara con el peso colombiano.',
  },
  {
    symbol: 'ECOPETROL',
    name: 'Ecopetrol (Acción BVC)',
    emoji: '🛢️',
    price: 3200,
    currency: 'COP',
    change: 45,
    changePercent: 1.43,
    history: genHistory(3200, 31),
    explanation: 'Ecopetrol es la principal empresa de petróleo de Colombia. Su acción sube o baja según el precio del petróleo y la empresa.',
  },
  {
    symbol: 'GRUPOAVAL',
    name: 'Grupo Aval (Acción BVC)',
    emoji: '🏦',
    price: 1850,
    currency: 'COP',
    change: -12,
    changePercent: -0.64,
    history: genHistory(1850, 47),
    explanation: 'Grupo Aval es uno de los grupos bancarios más grandes de Colombia. Su acción refleja la salud del sector financiero.',
  },
  {
    symbol: 'BANCOLOMBIA',
    name: 'Bancolombia (Acción BVC)',
    emoji: '💳',
    price: 54000,
    currency: 'COP',
    change: 320,
    changePercent: 0.6,
    history: genHistory(54000, 59),
    explanation: 'Bancolombia es el banco más grande de Colombia. Su acción es de las más negociadas en la bolsa local.',
  },
  {
    symbol: 'ARGOS',
    name: 'Grupo Argos (Acción BVC)',
    emoji: '🏗️',
    price: 21000,
    currency: 'COP',
    change: -150,
    changePercent: -0.71,
    history: genHistory(21000, 67),
    explanation: 'Grupo Argos es un gran grupo de infraestructura y cementos. Su acción refleja la construcción y el sector industrial.',
  },
  {
    symbol: 'APPLE',
    name: 'Apple (EE. UU.)',
    emoji: '🍎',
    price: 190,
    currency: 'USD',
    change: 2.4,
    changePercent: 1.28,
    history: genHistory(190, 71),
    explanation: 'Apple es una de las empresas más grandes del mundo. Su acción se compra en dólares en la bolsa de EE. UU.',
  },
  {
    symbol: 'TESLA',
    name: 'Tesla (EE. UU.)',
    emoji: '🚗',
    price: 245,
    currency: 'USD',
    change: -3.1,
    changePercent: -1.25,
    history: genHistory(245, 83),
    explanation: 'Tesla fabrica autos eléctricos. Es muy conocida por sus grandes subidas y bajadas: una acción volátil.',
  },
];

export const SIM_ASSETS: SimAsset[] = [
  {
    symbol: 'CAJA',
    name: 'Caja de ahorros',
    emoji: '🐷',
    price: 1,
    volatility: 0.001,
    drift: 0.0008,
    category: 'fondo',
    risk: 'bajo',
    description: 'Una opción muy segura. Tu dinero crece muy poco, pero casi nunca baja.',
  },
  {
    symbol: 'BONOS',
    name: 'Bonos del gobierno',
    emoji: '📜',
    price: 1000,
    volatility: 0.01,
    drift: 0.002,
    category: 'fondo',
    risk: 'bajo',
    description: 'Préstas dinero al gobierno. Poca ganancia, poco riesgo.',
  },
  {
    symbol: 'FONDO',
    name: 'Fondo de inversión',
    emoji: '🧺',
    price: 5000,
    volatility: 0.02,
    drift: 0.004,
    category: 'fondo',
    risk: 'medio',
    description: 'Un experto invierte por ti. Equilibrio entre riesgo y ganancia.',
  },
  {
    symbol: 'ECO',
    name: 'Ecopetrol (acción)',
    emoji: '🛢️',
    price: 3200,
    volatility: 0.05,
    drift: 0.003,
    category: 'accion',
    risk: 'alto',
    description: 'Una acción real de Colombia. Puede subir mucho o bajar mucho.',
  },
  {
    symbol: 'TECH',
    name: 'Tecnología (acción)',
    emoji: '💻',
    price: 8000,
    volatility: 0.08,
    drift: 0.006,
    category: 'accion',
    risk: 'alto',
    description: 'Una acción de tecnología. Mucho potencial, mucho riesgo.',
  },
  {
    symbol: 'USD',
    name: 'Dólar',
    emoji: '💵',
    price: 4150,
    volatility: 0.015,
    drift: 0.001,
    category: 'moneda',
    risk: 'medio',
    description: 'Comprar dólares. Su valor cambia frente al peso colombiano.',
  },
];

export const INITIAL_CASH = 10_000_000;
