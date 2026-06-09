/**
 * Homepage discovery experience — 8 content blocks, India-market optimised.
 *
 * Architecture: curiosity → exploration → page depth → ad revenue
 * Each block leads to a dedicated page. No dead ends.
 */

export const DISCOVERY_EXPERIENCE_BLOCKS = [
  {
    id: 'style-quiz',
    title: 'Find Your Style DNA',
    tagline: 'Who are you, stylistically?',
    hook: 'Five questions. Your complete fashion personality — plus an editorial lens built around how you dress.',
    route: '/quiz/personality',
    accent: '#600b45',
    kind: 'quiz',
    poster: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
    ctaText: 'Discover your style type',
    quizQuestion: 'Which vibe feels most like you?',
    previewOptions: [
      { label: 'Clean & understated' },
      { label: 'Bold & statement' },
      { label: 'Soft & romantic' },
      { label: 'Maximalist festive' },
    ],
  },
  {
    id: 'bollywood-looks',
    title: 'Bollywood Style',
    tagline: 'Airport edits · Red carpet · Street style',
    hook: 'The look that got 10,000 saves — decode why it spread, then explore your version.',
    route: '/celebrity-match',
    accent: '#d4b483',
    kind: 'celebrity',
    poster: '/sarees/Sarees/9/L12.01.25_3492_9d036254-9d70-42ef-9073-da5533651b09_700x.webp',
    ctaText: 'Match a Bollywood look',
  },
  {
    id: 'occasion-gate',
    title: 'Dress for Every Moment',
    tagline: 'From office to sangeet',
    hook: 'Pick your life moment — we map the complete look story, not just a product grid.',
    route: '/quiz/outfit-finder',
    accent: '#600b45',
    kind: 'occasion',
    poster: '/sarees/Sarees/1/0T3A5495_700x.webp',
    ctaText: 'Find your occasion look',
    occasionChips: [
      { label: 'Wedding Guest', category: 'lehengas', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
      { label: 'Sangeet', category: 'lehengas', image: '/lehengas/Lehengas/9/040A1707_700x.webp' },
      { label: 'Office', category: 'kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
      { label: 'Puja', category: 'kurtas', image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp' },
    ],
  },
  {
    id: 'wedding-festive',
    title: 'Wedding & Festive Edit',
    tagline: 'The season never ends',
    hook: 'Someone you know is always getting married. Be the guest everyone remembers.',
    route: '/magazine/festival-fashion',
    accent: '#4a0834',
    kind: 'festive',
    poster: '/lehengas/Lehengas/9/040A1707_700x.webp',
    festiveChips: [
      { label: 'Sangeet', category: 'lehengas', image: '/lehengas/Lehengas/9/040A1707_700x.webp' },
      { label: 'Reception', category: 'sarees', image: '/sarees/Sarees/9/L12.01.25_3492_9d036254-9d70-42ef-9073-da5533651b09_700x.webp' },
      { label: 'Mehendi', category: 'kurtas', image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp' },
      { label: 'Engagement', category: 'lehengas', image: '/lehengas/Lehengas/9/040A1719_700x.webp' },
      { label: 'Haldi', category: 'suit sets', image: '/suit-sets/Suit Sets/9/L12.01.25_1841_dbebe693-a859-4d15-a687-495f04734aba_700x.webp' },
      { label: 'Diwali', category: 'sarees', image: '/sarees/Sarees/9/L12.01.25_3547_33128c31-b45d-4240-b2c3-634c0659e06c_700x.webp' },
    ],
  },
  {
    id: 'edit-desk',
    title: 'The Edit Desk',
    tagline: 'Fashion journalism',
    hook: 'Trend breakdowns, styling secrets, and the stories behind Indian fashion — read one, open five.',
    route: '/magazine',
    accent: '#4a0834',
    kind: 'articles',
    poster: '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp',
    ctaText: 'Read the full edit',
  },
  {
    id: 'editors-voice',
    title: "Editor's Voice",
    tagline: 'Curated by a human, not an algorithm',
    hook: 'Three pieces. One story behind each. Not because they\'re popular — because they\'re right.',
    route: '/magazine',
    accent: '#8b1568',
    kind: 'editorial',
    poster: '/co-ords/co-ord_set/1/1.webp',
    ctaText: 'See all editor picks',
    editorQuote: 'Three pieces I\'d wear right now',
  },
  {
    id: 'style-debate',
    title: 'Style Debate',
    tagline: 'India is voting',
    hook: 'One question. Two sides. See exactly where India stands today.',
    route: '/games',
    accent: '#600b45',
    kind: 'debate',
    poster: '/tops/4/1.webp',
    ctaText: 'See all style debates',
  },
  {
    id: 'trending-india',
    title: 'Trending in India',
    tagline: 'What India is searching right now',
    hook: '',
    accent: '#4a0834',
    kind: 'search',
    poster: '/mens/kurtas/kurta/1/l-pkt410-vebnor-original-imahnybzsfggj62r.webp',
  },
];

/** Default poster image per occasion label when admin data has no chip.image */
export const OCCASION_CHIP_IMAGE_BY_LABEL = {
  'Wedding Guest': '/lehengas/Lehengas/1/040A3523_700x.webp',
  Sangeet: '/lehengas/Lehengas/9/040A1707_700x.webp',
  Office: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
  Puja: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
};

const EXCLUDED_OCCASION_CHIP_LABELS = new Set(['brunch', 'first job']);

const DEFAULT_OCCASION_CHIPS = [
  { label: 'Wedding Guest', category: 'lehengas', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
  { label: 'Sangeet', category: 'lehengas', image: '/lehengas/Lehengas/9/040A1707_700x.webp' },
  { label: 'Office', category: 'kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
  { label: 'Puja', category: 'kurtas', image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp' },
];

const OCCASION_CHIP_CATEGORY_BY_LABEL = {
  'Wedding Guest': 'lehengas',
  Sangeet: 'lehengas',
  Office: 'kurtas',
  Puja: 'kurtas',
};

const OCCASION_CHIP_IMAGE_BY_CATEGORY = {
  lehengas: '/lehengas/Lehengas/1/040A3523_700x.webp',
  kurtas: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
  'co-ords': '/co-ords/co-ord_set/1/1.webp',
  'suit sets': '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp',
};

export function resolveOccasionChipImage(chip, blockPoster = '') {
  if (chip?.image) return chip.image;
  if (chip?.label && OCCASION_CHIP_IMAGE_BY_LABEL[chip.label]) {
    return OCCASION_CHIP_IMAGE_BY_LABEL[chip.label];
  }
  const cat = String(chip?.category || '').toLowerCase();
  if (cat && OCCASION_CHIP_IMAGE_BY_CATEGORY[cat]) {
    return OCCASION_CHIP_IMAGE_BY_CATEGORY[cat];
  }
  return blockPoster;
}

/** Supports admin string[] or { label, category, image, route }[] — caps at 4 chips. */
export function normalizeOccasionChips(chips, blockPoster = '') {
  if (!Array.isArray(chips)) return [];

  const normalized = chips
    .map((chip) => {
      if (typeof chip === 'string') {
        const label = chip.trim();
        return {
          label,
          category: OCCASION_CHIP_CATEGORY_BY_LABEL[label] || 'kurtas',
          image: resolveOccasionChipImage({ label }, blockPoster),
        };
      }
      return {
        label: chip.label,
        category: chip.category || OCCASION_CHIP_CATEGORY_BY_LABEL[chip.label] || 'kurtas',
        route: chip.route,
        image: resolveOccasionChipImage(chip, blockPoster),
      };
    })
    .filter((chip) => chip.label && !EXCLUDED_OCCASION_CHIP_LABELS.has(chip.label.trim().toLowerCase()));

  const picked = (normalized.length ? normalized : DEFAULT_OCCASION_CHIPS).slice(0, 4);
  return picked;
}

/** Default poster image per festive occasion label */
export const FESTIVE_CHIP_IMAGE_BY_LABEL = {
  Sangeet: '/lehengas/Lehengas/9/040A1707_700x.webp',
  Reception: '/sarees/Sarees/9/L12.01.25_3492_9d036254-9d70-42ef-9073-da5533651b09_700x.webp',
  Mehendi: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
  Engagement: '/lehengas/Lehengas/9/040A1719_700x.webp',
  Haldi: '/suit-sets/Suit Sets/9/L12.01.25_1841_dbebe693-a859-4d15-a687-495f04734aba_700x.webp',
  Diwali: '/sarees/Sarees/9/L12.01.25_3547_33128c31-b45d-4240-b2c3-634c0659e06c_700x.webp',
};

const FESTIVE_CHIP_CATEGORY_BY_LABEL = {
  Sangeet: 'lehengas',
  Reception: 'sarees',
  Mehendi: 'kurtas',
  Engagement: 'lehengas',
  Haldi: 'suit sets',
  Diwali: 'sarees',
};

export function resolveFestiveChipImage(chip, blockPoster = '') {
  if (chip?.image) return chip.image;
  if (chip?.label && FESTIVE_CHIP_IMAGE_BY_LABEL[chip.label]) {
    return FESTIVE_CHIP_IMAGE_BY_LABEL[chip.label];
  }
  return blockPoster;
}

/** Supports admin string[] or { label, category, image }[] */
export function normalizeFestiveChips(chips, blockPoster = '') {
  if (!Array.isArray(chips)) return [];
  return chips.map((chip) => {
    if (typeof chip === 'string') {
      const label = chip.trim();
      return {
        label,
        category: FESTIVE_CHIP_CATEGORY_BY_LABEL[label] || 'lehengas',
        image: FESTIVE_CHIP_IMAGE_BY_LABEL[label] || blockPoster,
      };
    }
    return {
      label: chip.label,
      category: chip.category || FESTIVE_CHIP_CATEGORY_BY_LABEL[chip.label] || 'lehengas',
      image: resolveFestiveChipImage(chip, blockPoster),
    };
  });
}

export const STYLE_CHALLENGES = [
  {
    id: 'rate-outfit',
    title: 'Rate This Outfit',
    hook: '5 looks · 1–5 stars',
    route: '/games/rate-outfit',
    accent: '#e65100',
  },
  {
    id: 'choose-style',
    title: 'Pick Your Style Lane',
    hook: 'Minimal vs bold vs festive',
    route: '/games/choose-style',
    accent: '#4527a0',
  },
  {
    id: 'look-battle',
    title: 'Which Look Wins?',
    hook: '5 head-to-head battles',
    route: '/games/look-battle',
    accent: '#c62828',
  },
];

export const FASHION_POLLS = [
  {
    id: 'saree-vs-lehenga',
    question: 'Wedding guest power move?',
    subtext: '4,847 people have voted',
    options: [
      { id: 'saree', label: 'Silk saree — timeless', emoji: '🥻' },
      { id: 'lehenga', label: 'Lehenga — celebration', emoji: '✨' },
    ],
  },
  {
    id: 'minimal-vs-maximal',
    question: 'Your festive personality?',
    subtext: '2,311 people have voted',
    options: [
      { id: 'minimal', label: 'Quiet elegance', emoji: '🤍' },
      { id: 'maximal', label: 'Full festive glam', emoji: '💎' },
    ],
  },
  {
    id: 'airport-vs-event',
    question: 'Bollywood style icon?',
    subtext: '1,892 people have voted',
    options: [
      { id: 'airport', label: 'Deepika — airport minimal', emoji: '✈️' },
      { id: 'event', label: 'Alia — event maximalist', emoji: '🎬' },
    ],
  },
];

export const TRENDING_SEARCHES = [
  { label: 'Wedding guest fashion', route: '/trends/wedding-fashion', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
  { label: 'Celebrity airport looks', route: '/trends/airport-looks', image: '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp' },
  { label: 'Viral Instagram outfits', route: '/trends/viral-instagram-fashion', image: '/co-ords/co-ord_set/1/1.webp' },
  { label: 'Festival season edit', route: '/trends/festival-fashion', image: '/lehengas/Lehengas/9/040A1707_700x.webp' },
  { label: 'Sangeet guest outfit', category: 'lehengas', image: '/lehengas/Lehengas/9/040A1719_700x.webp' },
  { label: 'Summer fashion 2026', route: '/trends/summer-fashion', image: '/sarees/Sarees/9/L12.01.25_3415_700x.webp' },
  { label: 'Bollywood inspired looks', route: '/celebrity-match', image: '/sarees/Sarees/9/L12.01.25_3492_9d036254-9d70-42ef-9073-da5533651b09_700x.webp' },
  { label: 'Handloom sarees', category: 'sarees', image: '/sarees/Sarees/9/L12.01.25_3547_33128c31-b45d-4240-b2c3-634c0659e06c_700x.webp' },
  { label: 'Anarkali with pants', category: 'kurtas', image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp' },
  { label: 'Under ₹999 picks', route: '/viral', image: '/suit-sets/Suit Sets/9/L12.01.25_1911_700x.webp' },
];

export const TRENDING_SEARCH_IMAGE_BY_LABEL = Object.fromEntries(
  TRENDING_SEARCHES.map((item) => [item.label, item.image]),
);

const TRENDING_HEAT_BY_RANK = [98, 94, 89, 84, 79, 74, 70, 66, 62, 58];

/** Supports admin { label, route?, category? }[] without images */
export function normalizeTrendingSearches(searches) {
  if (!Array.isArray(searches)) return [];
  return searches.map((item, index) => {
    const label = typeof item === 'string' ? item.trim() : item.label;
    const base = typeof item === 'string' ? { label } : { ...item, label };
    return {
      ...base,
      image: base.image || TRENDING_SEARCH_IMAGE_BY_LABEL[label] || '',
      heat: base.heat ?? TRENDING_HEAT_BY_RANK[index] ?? Math.max(55, 90 - index * 4),
    };
  });
}

/** Default discovery extras — seeded into admin store on first load */
export const DEFAULT_DISCOVERY_CONFIG = {
  stripLabel: 'THIS EDIT',
  stripSub: 'Tap any chapter to open it',
  editorNotes: [
    'The desk pick for effortless festive dressing — structure without stiffness.',
    'An heirloom-worthy weave that still moves with you at a mehendi.',
    'A silk-forward silhouette for when the invite says celebration.',
  ],
  fashionPolls: FASHION_POLLS,
  styleChallenges: STYLE_CHALLENGES,
  trendingSearches: TRENDING_SEARCHES,
};

/** Legacy export — kept for backward-compatible imports */
export const DISCOVERY_HUB_BLOCKS = DISCOVERY_EXPERIENCE_BLOCKS.map((b) => ({
  id: b.id,
  title: b.title,
  hook: b.hook,
  cta: b.ctaText || 'Explore',
  route: b.route,
  accent: b.accent,
  kind: b.kind,
  image: b.poster,
}));

export function getExperienceBlock(id) {
  return DISCOVERY_EXPERIENCE_BLOCKS.find((b) => b.id === id) || null;
}
