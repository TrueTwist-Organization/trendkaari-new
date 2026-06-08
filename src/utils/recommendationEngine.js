/**
 * Recommendation engine — five core types, minimum 8 products per rail.
 */

import { filterProductsByCategory } from './categoryFilter';
import {
  getRecentlyViewedIds,
  getRecentViewCategories,
} from './viewHistory';

export const MIN_RAIL_PRODUCTS = 8;
export const DEFAULT_RAIL_PRODUCTS = 10;

export const RECOMMENDATION_TYPES = {
  RELATED: 'related',
  SIMILAR: 'similar',
  ALSO_VIEWED: 'also-viewed',
  TRENDING_WEEK: 'trending-week',
  COMPLETE_LOOK: 'complete-look',
};

const COMPLEMENTARY_CATEGORIES = {
  kurtas: ['dupatta sets', 'bottoms', 'suit sets', 'kurtas'],
  'suit sets': ['kurtas', 'dupatta sets', 'sarees', 'lehengas'],
  sarees: ['suit sets', 'lehengas', 'kurtas'],
  lehengas: ['sarees', 'suit sets', 'kurtas'],
  tops: ['bottoms', 'co-ords', 'dresses', 't-shirts'],
  dresses: ['tops', 'co-ords', 'bottoms'],
  'co-ords': ['tops', 't-shirts', 'bottoms'],
  shirts: ['pants', 'jeans', 'blazers', 'jackets'],
  'gents kurtas': ['jackets', 'blazers', 'gents co-ords', 'shirts'],
  jackets: ['shirts', 'pants', 'gents kurtas'],
  blazers: ['shirts', 'pants', 'gents kurtas'],
};

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

function getWeekSeed() {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
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

function backfillToMin(products, picked, limit, min, exclude) {
  if (picked.length >= min) return picked.slice(0, limit);
  const pool = seededShuffle(excludeIds(products, exclude), `backfill-${picked.length}`);
  const out = [...picked];
  for (const p of pool) {
    if (out.length >= Math.max(min, limit)) break;
    if (out.some((x) => x.id === p.id)) continue;
    out.push(p);
    exclude.add(p.id);
  }
  return out.slice(0, limit);
}

function anchorCategory(product, category) {
  if (product) {
    return (product.subCategory || product.category || '').toLowerCase();
  }
  return (category || '').toLowerCase();
}

function scoreRelated(product, candidate) {
  let score = 0;
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subCategory || product.category || '').toLowerCase();
  const cCat = (candidate.category || '').toLowerCase();
  const cSub = (candidate.subCategory || candidate.category || '').toLowerCase();

  if (cSub === sub) score += 5;
  else if (cCat === cat) score += 3;

  const priceDelta = Math.abs((product.price || 0) - (candidate.price || 0));
  if (priceDelta <= 500) score += 2;
  score += (candidate.rating || 0) * 0.5;
  return score;
}

function scoreSimilar(product, candidate) {
  let score = scoreRelated(product, candidate);
  const titleA = (product.title || '').toLowerCase();
  const titleB = (candidate.title || '').toLowerCase();
  const wordsA = titleA.split(/\s+/).filter((w) => w.length > 3);
  for (const w of wordsA) {
    if (titleB.includes(w)) score += 0.5;
  }
  const fabricA = (product.fabric || product.highlights?.Fabric || '').toLowerCase();
  const fabricB = (candidate.fabric || candidate.highlights?.Fabric || '').toLowerCase();
  if (fabricA && fabricB && fabricA.split(' ')[0] === fabricB.split(' ')[0]) score += 2;
  return score;
}

