/** Resolve ad HTML for a placement — with optional shared fallbacks. */

import { LEGACY_HOMEPAGE_AD_ALIASES } from '../constants/adPlacements';

const CHECKOUT_SHARED_TOP = 'checkout_all_steps_top';
const CHECKOUT_SHARED_BOTTOM = 'checkout_all_steps_bottom';

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

  return { code: '', label: primaryKey, resolvedFrom: null };
}

export function getAdCode(adCodes, primaryKey) {
  return resolveAdCode(adCodes, primaryKey).code;
}

export function makeAdResolver(adCodes) {
  return (primaryKey) => getAdCode(adCodes, primaryKey);
}
