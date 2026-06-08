import { getEditorsPicks, getViralFashion } from './discoveryEngine';
import { getFeaturedArticles } from '../data/fashionMagazine';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { DISCOVERY_EXPERIENCE_BLOCKS } from '../data/discoveryExperience';

const EDITOR_NOTES = [
  'The desk pick for effortless festive dressing — structure without stiffness.',
  'A scroll-stopper that still feels wearable off the feed.',
  'Investment-tier fabric, everyday-friendly silhouette.',
];

const FESTIVE_CATEGORIES = ['lehengas', 'sarees', 'suit sets', 'suits'];

/**
 * Build homepage feed: 9 India-market discovery blocks.
 * No product spotlights. Every block navigates to a dedicated page.
 * Business model: curiosity → exploration → page depth → ad revenue.
 *
 * @param {Array} products - product catalog
 * @param {Array|null} dynamicBlocks - blocks from API (null = use static fallback)
 */
export function buildDiscoveryExperienceFeed(products = [], dynamicBlocks = null) {
  if (!products?.length) return { posterRow: [], feed: [] };

  const activeBlocks = (Array.isArray(dynamicBlocks) && dynamicBlocks.length)
    ? dynamicBlocks
    : DISCOVERY_EXPERIENCE_BLOCKS;

  const editors = getEditorsPicks(products, 3);
  const viral = getViralFashion(products, 4);
  const articles = getFeaturedArticles(4);
  const celebrities = CELEBRITY_LOOKS.slice(0, 6);

  const festiveProducts = products
    .filter((p) =>
      FESTIVE_CATEGORIES.some((cat) =>
        (p.category || p.subCategory || '').toLowerCase().includes(cat),
      ),
    )
    .slice(0, 4);

  const feed = activeBlocks.map((block) => ({
    type: 'experience',
    id: block.id,
    block,
    payload: buildBlockPayload(block.id, {
      products,
      editors,
      viral,
      articles,
      celebrities,
      festiveProducts,
    }),
  }));

  return {
    posterRow: activeBlocks,
    feed,
  };
}

function buildBlockPayload(blockId, ctx) {
  switch (blockId) {
    case 'bollywood-looks':
      return { looks: ctx.celebrities };
    case 'this-week':
      return { picks: ctx.viral.slice(0, 3) };
    case 'edit-desk':
      return { articles: ctx.articles.slice(0, 3) };
    case 'editors-voice':
      return {
        picks: ctx.editors.map((product, i) => ({
          product,
          note: EDITOR_NOTES[i] || EDITOR_NOTES[0],
        })),
      };
    case 'wedding-festive':
      return { products: ctx.festiveProducts };
    default:
      return {};
  }
}
