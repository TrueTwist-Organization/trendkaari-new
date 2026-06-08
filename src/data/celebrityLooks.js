/**
 * Celebrity look cards — editorial discovery entry points.
 *
 * Each entry powers two surfaces:
 *  1. Homepage Bollywood block (card grid)
 *  2. Individual celebrity look page at /celebrity-match/:id
 *
 * Fields:
 *  styleNotes   — 3 editorial tips rendered on the individual look page
 *  knowledgeSlug — links to style guide via /knowledge/:slug
 *  quizSlug     — links to a relevant quiz via /quiz/:slug
 *  articleCategory — links to a magazine category via /magazine/:slug
 *  theme        — used for grouping / future filtering
 */

export const CELEBRITY_LOOKS = [
  {
    id: 'deepika-airport',
    celebrity: 'Deepika Padukone',
    context: 'Airport · Mumbai',
    title: 'Quiet Luxury Kurta Set',
    hook: 'Find your version →',
    image: '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
    category: 'kurtas',
    theme: 'Effortless',
    styleNotes: [
      'Choose breathable cotton or linen for travel — comfort is the actual flex here.',
      'Minimal jewellery only — one small earring per ear, nothing on the wrist.',
      'Block heels or pointed Kolhapuri flats balance the relaxed silhouette perfectly.',
    ],
    knowledgeSlug: 'kurti-style-guide',
    quizSlug: 'outfit-finder',
    articleCategory: 'celebrity-looks',
  },
  {
    id: 'alia-reception',
    celebrity: 'Alia Bhatt',
    context: 'Reception · Delhi',
    title: 'Silk Saree Moment',
    hook: 'Explore sarees →',
    image: '/sarees/Sarees/1/0T3A5495_700x.webp',
    category: 'sarees',
    theme: 'Bridal',
    styleNotes: [
      'Pre-draped sarees are the modern choice — elegant with absolutely no fuss.',
      'Keep the blouse minimal so the silk fabric and drape do all the talking.',
      'A single statement necklace over a silk saree reads editorial, not overdressed.',
    ],
    knowledgeSlug: 'saree-types-explained',
    quizSlug: 'wedding-style',
    articleCategory: 'celebrity-looks',
  },
  {
    id: 'janhvi-sangeet',
    celebrity: 'Janhvi Kapoor',
    context: 'Sangeet · Mumbai',
    title: 'Embellished Lehenga Edit',
    hook: 'Shop the look →',
    image: '/lehengas/Lehengas/1/040A3523_700x.webp',
    category: 'lehengas',
    theme: 'Festive',
    styleNotes: [
      'A flared lehenga with mirror work photographs like a dream — every step becomes a shot.',
      'Let the skirt be the hero — pair with a blouse that has minimal back detailing only.',
      'Pull your hair back or up to keep the neckline visible and the silhouette clean.',
    ],
    knowledgeSlug: 'kurti-style-guide',
    quizSlug: 'festival-look',
    articleCategory: 'festival-fashion',
  },
  {
    id: 'kiara-festive',
    celebrity: 'Kiara Advani',
    context: 'Festive · Celebration',
    title: 'Embroidered Suit Set',
    hook: 'Open suit sets →',
    image: '/suit-sets/Suit Sets/9/L12.01.25_1911_700x.webp',
    category: 'suit sets',
    theme: 'Festive',
    styleNotes: [
      'An embroidered suit set moves effortlessly from afternoon pooja to evening party.',
      'Match your dupatta colour to the embroidery thread for a polished, intentional look.',
      'Gold juttis are always the right choice for festive — simple, sharp, never wrong.',
    ],
    knowledgeSlug: 'kurti-style-guide',
    quizSlug: 'outfit-finder',
    articleCategory: 'festival-fashion',
  },
  {
    id: 'kartik-airport',
    celebrity: 'Kartik Aaryan',
    context: 'Airport · Street style',
    title: 'Clean Kurta Silhouette',
    hook: 'Browse mens kurtas →',
    image: '/mens/kurtas/kurta/1/l-pkt410-vebnor-original-imahnybzsfggj62r.webp',
    category: 'gents kurtas',
    theme: 'Casual',
    styleNotes: [
      'Straight-cut kurtas in off-white or beige neutrals are the most versatile menswear choice.',
      'Roll up the sleeves one fold — instantly looks relaxed and intentional, not forgettable.',
      'White sneakers OR brown leather loafers — both work, pick based on where you are going.',
    ],
    knowledgeSlug: 'kurti-style-guide',
    quizSlug: 'outfit-finder',
    articleCategory: 'styling-tips',
  },
  {
    id: 'ranveer-event',
    celebrity: 'Ranveer Singh',
    context: 'Event · Bold edit',
    title: 'Statement Co-ord Energy',
    hook: 'See the full look →',
    image: '/mens/blazers/Blezermen/b10/1.webp',
    category: 'blazers',
    theme: 'Bold',
    styleNotes: [
      'Bold prints work when the silhouette is extremely clean — never mix two patterns.',
      'Let the co-ord be the centrepiece — one ring at most, zero necklaces, no watch.',
      'This look lives or dies on confidence. If you are second-guessing it, simplify.',
    ],
    knowledgeSlug: 'fashion-color-guide',
    quizSlug: 'personality',
    articleCategory: 'styling-tips',
  },
];

/** Map category → a human-readable label for the "Shop the Look" section */
export const CATEGORY_LABELS = {
  kurtas: 'Kurtas',
  sarees: 'Sarees',
  lehengas: 'Lehengas',
  'suit sets': 'Suit Sets',
  'gents kurtas': 'Mens Kurtas',
  blazers: 'Blazers',
  'co-ords': 'Co-ord Sets',
  tops: 'Tops',
};
