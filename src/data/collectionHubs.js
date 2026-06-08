/**
 * Collection Hub — buying guides and related collection maps per category.
 */

export const DEFAULT_BUYING_GUIDE = {
  title: 'How to shop this collection',
  intro: 'Use fit, fabric, and occasion as your three filters — then explore related collections below.',
  tips: [
    'Check size chart against your usual fit — ethnic sizing can vary by silhouette.',
    'Read fabric composition for season and care expectations.',
    'Start with one hero piece, then browse complementary categories.',
  ],
  checklist: ['Confirm size & fit', 'Match fabric to season', 'Pair with complementary categories'],
  knowledgeSlug: null,
};

export const COLLECTION_BUYING_GUIDES = {
  kurtas: {
    title: 'Kurta buying guide',
    intro: 'Straight for daily wear, A-line for balance, Anarkali for festive flair — match length to your height and bottom style.',
    tips: [
      'Cotton & cotton-linen for daily rotation; silk blends for functions.',
      'Knee-length works for most heights with leggings or palazzo.',
      'Check yoke embroidery weight — lighter for day, richer for evening.',
    ],
    checklist: ['Pick silhouette (straight / A-line / Anarkali)', 'Choose fabric for season', 'Match bottom (palazzo / churidar)'],
    knowledgeSlug: 'kurti-style-guide',
  },
  'suit sets': {
    title: 'Suit set buying guide',
    intro: 'Three-piece coordinates save styling time — look for dupatta drape, trouser cut, and embroidery placement.',
    tips: [
      'Ensure dupatta length suits your drape style (shoulder vs elbow).',
      'Contrast embroidery on yoke photographs best for celebrations.',
      'Buy the full set first; mix dupatta with other kurtas later.',
    ],
    checklist: ['Verify dupatta included', 'Check trouser rise & length', 'Match occasion formality'],
    knowledgeSlug: 'fashion-color-guide',
  },
  sarees: {
    title: 'Saree buying guide',
    intro: 'Fabric dictates drape and formality — silk for ceremonies, georgette for parties, cotton for daily.',
    tips: [
      'Pre-draped sarees are fastest if you are new to pleating.',
      'Match blouse fabric weight to saree body.',
      'Fall and pico finishing matter for longevity — check product details.',
    ],
    checklist: ['Pick fabric (silk / georgette / cotton)', 'Plan blouse pairing', 'Consider pre-draped for ease'],
    knowledgeSlug: 'saree-types-explained',
  },
  lehengas: {
    title: 'Lehenga buying guide',
    intro: 'Flare, weight, and blouse structure define movement — lighter skirts for garba, richer for weddings.',
    tips: [
      'Measure waist at natural sit point, not trouser waist.',
      'Can-can or tulle adds volume — skip for long seated events if uncomfortable.',
      'Blouse fit matters more than skirt for photos — tailor if needed.',
    ],
    checklist: ['Waist & hip measurements', 'Skirt weight for dancing', 'Blouse neckline for occasion'],
    knowledgeSlug: 'lehenga-vs-saree',
  },
  'co-ords': {
    title: 'Co-ord set buying guide',
    intro: 'Matching sets solve proportion — check top length against trouser rise for a clean line.',
    tips: [
      'Linen & cotton co-ords for brunch; satin blends for evening.',
      'Wear as a set first, then split top and bottom across wardrobe.',
      'Check if pieces sell separately if sizing differs top vs bottom.',
    ],
    checklist: ['Top length vs trouser rise', 'Fabric for occasion', 'Split-wear potential'],
    knowledgeSlug: 'kurti-style-guide',
  },
  tops: {
    title: 'Tops & tunics buying guide',
    intro: 'Length and sleeve define the look — hip-length with palazzo, tunic-length with leggings.',
    tips: [
      'Cotton for daily; georgette for dinner outings.',
      'Check side slits if pairing with fitted bottoms.',
      'Pastel vs jewel tones — pick one hero colour per outfit.',
    ],
    checklist: ['Length for your bottom', 'Fabric breathability', 'Neckline for occasion'],
    knowledgeSlug: 'fashion-color-guide',
  },
  'gents kurtas': {
    title: 'Mens kurta buying guide',
    intro: 'Straight cuts for daily, band collar for minimal, embroidered for weddings — match fabric to event.',
    tips: [
      'Cotton & khadi for daytime; silk blend for receptions.',
      'Length should hit mid-thigh or knee based on bottom.',
      'Layer with ethnic jacket or blazer for groomsmen looks.',
    ],
    checklist: ['Silhouette & collar', 'Fabric weight', 'Layering option'],
    knowledgeSlug: 'kurti-style-guide',
  },
  shirts: {
    title: 'Shirt buying guide',
    intro: 'Oxford for office, linen for summer, satin for evening — shoulder fit is non-negotiable.',
    tips: [
      'Shoulder seam should sit at shoulder edge.',
      'Half tuck works with chinos; full tuck for formal.',
      'Light colours for heat; prints for casual weekends.',
    ],
    checklist: ['Shoulder fit', 'Fabric for climate', 'Collar style for occasion'],
    knowledgeSlug: null,
  },
  blazers: {
    title: 'Ethnic blazer buying guide',
    intro: 'Structure elevates kurtas instantly — pick velvet for weddings, linen blends for daytime.',
    tips: [
      'Wear over plain kurta first; add print later.',
      'Sleeve length should show ½ inch of kurta cuff.',
      'Coordinate with groom squad in complementary, not identical, tones.',
    ],
    checklist: ['Structure & shoulder', 'Fabric formality', 'Kurta pairing colour'],
    knowledgeSlug: null,
  },
  'dupatta sets': {
    title: 'Dupatta set buying guide',
    intro: 'Dupatta print should complement, not compete with, kurta body — balance embroidery zones.',
    tips: [
      'Block-print dupattas pair with solid kurtas and reverse.',
      'Check dupatta length for your preferred drape style.',
      'Festive sets: heavier dupatta, lighter kurta works well.',
    ],
    checklist: ['Dupatta length & print', 'Kurta embroidery balance', 'Bottom included?'],
    knowledgeSlug: 'what-is-anarkali',
  },
};

