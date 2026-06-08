/**
 * discoveryContext.js
 *
 * Maps product categories (and other contexts) to arrays of related discovery
 * destinations — trends, celebrity looks, quizzes, and knowledge guides.
 *
 * Used by DiscoveryLoopSection to populate the "Continue Exploring" strip on
 * any page that doesn't have its own explicit cross-link data.
 */

const CATEGORY_CONTEXT = {
  kurtas: {
    trendSlugs: ['summer-fashion', 'airport-looks', 'viral-instagram-fashion'],
    celebIds: ['deepika-airport', 'kartik-airport'],
    quizSlugs: ['outfit-finder', 'personality'],
    guideSlugs: ['kurti-style-guide', 'what-is-anarkali', 'best-fabrics-summer'],
  },
  'suit sets': {
    trendSlugs: ['festival-fashion', 'wedding-fashion', 'viral-instagram-fashion'],
    celebIds: ['kiara-festive', 'janhvi-sangeet'],
    quizSlugs: ['festival-look', 'wedding-style'],
    guideSlugs: ['what-is-anarkali', 'fashion-color-guide'],
  },
  sarees: {
    trendSlugs: ['wedding-fashion', 'festival-fashion'],
    celebIds: ['alia-reception', 'janhvi-sangeet'],
    quizSlugs: ['wedding-style', 'festival-look'],
    guideSlugs: ['saree-types-explained', 'lehenga-vs-saree', 'what-is-georgette'],
  },
  lehengas: {
    trendSlugs: ['wedding-fashion', 'festival-fashion'],
    celebIds: ['alia-reception', 'kiara-festive'],
    quizSlugs: ['wedding-style', 'festival-look'],
    guideSlugs: ['lehenga-vs-saree', 'wedding-dress-guide'],
  },
  'co-ords': {
    trendSlugs: ['viral-instagram-fashion', 'airport-looks', 'summer-fashion'],
    celebIds: ['deepika-airport', 'ranveer-event'],
    quizSlugs: ['personality', 'outfit-finder'],
    guideSlugs: ['what-is-coord-fashion', 'palazzo-pairing-guide'],
  },
  tops: {
    trendSlugs: ['viral-instagram-fashion', 'summer-fashion', 'airport-looks'],
    celebIds: ['deepika-airport', 'kartik-airport'],
    quizSlugs: ['personality', 'outfit-finder'],
    guideSlugs: ['best-fabrics-summer', 'fashion-color-guide'],
  },
  'blazers': {
    trendSlugs: ['airport-looks', 'viral-instagram-fashion'],
    celebIds: ['ranveer-event', 'kartik-airport'],
    quizSlugs: ['personality', 'outfit-finder'],
    guideSlugs: ['fashion-color-guide', 'kurti-style-guide'],
  },
  default: {
    trendSlugs: ['viral-instagram-fashion', 'summer-fashion', 'wedding-fashion'],
    celebIds: ['deepika-airport', 'kiara-festive', 'ranveer-event'],
    quizSlugs: ['personality', 'outfit-finder'],
    guideSlugs: ['fashion-color-guide', 'kurti-style-guide', 'best-fabrics-summer'],
  },
};

/**
 * Get discovery context for a given product category.
 * Falls back to 'default' if the category is not in the map.
 *
 * @param {string} category - Product category slug or label
 * @returns {{ trendSlugs, celebIds, quizSlugs, guideSlugs }}
 */
export function getDiscoveryContext(category) {
  const key = (category || '').toLowerCase().trim();
  return CATEGORY_CONTEXT[key] || CATEGORY_CONTEXT.default;
}

/**
 * Merge explicit arrays with fallback category context.
 * Used when a page has partial explicit data and wants to fill remaining slots.
 */
export function mergeDiscoveryContext(explicit = {}, category = '') {
  const fallback = getDiscoveryContext(category);
  return {
    trendSlugs: dedup([...(explicit.trendSlugs || []), ...fallback.trendSlugs]).slice(0, 3),
    celebIds: dedup([...(explicit.celebIds || []), ...fallback.celebIds]).slice(0, 3),
    quizSlugs: dedup([...(explicit.quizSlugs || []), ...fallback.quizSlugs]).slice(0, 2),
    guideSlugs: dedup([...(explicit.guideSlugs || []), ...fallback.guideSlugs]).slice(0, 2),
  };
}

function dedup(arr) {
  return [...new Set(arr)];
}
