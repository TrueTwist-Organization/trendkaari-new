import { TREND_PAGES, getTrendPage as getStaticTrendPage } from '../data/trendPages';
import {
  KNOWLEDGE_PAGES,
  getKnowledgePageBySlug as getStaticKnowledgePage,
  getAllKnowledgePages as getStaticAllKnowledgePages,
} from '../data/fashionKnowledge';
import {
  FASHION_QUIZZES,
  getQuizBySlug as getStaticQuizBySlug,
  getAllQuizzes as getStaticAllQuizzes,
} from '../data/fashionQuizzes';

const cache = {
  'trend-pages': null,
  'knowledge-pages': null,
  quizzes: null,
};

const inflight = {};

async function fetchContentType(type, staticFallback) {
  if (cache[type]) return cache[type];
  if (inflight[type]) return inflight[type];

  inflight[type] = fetch(`/api/store/content?type=${type}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const items = Array.isArray(data?.items) ? data.items.filter(Boolean) : [];
      cache[type] = items.length ? items : staticFallback;
      return cache[type];
    })
    .catch(() => {
      cache[type] = staticFallback;
      return cache[type];
    })
    .finally(() => {
      inflight[type] = null;
    });

  return inflight[type];
}

export function clearEditorialContentCache() {
  cache['trend-pages'] = null;
  cache['knowledge-pages'] = null;
  cache.quizzes = null;
}

export async function fetchTrendPages() {
  return fetchContentType('trend-pages', TREND_PAGES);
}

export async function fetchKnowledgePages() {
  return fetchContentType('knowledge-pages', KNOWLEDGE_PAGES);
}

export async function fetchQuizzesList() {
  return fetchContentType('quizzes', Object.values(FASHION_QUIZZES));
}

export async function fetchQuizzesMap() {
  const list = await fetchQuizzesList();
  const map = {};
  list.forEach((quiz) => {
    if (quiz?.slug) map[quiz.slug] = quiz;
  });
  return Object.keys(map).length ? map : FASHION_QUIZZES;
}

export async function getTrendPageAsync(slug) {
  if (!slug) return null;
  const pages = await fetchTrendPages();
  return pages.find((p) => p.slug === slug) ?? getStaticTrendPage(slug);
}

export async function getKnowledgePageAsync(slug) {
  if (!slug) return null;
  const pages = await fetchKnowledgePages();
  return pages.find((p) => p.slug === slug) ?? getStaticKnowledgePage(slug);
}

export async function getQuizBySlugAsync(slug) {
  if (!slug) return null;
  const map = await fetchQuizzesMap();
  return map[slug] ?? getStaticQuizBySlug(slug);
}

export function getTrendPage(slug) {
  if (cache['trend-pages']) {
    return cache['trend-pages'].find((p) => p.slug === slug) ?? getStaticTrendPage(slug);
  }
  return getStaticTrendPage(slug);
}

export function getKnowledgePageBySlug(slug) {
  if (cache['knowledge-pages']) {
    return cache['knowledge-pages'].find((p) => p.slug === slug) ?? getStaticKnowledgePage(slug);
  }
  return getStaticKnowledgePage(slug);
}

export function getQuizBySlug(slug) {
  if (cache.quizzes) {
    const fromCache = cache.quizzes.find((q) => q.slug === slug);
    if (fromCache) return fromCache;
  }
  return getStaticQuizBySlug(slug);
}

export function getAllQuizzes() {
  if (cache.quizzes?.length) return cache.quizzes;
  return getStaticAllQuizzes();
}

export function getAllKnowledgePages() {
  if (cache['knowledge-pages']?.length) return cache['knowledge-pages'];
  return getStaticAllKnowledgePages();
}

export function isValidTrendSlug(slug) {
  if (cache['trend-pages']) return cache['trend-pages'].some((p) => p.slug === slug);
  return TREND_PAGES.some((p) => p.slug === slug);
}

export function isValidKnowledgePageSlug(slug) {
  if (cache['knowledge-pages']) return cache['knowledge-pages'].some((p) => p.slug === slug);
  return Boolean(getStaticKnowledgePage(slug));
}

export function isValidQuizSlug(slug) {
  if (cache.quizzes) return cache.quizzes.some((q) => q.slug === slug);
  return Boolean(FASHION_QUIZZES[slug]);
}

export function isValidQuizResult(quizSlug, resultKey) {
  const quiz = getQuizBySlug(quizSlug);
  return Boolean(quiz?.results?.[resultKey]);
}

export async function prefetchEditorialContent() {
  await Promise.all([fetchTrendPages(), fetchKnowledgePages(), fetchQuizzesList()]);
}
