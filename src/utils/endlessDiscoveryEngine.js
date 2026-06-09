/**
 * Endless discovery — every page gets similar products, similar styles,
 * related collections, related articles, related quizzes, and trending picks.
 * Minimum 10 next-click opportunities guaranteed.
 */

import { getRelatedCollectionsForCategory } from '../data/collectionHubs';
import { getAllQuizzes } from '../data/fashionQuizzes';
import {
  getFeaturedArticles,
  getLatestArticles,
  getRelatedArticles,
  MAGAZINE_ARTICLES,
} from '../data/fashionMagazine';
import {
  getFeaturedKnowledgePages,
  getRelatedKnowledgePages,
} from '../data/fashionKnowledge';
import {
  DEFAULT_RAIL_PRODUCTS,
  getRelatedProducts,
  getSimilarStyles,
  getTrendingThisWeek,
  MIN_RAIL_PRODUCTS,
} from './recommendationEngine';
import { buildQuizDiscoveryRails } from './quizEngine';
import { buildGameHubDiscoveryRails } from './fashionGameEngine';

export const MIN_ENDLESS_CLICKS = 10;
export const MIN_COLLECTIONS = 4;
export const MIN_READING = 3;
export const MIN_QUIZZES = 2;

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

function resolveAnchorCategory(ctx) {
  const { product, category, article, knowledgePage, quizResult } = ctx;
  return (
    product?.subCategory ||
    product?.category ||
    category ||
    article?.shopCategory ||
    knowledgePage?.shopCategory ||
    quizResult?.discoverCategory ||
    quizResult?.categories?.[0] ||
    'kurtas'
  )
    .toString()
    .toLowerCase();
}

function normalizeReadingItem(item, type) {
  if (type === 'magazine') {
    return {
      id: `mag-${item.id}`,
      type: 'magazine',
      title: item.title,
      excerpt: item.excerpt || item.deck,
      image: item.heroImage || item.image,
      categorySlug: item.categorySlug,
      slug: item.slug,
      readTime: item.readTime,
    };
  }

  return {
    id: `know-${item.id}`,
    type: 'knowledge',
    title: item.title,
    excerpt: item.excerpt,
    image: item.image,
    slug: item.slug,
    readTime: item.readTime,
  };
}

const BROKEN_READING_IMAGES = new Set([
  '/kurtas/Kurtas/1/040A2925_700x.webp',
  '/sarees/Sarees/1/040A3523_700x.webp',
]);

function hasReadableImage(entry) {
  const image = String(entry?.image || '').trim();
  return image.length > 0 && !BROKEN_READING_IMAGES.has(image);
}

function getRelatedReading(ctx, limit = MIN_READING) {
  const { article, knowledgePage } = ctx;
  const anchor = resolveAnchorCategory(ctx);
  const items = [];
  const seen = new Set();

  const push = (entry) => {
    if (!entry || seen.has(entry.id) || !hasReadableImage(entry)) return;
    seen.add(entry.id);
    items.push(entry);
  };

  if (article) {
    getRelatedArticles(article, limit).forEach((a) => push(normalizeReadingItem(a, 'magazine')));
  }

  if (knowledgePage) {
    getRelatedKnowledgePages(knowledgePage, limit).forEach((p) =>
      push(normalizeReadingItem(p, 'knowledge')),
    );
  }

  if (items.length < limit) {
    const byCategory = MAGAZINE_ARTICLES.filter(
      (a) => (a.shopCategory || '').toLowerCase() === anchor && a.id !== article?.id,
    );
    seededShuffle(byCategory.length ? byCategory : MAGAZINE_ARTICLES, `read-cat-${anchor}`)
      .slice(0, limit)
      .forEach((a) => push(normalizeReadingItem(a, 'magazine')));
  }

  if (items.length < limit) {
    getFeaturedKnowledgePages(limit).forEach((p) => {
      if (p.id === knowledgePage?.id) return;
      push(normalizeReadingItem(p, 'knowledge'));
    });
  }

  if (items.length < limit) {
    getLatestArticles(limit).forEach((a) => push(normalizeReadingItem(a, 'magazine')));
  }

  return items.slice(0, Math.max(limit, MIN_READING));
}

function getRelatedQuizzes(ctx, limit = MIN_QUIZZES) {
  const { quizSlug, quizResult } = ctx;
  const anchor = resolveAnchorCategory(ctx);
  const exclude = new Set([quizSlug].filter(Boolean));
  const all = getAllQuizzes().filter((q) => !exclude.has(q.slug));

  const scored = all.map((quiz) => {
    let score = 1;
    const text = `${quiz.title} ${quiz.subtitle} ${quiz.description}`.toLowerCase();
    if (anchor.includes('lehenga') || anchor.includes('saree') || anchor.includes('wedding')) {
      if (quiz.slug === 'wedding-style' || quiz.slug === 'festival-look') score += 4;
    }
    if (anchor.includes('kurta') || anchor.includes('coord') || anchor.includes('top')) {
      if (quiz.slug === 'outfit-finder' || quiz.slug === 'personality') score += 3;
    }
    if (quizResult?.personality && text.includes(String(quizResult.personality).toLowerCase())) score += 2;
    return { quiz, score };
  });

  const picked = seededShuffle(
    scored.sort((a, b) => b.score - a.score).map((x) => x.quiz),
    `quizzes-${anchor}-${quizSlug || 'hub'}`,
  ).slice(0, Math.max(limit, MIN_QUIZZES));

  return picked.map((quiz) => ({
    slug: quiz.slug,
    title: quiz.title,
    subtitle: quiz.subtitle,
    accent: quiz.accent,
    steps: quiz.steps?.length || 0,
  }));
}

