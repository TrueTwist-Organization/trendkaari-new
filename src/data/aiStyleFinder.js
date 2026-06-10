/** AI Style Finder — age, body type, budget & occasion inputs. */

export const STYLE_FINDER_STEPS = [
  {
    id: 'age',
    question: 'What is your age range?',
    helper: 'We tune fit tips and trend level to your lane.',
    options: [
      { id: '18-25', label: '18 – 25', emoji: '🌱', sublabel: 'Trend-led & experimental' },
      { id: '26-35', label: '26 – 35', emoji: '✨', sublabel: 'Versatile everyday dressing' },
      { id: '36-45', label: '36 – 45', emoji: '🪷', sublabel: 'Refined & quality-first' },
      { id: '46-plus', label: '46+', emoji: '👑', sublabel: 'Classic comfort & elegance' },
    ],
  },
  {
    id: 'bodyType',
    question: 'Which body type best describes you?',
    helper: 'Silhouette suggestions follow — no wrong answers.',
    options: [
      { id: 'petite', label: 'Petite', emoji: '🌸', sublabel: 'Shorter frame, love clean lines' },
      { id: 'regular', label: 'Regular', emoji: '🙂', sublabel: 'Balanced proportions' },
      { id: 'curvy', label: 'Curvy', emoji: '💫', sublabel: 'Fuller bust, waist or hips' },
      { id: 'tall', label: 'Tall', emoji: '📏', sublabel: 'Longer torso or legs' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget per outfit?',
    helper: 'We surface picks in your price lane first.',
    options: [
      { id: 'value', label: 'Under ₹1,499', emoji: '💫', sublabel: 'Smart value picks' },
      { id: 'mid', label: '₹1,500 – ₹2,499', emoji: '⭐', sublabel: 'Mid-range favourites' },
      { id: 'premium', label: '₹2,500+', emoji: '👑', sublabel: 'Premium & occasion-ready' },
    ],
  },
  {
    id: 'occasion',
    question: 'What are you dressing for?',
    helper: 'Occasion drives category and collection links.',
    options: [
      { id: 'daily', label: 'Daily / casual', emoji: '☀️', sublabel: 'Errands, brunch, WFH' },
      { id: 'office', label: 'Office / smart casual', emoji: '💼', sublabel: 'Meetings & desk days' },
      { id: 'festive', label: 'Festive / celebration', emoji: '🪔', sublabel: 'Puja, parties, gatherings' },
      { id: 'wedding', label: 'Wedding guest', emoji: '💍', sublabel: 'Functions & receptions' },
    ],
  },
];

export const AGE_PROFILES = {
  '18-25': {
    tone: 'Trend-forward',
    keywords: ['coord', 'modern', 'crop', 'fusion'],
    guideIds: ['coord-set-styling', 'capsule-wardrobe'],
  },
  '26-35': {
    tone: 'Versatile modern',
    keywords: ['straight', 'office', 'cotton', 'co-ord'],
    guideIds: ['kurta-fit-guide', 'coord-set-styling'],
  },
  '36-45': {
    tone: 'Refined polish',
    keywords: ['silk', 'elegant', 'straight', 'embroidered'],
    guideIds: ['kurta-fit-guide', 'capsule-wardrobe', 'fabric-care'],
  },
  '46-plus': {
    tone: 'Classic elegance',
    keywords: ['comfort', 'silk', 'straight', 'cotton'],
    guideIds: ['saree-drape-101', 'fabric-care', 'kurta-fit-guide'],
  },
};

export const BODY_PROFILES = {
  petite: {
    label: 'Petite',
    fitTip: 'Straight and A-line cuts add height — avoid overwhelming volume.',
    keywords: ['straight', 'a-line', 'short', 'slim'],
  },
  regular: {
    label: 'Regular',
    fitTip: 'Regular and straight fits offer easy, balanced silhouettes.',
    keywords: ['straight', 'regular', 'cotton', 'regular fit'],
  },
  curvy: {
    label: 'Curvy',
    fitTip: 'Flared, A-line and empire waists skim without clinging.',
    keywords: ['flare', 'a-line', 'anarkali', 'empire', 'palazzo'],
  },
  tall: {
    label: 'Tall',
    fitTip: 'Longline kurtas, maxi hems and wide-leg bottoms suit your frame.',
    keywords: ['long', 'maxi', 'palazzo', 'straight'],
  },
};

export const BUDGET_PROFILES = {
  value: { label: 'Under ₹1,499', priceMax: 1499, mood: 'value' },
  mid: { label: '₹1,500 – ₹2,499', priceMin: 1500, priceMax: 2499, mood: 'mid' },
  premium: { label: '₹2,500+', priceMin: 2500, mood: 'premium' },
};

export const OCCASION_PROFILES = {
  daily: {
    label: 'Everyday ease',
    categories: ['kurtas', 'tops', 'co-ords'],
    collections: [
      { id: 'daily-kurtas', title: 'Daily Kurtas', category: 'kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
      { id: 'daily-coords', title: 'Casual Co-ords', category: 'co-ords', image: '/co-ords/co-ord_set/1/1.webp' },
      { id: 'daily-tops', title: 'Easy Tops', category: 'tops', image: '/tops/4/1.webp' },
    ],
    guideIds: ['capsule-wardrobe', 'coord-set-styling'],
    keywords: ['cotton', 'casual', 'everyday'],
  },
  office: {
    label: 'Office polish',
    categories: ['kurtas', 'tops', 'co-ords'],
    collections: [
      { id: 'office-kurtas', title: 'Work Kurtas', category: 'kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
      { id: 'office-tops', title: 'Smart Tops', category: 'tops', image: '/tops/7/1.webp' },
      { id: 'office-coords', title: 'Desk Co-ords', category: 'co-ords', image: '/co-ords/co-ord_set/1/1.webp' },
    ],
    guideIds: ['kurta-fit-guide', 'capsule-wardrobe'],
    keywords: ['straight', 'office', 'formal', 'cotton'],
  },
  festive: {
    label: 'Festive ready',
    categories: ['suit sets', 'sarees', 'kurtas'],
    collections: [
      { id: 'festive-suits', title: 'Festive Suit Sets', category: 'suit sets', image: '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp' },
      { id: 'festive-sarees', title: 'Celebration Sarees', category: 'sarees', image: '/sarees/Sarees/1/0T3A5495_700x.webp' },
      { id: 'festive-kurtas', title: 'Embroidered Kurtas', category: 'kurtas', image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp' },
    ],
    guideIds: ['festive-colour-palette', 'wedding-guest-dress-code'],
    keywords: ['festive', 'embroidered', 'silk', 'gold'],
  },
  wedding: {
    label: 'Wedding guest',
    categories: ['lehengas', 'sarees', 'suit sets'],
    collections: [
      { id: 'wedding-lehengas', title: 'Guest Lehengas', category: 'lehengas', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
      { id: 'wedding-sarees', title: 'Ceremony Sarees', category: 'sarees', image: '/sarees/Sarees/1/0T3A5495_700x.webp' },
      { id: 'wedding-suits', title: 'Celebration Sets', category: 'suit sets', image: '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp' },
    ],
    guideIds: ['wedding-guest-dress-code', 'saree-drape-101'],
    keywords: ['wedding', 'lehenga', 'saree', 'silk'],
  },
};

export function buildStyleFinderResultKey(answers = {}) {
  const { age, bodyType, budget, occasion } = answers;
  if (!age || !bodyType || !budget || !occasion) return null;
  return `${age}__${bodyType}__${budget}__${occasion}`;
}

export function parseStyleFinderResultKey(key = '') {
  const [age, bodyType, budget, occasion] = String(key).split('__');
  if (!age || !bodyType || !budget || !occasion) return null;
  if (!AGE_PROFILES[age] || !BODY_PROFILES[bodyType] || !BUDGET_PROFILES[budget] || !OCCASION_PROFILES[occasion]) {
    return null;
  }
  return { age, bodyType, budget, occasion };
}

export function isValidStyleFinderResultKey(key) {
  return Boolean(parseStyleFinderResultKey(key));
}
