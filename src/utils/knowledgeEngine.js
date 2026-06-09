/**
 * Fashion Knowledge — product & collection linking for reference pages.
 */

import { filterProductsByCategory } from './categoryFilter';
import { getCategoryImage } from './categoryImages';
import { buildRecommendationRails } from './recommendationEngine';
import { getTopicBySlug } from '../data/fashionKnowledge';
import { getAllKnowledgePages } from './editorialContentData';

const PAGE_PRODUCTS = 10;

function titleMatchesKeywords(product, keywords = []) {
  const title = (product.title || '').toLowerCase();
  return keywords.some((kw) => title.includes(kw.toLowerCase()));
}

function scoreKnowledgeProduct(product, page) {
  let score = product.rating || 0;
  const cats = page.shopCategories || (page.shopCategory ? [page.shopCategory] : []);
  const sub = (product.subCategory || product.category || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (cats.some((c) => c.toLowerCase() === sub || c.toLowerCase() === cat)) score += 5;
  if (titleMatchesKeywords(product, page.tags)) score += 4;

  return score;
}

export function getKnowledgePageProducts(allProducts, page, limit = PAGE_PRODUCTS) {
  if (!allProducts?.length || !page) return [];

  const categories = page.shopCategories || (page.shopCategory ? [page.shopCategory] : []);
  let pool = [];
  for (const cat of categories) {
    pool.push(...filterProductsByCategory(allProducts, cat));
  }
  if (!pool.length) pool = [...allProducts];

  return pool
    .map((p) => ({ p, score: scoreKnowledgeProduct(p, page) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, limit);
}

export function getKnowledgeCollections(page) {
  const fallbackImage = page?.image || getCategoryImage(page?.shopCategory);
  const labels = page?.collectionLabels?.length
    ? page.collectionLabels
    : page?.shopCategory
      ? [{ category: page.shopCategory, label: `Shop ${page.shopCategory}` }]
      : [];

  return labels.map((col) => ({
    ...col,
    image: col.image || getCategoryImage(col.category, fallbackImage),
  }));
}

export function getKnowledgeRecommendationRails(allProducts, page) {
  return buildRecommendationRails({
    allProducts,
    category: page?.shopCategory || 'kurtas',
    productsPerRail: 8,
  });
}

export function getKnowledgePagesByTopic(topicSlug) {
  return getAllKnowledgePages().filter((p) => p.topicSlug === topicSlug);
}

export function getFeaturedKnowledgePages(limit = 5) {
  const pages = getAllKnowledgePages();
  const featured = pages.filter((p) => p.featured);
  const rest = pages.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getRelatedKnowledgePages(page, limit = 3) {
  if (!page) return [];
  const KNOWLEDGE_PAGES = getAllKnowledgePages();
  const byId = new Map(KNOWLEDGE_PAGES.map((p) => [p.id, p]));
  const related = (page.relatedPageIds || []).map((id) => byId.get(id)).filter(Boolean);
  const sameTopic = KNOWLEDGE_PAGES.filter(
    (p) => p.topicSlug === page.topicSlug && p.id !== page.id,
  );
  const merged = [...related];
  for (const p of sameTopic) {
    if (merged.length >= limit) break;
    if (!merged.some((x) => x.id === p.id)) merged.push(p);
  }
  return merged.slice(0, limit);
}

export function buildKnowledgeHubData() {
  return {
    featured: getFeaturedKnowledgePages(5),
    topics: getKnowledgePagesByTopic,
  };
}

export { getTopicBySlug };
