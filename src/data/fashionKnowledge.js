/**
 * Fashion Knowledge — educational reference pages.
 *
 * Routes:
 *   /knowledge           → hub
 *   /knowledge/:slug     → knowledge page
 */

export const KNOWLEDGE_TOPICS = [
  {
    slug: 'silhouettes',
    title: 'Silhouettes & Styles',
    description: 'Understand cuts, fits, and iconic Indian wear shapes.',
    accent: '#600b45',
  },
  {
    slug: 'fabrics',
    title: 'Fabrics Explained',
    description: 'What your clothes are made of — and how they feel.',
    accent: '#1565c0',
  },
  {
    slug: 'garments',
    title: 'Garment Guides',
    description: 'Deep dives into kurtis, sarees, lehengas, and more.',
    accent: '#880e4f',
  },
  {
    slug: 'colour',
    title: 'Colour & Palette',
    description: 'Wear colour with intention — season, skin tone, occasion.',
    accent: '#e65100',
  },
];

function block(type, payload) {
  return { type, ...payload };
}

export const KNOWLEDGE_PAGES = [
  {
    id: 'what-is-anarkali',
    slug: 'what-is-anarkali',
    topicSlug: 'silhouettes',
    title: 'What is Anarkali?',
    dek: 'The flared kurta silhouette named after a Mughal court dancer — and why it flatters almost everyone.',
    excerpt: 'Fitted bodice, flowing skirt panel, celebration-ready drama. Here is everything you need to know about the Anarkali.',
    readTime: '5 min read',
    image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
    shopCategory: 'kurtas',
    shopCategories: ['kurtas', 'suit sets'],
    collectionLabels: [
      { category: 'kurtas', label: 'Anarkali Kurtas' },
      { category: 'suit sets', label: 'Anarkali Suit Sets' },
    ],
    tags: ['anarkali', 'flare', 'kurta', 'festive'],
    featured: true,
    relatedTrends: ['festival-fashion', 'wedding-fashion'],
    relatedCelebrityIds: ['kiara-festive', 'janhvi-sangeet'],
    relatedQuizSlugs: ['outfit-finder', 'festival-look'],
    sections: [
      block('paragraph', {
        text: 'An Anarkali is a long, frock-style kurta with a fitted yoke and a flared skirt panel from the waist down. It takes its name from Anarkali of Mughal legend and remains one of the most universally flattering ethnic silhouettes.',
      }),
      block('heading', { text: 'How to spot an Anarkali' }),
      block('list', {
        items: [
          'Fitted bodice through bust and waist',
          'Flared panels or pleats from waist to hem',
          'Length usually below knee or floor-grazing',
          'Often worn with churidar, leggings, or palazzo',
        ],
      }),
      block('heading', { text: 'When to wear it' }),
      block('paragraph', {
        text: 'Anarkalis work for festive lunches, mehendi functions, and family gatherings where you want movement without sacrificing structure. Petite frames can choose knee-length versions; taller wearers can go full flare.',
      }),
      block('tip', {
        title: 'Styling tip',
        text: 'Keep jewellery minimal when the Anarkali has heavy embroidery — let the silhouette be the hero.',
      }),
    ],
    relatedPageIds: ['kurti-style-guide', 'saree-types-explained'],
  },
  {
    id: 'what-is-rayon-fabric',
    slug: 'what-is-rayon-fabric',
    topicSlug: 'fabrics',
    title: 'What is Rayon Fabric?',
    dek: 'Soft drape, breathable feel, budget-friendly — the fabric behind everyday ethnic comfort.',
    excerpt: 'Rayon is a semi-synthetic cellulose fabric loved for its silk-like fall at a friendlier price point.',
    readTime: '4 min read',
    image: '/tops/4/1.webp',
    shopCategory: 'kurtas',
    shopCategories: ['kurtas', 'tops', 'sarees'],
    collectionLabels: [
      { category: 'kurtas', label: 'Rayon Kurtas' },
      { category: 'sarees', label: 'Flowy Sarees' },
    ],
    tags: ['rayon', 'fabric', 'breathable', 'drape'],
    featured: true,
    relatedTrends: ['summer-fashion', 'viral-instagram-fashion'],
    relatedCelebrityIds: ['deepika-airport', 'kartik-airport'],
    relatedQuizSlugs: ['outfit-finder'],
    sections: [
      block('paragraph', {
        text: 'Rayon is made from regenerated cellulose — usually wood pulp — and spun into fibres that mimic natural silk drape. In Indian wear it appears in daily kurtas, sarees, and tops where breathability matters.',
      }),
      block('heading', { text: 'Pros & cons' }),
      block('list', {
        items: [
          'Pros: soft hand-feel, good drape, affordable, breathable in heat',
          'Cons: can shrink if washed hot; delicate when wet; may wrinkle',
        ],
      }),
      block('heading', { text: 'Care basics' }),
      block('paragraph', {
        text: 'Cold hand wash or gentle machine cycle. Avoid wringing. Steam or low-iron on reverse. Store folded, not hung, for long periods to prevent shoulder stretch.',
      }),
      block('tip', {
        title: 'Shop smart',
        text: 'Look for "viscose rayon" or blend percentages on the label — higher cotton content adds durability for daily wear.',
      }),
    ],
    relatedPageIds: ['kurti-style-guide', 'fashion-color-guide'],
  },
  {
    id: 'kurti-style-guide',
    slug: 'kurti-style-guide',
    topicSlug: 'garments',
    title: 'Kurti Style Guide',
    dek: 'Straight, A-line, Anarkali, asymmetric — find your kurti lane.',
    excerpt: 'The kurti is the most versatile piece in Indian wardrobes. This guide maps silhouettes to body type and occasion.',
    readTime: '7 min read',
    image: '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
    shopCategory: 'kurtas',
    shopCategories: ['kurtas', 'tops', 'co-ords'],
    collectionLabels: [
      { category: 'kurtas', label: 'All Kurtas' },
      { category: 'tops', label: 'Fusion Tops' },
      { category: 'co-ords', label: 'Kurti Co-ords' },
    ],
    tags: ['kurta', 'kurti', 'straight', 'a-line'],
    featured: true,
    relatedTrends: ['airport-looks', 'summer-fashion'],
    relatedCelebrityIds: ['deepika-airport', 'kartik-airport', 'kiara-festive'],
    relatedQuizSlugs: ['outfit-finder', 'personality'],
    sections: [
      block('paragraph', {
        text: 'A kurti (or kurta) is a tunic-length top worn with leggings, palazzo, jeans, or dupatta. Style comes down to three choices: silhouette, length, and neckline.',
      }),
      block('heading', { text: 'Silhouette map' }),
      block('list', {
        items: [
          'Straight kurti — clean lines; best for office and daily wear',
          'A-line kurti — gentle flare; balances hips and thighs',
          'Anarkali — dramatic flare; festive and wedding-friendly',
          'Asymmetric / high-low — modern fusion; great with jeans',
        ],
      }),
      block('heading', { text: 'Length guide' }),
      block('list', {
        items: [
          'Short (hip-length) — pairs with palazzo or wide pants',
          'Medium (knee) — most versatile for all heights',
          'Long (calf to ankle) — elegant; works with churidar',
        ],
      }),
      block('tip', {
        title: 'Quick pick',
        text: 'Daily rotation? Straight cotton kurtas. One festive piece? Anarkali or embroidered A-line.',
      }),
    ],
    relatedPageIds: ['what-is-anarkali', 'what-is-rayon-fabric', 'fashion-color-guide'],
  },
  {
    id: 'saree-types-explained',
    slug: 'saree-types-explained',
    topicSlug: 'garments',
    title: 'Saree Types Explained',
    dek: 'Silk, georgette, cotton, chiffon, pre-draped — know your weave before you buy.',
    excerpt: 'Every saree type drapes differently. Match fabric to occasion, climate, and comfort.',
    readTime: '8 min read',
    image: '/sarees/Sarees/1/0T3A5495_700x.webp',
    shopCategory: 'sarees',
    shopCategories: ['sarees'],
    collectionLabels: [
      { category: 'sarees', label: 'All Sarees' },
      { category: 'sarees', label: 'Silk & Festive Sarees' },
    ],
    tags: ['saree', 'silk', 'georgette', 'cotton', 'drape'],
    featured: true,
    relatedTrends: ['wedding-fashion', 'festival-fashion'],
    relatedCelebrityIds: ['alia-reception', 'janhvi-sangeet'],
    relatedQuizSlugs: ['wedding-style', 'festival-look'],
    sections: [
      block('paragraph', {
        text: 'A saree is a continuous length of fabric draped around the body with pleats at the waist and a pallu over the shoulder. The fabric type determines weight, fall, and formality.',
      }),
      block('heading', { text: 'Common saree types' }),
      block('list', {
        items: [
          'Silk saree — rich, formal; weddings, pujas, receptions',
          'Georgette saree — light drape; parties and daytime events',
          'Cotton saree — breathable; daily wear and summer functions',
          'Chiffon saree — fluid, sheer layers; evening and cocktail',
          'Pre-draped / ready saree — stitched pleats; fastest to wear',
        ],
      }),
      block('heading', { text: 'Choosing by occasion' }),
      block('list', {
        items: [
          'Office / daily: cotton, linen blend, subtle prints',
          'Festive lunch: georgette or light silk with minimal zari',
          'Wedding guest: kanjivaram-style silk, organza, or embellished georgette',
        ],
      }),
      block('tip', {
        title: 'First saree?',
        text: 'Start with georgette or pre-draped — forgiving fall and easier pleats while you learn.',
      }),
    ],
    relatedPageIds: ['what-is-anarkali', 'fashion-color-guide'],
  },
  {
    id: 'fashion-color-guide',
    slug: 'fashion-color-guide',
    topicSlug: 'colour',
    title: 'Fashion Color Guide',
    dek: 'Maroon, sage, mustard, ivory — how to build a palette that works together.',
    excerpt: 'Colour sets mood before silhouette does. Use this guide to mix festive, daily, and office palettes.',
    readTime: '6 min read',
    image: '/tops/7/1.webp',
    shopCategory: 'suit sets',
    shopCategories: ['suit sets', 'kurtas', 'sarees', 'lehengas'],
    collectionLabels: [
      { category: 'suit sets', label: 'Festive Colour Sets' },
      { category: 'kurtas', label: 'Everyday Neutrals' },
      { category: 'sarees', label: 'Jewel Tone Sarees' },
    ],
    tags: ['colour', 'maroon', 'sage', 'pastel', 'festive'],
    featured: true,
    relatedTrends: ['viral-instagram-fashion', 'summer-fashion', 'festival-fashion'],
    relatedCelebrityIds: ['ranveer-event', 'deepika-airport'],
    relatedQuizSlugs: ['personality', 'outfit-finder'],
    sections: [
      block('paragraph', {
        text: 'Indian fashion runs on colour stories — wedding maroons, summer pastels, office sage and navy. The trick is picking a base palette and adding one accent.',
      }),
      block('heading', { text: 'Palette lanes' }),
      block('list', {
        items: [
          'Festive rich: maroon, emerald, gold, wine',
          'Summer soft: peach, lavender, butter yellow, mint',
          'Office calm: sage, beige, navy, white',
          'Evening bold: black, ivory, single jewel accent',
        ],
      }),
      block('heading', { text: 'Mixing rules' }),
      block('list', {
        items: [
          'One hero colour + one neutral per outfit',
          'Match metal jewellery to undertone (gold/warm, silver/cool)',
          'Prints: pull dupatta or accessory from secondary print colour',
        ],
      }),
      block('tip', {
        title: 'Safe starter trio',
        text: 'Maroon + gold (festive), sage + white (daily), navy + ivory (office) — three combos that rarely miss.',
      }),
    ],
    relatedPageIds: ['kurti-style-guide', 'saree-types-explained', 'what-is-rayon-fabric'],
  },
  {
    id: 'what-is-georgette',
    slug: 'what-is-georgette',
    topicSlug: 'fabrics',
    title: 'What is Georgette Fabric?',
    dek: 'Crisp, sheer, and dance-floor friendly — the party fabric explained.',
    excerpt: 'Georgette adds movement without weight. Learn when to choose it over silk or chiffon.',
    readTime: '4 min read',
    image: '/sarees/Sarees/1/0T3A5495_700x.webp',
    shopCategory: 'sarees',
    shopCategories: ['sarees', 'suit sets'],
    collectionLabels: [
      { category: 'sarees', label: 'Georgette Sarees' },
      { category: 'suit sets', label: 'Georgette Suit Sets' },
    ],
    tags: ['georgette', 'fabric', 'saree', 'drape'],
    featured: false,
    relatedTrends: ['wedding-fashion', 'festival-fashion'],
    relatedCelebrityIds: ['alia-reception', 'janhvi-sangeet'],
    relatedQuizSlugs: ['wedding-style'],
    sections: [
      block('paragraph', {
        text: 'Georgette is a lightweight, slightly crinkled woven fabric — plain or silk blend. It holds pleats well in sarees and adds graceful movement to suit sets without clinging.',
      }),
      block('tip', {
        title: 'Best for',
        text: 'Sangeet nights, daytime weddings, and anyone who wants drape without heavy silk weight.',
      }),
    ],
    relatedPageIds: ['saree-types-explained', 'what-is-rayon-fabric'],
  },
  {
    id: 'palazzo-pairing-guide',
    slug: 'palazzo-pairing-guide',
    topicSlug: 'silhouettes',
    title: 'Palazzo Pairing Guide',
    dek: 'Which kurti lengths and fabrics work best with wide-leg bottoms.',
    excerpt: 'Palazzos are comfort royalty — but proportion matters. Match top length and fabric weight correctly.',
    readTime: '4 min read',
    image: '/co-ords/co-ord_set/1/1.webp',
    shopCategory: 'co-ords',
    shopCategories: ['co-ords', 'kurtas'],
    collectionLabels: [
      { category: 'co-ords', label: 'Kurti Palazzo Sets' },
      { category: 'kurtas', label: 'Short Kurtas' },
    ],
    tags: ['palazzo', 'kurta', 'co-ord', 'pairing'],
    featured: false,
    relatedTrends: ['viral-instagram-fashion', 'summer-fashion'],
    relatedCelebrityIds: ['deepika-airport', 'kiara-festive'],
    relatedQuizSlugs: ['outfit-finder'],
    sections: [
      block('paragraph', {
        text: 'Palazzo pants add volume at the hem — balance with a medium to short kurti or a straight long kurta with side slits. Avoid boxy long kurtas without slits; they shorten the leg line.',
      }),
      block('list', {
        items: [
          'Short kurti + high-waist palazzo — lengthens legs',
          'Long slit kurta + flowy palazzo — elegant evening look',
          'Co-ord set — proportion pre-balanced',
        ],
      }),
    ],
    relatedPageIds: ['kurti-style-guide', 'what-is-anarkali'],
  },
  {
    id: 'lehenga-vs-saree',
    slug: 'lehenga-vs-saree',
    topicSlug: 'garments',
    title: 'Lehenga vs Saree: Which to Choose?',
    dek: 'Two celebration heroes — compare comfort, styling time, and occasion fit.',
    excerpt: 'Both are wedding-guest favourites. Your choice depends on movement, styling confidence, and function type.',
    readTime: '5 min read',
    image: '/lehengas/Lehengas/1/040A3523_700x.webp',
    shopCategory: 'lehengas',
    shopCategories: ['lehengas', 'sarees'],
    collectionLabels: [
      { category: 'lehengas', label: 'Lehenga Sets' },
      { category: 'sarees', label: 'Ceremony Sarees' },
    ],
    tags: ['lehenga', 'saree', 'wedding', 'comparison'],
    featured: false,
    relatedTrends: ['wedding-fashion', 'festival-fashion'],
    relatedCelebrityIds: ['alia-reception', 'janhvi-sangeet', 'kiara-festive'],
    relatedQuizSlugs: ['wedding-style', 'festival-look'],
    sections: [
      block('paragraph', {
        text: 'Lehengas are three-piece sets (skirt, blouse, dupatta) — ready to wear with minimal draping. Sarees offer timeless elegance but need pleating and pallu management.',
      }),
      block('heading', { text: 'Pick lehenga when…' }),
      block('list', {
        items: ['You want to dance freely (sangeet, garba)', 'You prefer structured, pre-fitted looks', 'You are short on styling time'],
      }),
      block('heading', { text: 'Pick saree when…' }),
      block('list', {
        items: ['Ceremony calls for traditional drape', 'You love jewellery + pallu styling', 'You want one saree across multiple functions with different blouses'],
      }),
    ],
    relatedPageIds: ['saree-types-explained', 'what-is-anarkali'],
  },

  /* ── New pages ───────────────────────────────────────────────────────── */

  {
    id: 'what-is-coord-fashion',
    slug: 'what-is-coord-fashion',
    topicSlug: 'silhouettes',
    title: 'What is Co-ord Fashion?',
    dek: 'Matching sets that do all the thinking for you — how to wear the trend India is obsessed with.',
    excerpt: 'Co-ord sets are the easiest way to look put-together. One decision, two pieces, zero effort.',
    readTime: '5 min read',
    image: '/co-ords/co-ord_set/1/1.webp',
    shopCategory: 'co-ords',
    shopCategories: ['co-ords', 'suit sets', 'tops'],
    collectionLabels: [
      { category: 'co-ords', label: 'All Co-ord Sets' },
      { category: 'suit sets', label: 'Festive Co-ord Sets' },
      { category: 'tops', label: 'Fusion Tops' },
    ],
    tags: ['co-ord', 'matching set', 'fusion', 'streetwear'],
    featured: true,
    relatedTrends: ['viral-instagram-fashion', 'airport-looks', 'summer-fashion'],
    relatedCelebrityIds: ['deepika-airport', 'kartik-airport', 'ranveer-event'],
    relatedQuizSlugs: ['personality', 'outfit-finder'],
    sections: [
      block('paragraph', {
        text: 'A co-ord set is two or more matching pieces — top and bottom, or top, bottom and dupatta — designed to be worn together. The fabric, print, and palette are pre-matched so you never have to second-guess the combination.',
      }),
      block('heading', { text: 'Types of co-ord sets' }),
      block('list', {
        items: [
          'Kurti + palazzo — the most common ethnic co-ord; comfort and occasion-ready',
          'Crop top + skirt — fusion co-ord; festivals and evening outings',
          'Shirt + trouser — office-friendly; modern Indian wear',
          'Suit set (kurta + dupatta + bottom) — traditional three-piece co-ord',
          'Printed matching sets — bold pattern across both pieces; party and travel',
        ],
      }),
      block('heading', { text: 'Why co-ords work' }),
      block('paragraph', {
        text: 'Co-ords remove outfit decision fatigue. Proportion is already solved — lengths, volumes, and prints are designed to balance each other. That is why Bollywood celebrities reach for co-ord sets at airports and events: they photograph well, travel easily, and require no accessories to look complete.',
      }),
      block('heading', { text: 'How to style a co-ord' }),
      block('list', {
        items: [
          'Wear as a set first — let the matching do the work',
          'Break the set: wear the top with jeans, or the bottom with a plain top',
          'Add only one accessory — the matching set already creates visual impact',
          'Solid co-ords: bold earrings work; printed co-ords: skip the jewellery',
        ],
      }),
      block('tip', {
        title: 'Travel tip',
        text: 'Pack co-ords for trips — they compress well, look polished on arrival, and each piece works solo with other separates.',
      }),
    ],
    relatedPageIds: ['kurti-style-guide', 'palazzo-pairing-guide', 'fashion-color-guide'],
  },

  {
    id: 'best-fabrics-summer',
    slug: 'best-fabrics-summer',
    topicSlug: 'fabrics',
    title: 'Best Fabrics for Summer',
    dek: 'Cotton, linen, rayon, chiffon — which fabrics keep you cool and stylish when temperatures rise.',
    excerpt: 'Summer dressing is 80% fabric choice. The right weave keeps you breathable, sweat-free, and fresh.',
    readTime: '6 min read',
    image: '/tops/4/1.webp',
    shopCategory: 'tops',
    shopCategories: ['tops', 'kurtas', 'co-ords', 'sarees'],
    collectionLabels: [
      { category: 'tops', label: 'Summer Tops' },
      { category: 'kurtas', label: 'Cotton Kurtas' },
      { category: 'co-ords', label: 'Linen Co-ords' },
      { category: 'sarees', label: 'Cotton Sarees' },
    ],
    tags: ['summer', 'cotton', 'linen', 'breathable', 'fabric'],
    featured: true,
    relatedTrends: ['summer-fashion', 'airport-looks', 'viral-instagram-fashion'],
    relatedCelebrityIds: ['deepika-airport', 'kartik-airport'],
    relatedQuizSlugs: ['outfit-finder', 'personality'],
    sections: [
      block('paragraph', {
        text: 'Heat and humidity demand fabric choices that breathe, wick moisture, and maintain structure through a long day. Indian summers — especially April through June — call for natural or semi-natural fibres that do not trap heat against the skin.',
      }),
      block('heading', { text: 'Best summer fabrics — ranked' }),
      block('list', {
        items: [
          'Cotton (pure) — the gold standard; absorbs sweat, washes easily, stays cool',
          'Linen — slightly textured; breathes exceptionally well; wrinkles are part of the charm',
          'Rayon / viscose — semi-synthetic; silk-like drape; cooler than polyester but warmer than cotton',
          'Chiffon — light and airy; best for evenings when cotton feels too casual',
          'Mul cotton — extremely fine cotton weave; airy even in peak heat',
        ],
      }),
      block('heading', { text: 'What to avoid in summer' }),
      block('list', {
        items: [
          'Polyester — traps heat, holds sweat odour',
          'Heavy silk — elegant but warm; saves for cooler evening occasions',
          'Velvet and brocade — festive but unbearable in 38°C+',
          'Dark blacks in direct sun — absorbs more heat regardless of fabric',
        ],
      }),
      block('heading', { text: 'Summer palette tip' }),
      block('paragraph', {
        text: 'Pair breathable fabrics with light palettes — white, cream, peach, sky blue, mint. Dark jewel tones look rich but absorb heat. For summer functions, choose pastel georgette or printed cotton.',
      }),
      block('tip', {
        title: 'Quick test',
        text: 'Hold the fabric up to light — if light passes through, it breathes. The more see-through, the cooler it will feel.',
      }),
    ],
    relatedPageIds: ['what-is-rayon-fabric', 'what-is-georgette', 'fashion-color-guide'],
  },

  {
    id: 'wedding-dress-guide',
    slug: 'wedding-dress-guide',
    topicSlug: 'garments',
    title: 'Wedding Dress Guide',
    dek: 'From bride to wedding guest — what to wear, what to avoid, and how to dress for every function.',
    excerpt: 'Indian wedding dressing has rules — mostly unspoken. This guide breaks down every function, every role, and every fabric decision.',
    readTime: '9 min read',
    image: '/lehengas/Lehengas/1/040A3523_700x.webp',
    shopCategory: 'lehengas',
    shopCategories: ['lehengas', 'sarees', 'suit sets', 'kurtas'],
    collectionLabels: [
      { category: 'lehengas', label: 'Bridal Lehenga Sets' },
      { category: 'sarees', label: 'Wedding Sarees' },
      { category: 'suit sets', label: 'Guest Suit Sets' },
      { category: 'kurtas', label: 'Sangeet Kurtas' },
    ],
    tags: ['wedding', 'lehenga', 'saree', 'bride', 'guest'],
    featured: true,
    relatedTrends: ['wedding-fashion', 'festival-fashion'],
    relatedCelebrityIds: ['alia-reception', 'janhvi-sangeet', 'kiara-festive'],
    relatedQuizSlugs: ['wedding-style', 'festival-look'],
    sections: [
      block('paragraph', {
        text: 'Indian weddings span two to seven days across mehendi, haldi, sangeet, nikah or pheras, and reception. Each function has its own dress code — and each role (bride, bridesmaid, mother, guest) has different expectations.',
      }),
      block('heading', { text: 'Function-by-function breakdown' }),
      block('list', {
        items: [
          'Mehendi — relaxed; printed cotton or georgette suit set; nothing too heavy',
          'Haldi — white or yellow kurta you do not mind getting stained; comfortable and washable',
          'Sangeet — showstopper lehenga or sharara; bold colour, dance-friendly silhouette',
          'Wedding ceremony — traditional bridal lehenga or kanjivaram saree; heavily embellished',
          'Reception — reception lehenga or embroidered gown; slightly more Western is fine',
        ],
      }),
      block('heading', { text: 'Wedding guest dress code' }),
      block('list', {
        items: [
          'Do not wear white, red, or black as a guest (reserved for bride or considered inauspicious)',
          'Georgette or silk sarees are always appropriate for any function',
          'Suit sets and co-ords work for day functions; lehengas for evening sangeet or reception',
          'Heavy embroidery is fine; outshining the bride is not — calibrate accordingly',
        ],
      }),
      block('heading', { text: 'Fabric guide by function' }),
      block('list', {
        items: [
          'Mehendi/Haldi: cotton or printed rayon',
          'Sangeet: heavy georgette, raw silk, or tissue fabric',
          'Ceremony: kanjivaram, banarasi, or embroidered net',
          'Reception: velvet, sequined net, or heavy georgette',
        ],
      }),
      block('tip', {
        title: 'Budget tip',
        text: 'Invest in one strong festive lehenga and one good georgette saree — between them you can cover most wedding functions with accessories and blouse changes.',
      }),
    ],
    relatedPageIds: ['lehenga-vs-saree', 'saree-types-explained', 'what-is-anarkali'],
  },
];

