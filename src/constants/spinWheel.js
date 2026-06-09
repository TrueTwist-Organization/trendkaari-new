export const SPIN_WHEEL_MIN_ORDER = 1000;

export const SPIN_WHEEL_STORAGE_KEY = 'trendkaari_spin_wheel_claims';

/** Trendkaari brand palette — plum, gold, festival orange */
export const SPIN_BRAND = {
  plum: '#600b45',
  plumDeep: '#4a0834',
  plumMid: '#8b1568',
  gold: '#d4b483',
  goldLight: '#e8c99a',
  orange: '#e65100',
  orangeDeep: '#bf360c',
  warmTan: '#a67c52',
};

/** @type {Array<{ id: string, label: string, sublabel: string, code: string | null, color: string, labelColor?: string, weight: number }>} */
export const SPIN_WHEEL_PRIZES = [
  { id: 'off5', label: '5% OFF', sublabel: 'Next order', code: 'SPIN5', color: SPIN_BRAND.plum, weight: 22 },
  { id: 'off10', label: '10% OFF', sublabel: 'Next order', code: 'SPIN10', color: SPIN_BRAND.orange, weight: 14 },
  { id: 'flat50', label: '₹50 OFF', sublabel: 'Min ₹799', code: 'SPIN50', color: SPIN_BRAND.gold, labelColor: SPIN_BRAND.plumDeep, weight: 18 },
  { id: 'flat100', label: '₹100 OFF', sublabel: 'Min ₹1499', code: 'SPIN100', color: SPIN_BRAND.plumDeep, weight: 10 },
  { id: 'freeship', label: 'Free Ship', sublabel: 'Next order', code: 'SPINFREE', color: SPIN_BRAND.plumMid, weight: 16 },
  { id: 'off15', label: '15% OFF', sublabel: 'Jackpot!', code: 'SPIN15', color: SPIN_BRAND.orangeDeep, weight: 6 },
  { id: 'luck', label: 'Try Again', sublabel: 'Next ₹1000+ order', code: null, color: SPIN_BRAND.goldLight, labelColor: SPIN_BRAND.plumDeep, weight: 10 },
  { id: 'mystery', label: '₹75 OFF', sublabel: 'Surprise deal', code: 'SPIN75', color: SPIN_BRAND.warmTan, weight: 4 },
];

export function isSpinWheelEligible(orderTotal) {
  return Number(orderTotal) >= SPIN_WHEEL_MIN_ORDER;
}

export function pickSpinPrizeIndex() {
  const total = SPIN_WHEEL_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < SPIN_WHEEL_PRIZES.length; i++) {
    roll -= SPIN_WHEEL_PRIZES[i].weight;
    if (roll <= 0) return i;
  }
  return 0;
}

export function loadSpinClaims() {
  try {
    const raw = localStorage.getItem(SPIN_WHEEL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function hasClaimedSpinForOrder(orderId) {
  if (!orderId) return false;
  const claims = loadSpinClaims();
  return Boolean(claims[String(orderId)]);
}

export function saveSpinClaim(orderId, prize) {
  if (!orderId) return;
  try {
    const claims = loadSpinClaims();
    claims[String(orderId)] = { prizeId: prize.id, code: prize.code, at: Date.now() };
    localStorage.setItem(SPIN_WHEEL_STORAGE_KEY, JSON.stringify(claims));
  } catch {
    /* ignore */
  }
}

export function getSavedSpinForOrder(orderId) {
  const claims = loadSpinClaims();
  const entry = claims[String(orderId)];
  if (!entry) return null;
  return SPIN_WHEEL_PRIZES.find((p) => p.id === entry.prizeId) || null;
}
