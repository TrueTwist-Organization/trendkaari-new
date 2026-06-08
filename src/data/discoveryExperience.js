/**
 * Homepage discovery experience — 9 content blocks, India-market optimised.
 *
 * Architecture: curiosity → exploration → page depth → ad revenue
 * Each block leads to a dedicated page. No dead ends.
 */

export const DISCOVERY_EXPERIENCE_BLOCKS = [
  {
    id: 'style-quiz',
    title: 'Find Your Style DNA',
    tagline: 'Who are you, stylistically?',
    hook: 'Five questions. Your complete fashion personality — plus a curated edit built just for you.',
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
    hook: 'The look that got 10,000 saves — find your version at a fraction of the price.',
    route: '/celebrity-match',
    accent: '#c9a84c',
    kind: 'celebrity',
    poster: '/sarees/Sarees/1/0T3A5495_700x.webp',
    ctaText: 'Match a Bollywood look',
    dark: true,
  },
  {
    id: 'this-week',
    title: 'This Week in Indian Fashion',
    tagline: 'Updated every Monday',
    hook: 'The pieces blowing up across Instagram, Pinterest, and WhatsApp groups right now.',
    route: '/viral',
    accent: '#b71c1c',
    kind: 'viral',
    poster: '/lehengas/Lehengas/1/040A3523_700x.webp',
    ctaText: 'See all this week\'s picks',
    savesCount: '3,200+',
  },
  {
    id: 'occasion-gate',
    title: 'Dress for Every Moment',
    tagline: 'From office to sangeet',
    hook: 'Pick your life moment — we build the complete look, not just a product grid.',
    route: '/quiz/outfit-finder',
    accent: '#1565c0',
    kind: 'occasion',
    poster: '/co-ords/co-ord_set/1/1.webp',
    ctaText: 'Find your occasion look',
    occasionChips: [
      { label: 'Wedding Guest', category: 'lehengas', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
      { label: 'Sangeet', category: 'lehengas', image: '/lehengas/Lehengas/9/040A1707_700x.webp' },
      { label: 'Office', category: 'kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
      { label: 'Puja', category: 'kurtas', image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp' },
      { label: 'Brunch', category: 'co-ords', image: '/co-ords/co-ord_set/1/1.webp' },
      { label: 'First Job', category: 'suit sets', image: '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp' },
    ],
  },
  {
    id: 'wedding-festive',
    title: 'Wedding & Festive Edit',
    tagline: 'The season never ends',
    hook: 'Someone you know is always getting married. Be the guest everyone remembers.',
    route: '/magazine/festival-fashion',
    accent: '#880e4f',
    kind: 'festive',
    poster: '/lehengas/Lehengas/1/040A3523_700x.webp',
    ctaText: 'Open the wedding edit',
    festiveChips: ['Sangeet', 'Reception', 'Mehendi', 'Engagement', 'Haldi', 'Diwali'],
  },
  {
    id: 'edit-desk',
    title: 'The Edit Desk',
    tagline: 'Fashion journalism',
    hook: 'Trend breakdowns, styling secrets, and the stories behind Indian fashion — read one, open five.',
    route: '/magazine',
    accent: '#4a0834',
    kind: 'articles',
    poster: '/kurtas/Kurtas/1/040A2925_700x.webp',
    ctaText: 'Read the full edit',
  },
  {
    id: 'editors-voice',
    title: "Editor's Voice",
    tagline: 'Curated by a human, not an algorithm',
    hook: 'Three pieces. One story behind each. Not because they\'re popular — because they\'re right.',
    route: '/magazine',
    accent: '#4527a0',
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
    accent: '#37474f',
    kind: 'search',
    poster: '/mens/kurtas/kurta/1/l-pkt410-vebnor-original-imahnybzsfggj62r.webp',
  },
];

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
  { label: 'Wedding guest fashion', route: '/trends/wedding-fashion' },
  { label: 'Celebrity airport looks', route: '/trends/airport-looks' },
  { label: 'Viral Instagram outfits', route: '/trends/viral-instagram-fashion' },
  { label: 'Festival season edit', route: '/trends/festival-fashion' },
  { label: 'Sangeet guest outfit', category: 'lehengas' },
  { label: 'Summer fashion 2026', route: '/trends/summer-fashion' },
  { label: 'Bollywood inspired looks', route: '/celebrity-match' },
  { label: 'Handloom sarees', category: 'sarees' },
  { label: 'Anarkali with pants', category: 'kurtas' },
  { label: 'Under ₹999 picks', route: '/viral' },
];

/** Default discovery extras — seeded into admin store on first load */
export const DEFAULT_DISCOVERY_CONFIG = {
  stripLabel: 'THIS EDIT',
  stripSub: 'Tap any chapter to open it',
  editorNotes: [
    'The desk pick for effortless festive dressing — structure without stiffness.',
    'A scroll-stopper that still feels wearable off the feed.',
    'Investment-tier fabric, everyday-friendly silhouette.',
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
