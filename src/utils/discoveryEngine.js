/** Client-side discovery rails — exploration-first, not checkout-optimized. */

import { filterProductsByCategory } from './categoryFilter';
import { buildRecommendationRails } from './recommendationEngine';
import {
  getLastViewedProduct,
  getRecentViewCategories,
  getRecentlyViewedIds,
} from './viewHistory';

function hashSeed(input) {
  let h = 2166136261;
  const s = String(input);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle(list, seed) {
  const arr = [...list];
  let s = hashSeed(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function excludeIds(products, exclude = new Set()) {
  return products.filter((p) => !exclude.has(p.id));
}

function takeUnique(products, limit, exclude = new Set()) {
  const out = [];
  for (const p of products) {
    if (exclude.has(p.id)) continue;
    out.push(p);
    exclude.add(p.id);
    if (out.length >= limit) break;
  }
  return out;
}

function byRating(a, b) {
  return (b.rating || 0) - (a.rating || 0);
}

function byRecent(a, b) {
  return (b.id || 0) - (a.id || 0);
}

function titleIncludes(product, ...terms) {
  const t = (product.title || '').toLowerCase();
  return terms.some((term) => t.includes(term));
}

export function getTrendingProducts(products, limit = 12, exclude = new Set()) {
  return takeUnique(
    [...products].sort(byRating),
    limit,
    exclude,
  );
}

export function getNewArrivals(products, limit = 12, exclude = new Set()) {
  return takeUnique(
    [...products].sort(byRecent),
    limit,
    exclude,
  );
}

export function getBecauseYouViewed(products, limit = 12, exclude = new Set()) {
  const recentIds = getRecentlyViewedIds(6);
  const recentCats = getRecentViewCategories(4);
  if (!recentIds.length && !recentCats.length) return [];

  const viewed = products.filter((p) => recentIds.includes(p.id));
  const anchorCat =
    viewed[0]?.category ||
    viewed[0]?.subCategory ||
    recentCats[0] ||
    '';

  const sameCat = products.filter(
    (p) =>
      !recentIds.includes(p.id) &&
      ((p.category || '').toLowerCase() === anchorCat.toLowerCase() ||
        (p.subCategory || '').toLowerCase() === anchorCat.toLowerCase()),
  );

  const related = seededShuffle(
    [...sameCat, ...excludeIds(products, new Set(recentIds))],
    `because-${anchorCat}-${recentIds[0] || 0}`,
  );

  return takeUnique(related, limit, exclude);
}

export function getSimilarVibe(product, allProducts, limit = 12, exclude = new Set()) {
  if (!product) return [];
  exclude.add(product.id);

  const cat = (product.category || '').toLowerCase();
  const sub = (product.subCategory || '').toLowerCase();
  const fabric = (product.fabric || product.highlights?.Fabric || '').toLowerCase();

  const scored = allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if ((p.category || '').toLowerCase() === cat) score += 3;
      if ((p.subCategory || '').toLowerCase() === sub) score += 2;
      const pf = (p.fabric || p.highlights?.Fabric || '').toLowerCase();
      if (fabric && pf && pf.includes(fabric.split(' ')[0])) score += 1;
      score += (p.rating || 0) * 0.2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  return takeUnique(scored, limit, exclude);
}

export function getEditorsPicks(products, limit = 12, exclude = new Set()) {
  const picks = products.filter(
    (p) => (p.rating || 0) >= 4.2 || (p.originalPrice || 0) - (p.price || 0) > 400,
  );
  return takeUnique(
    seededShuffle(picks.length >= limit ? picks : products, 'editors-picks'),
    limit,
    exclude,
  );
}

const EDITOR_VOICE_TOKENS = [
  'lehenga', 'saree', 'kurta', 'suit set', 'co-ord', 'dupatta', 'anarkali', 'sharara', 'palazzo',
];

const EDITOR_VOICE_EXCLUDE = /jean|denim|hoodie|parka|cargo|t-shirt|tee\b|sweatshirt|jogger/i;

/** Homepage Editor's Voice — ethnic / Indian-wear first, editorial-quality picks */
export function getEditorsVoicePicks(products, limit = 3, exclude = new Set()) {
  const ethnic = products.filter((p) => {
    const blob = `${p.category || ''} ${p.subCategory || ''} ${p.title || ''}`.toLowerCase();
    if (EDITOR_VOICE_EXCLUDE.test(blob)) return false;
    return EDITOR_VOICE_TOKENS.some((token) => blob.includes(token));
  });

  const fallback = products.filter((p) => !EDITOR_VOICE_EXCLUDE.test(`${p.title || ''} ${p.category || ''}`));
  const pool = ethnic.length >= limit ? ethnic : (fallback.length >= limit ? fallback : products);
  const ranked = [...pool].sort((a, b) => {
    const scoreA = (a.rating || 0) * 10 + (a.price || 0) * 0.001;
    const scoreB = (b.rating || 0) * 10 + (b.price || 0) * 0.001;
    return scoreB - scoreA;
  });

  return takeUnique(
    seededShuffle(ranked.length ? ranked : pool, 'editors-voice'),
    limit,
    exclude,
  );
}

export function getMoodCollection(products, mood, limit = 12, exclude = new Set()) {
  const filters = {
    wedding: (p) =>
      ['lehengas', 'sarees', 'suit sets'].includes((p.subCategory || p.category || '').toLowerCase()),
    casual: (p) =>
      ['kurtas', 'tops', 't-shirts', 'co-ords'].some((c) =>
        `${p.category} ${p.subCategory}`.toLowerCase().includes(c),
      ),
    festive: (p) => titleIncludes(p, 'emerald', 'gold', 'maroon', 'red', 'festive', 'silk'),
    minimal: (p) => titleIncludes(p, 'white', 'beige', 'sage', 'grey', 'navy', 'black'),
    premium: (p) => (p.price || 0) >= 1800,
    value: (p) => (p.price || 0) <= 1499,
  };

  const fn = filters[mood];
  const pool = fn ? products.filter(fn) : products;
  return takeUnique(seededShuffle(pool.length ? pool : products, mood), limit, exclude);
}

export function getUnexploredProducts(products, limit = 12, exclude = new Set()) {
  const viewed = new Set(getRecentlyViewedIds(30));
  const fresh = products.filter((p) => !viewed.has(p.id));
  return takeUnique(
    seededShuffle(fresh.length >= limit ? fresh : products, 'unexplored'),
    limit,
    exclude,
  );
}

export function getCategoryRail(products, category, limit = 12, exclude = new Set()) {
  const filtered = filterProductsByCategory(products, category);
  return takeUnique(seededShuffle(filtered, category), limit, exclude);
}

function syntheticViewScore(product) {
  const rating = product.rating || 4;
  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  return Math.round(rating * 2400 + discount * 45 + ((product.id || 0) % 900));
}

export function formatViewCount(score) {
  if (score >= 10000) return `${(score / 1000).toFixed(1)}k views`;
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k views`;
  return `${score} views`;
}

/** Today's top-rated + high-engagement picks */
export function getTrendingToday(products, limit = 14, exclude = new Set()) {
  const ranked = [...products].sort((a, b) => {
    const scoreA = (a.rating || 0) * 10 + syntheticViewScore(a) * 0.001;
    const scoreB = (b.rating || 0) * 10 + syntheticViewScore(b) * 0.001;
    return scoreB - scoreA;
  });
  return takeUnique(ranked, limit, exclude);
}

/** Bold discounts + statement colours — “viral” heuristic */
export function getViralFashion(products, limit = 14, exclude = new Set()) {
  const pool = products.filter((p) => {
    const discount =
      p.originalPrice && p.price
        ? ((p.originalPrice - p.price) / p.originalPrice) * 100
        : 0;
    return (
      discount >= 25 ||
      (p.rating || 0) >= 4.3 ||
      titleIncludes(p, 'viral', 'trend', 'hot', 'bestseller', 'statement', 'bold')
    );
  });
  return takeUnique(
    seededShuffle(pool.length >= limit ? pool : products, 'viral-fashion'),
    limit,
    exclude,
  );
}

/** Popularity proxy — view score + rating */
export function getMostViewedProducts(products, limit = 14, exclude = new Set()) {
  const withViews = products.map((p) => ({
    ...p,
    viewScore: syntheticViewScore(p),
  }));
  withViews.sort((a, b) => b.viewScore - a.viewScore);
  return takeUnique(withViews, limit, exclude).map((p) => ({
    ...p,
    viewLabel: formatViewCount(p.viewScore),
  }));
}

/** Category tiles ranked by catalog depth */
export function getTrendingCategories(products, limit = 8) {
  const counts = new Map();
  const sampleImage = new Map();

  for (const p of products) {
    const cat = (p.subCategory || p.category || '').toLowerCase();
    if (!cat) continue;
    counts.set(cat, (counts.get(cat) || 0) + 1);
    if (!sampleImage.has(cat) && p.image) sampleImage.set(cat, p.image);
  }

  const featured = [
    'kurtas',
    'lehengas',
    'sarees',
    'suit sets',
    'co-ords',
    'tops',
    'gents kurtas',
    'shirts',
  ];

  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      tag,
      label: tag.replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
      image: sampleImage.get(tag) || '/tops/4/1.webp',
      trending: featured.includes(tag),
    }));

  const seen = new Set();
  const out = [];
  for (const item of ranked) {
    if (seen.has(item.tag)) continue;
    seen.add(item.tag);
    out.push(item);
    if (out.length >= limit) break;
  }

  for (const tag of featured) {
    if (out.length >= limit) break;
    if (seen.has(tag)) continue;
    out.push({
      tag,
      label: tag.replace(/\b\w/g, (c) => c.toUpperCase()),
      count: counts.get(tag) || 0,
      image: sampleImage.get(tag) || '/kurtas/Kurtas/1/040A2925_700x.webp',
      trending: true,
    });
  }

  return out.slice(0, limit);
}

/**
 * Eight homepage exploration sections — unique products per section where possible.
 */
export function buildHomepageExplorationSections(products) {
  if (!products?.length) return [];

  const exclude = new Set();
  const sections = [];

  const take = (fn, limit = 14) => {
    const items = fn(products, limit, exclude);
    items.forEach((p) => exclude.add(p.id));
    return items;
  };

  sections.push({
    id: 'trending-today',
    type: 'product-rail',
    title: 'Trending Today',
    hook: 'What India is scrolling right now — tap any look to go deeper',
    cta: 'See all trending',
    category: 'kurtas',
    tone: 'hot',
    badge: 'Hot today',
    products: take(getTrendingToday),
  });

  sections.push({
    id: 'viral-fashion',
    type: 'product-rail',
    title: 'Viral Fashion',
    hook: 'Statement pieces blowing up feeds — don’t miss the next scroll',
    cta: 'Explore viral edit',
    category: 'lehengas',
    tone: 'viral',
    badge: 'Going viral',
    products: take(getViralFashion),
  });

  sections.push({
    id: 'most-viewed',
    type: 'product-rail',
    title: 'Most Viewed Products',
    hook: 'Crowd favourites everyone keeps opening — see why',
    cta: 'View popular picks',
    category: 'sarees',
    tone: 'popular',
    showViews: true,
    products: take(getMostViewedProducts),
  });

  sections.push({
    id: 'editor-picks',
    type: 'product-rail',
    title: 'Editor Picks',
    hook: 'Curated like a fashion magazine — one click opens the full story',
    cta: 'Browse editor’s desk',
    category: 'suit sets',
    tone: 'editorial',
    badge: 'Editor’s choice',
    products: take(getEditorsPicks),
  });

  sections.push({
    id: 'new-arrivals',
    type: 'product-rail',
    title: 'New Arrivals',
    hook: 'Fresh drops just landed — be first to explore',
    cta: 'Shop new in',
    category: 'tops',
    tone: 'new',
    badge: 'Just in',
    products: take(getNewArrivals),
  });

  sections.push({
    id: 'trending-categories',
    type: 'categories',
    title: 'Trending Categories',
    hook: 'Pick a lane and keep exploring — each category is a rabbit hole',
    cta: 'Browse all categories',
    category: 'all',
  });

  return sections;
}

/**
 * Build ordered discovery rails for home / discover feed.
 * Each rail includes a curiosity hook to drive the next click.
 */
export function buildDiscoveryRails(products, { maxRails = 10 } = {}) {
  if (!products?.length) return [];

  const exclude = new Set();
  const rails = [];
  const lastView = getLastViewedProduct();
  const recentCats = getRecentViewCategories(3);

  const addRail = (rail) => {
    if (!rail.products?.length) return;
    rails.push(rail);
    rail.products.forEach((p) => exclude.add(p.id));
  };

  const because = getBecauseYouViewed(products, 14, exclude);
  if (because.length >= 4) {
    addRail({
      id: 'because-you-viewed',
      title: 'Because you were exploring…',
      hook: 'Picked from your recent vibe — one tap away',
      products: because,
      tone: 'personal',
    });
  }

  addRail({
    id: 'trending-now',
    title: 'Trending on Trendkaari',
    hook: 'What everyone is scrolling right now',
    products: getTrendingProducts(products, 14, exclude),
    tone: 'hot',
  });

  addRail({
    id: 'new-arrivals',
    title: 'Fresh drops',
    hook: 'New silhouettes just landed — see them first',
    products: getNewArrivals(products, 14, exclude),
    tone: 'new',
  });

  if (recentCats[0]) {
    addRail({
      id: `more-${recentCats[0]}`,
      title: `More in ${recentCats[0]}`,
      hook: 'Stay in the mood — keep exploring this edit',
      products: getCategoryRail(products, recentCats[0], 14, exclude),
      category: recentCats[0],
      tone: 'category',
    });
  }

  addRail({
    id: 'wedding-season',
    title: 'Wedding season edit',
    hook: 'Lehengas, sarees & celebration sets',
    products: getMoodCollection(products, 'wedding', 14, exclude),
    category: 'lehengas',
    tone: 'occasion',
  });

  addRail({
    id: 'weekend-casual',
    title: 'Weekend casual',
    hook: 'Easy kurtas, co-ords & off-duty fits',
    products: getMoodCollection(products, 'casual', 14, exclude),
    category: 'kurtas',
    tone: 'occasion',
  });

  addRail({
    id: 'editors-picks',
    title: "Editor's desk",
    hook: 'Curated like a fashion magazine spread',
    products: getEditorsPicks(products, 14, exclude),
    tone: 'editorial',
  });

  addRail({
    id: 'festive-glow',
    title: 'Festive glow',
    hook: 'Rich colours for parties & pujas',
    products: getMoodCollection(products, 'festive', 14, exclude),
    tone: 'occasion',
  });

  addRail({
    id: 'premium-edit',
    title: 'Premium closet',
    hook: 'Elevated fabrics & statement pieces',
    products: getMoodCollection(products, 'premium', 14, exclude),
    tone: 'premium',
  });

  addRail({
    id: 'hidden-gems',
    title: 'Hidden gems',
    hook: 'Pieces you haven’t opened yet',
    products: getUnexploredProducts(products, 14, exclude),
    tone: 'serendipity',
  });

  if (lastView?.category) {
    addRail({
      id: 'complete-the-look',
      title: 'Complete the look',
      hook: `Styled to pair with ${lastView.title || 'your last view'}`,
      products: getSimilarVibe(
        products.find((p) => p.id === lastView.id) || { id: lastView.id, category: lastView.category },
        products,
        14,
        exclude,
      ),
      tone: 'personal',
    });
  }

  addRail({
    id: 'mens-edit',
    title: "Men's discovery",
    hook: 'Kurtas, shirts & co-ords worth a second look',
    products: getCategoryRail(products, 'men-western', 14, exclude),
    category: 'shirts',
    tone: 'category',
  });

  addRail({
    id: 'value-finds',
    title: 'Under ₹1,499',
    hook: 'Smart picks that don’t compromise on style',
    products: getMoodCollection(products, 'value', 14, exclude),
    tone: 'value',
  });

  return rails.slice(0, maxRails);
}

export function buildProductDiscoveryRails(product, allProducts) {
  return buildRecommendationRails({ allProducts, product, category: product?.subCategory || product?.category });
}
