import { ARBITRAGE_EXPERT_YEARS } from '../constants/brand';

/** Editable homepage shell — trust bar, market map, intros, hero, finale. */
export const DEFAULT_HOMEPAGE_CONFIG = {
  hero: {
    titleLine1: 'Celebrate Every',
    titleLine2: 'Special Moment',
    subtitle:
      'Curated Indian ethnic & contemporary wear for festivals, weddings, and everyday style.',
    primaryCta: 'Shop Now',
    secondaryCta: 'Explore Collections',
    backgroundImage: '/hero/home-hero-bg.png?v=2',
    backgroundImageMobile: '/hero/home-hero-bg-mobile.jpg?v=1',
    desktopImage: '/hero/home-hero-banner.png?v=celebrate-special-v2',
    mobileImage: '/hero/home-hero-banner-mobile.png?v=celebrate-special-v2',
    modelsImage: '/hero/home-hero-models.png?v=5',
    mobileModelsImage: '/hero/home-hero-models-mobile.png?v=5',
    alt: 'Celebrate Every Special Moment — Trendkaari curated Indian ethnic and contemporary wear',
    trustBadges: [
      { icon: 'Award', label: 'Premium Quality' },
      { icon: 'Leaf', label: 'Curated Collections' },
      { icon: 'ShieldCheck', label: 'Secure Shopping' },
    ],
  },
  trust: {
    items: [
      {
        icon: 'TrendingUp',
        label: `${ARBITRAGE_EXPERT_YEARS}+ years expertise`,
        sub: 'Reading fashion markets before they move',
      },
      {
        icon: 'Eye',
        label: 'Arbitrage intelligence',
        sub: 'Spotting value gaps & emerging trends',
      },
      {
        icon: 'BookOpen',
        label: 'Editorial depth',
        sub: 'Journalism-first, not product grids',
      },
      {
        icon: 'Globe',
        label: 'India-first lens',
        sub: 'What search & social signal next',
      },
    ],
  },
  marketMap: {
    eyebrow: 'Market map',
    title: 'Start with a category lens',
    subtitle:
      'Women and men — tap a category lens, then scroll into the editorial chapters below.',
    linkText: 'View all categories',
    categories: [
      { slug: 'lehengas', label: 'Lehengas', image: '/lehengas/Lehengas/1/040A3523_700x.webp' },
      { slug: 'sarees', label: 'Sarees', image: '/sarees/Sarees/1/0T3A5495_700x.webp' },
      { slug: 'kurtas', label: 'Kurtas', image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp' },
      { slug: 'co-ords', label: 'Co-ords', image: '/co-ords/co-ord_set/1/1.webp' },
      { slug: 'suit sets', label: 'Suit Sets', image: '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp' },
      { slug: 'tops', label: 'Tops', image: '/tops/4/1.webp' },
      {
        slug: 'men-traditional',
        label: 'Men',
        image: '/mens/kurtas/kurta/4/xxl-dmm-daswani-exports-original-imahmgj4r2evzddc.webp',
      },
    ],
  },
  editorialIntro: {
    eyebrow: 'The editorial feed',
    title: 'Eight chapters.\nOne intelligence journey.',
    text:
      'Tap a chapter to go deeper — style profiles, Bollywood analysis, wedding signals, and what India is searching right now. Built for discovery, not hard sell.',
  },
  spotlight: {
    eyebrow: 'Signals we\'re tracking',
    title: 'What the market is moving on',
    subtitle:
      'Pieces gaining traction in search and social — tap to read the product story, not to rush a purchase.',
    heroBadge: 'Arbitrage pick',
    railLabel: 'Also on our radar',
  },
  finale: {
    title: 'Ready to go deeper?',
    text:
      'The full explore feed has endless editorial rails — discovery starts here, not at a checkout counter.',
    primaryLabel: 'Open explore feed',
    secondaryLabel: 'Take style quiz',
  },
};

function mergeMarketMapCategories(storedCategories) {
  const defaults = DEFAULT_HOMEPAGE_CONFIG.marketMap.categories;
  if (!Array.isArray(storedCategories) || !storedCategories.length) return defaults;

  const slugs = new Set(storedCategories.map((cat) => cat.slug));
  const missing = defaults.filter((cat) => !slugs.has(cat.slug));
  return missing.length ? [...storedCategories, ...missing] : storedCategories;
}

export function mergeHomepageConfig(stored) {
  if (!stored || typeof stored !== 'object') return DEFAULT_HOMEPAGE_CONFIG;
  return {
    hero: { ...DEFAULT_HOMEPAGE_CONFIG.hero, ...stored.hero },
    trust: {
      items: Array.isArray(stored.trust?.items) && stored.trust.items.length
        ? stored.trust.items
        : DEFAULT_HOMEPAGE_CONFIG.trust.items,
    },
    marketMap: {
      ...DEFAULT_HOMEPAGE_CONFIG.marketMap,
      ...stored.marketMap,
      categories: mergeMarketMapCategories(stored.marketMap?.categories),
    },
    editorialIntro: { ...DEFAULT_HOMEPAGE_CONFIG.editorialIntro, ...stored.editorialIntro },
    spotlight: { ...DEFAULT_HOMEPAGE_CONFIG.spotlight, ...stored.spotlight },
    finale: { ...DEFAULT_HOMEPAGE_CONFIG.finale, ...stored.finale },
  };
}