export function getRelatedProducts(product, category, allProducts, limit = DEFAULT_RAIL_PRODUCTS, exclude = new Set()) {
  const anchor = anchorCategory(product, category);
  if (!anchor && !product) {
    return takeUnique(seededShuffle(allProducts, 'related-fallback'), limit, exclude);
  }

  const pool = product
    ? allProducts
        .filter((p) => p.id !== product.id)
        .map((p) => ({ p, score: scoreRelated(product, p) }))
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p)
    : filterProductsByCategory(allProducts, anchor);

  const picked = takeUnique(pool.length ? pool : allProducts, limit, exclude);
  return backfillToMin(allProducts, picked, limit, MIN_RAIL_PRODUCTS, exclude);
}

export function getSimilarStyles(product, category, allProducts, limit = DEFAULT_RAIL_PRODUCTS, exclude = new Set()) {
  if (product) {
    const ranked = allProducts
      .filter((p) => p.id !== product.id)
      .map((p) => ({ p, score: scoreSimilar(product, p) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
    const picked = takeUnique(ranked, limit, exclude);
    return backfillToMin(allProducts, picked, limit, MIN_RAIL_PRODUCTS, exclude);
  }

  const anchor = anchorCategory(null, category);
  const inCat = filterProductsByCategory(allProducts, anchor);
  const wearGroup = seededShuffle(inCat.length ? inCat : allProducts, `similar-cat-${anchor}`);
  const picked = takeUnique(wearGroup, limit, exclude);
  return backfillToMin(allProducts, picked, limit, MIN_RAIL_PRODUCTS, exclude);
}

export function getCustomersAlsoViewed(product, category, allProducts, limit = DEFAULT_RAIL_PRODUCTS, exclude = new Set()) {
  const viewedIds = getRecentlyViewedIds(20);
  const anchor = anchorCategory(product, category);

  const fromHistory = viewedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .filter((p) => !exclude.has(p.id) && (!product || p.id !== product.id));

  const sameLane = allProducts.filter((p) => {
    if (exclude.has(p.id) || (product && p.id === product.id)) return false;
    const cat = (p.subCategory || p.category || '').toLowerCase();
    return anchor ? cat === anchor || (p.category || '').toLowerCase() === anchor : true;
  });

  const crowd = seededShuffle(
    [...fromHistory, ...sameLane],
    `also-viewed-${product?.id || anchor}-${viewedIds[0] || 0}`,
  );

  const picked = takeUnique(crowd, limit, exclude);
  return backfillToMin(allProducts, picked, limit, MIN_RAIL_PRODUCTS, exclude);
}

export function getTrendingThisWeek(allProducts, limit = DEFAULT_RAIL_PRODUCTS, exclude = new Set()) {
  const week = getWeekSeed();
  const ranked = [...allProducts]
    .map((p) => ({
      p,
      score: (p.rating || 4) * 10 + ((p.id || 0) % 100) * 0.1,
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  const shuffled = seededShuffle(ranked, `trending-week-${week}`);
  const picked = takeUnique(shuffled, limit, exclude);
  return backfillToMin(allProducts, picked, limit, MIN_RAIL_PRODUCTS, exclude);
}

export function getCompleteTheLook(product, category, allProducts, limit = DEFAULT_RAIL_PRODUCTS, exclude = new Set()) {
  const anchor = anchorCategory(product, category);
  const complements = COMPLEMENTARY_CATEGORIES[anchor] || getRecentViewCategories(2);

  const pool = [];
  for (const cat of complements) {
    const items = filterProductsByCategory(allProducts, cat);
    pool.push(...seededShuffle(items, `complete-${cat}-${product?.id || anchor}`).slice(0, 4));
  }

  if (!pool.length) {
    pool.push(...seededShuffle(excludeIds(allProducts, exclude), `complete-fallback-${anchor}`));
  }

  const picked = takeUnique(pool, limit, exclude);
  return backfillToMin(allProducts, picked, limit, MIN_RAIL_PRODUCTS, exclude);
}

const RAIL_DEFINITIONS = [
  {
    id: RECOMMENDATION_TYPES.RELATED,
    title: 'Related Products',
    hook: 'Same edit, more options — keep browsing this lane',
    tone: 'related',
    getProducts: (ctx, limit, exclude) =>
      getRelatedProducts(ctx.product, ctx.category, ctx.allProducts, limit, exclude),
    getCategory: (ctx) => ctx.product?.subCategory || ctx.product?.category || ctx.category,
  },
  {
    id: RECOMMENDATION_TYPES.SIMILAR,
    title: 'Similar Styles',
    hook: 'Same vibe, new favourites — one tap opens another look',
    tone: 'similar',
    getProducts: (ctx, limit, exclude) =>
      getSimilarStyles(ctx.product, ctx.category, ctx.allProducts, limit, exclude),
    getCategory: (ctx) => ctx.product?.category || ctx.category,
  },
  {
    id: RECOMMENDATION_TYPES.ALSO_VIEWED,
    title: 'Customers Also Viewed',
    hook: 'Shoppers who viewed this also opened these',
    tone: 'social',
    getProducts: (ctx, limit, exclude) =>
      getCustomersAlsoViewed(ctx.product, ctx.category, ctx.allProducts, limit, exclude),
    getCategory: (ctx) => ctx.category || getRecentViewCategories(1)[0],
  },
  {
    id: RECOMMENDATION_TYPES.TRENDING_WEEK,
    title: 'Trending This Week',
    hook: 'Hot picks rotating weekly — see what’s climbing now',
    tone: 'hot',
    getProducts: (ctx, limit, exclude) => getTrendingThisWeek(ctx.allProducts, limit, exclude),
    getCategory: () => 'kurtas',
  },
  {
    id: RECOMMENDATION_TYPES.COMPLETE_LOOK,
    title: 'Complete the Look',
    hook: 'Pair it, layer it, finish the outfit — explore complements',
    tone: 'look',
    getProducts: (ctx, limit, exclude) =>
      getCompleteTheLook(ctx.product, ctx.category, ctx.allProducts, limit, exclude),
    getCategory: (ctx) => {
      const anchor = anchorCategory(ctx.product, ctx.category);
      return COMPLEMENTARY_CATEGORIES[anchor]?.[0] || ctx.category || 'co-ords';
    },
  },
];

export function buildRecommendationRails(ctx) {
  const { allProducts, product = null, category = null } = ctx;
  if (!allProducts?.length) return [];

  const limit = ctx.productsPerRail || DEFAULT_RAIL_PRODUCTS;
  const exclude = new Set();
  if (product?.id) exclude.add(product.id);

  const context = { allProducts, product, category };

  return RAIL_DEFINITIONS.map((def) => {
    const railExclude = new Set(exclude);
    const products = def.getProducts(context, limit, railExclude);
    products.forEach((p) => exclude.add(p.id));

    return {
      id: def.id,
      type: def.id,
      title: def.title,
      hook: def.hook,
      tone: def.tone,
      products,
      category: def.getCategory(context),
    };
  }).filter((rail) => rail.products.length >= MIN_RAIL_PRODUCTS);
}

export function countRecommendationOpportunities(rails) {
  return (rails || []).reduce((sum, rail) => sum + (rail.products?.length || 0), 0);
}

export function buildRecommendationGrid(ctx, minTotal = MIN_RAIL_PRODUCTS) {
  const rails = buildRecommendationRails(ctx);
  const seen = new Set();
  const out = [];

  for (const rail of rails) {
    for (const p of rail.products || []) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
      if (out.length >= minTotal * 2) return out;
    }
  }

  if (out.length < minTotal) {
    for (const p of ctx.allProducts || []) {
      if (ctx.product?.id === p.id || seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
      if (out.length >= minTotal) break;
    }
  }

  return out;
}

export function hasMinimumRecommendations(rails, minTotal = MIN_RAIL_PRODUCTS) {
  return countRecommendationOpportunities(rails) >= minTotal;
}
