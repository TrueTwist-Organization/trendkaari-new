/**
 * Quiz scoring, product picks, and related content for result pages.
 */

import { filterProductsByCategory, getCategoryDisplayName } from './categoryFilter';
import { FASHION_GUIDES } from '../data/fashionGuides';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { getQuizBySlug } from './editorialContentData';
import { buildRecommendationRails, MIN_RAIL_PRODUCTS } from './recommendationEngine';

const MIN_PRODUCTS = 8;
const RESULT_PRODUCTS = 12;

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

function backfillQuizRail(allProducts, picked, limit, exclude, seed) {
  if (picked.length >= MIN_RAIL_PRODUCTS) return picked.slice(0, limit);
  const out = [...picked];
  for (const p of seededShuffle(allProducts, seed)) {
    if (exclude.has(p.id) || out.some((x) => x.id === p.id)) continue;
    out.push(p);
    exclude.add(p.id);
    if (out.length >= Math.max(MIN_RAIL_PRODUCTS, limit)) break;
  }
  return out.slice(0, limit);
}

function resolveQuizCategories(result) {
  const seen = new Set();
  const categories = [];

  const push = (cat) => {
    const key = (cat || '').toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    categories.push(key);
  };

  push(result?.discoverCategory);
  for (const cat of result?.categories || []) push(cat);

  if (!categories.length) categories.push('kurtas');
  return categories;
}

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

function titleMatchesKeywords(product, keywords = []) {
  const title = (product.title || '').toLowerCase();
  return keywords.some((kw) => title.includes(kw.toLowerCase()));
}

function scoreProduct(product, result) {
  let score = product.rating || 0;
  const cats = resolveQuizCategories(result);
  const sub = (product.subCategory || product.category || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();

  cats.forEach((c, idx) => {
    if (c === sub || c === cat) score += idx === 0 ? 6 : idx === 1 ? 4 : 2;
  });

  if (titleMatchesKeywords(product, result.keywords)) score += 4;
  if (result.keywords?.some((kw) => desc.includes(kw.toLowerCase()))) score += 1;

  if (result.priceMax && product.price > result.priceMax) score -= 3;
  if (result.priceMin && product.price < result.priceMin) score -= 1;

  return score;
}

function pickQuizProductsForCategory(allProducts, result, category, limit, exclude) {
  let pool = filterProductsByCategory(allProducts, category);
  if (!pool.length) pool = [...allProducts];

  const scored = pool
    .map((p) => ({ p, score: scoreProduct(p, result) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  const picked = takeUnique(scored, limit, exclude);
  return backfillQuizRail(allProducts, picked, limit, exclude, `${result.key}-${category}`);
}

/** Sum option votes across all answered steps → winning result key */
export function resolveQuizResult(quizSlug, answers = {}) {
  const quiz = getQuizBySlug(quizSlug);
  if (!quiz) return null;

  const totals = {};

  for (const step of quiz.steps) {
    const answerId = answers[step.id];
    if (!answerId) continue;
    const option = step.options.find((o) => o.id === answerId);
    if (!option?.votes) continue;
    for (const [resultKey, points] of Object.entries(option.votes)) {
      totals[resultKey] = (totals[resultKey] || 0) + points;
    }
  }

  const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (!ranked.length) {
    const fallback = Object.keys(quiz.results)[0];
    return quiz.results[fallback] || null;
  }

  const winnerKey = ranked[0][0];
  const direct = quiz.results[winnerKey];
  if (direct) return direct;

  for (const [key] of ranked) {
    for (const result of Object.values(quiz.results)) {
      if (result.mergeTags?.includes(key)) return result;
    }
  }

  return quiz.results[Object.keys(quiz.results)[0]] || null;
}

export function getQuizResultProducts(allProducts, result, limit = RESULT_PRODUCTS, exclude = new Set()) {
  if (!allProducts?.length || !result) return [];

  const categories = resolveQuizCategories(result);
  let pool = [];

  for (const cat of categories) {
    pool.push(...filterProductsByCategory(allProducts, cat));
  }

  if (!pool.length) pool = [...allProducts];

  const scored = pool
    .filter((p) => !exclude.has(p.id))
    .map((p) => ({ p, score: scoreProduct(p, result) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  const unique = [];
  const seen = new Set(exclude);
  for (const p of scored) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    unique.push(p);
    if (unique.length >= limit) break;
  }

  if (unique.length < MIN_PRODUCTS) {
    for (const p of seededShuffle(allProducts, result.key)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      unique.push(p);
      if (unique.length >= MIN_PRODUCTS) break;
    }
  }

  return unique.slice(0, limit);
}

/** Product rails tuned to quiz result categories, keywords, and discover lane. */
export function buildQuizDiscoveryRails(allProducts, result, productsPerRail = 8, exclude = new Set()) {
  if (!allProducts?.length || !result) return null;

  const categories = resolveQuizCategories(result);
  const primary = categories[0];
  const secondary = categories[1] || primary;
  const tertiary = categories[2] || secondary;
  const railExclude = new Set(exclude);

  const similarProducts = pickQuizProductsForCategory(
    allProducts,
    result,
    primary,
    productsPerRail,
    railExclude,
  );
  const similarStyles = pickQuizProductsForCategory(
    allProducts,
    result,
    secondary,
    productsPerRail,
    railExclude,
  );
  const trendingProducts = pickQuizProductsForCategory(
    allProducts,
    result,
    tertiary,
    productsPerRail,
    railExclude,
  );

  const primaryLabel = getCategoryDisplayName(primary);
  const secondaryLabel = getCategoryDisplayName(secondary);
  const tertiaryLabel = getCategoryDisplayName(tertiary);

  return {
    similarProducts: {
      id: 'quiz-top-picks',
      title: `Top ${primaryLabel} for you`,
      hook: `Hand-picked from your quiz — ${result.tagline || 'tap to shop your lane'}`,
      tone: 'hot',
      products: similarProducts,
      category: primary,
    },
    similarStyles: {
      id: 'quiz-style-lane',
      title: secondary === primary ? `More ${secondaryLabel} picks` : `Explore ${secondaryLabel}`,
      hook: 'Same vibe from your answers — fresh silhouettes to compare',
      tone: 'related',
      products: similarStyles,
      category: secondary,
    },
    trendingProducts: {
      id: 'quiz-complete-lane',
      title: tertiary === secondary ? `Complete your ${tertiaryLabel} edit` : `Also try ${tertiaryLabel}`,
      hook: 'Round out your result with complementary pieces shoppers love',
      tone: 'similar',
      products: trendingProducts,
      category: tertiary,
    },
  };
}

export function getQuizRelatedGuides(result) {
  if (!result?.guideIds?.length) return FASHION_GUIDES.slice(0, 3);
  return FASHION_GUIDES.filter((g) => result.guideIds.includes(g.id)).slice(0, 4);
}

export function getQuizRelatedLooks(result) {
  const cats = (result?.categories || []).map((c) => c.toLowerCase());
  const matched = CELEBRITY_LOOKS.filter((look) =>
    cats.includes((look.category || '').toLowerCase()),
  );
  return (matched.length ? matched : CELEBRITY_LOOKS).slice(0, 4);
}

export function getQuizRecommendationRails(allProducts, result) {
  const category = result?.discoverCategory || result?.categories?.[0] || 'kurtas';
  return buildRecommendationRails({
    allProducts,
    category,
    productsPerRail: 8,
  });
}

export function getQuizResultPath(quizSlug, resultKey) {
  return `/quiz/${quizSlug}/result/${resultKey}`;
}

export function getQuizStartPath(quizSlug) {
  return `/quiz/${quizSlug}`;
}
