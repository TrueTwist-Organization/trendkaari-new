/**
 * Collection Hub engine — cross-category product rails for category pages.
 * Rails intentionally surface complementary categories, not duplicates of the grid above.
 */

import { filterProductsByCategory } from './categoryFilter';
import {
  getBuyingGuideForCategory,
  getRelatedCollectionsForCategory,
} from '../data/collectionHubs';
const RAIL_SIZE = 10;

function byRating(a, b) {
  return (b.rating || 0) - (a.rating || 0);
}

function buildExcludeSet(allProducts, category, extraIds = []) {
  const exclude = new Set(extraIds);
  for (const product of filterProductsByCategory(allProducts, category)) {
    exclude.add(product.id);
  }
  return exclude;
}

function relatedCategoryList(category) {
  const anchor = (category || '').toLowerCase();
  const related = getRelatedCollectionsForCategory(category);
  const cats = related
    .map((entry) => entry.category)
    .filter((cat) => cat && cat.toLowerCase() !== anchor);
  return { related, cats: [...new Set(cats)] };
}

function pickFromCategories(allProducts, categories, limit, exclude, { perCategory = 3 } = {}) {
  const picked = [];

  for (const cat of categories) {
    const pool = filterProductsByCategory(allProducts, cat)
      .filter((product) => !exclude.has(product.id))
      .sort(byRating);

    let count = 0;
    for (const product of pool) {
      if (exclude.has(product.id)) continue;
      exclude.add(product.id);
      picked.push(product);
      count += 1;
      if (picked.length >= limit || count >= perCategory) break;
    }
    if (picked.length >= limit) break;
  }

  return picked.slice(0, limit);
}

function buildRail({ id, title, hook, products, seeAllCategory, tone }) {
  if (!products || products.length < 4) return null;
  return { id, title, hook, products, seeAllCategory, tone };
}

export function buildCollectionHub(allProducts, category, options = {}) {
  if (!allProducts?.length || !category || category === 'all') {
    return null;
  }

  const exclude = buildExcludeSet(allProducts, category, options.excludeProductIds || []);
  const { related, cats } = relatedCategoryList(category);
  const categoryLabel = related[0]?.label || cats[0] || 'related styles';

  const suggestedProducts = pickFromCategories(
    allProducts,
    cats.slice(0, 1),
    RAIL_SIZE,
    new Set(exclude),
    { perCategory: RAIL_SIZE },
  );

  const pairProducts = pickFromCategories(
    allProducts,
    cats.slice(1, 3),
    RAIL_SIZE,
    new Set([...exclude, ...suggestedProducts.map((p) => p.id)]),
    { perCategory: 4 },
  );

  const trendingProducts = pickFromCategories(
    allProducts,
    cats,
    RAIL_SIZE,
    new Set([...exclude, ...suggestedProducts.map((p) => p.id), ...pairProducts.map((p) => p.id)]),
    { perCategory: 2 },
  );

  const exploreProducts = pickFromCategories(
    allProducts,
    cats.slice(2),
    RAIL_SIZE,
    new Set([
      ...exclude,
      ...suggestedProducts.map((p) => p.id),
      ...pairProducts.map((p) => p.id),
      ...trendingProducts.map((p) => p.id),
    ]),
    { perCategory: 3 },
  );

  const rails = [
    buildRail({
      id: 'suggested',
      title: 'Suggested for you',
      hook: `Top picks from ${categoryLabel} — pair with what you are browsing`,
      products: suggestedProducts,
      seeAllCategory: cats[0],
      tone: 'editorial',
    }),
    buildRail({
      id: 'pair-with',
      title: 'Complete your look',
      hook: 'Complementary categories to style your outfit end to end',
      products: pairProducts,
      seeAllCategory: cats[1] || cats[0],
      tone: 'similar',
    }),
    buildRail({
      id: 'cross-trending',
      title: 'Trending across related edits',
      hook: 'Popular styles from neighbouring collections — not the same grid above',
      products: trendingProducts,
      seeAllCategory: cats[0],
      tone: 'hot',
    }),
    buildRail({
      id: 'explore',
      title: 'More to explore',
      hook: 'Different categories worth opening next',
      products: exploreProducts,
      seeAllCategory: cats[cats.length - 1] || cats[0],
      tone: 'related',
    }),
  ].filter(Boolean);

  return {
    category,
    buyingGuide: getBuyingGuideForCategory(category),
    relatedCollections: related,
    rails,
  };
}

export function countCollectionHubClicks(hub) {
  if (!hub) return 0;
  const railProducts = (hub.rails || []).reduce((sum, rail) => sum + (rail.products?.length || 0), 0);
  return (hub.relatedCollections?.length || 0) + railProducts + (hub.buyingGuide?.knowledgeSlug ? 1 : 0);
}

/** @deprecated Use hub.rails — kept for any legacy callers */
export function getCollectionTrendingProducts() {
  return [];
}

export function getCollectionSimilarStyles() {
  return [];
}

export function getCollectionEditorPicks() {
  return [];
}

export function getCollectionRelatedProducts() {
  return [];
}
