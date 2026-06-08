/**
 * Fashion Magazine — editorial content architecture.
 *
 * Routes:
 *   /magazine                              → hub
 *   /magazine/:categorySlug               → category listing
 *   /magazine/:categorySlug/:articleSlug  → article detail
 */

export const MAGAZINE_CATEGORIES = [
  {
    slug: 'fashion-trends',
    title: 'Fashion Trends',
    tagline: 'What is moving right now',
    description: 'Runway-to-real-life trends, viral silhouettes, and the edits everyone is scrolling.',
    accent: '#600b45',
    icon: 'trending',
  },
  {
    slug: 'styling-tips',
    title: 'Styling Tips',
    tagline: 'Wear it better',
    description: 'Fit, drape, layering, and mix-and-match tricks from the Trendkaari editorial desk.',
    accent: '#1565c0',
    icon: 'sparkles',
  },
  {
    slug: 'celebrity-looks',
    title: 'Celebrity Looks',
    tagline: 'Star-inspired edits',
    description: 'Break down red-carpet and street-style moments — then shop the closest match.',
    accent: '#880e4f',
    icon: 'star',
  },
  {
    slug: 'seasonal-fashion',
    title: 'Seasonal Fashion',
    tagline: 'Dress for the weather',
    description: 'Monsoon layers, summer pastels, winter silk — season-ready wardrobes decoded.',
    accent: '#2e7d32',
    icon: 'leaf',
  },
  {
    slug: 'festival-fashion',
    title: 'Festival Fashion',
    tagline: 'Celebration dressing',
    description: 'Diwali, Navratri, Eid, and wedding season — function-by-function outfit lanes.',
    accent: '#e65100',
    icon: 'flame',
  },
  {
    slug: 'buying-guides',
    title: 'Buying Guides',
    tagline: 'Shop smarter',
    description: 'Size charts, fabric checks, and budget lanes so every purchase feels intentional.',
    accent: '#4527a0',
    icon: 'book',
  },
];

function block(type, payload) {
  return { type, ...payload };
}

