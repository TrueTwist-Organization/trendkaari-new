/**
 * AI Style Finder — builds a personalized profile from four inputs
 * and surfaces products, articles, and collections.
 */

import { filterProductsByCategory } from './categoryFilter';
import { FASHION_GUIDES } from '../data/fashionGuides';
import { buildRecommendationRails } from './recommendationEngine';
import {
  AGE_PROFILES,
  BODY_PROFILES,
  BUDGET_PROFILES,
  OCCASION_PROFILES,
  buildStyleFinderResultKey,
  parseStyleFinderResultKey,
} from '../data/aiStyleFinder';

const MIN_PRODUCTS = 10;
const RESULT_PRODUCTS = 14;

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

function inBudget(product, budgetProfile) {
  if (budgetProfile.priceMin && product.price < budgetProfile.priceMin) return false;
  if (budgetProfile.priceMax && product.price > budgetProfile.priceMax) return false;
  return true;
}

export function resolveStyleProfile(answers = {}) {
  const key = buildStyleFinderResultKey(answers);
  const parsed = parseStyleFinderResultKey(key);
  if (!parsed) return null;

  const age = AGE_PROFILES[parsed.age];
  const body = BODY_PROFILES[parsed.bodyType];
  const budget = BUDGET_PROFILES[parsed.budget];
  const occasion = OCCASION_PROFILES[parsed.occasion];

  const guideIds = [
    ...new Set([
      ...(age.guideIds || []),
      ...(occasion.guideIds || []),
    ]),
  ].slice(0, 4);

  const keywords = [
    ...(age.keywords || []),
    ...(body.keywords || []),
    ...(occasion.keywords || []),
  ];

  const title = `Your ${occasion.label} Edit`;
  const tagline = `${age.tone} · ${body.label} · ${budget.label}`;

  const description = [
    `Based on your age (${parsed.age.replace('-', '–')}), ${body.label.toLowerCase()} frame, ${budget.label.toLowerCase()} budget, and ${occasion.label.toLowerCase()} needs — here is your personalized lane.`,
    body.fitTip,
  ].join(' ');

  return {
    key,
    answers: parsed,
    title,
    tagline,
    description,
    fitTip: body.fitTip,
    categories: occasion.categories,
    collections: occasion.collections,
    keywords,
    guideIds,
    discoverCategory: occasion.categories[0],
    priceMin: budget.priceMin,
    priceMax: budget.priceMax,
    budgetLabel: budget.label,
    occasionLabel: occasion.label,
    bodyLabel: body.label,
    ageTone: age.tone,
    emoji: parsed.occasion === 'wedding' ? '💍' : parsed.occasion === 'festive' ? '🪔' : parsed.occasion === 'office' ? '💼' : '✨',
  };
}

export function resolveStyleProfileFromKey(resultKey) {
  const parsed = parseStyleFinderResultKey(resultKey);
  if (!parsed) return null;
  return resolveStyleProfile(parsed);
}

function scoreStyleProduct(product, profile) {
  let score = product.rating || 0;
  const cats = profile.categories || [];
  const sub = (product.subCategory || product.category || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (cats.some((c) => c.toLowerCase() === sub || c.toLowerCase() === cat)) score += 5;
  if (titleMatchesKeywords(product, profile.keywords)) score += 3;
  if (inBudget(product, profile)) score += 4;
  else score -= 3;

  return score;
}

export function getStyleFinderProducts(allProducts, profile, limit = RESULT_PRODUCTS) {
  if (!allProducts?.length || !profile) return [];

  let pool = [];
  for (const cat of profile.categories || []) {
    pool.push(...filterProductsByCategory(allProducts, cat));
  }
  if (!pool.length) pool = [...allProducts];

  const inBudgetPool = pool.filter((p) => inBudget(p, profile));
  const source = inBudgetPool.length >= MIN_PRODUCTS ? inBudgetPool : pool;

  const scored = source
    .map((p) => ({ p, score: scoreStyleProduct(p, profile) }))
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
    for (const p of seededShuffle(allProducts, profile.key)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      unique.push(p);
      if (unique.length >= MIN_PRODUCTS) break;
    }
  }

  return unique.slice(0, limit);
}

export function getStyleFinderArticles(profile) {
  if (!profile?.guideIds?.length) return FASHION_GUIDES.slice(0, 3);
  const matched = FASHION_GUIDES.filter((g) => profile.guideIds.includes(g.id));
  return (matched.length ? matched : FASHION_GUIDES).slice(0, 4);
}

export function getStyleFinderCollections(profile) {
  return profile?.collections || [];
}

export function getStyleFinderRecommendationRails(allProducts, profile) {
  return buildRecommendationRails({
    allProducts,
    category: profile?.discoverCategory || 'kurtas',
    productsPerRail: 8,
  });
}

export function getStyleFinderResultPath(resultKey) {
  return `/style-finder/result/${encodeURIComponent(resultKey)}`;
}