function getRelatedCollections(ctx, limit = MIN_COLLECTIONS) {
  const { quizResult } = ctx;
  const anchor = resolveAnchorCategory(ctx);
  const collections = getRelatedCollectionsForCategory(anchor);
  const merged = [...collections];

  if (quizResult?.categories?.length) {
    for (const cat of quizResult.categories) {
      for (const col of getRelatedCollectionsForCategory(cat)) {
        if (merged.length >= limit) break;
        if (merged.some((x) => x.category === col.category)) continue;
        merged.push(col);
      }
    }
  }

  if (merged.length >= limit) return merged.slice(0, limit);

  const fallback = getRelatedCollectionsForCategory('all');
  for (const col of fallback) {
    if (merged.length >= limit) break;
    if (merged.some((x) => x.category === col.category)) continue;
    merged.push(col);
  }
  return merged.slice(0, Math.max(limit, MIN_COLLECTIONS));
}

export function buildEndlessDiscovery(ctx) {
  const {
    allProducts,
    product = null,
    quizResult = null,
    gameHub = false,
    excludeProductIds = [],
    productsPerRail = DEFAULT_RAIL_PRODUCTS,
  } = ctx;
  if (!allProducts?.length) return null;

  const anchor = resolveAnchorCategory(ctx);
  const exclude = new Set(excludeProductIds);
  if (product?.id) exclude.add(product.id);

  const relatedCollections = getRelatedCollections(ctx);
  const relatedReading = getRelatedReading(ctx);
  const relatedQuizzes = getRelatedQuizzes(ctx);

  if (quizResult) {
    const quizRails = buildQuizDiscoveryRails(allProducts, quizResult, productsPerRail, exclude);
    if (quizRails) {
      return {
        anchorCategory: anchor,
        ...quizRails,
        relatedCollections,
        relatedReading,
        relatedQuizzes,
      };
    }
  }

  if (gameHub) {
    const gameRails = buildGameHubDiscoveryRails(allProducts, productsPerRail);
    if (gameRails) {
      return {
        anchorCategory: anchor,
        ...gameRails,
        relatedCollections,
        relatedReading,
        relatedQuizzes,
      };
    }
  }

  const similarProducts = getRelatedProducts(product, anchor, allProducts, productsPerRail, new Set(exclude));
  similarProducts.forEach((p) => exclude.add(p.id));

  const similarStyles = getSimilarStyles(product, anchor, allProducts, productsPerRail, new Set(exclude));
  similarStyles.forEach((p) => exclude.add(p.id));

  const trendingProducts = getTrendingThisWeek(allProducts, productsPerRail, new Set(exclude));

  return {
    anchorCategory: anchor,
    similarProducts: {
      id: 'similar-products',
      title: 'Similar Products',
      hook: 'Same lane, more options — one tap opens your next favourite',
      tone: 'related',
      products: similarProducts,
      category: anchor,
    },
    similarStyles: {
      id: 'similar-styles',
      title: 'Similar Styles',
      hook: 'Same vibe, fresh silhouettes — keep scrolling this edit',
      tone: 'similar',
      products: similarStyles,
      category: anchor,
    },
    trendingProducts: {
      id: 'trending-products',
      title: 'Trending Products',
      hook: 'Hot picks climbing the charts — see what shoppers open next',
      tone: 'hot',
      products: trendingProducts,
      category: 'kurtas',
    },
    relatedCollections,
    relatedReading,
    relatedQuizzes,
  };
}

export function countEndlessDiscoveryClicks(discovery) {
  if (!discovery) return 0;

  const productClicks =
    (discovery.similarProducts?.products?.length || 0) +
    (discovery.similarStyles?.products?.length || 0) +
    (discovery.trendingProducts?.products?.length || 0);

  const metaClicks =
    (discovery.relatedCollections?.length || 0) +
    (discovery.relatedReading?.length || 0) +
    (discovery.relatedQuizzes?.length || 0);

  return productClicks + metaClicks;
}

export function meetsMinimumEndlessDiscovery(discovery, minTotal = MIN_ENDLESS_CLICKS) {
  return countEndlessDiscoveryClicks(discovery) >= minTotal;
}

export function hasValidEndlessDiscovery(discovery) {
  if (!discovery) return false;
  const railsOk =
    (discovery.similarProducts?.products?.length || 0) >= MIN_RAIL_PRODUCTS &&
    (discovery.similarStyles?.products?.length || 0) >= MIN_RAIL_PRODUCTS &&
    (discovery.trendingProducts?.products?.length || 0) >= MIN_RAIL_PRODUCTS;
  return railsOk && meetsMinimumEndlessDiscovery(discovery);
}