export const MAGAZINE_ARTICLES = [
  // ── Fashion Trends ──
  {
    id: 'co-ord-sets-dominating-2026',
    slug: 'co-ord-sets-dominating-2026',
    categorySlug: 'fashion-trends',
    title: 'Why Co-ord Sets Are Dominating 2026',
    dek: 'One purchase, three outfits — the math every scroll-addicted wardrobe understands.',
    excerpt: 'Matching sets are no longer lounge-only. From desk to dinner, co-ords are the fastest route to a polished look.',
    readTime: '5 min read',
    author: 'Trendkaari Editorial',
    publishedAt: '2026-05-28',
    image: '/co-ords/co-ord_set/1/1.webp',
    shopCategory: 'co-ords',
    tags: ['co-ords', 'trends', 'fusion'],
    featured: true,
    sections: [
      block('paragraph', {
        text: 'Co-ord sets have crossed from Instagram trend to wardrobe staple. The appeal is simple: proportion is pre-solved, colour story is locked in, and you can split pieces across seasons.',
      }),
      block('heading', { text: 'Three ways people are wearing them now' }),
      block('list', {
        items: [
          'Monochrome desk sets with sneakers for smart-casual offices',
          'Festive co-ords with statement earrings — no blouse hunt required',
          'Mens co-ords layered under ethnic jackets for wedding brunches',
        ],
      }),
      block('tip', {
        title: 'Trend takeaway',
        text: 'If you only add one trend piece this quarter, make it a co-ord you can wear as a set and as separates.',
      }),
    ],
    relatedArticleIds: ['quiet-luxury-ethnic', 'kurta-length-decoded'],
  },
  {
    id: 'quiet-luxury-ethnic',
    slug: 'quiet-luxury-ethnic',
    categorySlug: 'fashion-trends',
    title: 'Quiet Luxury Goes Ethnic',
    dek: 'Understated silk, tonal embroidery, and zero logo energy.',
    excerpt: 'The loudest trend right now is restraint — sage kurtas, ivory suit sets, and fabric that speaks first.',
    readTime: '4 min read',
    author: 'Trendkaari Editorial',
    publishedAt: '2026-05-15',
    image: '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp',
    shopCategory: 'kurtas',
    tags: ['minimal', 'silk', 'kurtas'],
    featured: false,
    sections: [
      block('paragraph', {
        text: 'Quiet luxury in Indian wear means fewer mirrors, more weave. Think sage cotton-silk kurtas, straight pants, and one heirloom accessory instead of full bridal sparkle.',
      }),
      block('heading', { text: 'Palette to watch' }),
      block('list', {
        items: ['Sage & stone grey', 'Ivory & champagne', 'Deep wine as a single accent'],
      }),
    ],
    relatedArticleIds: ['co-ord-sets-dominating-2026', 'summer-pastel-palette'],
  },

  // ── Styling Tips ──
  {
    id: 'kurta-length-decoded',
    slug: 'kurta-length-decoded',
    categorySlug: 'styling-tips',
    title: 'Kurta Length Decoded',
    dek: 'Where your hem should land — and why it changes everything.',
    excerpt: 'Too long reads sloppy; too short fights your silhouette. Here is the length map for every body type.',
    readTime: '6 min read',
    author: 'Trendkaari Styling Desk',
    publishedAt: '2026-05-20',
    image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
    shopCategory: 'kurtas',
    tags: ['fit', 'kurtas', 'how-to'],
    featured: true,
    sections: [
      block('paragraph', {
        text: 'Kurta length is the fastest styling fix most people skip. Your ideal hem depends on height, bottom style, and occasion — not a one-size rule from a size chart.',
      }),
      block('heading', { text: 'Quick length guide' }),
      block('list', {
        items: [
          'Petite: mid-thigh to above-knee with straight pants',
          'Regular: knee-length for everyday; below-knee for formal',
          'Curvy: A-line and knee+ lengths balance proportions beautifully',
          'Tall: longline kurtas and palazzo pairings shine on you',
        ],
      }),
      block('tip', {
        title: 'Stylist note',
        text: 'When in doubt, try the same kurta with churidar vs palazzo — length reads completely different.',
      }),
    ],
    relatedArticleIds: ['saree-blouse-pairing', 'lehenga-size-guide'],
  },
  {
    id: 'saree-blouse-pairing',
    slug: 'saree-blouse-pairing',
    categorySlug: 'styling-tips',
    title: 'Saree + Blouse Pairing Rules',
    dek: 'Contrast, texture, and neckline — without overthinking.',
    excerpt: 'A great saree drape starts with the blouse. These combos work on repeat.',
    readTime: '5 min read',
    author: 'Trendkaari Styling Desk',
    publishedAt: '2026-05-08',
    image: '/sarees/Sarees/9/L12.01.25_3547_33128c31-b45d-4240-b2c3-634c0659e06c_700x.webp',
    shopCategory: 'sarees',
    tags: ['sarees', 'styling', 'blouse'],
    featured: false,
    sections: [
      block('paragraph', {
        text: 'Match fabric weight first, colour second. A heavy silk saree needs structure in the blouse; georgette loves soft cups and minimal seams.',
      }),
      block('heading', { text: 'Failsafe combos' }),
      block('list', {
        items: [
          'Gold tissue saree + deep wine blouse',
          'Pastel georgette + tonal satin blouse',
          'Printed cotton + solid contrast neck',
        ],
      }),
    ],
    relatedArticleIds: ['kurta-length-decoded', 'deepika-red-carpet-recreate'],
  },

  // ── Celebrity Looks ──
  {
    id: 'deepika-red-carpet-recreate',
    slug: 'deepika-red-carpet-recreate',
    categorySlug: 'celebrity-looks',
    title: 'Deepika-Inspired Silk Saree Moment',
    dek: 'Classic red carpet energy — shop the edit without the stylist budget.',
    excerpt: 'Structured drape, jewel tone, single statement earring. Recreate the silhouette from our saree lane.',
    readTime: '4 min read',
    author: 'Trendkaari Celebrity Edit',
    publishedAt: '2026-05-22',
    image: '/sarees/Sarees/9/L12.01.25_3492_9d036254-9d70-42ef-9073-da5533651b09_700x.webp',
    shopCategory: 'sarees',
    tags: ['celebrity', 'saree', 'red carpet'],
    featured: true,
    celebrity: 'Classic red carpet',
    sections: [
      block('paragraph', {
        text: 'The formula: rich silk or satin base, minimal pleats, strong blouse neckline, one bold accessory. Skip competing prints — let fabric sheen do the work.',
      }),
      block('heading', { text: 'Shop the breakdown' }),
      block('list', {
        items: [
          'Silk or satin saree in emerald, wine, or midnight',
          'Structured blouse — boat or square neck',
          'Kundan or single-drop earrings — not both choker and jhumka',
        ],
      }),
    ],
    relatedArticleIds: ['ranveer-fusion-menswear', 'quiet-luxury-ethnic'],
  },
  {
    id: 'ranveer-fusion-menswear',
    slug: 'ranveer-fusion-menswear',
    categorySlug: 'celebrity-looks',
    title: 'Ranveer-Style Fusion Menswear',
    dek: 'Bold co-ords, layered kurtas, and confidence as the accessory.',
    excerpt: 'Street-star energy meets ethnic layers — how to pull off fusion without costume vibes.',
    readTime: '4 min read',
    author: 'Trendkaari Celebrity Edit',
    publishedAt: '2026-05-10',
    image: '/co-ords/co-ord_set/1/1.webp',
    shopCategory: 'gents co-ords',
    tags: ['celebrity', 'menswear', 'fusion'],
    featured: false,
    celebrity: 'Street-style star',
    sections: [
      block('paragraph', {
        text: 'Fusion works when one element stays classic. Pair a bold printed kurta with neutral pants, or a statement co-ord with a plain ethnic jacket — not everything loud at once.',
      }),
      block('tip', {
        title: 'One bold move',
        text: 'Pick either print OR bright colour as hero — balance with neutral footwear.',
      }),
    ],
    relatedArticleIds: ['co-ord-sets-dominating-2026', 'deepika-red-carpet-recreate'],
  },

  // ── Seasonal Fashion ──
  {
    id: 'monsoon-breathable-fabrics',
    slug: 'monsoon-breathable-fabrics',
    categorySlug: 'seasonal-fashion',
    title: 'Monsoon Fabrics That Actually Breathe',
    dek: 'Cotton-linen blends, quick-dry weaves, and hems that survive humidity.',
    excerpt: 'Heavy silk can wait — these fabrics keep shape (and sanity) through wet commutes.',
    readTime: '5 min read',
    author: 'Trendkaari Seasonal',
    publishedAt: '2026-06-01',
    image: '/tops/4/1.webp',
    shopCategory: 'kurtas',
    tags: ['monsoon', 'fabric', 'cotton'],
    featured: true,
    sections: [
      block('paragraph', {
        text: 'Monsoon dressing is a fabric game. Lightweight cotton, linen blends, and georgette with minimal lining dry faster and feel less sticky in humidity.',
      }),
      block('heading', { text: 'Fabric priority list' }),
      block('list', {
        items: ['Pure cotton & cotton-linen for daily kurtas', 'Georgette sarees with minimal fall', 'Avoid heavy raw silk until post-monsoon'],
      }),
    ],
    relatedArticleIds: ['summer-pastel-palette', 'fabric-quality-checklist'],
  },
  {
    id: 'summer-pastel-palette',
    slug: 'summer-pastel-palette',
    categorySlug: 'seasonal-fashion',
    title: 'Summer Pastel Palette Guide',
    dek: 'Peach, lavender, butter yellow — wear heat-friendly hues.',
    excerpt: 'Pastels reflect light and photograph beautifully. Build a summer capsule around three soft tones.',
    readTime: '4 min read',
    author: 'Trendkaari Seasonal',
    publishedAt: '2026-04-18',
    image: '/tops/7/1.webp',
    shopCategory: 'tops',
    tags: ['summer', 'pastel', 'capsule'],
    featured: false,
    sections: [
      block('paragraph', {
        text: 'Start with one pastel hero — peach suit set or lavender co-ord — then anchor with white or beige basics. Accessories in gold or shell keep it elevated, not juvenile.',
      }),
    ],
    relatedArticleIds: ['monsoon-breathable-fabrics', 'quiet-luxury-ethnic'],
  },

  // ── Festival Fashion ──
  {
    id: 'diwali-outfit-formula',
    slug: 'diwali-outfit-formula',
    categorySlug: 'festival-fashion',
    title: 'The Diwali Outfit Formula',
    dek: 'Gold accent + rich base colour + one statement piece.',
    excerpt: 'From puja morning to family dinner — one formula, three outfit lanes.',
    readTime: '5 min read',
    author: 'Trendkaari Festive',
    publishedAt: '2026-10-15',
    image: '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp',
    shopCategory: 'suit sets',
    tags: ['diwali', 'festive', 'gold'],
    featured: true,
    sections: [
      block('paragraph', {
        text: 'Diwali dressing clicks when you limit shine to one zone — either fabric (silk kurta) or embroidery (gold thread suit set), not both screaming at once.',
      }),
      block('heading', { text: 'Three function lanes' }),
      block('list', {
        items: [
          'Puja: cotton-silk kurta in maroon or mustard',
          'Family lunch: embroidered suit set',
          'Evening dinner: saree or lehenga with single statement earring',
        ],
      }),
    ],
    relatedArticleIds: ['navratri-garba-picks', 'quiet-luxury-ethnic'],
  },
  {
    id: 'navratri-garba-picks',
    slug: 'navratri-garba-picks',
    categorySlug: 'festival-fashion',
    title: 'Navratri Garba Outfit Picks',
    dek: 'Twirl-friendly lehengas, mirror work, and breathable layers.',
    excerpt: 'Nine nights means nine moods — start with lightweight flare and secure dupatta pins.',
    readTime: '4 min read',
    author: 'Trendkaari Festive',
    publishedAt: '2026-09-20',
    image: '/lehengas/Lehengas/9/040A1719_700x.webp',
    shopCategory: 'lehengas',
    tags: ['navratri', 'garba', 'lehenga'],
    featured: false,
    sections: [
      block('paragraph', {
        text: 'Garba is a movement test. Pick lehengas with lighter skirts, secure blouses, and minimal heavy border weight so you can spin without adjusting every song.',
      }),
      block('tip', {
        title: 'Dance-floor hack',
        text: 'Pre-stitched dupatta or waist belt keeps hands free for dandiya sticks.',
      }),
    ],
    relatedArticleIds: ['diwali-outfit-formula', 'lehenga-size-guide'],
  },

  // ── Buying Guides ──
  {
    id: 'lehenga-size-guide',
    slug: 'lehenga-size-guide',
    categorySlug: 'buying-guides',
    title: 'Lehenga Size Guide: Measure Once, Buy Right',
    dek: 'Waist, hip, and length — the three numbers that prevent alteration panic.',
    excerpt: 'Lehenga sizing varies by brand. Use our measure-at-home checklist before you checkout.',
    readTime: '7 min read',
    author: 'Trendkaari Buying Desk',
    publishedAt: '2026-05-05',
    image: '/lehengas/Lehengas/9/040A1719_700x.webp',
    shopCategory: 'lehengas',
    tags: ['size guide', 'lehenga', 'how to buy'],
    featured: true,
    sections: [
      block('paragraph', {
        text: 'Measure at the natural waist (where the skirt sits), fullest hip, and desired skirt length from waist to floor. Compare to the size chart — if between sizes, size up for festive comfort.',
      }),
      block('heading', { text: 'Measure checklist' }),
      block('list', {
        items: [
          'Waist at skirt sit point — not trouser waist',
          'Hip at fullest point — usually 8 inches below waist',
          'Blouse bust with preferred undergarment',
          'Skirt length with heels you will wear',
        ],
      }),
    ],
    relatedArticleIds: ['fabric-quality-checklist', 'kurta-length-decoded'],
  },
  {
    id: 'fabric-quality-checklist',
    slug: 'fabric-quality-checklist',
    categorySlug: 'buying-guides',
    title: 'Fabric Quality Checklist Before You Buy',
    dek: 'Thread count clues, lining checks, and return-policy peace of mind.',
    excerpt: 'Online ethnic wear rewards fabric literacy. Run through this checklist on every premium purchase.',
    readTime: '6 min read',
    author: 'Trendkaari Buying Desk',
    publishedAt: '2026-04-30',
    image: '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp',
    shopCategory: 'suit sets',
    tags: ['fabric', 'quality', 'buying'],
    featured: false,
    sections: [
      block('paragraph', {
        text: 'Zoom product images for weave consistency, check lining on suit sets, and read fabric composition — "silk blend" percentages matter for drape and care.',
      }),
      block('heading', { text: 'Red flags vs green flags' }),
      block('list', {
        items: [
          'Green: named fabric, care label, close-up weave shots',
          'Red: vague "premium material", no composition, blurry embroidery photos',
        ],
      }),
    ],
    relatedArticleIds: ['lehenga-size-guide', 'monsoon-breathable-fabrics'],
  },
];

