import { getEditorsVoicePicks, getViralFashion } from './discoveryEngine';
import { getFeaturedArticles, getArticleBySlug } from '../data/fashionMagazine';
import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { DISCOVERY_EXPERIENCE_BLOCKS, DEFAULT_DISCOVERY_CONFIG } from '../data/discoveryExperience';

const DEFAULT_EDITOR_NOTES = DEFAULT_DISCOVERY_CONFIG.editorNotes;

const FESTIVE_CATEGORIES = ['lehengas', 'sarees', 'suit sets', 'suits'];

const STATIC_BLOCK_BY_ID = Object.fromEntries(
  DISCOVERY_EXPERIENCE_BLOCKS.map((block) => [block.id, block]),
);

/**
 * Resolve homepage blocks from API overrides against the canonical static list.
 * Drops rogue admin blocks (e.g. duplicate celebrity sections) and stale retired chapters.
 */
function resolveHomepageBlocks(dynamicBlocks) {
  const apiById = Object.fromEntries(dynamicBlocks.map((block) => [block.id, block]));

  return DISCOVERY_EXPERIENCE_BLOCKS.map((defaults) => {
    const apiBlock = apiById[defaults.id];
    if (!apiBlock) return defaults;

    const merged = { ...defaults, ...apiBlock };
    merged.dark = defaults.dark === true;
    return merged;
  });
}

function getEditDeskArticles() {
  const curated = [
    getArticleBySlug('fashion-trends', 'co-ord-sets-dominating-2026'),
    getArticleBySlug('styling-tips', 'kurta-length-decoded'),
    getArticleBySlug('celebrity-looks', 'deepika-red-carpet-recreate'),
  ].filter(Boolean);
  return curated.length >= 3 ? curated : getFeaturedArticles(3);
}

/**
 * Build homepage feed: 8 India-market discovery blocks.
 * No product spotlights. Every block navigates to a dedicated page.
 * Business model: curiosity → exploration → page depth → ad revenue.
 *
 * @param {Array} products - product catalog
 * @param {Array|null} dynamicBlocks - blocks from API (null = use static fallback)
 * @param {Object|null} discoveryConfig - extras from admin (editor notes, etc.)
 */
export function buildDiscoveryExperienceFeed(
  products = [],
  dynamicBlocks = null,
  discoveryConfig = null,
  celebrityLooks = null,
) {
  if (!products?.length) return { posterRow: [], feed: [] };

  const activeBlocks = (Array.isArray(dynamicBlocks) && dynamicBlocks.length)
    ? resolveHomepageBlocks(dynamicBlocks)
    : DISCOVERY_EXPERIENCE_BLOCKS;

  const editorNotes = discoveryConfig?.editorNotes?.length
    ? discoveryConfig.editorNotes
    : DEFAULT_EDITOR_NOTES;

  const editors = getEditorsVoicePicks(products, 3);
  const viral = getViralFashion(products, 4);
  const articles = getEditDeskArticles();
  const celebrities = celebrityLooks?.length ? celebrityLooks : CELEBRITY_LOOKS.slice(0, 6);

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
    payload: buildBlockPayload(block.id, block.kind, {
      products,
      editors,
      viral,
      articles,
      celebrities,
      festiveProducts,
      editorNotes,
    }),
  }));

  return {
    posterRow: activeBlocks,
    feed,
  };
}

function buildBlockPayload(blockId, blockKind, ctx) {
  const key = blockKind || blockId;
  switch (key) {
    case 'celebrity':
    case 'bollywood-looks':
      return { looks: (ctx.celebrities?.length ? ctx.celebrities : CELEBRITY_LOOKS).slice(0, 4) };
    case 'viral':
    case 'this-week':
      return { picks: ctx.viral.slice(0, 3) };
    case 'articles':
    case 'edit-desk':
      return { articles: ctx.articles.slice(0, 3) };
    case 'editorial':
    case 'editors-voice':
      return {
        picks: ctx.editors.map((product, i) => ({
          product,
          note: ctx.editorNotes[i] || ctx.editorNotes[0],
        })),
      };
    case 'festive':
    case 'wedding-festive':
      return { products: ctx.festiveProducts };
    default:
      return {};
  }
}
