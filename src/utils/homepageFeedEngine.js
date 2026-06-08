import { buildHomepageExplorationSections, getTrendingCategories } from './discoveryEngine';
import { DISCOVERY_HUB_BLOCKS, DISCOVERY_QUIZ_TEASERS } from '../data/fashionDiscoveryHub';

const FEED_PATTERN = ['quiz', 'products', 'articles', 'collections', 'products'];

/**
 * Interleave discovery teasers with product rails so the homepage never stacks
 * long runs of product-only grids. Pattern: Quiz → Products → Articles → Collections → Products.
 */
export function buildInterleavedHomepageFeed(products = []) {
  if (!products?.length) return [];

  const allSections = buildHomepageExplorationSections(products);
  const productRails = allSections.filter((s) => s.type === 'product-rail');
  const categoriesSection = allSections.find((s) => s.type === 'categories') || {
    id: 'trending-categories',
    type: 'categories',
    title: 'Trending Categories',
    hook: 'Pick a lane and keep exploring — each category is a rabbit hole',
    cta: 'Browse all categories',
    category: 'all',
  };

  const articlesBlock = DISCOVERY_HUB_BLOCKS.find((b) => b.id === 'trending-articles');
  const guidesBlock = DISCOVERY_HUB_BLOCKS.find((b) => b.id === 'style-guides');

  const feed = [];
  let railIdx = 0;
  let quizIdx = 0;
  let articlesFlip = 0;
  let cycles = 0;
  const maxCycles = 4;

  while (cycles < maxCycles && (railIdx < productRails.length || quizIdx < DISCOVERY_QUIZ_TEASERS.length)) {
    for (const step of FEED_PATTERN) {
      if (step === 'quiz') {
        if (quizIdx >= DISCOVERY_QUIZ_TEASERS.length) continue;
        feed.push({
          type: 'discovery-teaser',
          id: `teaser-${DISCOVERY_QUIZ_TEASERS[quizIdx].id}`,
          block: DISCOVERY_QUIZ_TEASERS[quizIdx],
        });
        quizIdx += 1;
      } else if (step === 'products') {
        if (railIdx >= productRails.length) continue;
        feed.push(productRails[railIdx]);
        railIdx += 1;
      } else if (step === 'articles') {
        const block = articlesFlip % 2 === 0 ? articlesBlock : guidesBlock;
        articlesFlip += 1;
        if (block) {
          feed.push({
            type: 'discovery-teaser',
            id: `teaser-${block.id}-${articlesFlip}`,
            block,
          });
        }
      } else if (step === 'collections') {
        feed.push({ ...categoriesSection, type: 'categories' });
      }
    }
    cycles += 1;
  }

  return feed;
}

export { getTrendingCategories };