export function getKnowledgeTopics() {
  return KNOWLEDGE_TOPICS;
}

export function getTopicBySlug(slug) {
  return KNOWLEDGE_TOPICS.find((t) => t.slug === slug) || null;
}

export function getAllKnowledgePages() {
  return KNOWLEDGE_PAGES;
}

export function getKnowledgePageBySlug(slug) {
  return KNOWLEDGE_PAGES.find((p) => p.slug === slug) || null;
}

export function isValidKnowledgePageSlug(slug) {
  return Boolean(getKnowledgePageBySlug(slug));
}

export function getKnowledgePagesByTopic(topicSlug) {
  return KNOWLEDGE_PAGES.filter((p) => p.topicSlug === topicSlug);
}

export function getFeaturedKnowledgePages(limit = 5) {
  const featured = KNOWLEDGE_PAGES.filter((p) => p.featured);
  const rest = KNOWLEDGE_PAGES.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getRelatedKnowledgePages(page, limit = 3) {
  if (!page) return [];
  const byId = new Map(KNOWLEDGE_PAGES.map((p) => [p.id, p]));
  const related = (page.relatedPageIds || []).map((id) => byId.get(id)).filter(Boolean);
  const sameTopic = KNOWLEDGE_PAGES.filter(
    (p) => p.topicSlug === page.topicSlug && p.id !== page.id,
  );
  const merged = [...related];
  for (const p of sameTopic) {
    if (merged.length >= limit) break;
    if (!merged.find((x) => x.id === p.id)) merged.push(p);
  }
  return merged.slice(0, limit);
}

export function getKnowledgePagePath(slug) {
  return `/knowledge/${encodeURIComponent(slug)}`;
}

export function getKnowledgeHubPath() {
  return '/knowledge';
}
