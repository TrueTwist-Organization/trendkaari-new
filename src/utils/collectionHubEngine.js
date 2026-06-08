/**
 * Collection Hub engine — assembles buying guide, related collections, and product rails.
 */

import { filterProductsByCategory } from './categoryFilter';
import { getEditorsPicks } from './discoveryEngine';
import {
  getRelatedProducts,
  getSimilarStyles,
  MIN_RAIL_PRODUCTS,
} from './recommendationEngine';
import {
  getBuyingGuideForCategory,
  getRelatedCollectionsForCategory,
} from '../data/collectionHubs';

const RAIL_SIZE = 10;

function byRating(a, b) {
  return (b.rating || 0) - (a.rating || 0);
}

function categoryPool(allProducts, category) {
  const pool = filterProductsByCategory(allProducts, category);
  return pool.length ? pool : allProducts;
}

export function getCollectionTrendingProducts(allProducts, category, limit = RAIL_SIZE) {
  const pool = categoryPool(allProducts, category);
  const exclude = new Set();
  const ranked = [...pool].sort(byRating);
  const picked = [];
  for (const p of ranked) {
    if (exclude.has(p.id)) continue;
    exclude.add(p.id);
    picked.push(p);
    if (picked.length >= limit) break;
  }
  while (picked.length < MIN_RAIL_PRODUCTS && picked.length < pool.length) {
    for (const p of pool) {
      if (exclude.has(p.id)) continue;
      exclude.add(p.id);
      picked.push(p);
      if (picked.length >= MIN_RAIL_PRODUCTS) break;
    }
    break;
  }
  return picked.slice(0, limit);
}

export function getCollectionSimilarStyles(allProducts, category, limit = RAIL_SIZE) {
  return getSimilarStyles(null, category, allProducts, limit);
}

export function getCollectionEditorPicks(allProducts, category, limit = RAIL_SIZE) {
  const pool = categoryPool(allProducts, category);
  return getEditorsPicks(pool, limit);
}

export function getCollectionRelatedProducts(allProducts, category, limit = RAIL_SIZE) {
  return getRelatedProducts(null, category, allProducts, limit);
}

export function buildCollectionHub(allProducts, category) {
  if (!allProducts?.length || !category || category === 'all') {
    return null;
  }

  const buyingGuide = getBuyingGuideForCategory(category);
  const relatedCollections = getRelatedCollectionsForCategory(category);

  return {
    category,
    buyingGuide,
    relatedCollections,
    trending: getCollectionTrendingProducts(allProducts, category),
    similarStyles: getCollectionSimilarStyles(allProducts, category),
    editorPicks: getCollectionEditorPicks(allProducts, category),
    relatedProducts: getCollectionRelatedProducts(allProducts, category),
  };
}

export function countCollectionHubClicks(hub) {
  if (!hub) return 0;
  return (
    (hub.relatedCollections?.length || 0) +
    (hub.trending?.length || 0) +
    (hub.similarStyles?.length || 0) +
    (hub.editorPicks?.length || 0) +
    (hub.buyingGuide?.knowledgeSlug ? 1 : 0)
  );
}
