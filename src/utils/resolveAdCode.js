/** Resolve ad HTML for a placement — with optional shared fallbacks. */

import { LEGACY_HOMEPAGE_AD_ALIASES } from '../constants/adPlacements';

const CHECKOUT_SHARED_TOP = 'checkout_all_steps_top';
const CHECKOUT_SHARED_BOTTOM = 'checkout_all_steps_bottom';

/** When a page slot is empty in admin, try related hub/parent slots. */
const CONTENT_AD_FALLBACKS = {
  quiz_flow_mid: ['quiz_hub_mid'],
  quiz_flow_bottom: ['quiz_hub_bottom'],
  game_play_mid: ['games_hub_mid'],
  game_play_bottom: ['games_hub_bottom'],
  magazine_category_mid: ['magazine_hub_mid'],
  magazine_category_bottom: ['magazine_hub_bottom'],
  spin_wheel_top: ['games_hub_mid', 'quiz_hub_mid'],
  spin_wheel_bottom: ['games_hub_bottom', 'quiz_hub_bottom'],
  discover_feed_mid: ['discover_feed_bottom'],
  category_after_grid: ['category_page_bottom', 'category_below_sort'],
  ads_every_2_products: ['category_below_sort', 'category_page_bottom'],
  knowledge_page_mid: ['knowledge_hub_mid'],
  knowledge_page_bottom: ['knowledge_hub_bottom'],
  magazine_article_mid: ['magazine_hub_mid'],
  magazine_article_bottom: ['magazine_hub_bottom'],
  celebrity_look_mid: ['celebrity_hub_mid'],
  celebrity_look_bottom: ['celebrity_hub_bottom'],
  trend_page_mid: ['trend_hub_mid'],
  trend_page_bottom: ['trend_hub_bottom'],
  content_page_top: ['site_common_ad'],
  content_page_bottom: ['site_common_ad'],
};

function checkoutFallbackKey(primaryKey) {
  if (primaryKey === 'checkout_step_error_top') return CHECKOUT_SHARED_TOP;
  if (primaryKey === 'checkout_step_error_bottom') return CHECKOUT_SHARED_BOTTOM;

  const match = String(primaryKey || '').match(/^checkout_step_(.+?)_(top|bottom)$/);
  if (!match) return null;
  return match[2] === 'top' ? CHECKOUT_SHARED_TOP : CHECKOUT_SHARED_BOTTOM;
}

export function resolveAdCode(adCodes, primaryKey) {
  const code = String(adCodes?.[primaryKey] || '').trim();
  if (code) {
    return { code, label: primaryKey, resolvedFrom: primaryKey };
  }

  const fallbackKey = checkoutFallbackKey(primaryKey);
  if (fallbackKey) {
    const fallbackCode = String(adCodes?.[fallbackKey] || '').trim();
    if (fallbackCode) {
      return { code: fallbackCode, label: primaryKey, resolvedFrom: fallbackKey };
    }
  }

  const legacyHomeKey = LEGACY_HOMEPAGE_AD_ALIASES[primaryKey];
  if (legacyHomeKey) {
    const legacyCode = String(adCodes?.[legacyHomeKey] || '').trim();
    if (legacyCode) {
      return { code: legacyCode, label: primaryKey, resolvedFrom: legacyHomeKey };
    }
  }

  if (primaryKey === 'homepage_after_spotlight') {
    const reviewsCode = String(adCodes?.home_before_reviews || '').trim();
    if (reviewsCode) {
      return { code: reviewsCode, label: primaryKey, resolvedFrom: 'home_before_reviews' };
    }
  }

  if (primaryKey === 'product_trending_every_6') {
    const similarCode = String(adCodes?.product_similar_every_6 || '').trim();
    if (similarCode) {
      return { code: similarCode, label: primaryKey, resolvedFrom: 'product_similar_every_6' };
    }
  }

  if (primaryKey === 'category_suggestions_every_6') {
    const productRailCode = String(adCodes?.product_similar_every_6 || '').trim();
    if (productRailCode) {
      return { code: productRailCode, label: primaryKey, resolvedFrom: 'product_similar_every_6' };
    }
  }

  const contentFallbacks = CONTENT_AD_FALLBACKS[primaryKey];
  if (contentFallbacks?.length) {
    for (const key of contentFallbacks) {
      const fallbackCode = String(adCodes?.[key] || '').trim();
      if (fallbackCode) {
        return { code: fallbackCode, label: primaryKey, resolvedFrom: key };
      }
    }
  }

  return { code: '', label: primaryKey, resolvedFrom: null };
}

export function getAdCode(adCodes, primaryKey) {
  return resolveAdCode(adCodes, primaryKey).code;
}

export function makeAdResolver(adCodes) {
  return (primaryKey) => getAdCode(adCodes, primaryKey);
}