export function getMagazineCategories() {
  return MAGAZINE_CATEGORIES;
}

export function getCategoryBySlug(slug) {
  return MAGAZINE_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function isValidMagazineCategorySlug(slug) {
  return Boolean(getCategoryBySlug(slug));
}

export function getAllArticles() {
  return MAGAZINE_ARTICLES;
}

export function getArticleBySlug(categorySlug, articleSlug) {
  return (
    MAGAZINE_ARTICLES.find(
      (a) => a.categorySlug === categorySlug && a.slug === articleSlug,
    ) || null
  );
}

export function isValidMagazineArticle(categorySlug, articleSlug) {
  return Boolean(getArticleBySlug(categorySlug, articleSlug));
}

export function getArticlesByCategory(categorySlug) {
  return MAGAZINE_ARTICLES.filter((a) => a.categorySlug === categorySlug);
}

export function getFeaturedArticles(limit = 6) {
  const featured = MAGAZINE_ARTICLES.filter((a) => a.featured);
  const rest = MAGAZINE_ARTICLES.filter((a) => !a.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getLatestArticles(limit = 8) {
  return [...MAGAZINE_ARTICLES]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

export function getRelatedArticles(article, limit = 3) {
  if (!article) return [];
  const byId = new Map(MAGAZINE_ARTICLES.map((a) => [a.id, a]));
  const related = (article.relatedArticleIds || [])
    .map((id) => byId.get(id))
    .filter(Boolean);
  const sameCategory = MAGAZINE_ARTICLES.filter(
    (a) => a.categorySlug === article.categorySlug && a.id !== article.id,
  );
  const merged = [...related];
  for (const a of sameCategory) {
    if (merged.length >= limit) break;
    if (!merged.find((x) => x.id === a.id)) merged.push(a);
  }
  return merged.slice(0, limit);
}

export function getMagazineCategoryPath(categorySlug) {
  return `/magazine/${categorySlug}`;
}

export function getMagazineArticlePath(categorySlug, articleSlug) {
  return `/magazine/${categorySlug}/${encodeURIComponent(articleSlug)}`;
}

export function getMagazineHubPath() {
  return '/magazine';
}
