/**
 * Trend Hub — 5 editorial trend pages.
 *
 * Each page powers:
 *  /trends          → hub (shows all 5 cards)
 *  /trends/:slug    → individual trend page
 *
 * Discovery loop:
 *  Homepage Trending section → /trends/:slug
 *    → Celebrity looks → /celebrity-match/:id
 *    → Products → /product/:id
 *    → Quizzes → /quiz/:slug
 *    → Style Guides → /knowledge/:slug
 *    → More Trends → /trends/:slug (other trends)
 */

export const TREND_PAGES = [
  {
    id: 'wedding-fashion',
    slug: 'wedding-fashion',
    title: 'Wedding Fashion 2026',
    label: 'Wedding',
    tagline: 'Be the guest everyone remembers.',
    eyebrow: 'TREND REPORT · WEDDINGS',
    editorial: [
      'The Indian wedding circuit never slows down. Whether you\'re attending a destination mehendi in Rajasthan or an intimate reception in South Delhi, 2026\'s wedding fashion playbook is clear: rich fabrics, intentional colour, and silhouettes that photograph from every angle.',
      'This season\'s standout move is mixing traditional embroidery with cleaner silhouettes — heavy dupatta, minimal blouse, statement skirt. The lehenga is not going anywhere, but how you style it has changed completely.',
    ],
    heroImage: '/lehengas/Lehengas/1/040A3523_700x.webp',
    accent: '#880e4f',
    accentLight: 'rgba(136,14,79,0.07)',
    categories: ['lehengas', 'sarees', 'suit sets'],
    celebrityIds: ['alia-reception', 'janhvi-sangeet', 'kiara-festive'],
    quizzes: [
      {
        slug: 'wedding-style',
        label: 'What\'s your wedding guest style?',
        desc: 'Four questions. Your complete wedding wardrobe — from mehendi to reception.',
      },
      {
        slug: 'outfit-finder',
        label: 'Build the perfect occasion look',
        desc: 'Tell us the moment, we\'ll find the outfit that belongs there.',
      },
    ],
    knowledgePages: [
      {
        slug: 'wedding-dress-guide',
        label: 'Complete wedding dress guide',
        desc: 'Which outfits, fabrics, and colours suit every function — from mehendi to reception.',
      },
      {
        slug: 'saree-types-explained',
        label: 'Saree types for every wedding role',
        desc: 'Banarasi silk to georgette — which drape to wear and when.',
      },
      {
        slug: 'lehenga-vs-saree',
        label: 'Lehenga or saree?',
        desc: 'The eternal wedding dilemma, finally resolved with clear rules.',
      },
    ],
    magazineCategory: 'festival-fashion',
    relatedTrends: ['festival-fashion', 'airport-looks', 'viral-instagram-fashion'],
  },

  {
    id: 'summer-fashion',
    slug: 'summer-fashion',
    title: 'Summer Fashion 2026',
    label: 'Summer',
    tagline: 'Light fabrics, bold colours, zero compromise.',
    eyebrow: 'TREND REPORT · SUMMER',
    editorial: [
      'Indian summers demand a different kind of dressing. Not minimal — purposeful. Cotton sets that breathe, co-ords that photograph well, and kurtas that make you look considered when you feel anything but. The 2026 summer edit is about mastering one thing: intentional comfort.',
      'The palette this season skews warm — terracotta, saffron, off-white — with occasional punches of cobalt. Fabrics are pure cotton or cotton-linen blends. Embroidery is minimal, mostly at the neckline or hem only.',
    ],
    heroImage: '/kurtas/Kurtas/1/040A2925_700x.webp',
    accent: '#e65100',
    accentLight: 'rgba(230,81,0,0.06)',
    categories: ['kurtas', 'tops', 'co-ords'],
    celebrityIds: ['deepika-airport', 'kartik-airport'],
    quizzes: [
      {
        slug: 'outfit-finder',
        label: 'Find your summer look',
        desc: 'Match the vibe to the weather, occasion, and your wardrobe.',
      },
      {
        slug: 'personality',
        label: 'Discover your fashion personality',
        desc: 'What does your summer style say about how you see the world?',
      },
    ],
    knowledgePages: [
      {
        slug: 'best-fabrics-summer',
        label: 'Best fabrics for the Indian summer',
        desc: 'Cotton, linen, rayon, chiffon — ranked by breathability for 40°C days.',
      },
      {
        slug: 'kurti-style-guide',
        label: 'The complete kurta guide for summer',
        desc: 'Which fabrics, cuts, and lengths actually work in the Indian heat.',
      },
      {
        slug: 'fashion-color-guide',
        label: 'Best colours for summer 2026',
        desc: 'The exact palette dominating Indian wardrobes this season.',
      },
    ],
    magazineCategory: 'seasonal-fashion',
    relatedTrends: ['airport-looks', 'viral-instagram-fashion', 'festival-fashion'],
  },

  {
    id: 'festival-fashion',
    slug: 'festival-fashion',
    title: 'Festival Fashion 2026',
    label: 'Festival',
    tagline: 'Navratri, Diwali, Eid — your full seasonal edit.',
    eyebrow: 'TREND REPORT · FESTIVALS',
    editorial: [
      'India runs on festivals, and festivals run on fashion. The 2026 festive season has a clear direction: move away from generic ethnic and towards intentional traditional. That means knowing your fabric, your embroidery, and exactly which silhouette photographs best under string lights.',
      'This year, the safest choice is also the most stylish one — a well-fitted anarkali in a jewel tone will outlast any trend. But if you want to take a risk, mirror-work lehengas with minimal blouses are having their defining moment.',
    ],
    heroImage: '/co-ords/co-ord_set/1/1.webp',
    accent: '#c9a84c',
    accentLight: 'rgba(201,168,76,0.08)',
    categories: ['lehengas', 'kurtas', 'suit sets'],
    celebrityIds: ['janhvi-sangeet', 'kiara-festive', 'deepika-airport'],
    quizzes: [
      {
        slug: 'festival-look',
        label: 'Find your festival look',
        desc: 'Which festive aesthetic matches your personality and the occasion?',
      },
      {
        slug: 'outfit-finder',
        label: 'Pick the perfect festive outfit',
        desc: 'Navratri to New Year\'s Eve — we\'ll build the complete look.',
      },
    ],
    knowledgePages: [
      {
        slug: 'what-is-anarkali',
        label: 'What is an Anarkali?',
        desc: 'The silhouette built for festivals — how to choose yours.',
      },
      {
        slug: 'kurti-style-guide',
        label: 'Festive kurta guide',
        desc: 'The silhouettes and fabrics that make the biggest impact at any celebration.',
      },
      {
        slug: 'fashion-color-guide',
        label: 'Festive colour playbook',
        desc: 'From classic reds to the unexpected pastel-festive looks of 2026.',
      },
    ],
    magazineCategory: 'festival-fashion',
    relatedTrends: ['wedding-fashion', 'viral-instagram-fashion', 'airport-looks'],
  },

  {
    id: 'viral-instagram-fashion',
    slug: 'viral-instagram-fashion',
    title: 'Viral Instagram Fashion',
    label: 'Viral',
    tagline: 'The looks blowing up on Indian Instagram right now.',
    eyebrow: 'TREND REPORT · VIRAL',
    editorial: [
      'Indian fashion on Instagram in 2026 is not what you expect. It\'s not just influencers in co-ord sets. It\'s the unexpected resurgence of traditional silhouettes styled with modern confidence — the kurta-with-sneakers moment, the pre-draped saree on a flight, the dupatta worn as a skirt.',
      'What makes a look viral in 2026 is not the garment — it\'s the styling contradiction. Something traditional worn in an unexpected context. Something expensive-looking that isn\'t. The algorithm rewards personality, and personality requires a point of view.',
    ],
    heroImage: '/tops/4/1.webp',
    accent: '#600b45',
    accentLight: 'rgba(96,11,69,0.06)',
    categories: ['co-ords', 'tops', 'kurtas'],
    celebrityIds: ['deepika-airport', 'ranveer-event', 'kartik-airport'],
    quizzes: [
      {
        slug: 'personality',
        label: 'What\'s your Instagram fashion personality?',
        desc: 'Five questions reveal your authentic style language — no filters needed.',
      },
      {
        slug: 'outfit-finder',
        label: 'Find your viral-worthy outfit',
        desc: 'Build the look before someone else does.',
      },
    ],
    knowledgePages: [
      {
        slug: 'what-is-coord-fashion',
        label: 'What is co-ord fashion?',
        desc: 'India\'s most viral silhouette — and how to wear it beyond the obvious.',
      },
      {
        slug: 'fashion-color-guide',
        label: 'The colours dominating Indian Instagram',
        desc: 'Which palettes photograph best and why they\'re trending right now.',
      },
      {
        slug: 'palazzo-pairing-guide',
        label: 'How to style palazzos in 2026',
        desc: 'The silhouette that keeps going viral — here\'s how to wear it right.',
      },
    ],
    magazineCategory: 'fashion-trends',
    relatedTrends: ['airport-looks', 'summer-fashion', 'festival-fashion'],
  },

  {
    id: 'airport-looks',
    slug: 'airport-looks',
    title: 'Airport Looks 2026',
    label: 'Airport',
    tagline: 'Travel like the camera is always on.',
    eyebrow: 'TREND REPORT · TRAVEL',
    editorial: [
      'The Indian airport has become fashion\'s most unexpected runway. Stars getting papped at 5am. The pressure to look effortlessly put together while hauling a 23kg suitcase through Terminal 2 is entirely real — and the best airport looks solve exactly one problem: intentional comfort.',
      'The 2026 airport formula: breathable natural fabric, neutral base, one statement piece only. The kurta-and-trouser combination is winning because it\'s ethnically rooted but reads modern in every city. Add quality footwear and you have a look that works from check-in to Insta.',
    ],
    heroImage: '/mens/kurtas/kurta/1/l-pkt410-vebnor-original-imahnybzsfggj62r.webp',
    accent: '#1565c0',
    accentLight: 'rgba(21,101,192,0.06)',
    categories: ['kurtas', 'suit sets', 'blazers'],
    celebrityIds: ['deepika-airport', 'kartik-airport', 'ranveer-event'],
    quizzes: [
      {
        slug: 'outfit-finder',
        label: 'Find your airport look',
        desc: 'Comfort-first dressing that never looks like you gave up.',
      },
      {
        slug: 'personality',
        label: 'What\'s your travel style personality?',
        desc: 'From the minimalist traveller to the maximalist jet-setter.',
      },
    ],
    knowledgePages: [
      {
        slug: 'best-fabrics-summer',
        label: 'Best fabrics for travel in Indian heat',
        desc: 'Never pack the wrong fabric again — a quick guide to breathable travel dressing.',
      },
      {
        slug: 'kurti-style-guide',
        label: 'Kurtas for travel — the full guide',
        desc: 'The most versatile travel garment in Indian fashion, styled right.',
      },
      {
        slug: 'fashion-color-guide',
        label: 'Neutral colour guide for travel dressing',
        desc: 'Build a capsule that works across three different destinations.',
      },
    ],
    magazineCategory: 'celebrity-looks',
    relatedTrends: ['viral-instagram-fashion', 'summer-fashion', 'wedding-fashion'],
  },
];

/** Look up a trend page by slug. Returns null if not found. */
export function getTrendPage(slug) {
  return TREND_PAGES.find((t) => t.slug === slug) || null;
}

/** Check if a trend slug is valid. */
export function isValidTrendSlug(slug) {
  return TREND_PAGES.some((t) => t.slug === slug);
}