export const RELATED_COLLECTIONS = {
  kurtas: [
    { category: 'dupatta sets', label: 'Dupatta Sets', hook: 'Complete your kurta look' },
    { category: 'bottoms', label: 'Bottom Wear', hook: 'Palazzo & trousers to pair' },
    { category: 'suit sets', label: 'Suit Sets', hook: 'Three-piece coordinates' },
    { category: 'tops', label: 'Fusion Tops', hook: 'Mix western & ethnic' },
  ],
  'suit sets': [
    { category: 'kurtas', label: 'Kurtas', hook: 'Wear dupatta with kurtas' },
    { category: 'sarees', label: 'Sarees', hook: 'Ceremony alternative' },
    { category: 'lehengas', label: 'Lehengas', hook: 'Upgrade for weddings' },
    { category: 'dupatta sets', label: 'Dupatta Sets', hook: 'Lighter festive option' },
  ],
  sarees: [
    { category: 'suit sets', label: 'Suit Sets', hook: 'Easier drape option' },
    { category: 'lehengas', label: 'Lehengas', hook: 'Dance-floor alternative' },
    { category: 'kurtas', label: 'Kurtas', hook: 'Day-function edit' },
  ],
  lehengas: [
    { category: 'sarees', label: 'Sarees', hook: 'Classic ceremony drape' },
    { category: 'suit sets', label: 'Suit Sets', hook: 'Lighter function look' },
    { category: 'kurtas', label: 'Kurtas', hook: 'Mehendi & brunch' },
  ],
  'co-ords': [
    { category: 'tops', label: 'Tops', hook: 'Split & remix pieces' },
    { category: 'bottoms', label: 'Bottoms', hook: 'Swap co-ord pants' },
    { category: 'dresses', label: 'Dresses', hook: 'One-piece alternative' },
  ],
  tops: [
    { category: 'bottoms', label: 'Bottom Wear', hook: 'Pair your top' },
    { category: 'co-ords', label: 'Co-ord Sets', hook: 'Pre-matched sets' },
    { category: 'kurtas', label: 'Kurtas', hook: 'Go full ethnic' },
  ],
  'gents kurtas': [
    { category: 'blazers', label: 'Blazers', hook: 'Layer for weddings' },
    { category: 'jackets', label: 'Jackets', hook: 'Festive layering' },
    { category: 'gents co-ords', label: 'Mens Co-ords', hook: 'Coordinated sets' },
    { category: 'shirts', label: 'Shirts', hook: 'Fusion pairing' },
  ],
  shirts: [
    { category: 'pants', label: 'Trousers', hook: 'Complete the look' },
    { category: 'jeans', label: 'Jeans', hook: 'Casual weekend' },
    { category: 'blazers', label: 'Blazers', hook: 'Smart layer' },
  ],
  blazers: [
    { category: 'gents kurtas', label: 'Kurtas', hook: 'Layer underneath' },
    { category: 'shirts', label: 'Shirts', hook: 'Western pairing' },
    { category: 'pants', label: 'Trousers', hook: 'Finish the outfit' },
  ],
  'women-traditional': [
    { category: 'kurtas', label: 'Kurtas', hook: 'Daily ethnic' },
    { category: 'sarees', label: 'Sarees', hook: 'Celebration drape' },
    { category: 'lehengas', label: 'Lehengas', hook: 'Wedding guest' },
  ],
  'women-western': [
    { category: 'co-ords', label: 'Co-ords', hook: 'Matched sets' },
    { category: 'dresses', label: 'Dresses', hook: 'One-and-done' },
    { category: 'tops', label: 'Tops', hook: 'Mix & match' },
  ],
  'men-traditional': [
    { category: 'gents kurtas', label: 'Kurtas', hook: 'Core ethnic' },
    { category: 'blazers', label: 'Blazers', hook: 'Wedding layer' },
    { category: 'jackets', label: 'Jackets', hook: 'Festive outerwear' },
  ],
  'men-western': [
    { category: 'shirts', label: 'Shirts', hook: 'Daily smart' },
    { category: 'pants', label: 'Trousers', hook: 'Tailored fit' },
    { category: 'jeans', label: 'Jeans', hook: 'Casual edge' },
  ],
};

const FALLBACK_RELATED = [
  { category: 'kurtas', label: 'Kurtas', hook: 'Explore kurtas' },
  { category: 'suit sets', label: 'Suit Sets', hook: 'Coordinated sets' },
  { category: 'sarees', label: 'Sarees', hook: 'Classic drape' },
  { category: 'co-ords', label: 'Co-ords', hook: 'Modern sets' },
];

export function getBuyingGuideForCategory(category) {
  const key = (category || '').toLowerCase();
  return COLLECTION_BUYING_GUIDES[key] || {
    ...DEFAULT_BUYING_GUIDE,
    title: `How to shop ${key === 'all' ? 'this edit' : key}`,
  };
}

export function getRelatedCollectionsForCategory(category) {
  const key = (category || '').toLowerCase();
  if (key === 'all') return FALLBACK_RELATED;
  return RELATED_COLLECTIONS[key] || FALLBACK_RELATED.filter((c) => c.category !== key).slice(0, 4);
}
