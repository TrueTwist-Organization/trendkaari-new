/**
 * Fashion Magazine — product rails and editorial helpers for article pages.
 */

import { filterProductsByCategory } from './categoryFilter';
import { buildRecommendationRails } from './recommendationEngine';
import {
  getArticlesByCategory,
  getCategoryBySlug,
  getFeaturedArticles,
  getLatestArticles,
  getRelatedArticles,
} from '../data/fashionMagazine';

const ARTICLE_PRODUCTS = 10;

function titleMatchesKeywords(product, keywords = []) {
  const title = (product.title || '').toLowerCase();
  return keywords.some((kw) => title.includes(kw.toLowerCase()));
}

function scoreArticleProduct(product, article) {
  let score = product.rating || 0;
  const shopCat = (article.shopCategory || '').toLowerCase();
  const sub = (product.subCategory || product.category || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (shopCat && (sub === shopCat || cat === shopCat)) score += 5;
  if (titleMatchesKeywords(product, article.tags)) score += 3;

  return score;
}

export function getArticleShopProducts(allProducts, article, limit = ARTICLE_PRODUCTS) {
  if (!allProducts?.length || !article) return [];

  const category = article.shopCategory;
  let pool = category ? filterProductsByCategory(allProducts, category) : [...allProducts];
  if (!pool.length) pool = [...allProducts];

  return pool
    .map((p) => ({ p, score: scoreArticleProduct(p, article) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, limit);
}

export function getArticleRecommendationRails(allProducts, article) {
  return buildRecommendationRails({
    allProducts,
    category: article?.shopCategory || 'kurtas',
    productsPerRail: 8,
  });
}

export function buildMagazineHubSections() {
  return {
    featured: getFeaturedArticles(6),
    latest: getLatestArticles(8),
  };
}

export function buildCategoryPageData(categorySlug) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  return {
    category,
    articles: getArticlesByCategory(categorySlug),
  };
}

export {
  getRelatedArticles,
  getFeaturedArticles,
  getLatestArticles,
  getArticlesByCategory,
  getCategoryBySlug,
};
