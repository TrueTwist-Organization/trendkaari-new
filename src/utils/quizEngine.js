/**
 * Quiz scoring, product picks, and related content for result pages.
 */

import { filterProductsByCategory } from './categoryFilter';
import { FASHION_GUIDES } from '../data/fashionGuides';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { getQuizBySlug } from '../data/fashionQuizzes';
import { buildRecommendationRails } from './recommendationEngine';

const MIN_PRODUCTS = 8;
const RESULT_PRODUCTS = 12;

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
  const cats = result.categories || [];
  const sub = (product.subCategory || product.category || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (cats.some((c) => c.toLowerCase() === sub || c.toLowerCase() === cat)) score += 4;
  if (titleMatchesKeywords(product, result.keywords)) score += 3;

  if (result.priceMax && product.price > result.priceMax) score -= 2;
  if (result.priceMin && product.price < result.priceMin) score -= 1;

  return score;
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

export function getQuizResultProducts(allProducts, result, limit = RESULT_PRODUCTS) {
  if (!allProducts?.length || !result) return [];

  const categories = result.categories || [];
  let pool = [];

  for (const cat of categories) {
    pool.push(...filterProductsByCategory(allProducts, cat));
  }

  if (!pool.length) pool = [...allProducts];

  const scored = pool
    .map((p) => ({ p, score: scoreProduct(p, result) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  const unique = [];
  const seen = new Set();
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
