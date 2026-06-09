import {
  AD_PLACEMENT_DEFINITIONS,
  LEGACY_HOMEPAGE_AD_ALIASES,
  RETIRED_HOMEPAGE_AD_ALIASES,
  RETIRED_PRODUCT_AD_ALIASES,
} from '../constants/adPlacements';
import { sanitizeAdHtmlForEmbed } from './adHtml.js';

export { AD_PLACEMENT_DEFINITIONS };

export function decodeAdCodeClient(stored = '', encoded = true) {
  const raw = String(stored || '').trim();
  if (!raw) return '';
  if (!encoded) return raw;
  try {
    let text = decodeURIComponent(
      Array.prototype.map
        .call(atob(raw), (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    for (let i = 0; i < 2 && !/<(script|div|ins|iframe)/i.test(text); i += 1) {
      try {
        const next = decodeURIComponent(
          Array.prototype.map
            .call(atob(text), (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
        );
        if (!next || next === text) break;
        text = next;
      } catch {
        break;
      }
    }
    return text;
  } catch {
    return raw;
  }
}

function applyLegacyHomepageAliases(map) {
  Object.entries(LEGACY_HOMEPAGE_AD_ALIASES).forEach(([newKey, oldKey]) => {
    if (!map[newKey] && map[oldKey]) map[newKey] = map[oldKey];
  });
  if (!map.homepage_after_spotlight && map.home_before_reviews) {
    map.homepage_after_spotlight = map.home_before_reviews;
  }
  const legacyEvery2 =
    map.homepage_editorial_every_2 || map.home_editorial_every_2;
  if (legacyEvery2 && !map.homepage_after_style_quiz) {
    map.homepage_after_style_quiz = legacyEvery2;
  }
  const legacyEditorialBottom =
    map.homepage_editorial_bottom || map.home_editorial_bottom;
  if (legacyEditorialBottom && !map.homepage_after_trending_india) {
    map.homepage_after_trending_india = legacyEditorialBottom;
  }
  const legacyProductEvery2 =
    map.product_suggestions_every_2;
  if (legacyProductEvery2 && !map.product_similar_every_6) {
    map.product_similar_every_6 = legacyProductEvery2;
  }
  if (legacyProductEvery2 && !map.product_trending_every_6) {
    map.product_trending_every_6 = legacyProductEvery2;
  }
  if (!map.category_suggestions_every_6 && map.product_similar_every_6) {
    map.category_suggestions_every_6 = map.product_similar_every_6;
  }
  return map;
}

/** Map placement key → decoded HTML for storefront */
export function adSlotsToCodeMap(slots = []) {
  const map = {};
  (slots || []).forEach((slot) => {
    if (!slot?.placement) return;
    const code = sanitizeAdHtmlForEmbed(decodeAdCodeClient(slot.code, slot.encoded !== false));
    if (code.trim()) map[slot.placement] = code;
  });
  return applyLegacyHomepageAliases(map);
}

function codeLooksPlainHtml(text = '') {
  return /<(script|div|ins|iframe|img|a)[\s>]/i.test(String(text || '').trim());
}

/** Merge saved slots with all placement definitions for admin form */
function normalizeSavedPlacement(placement) {
  if (RETIRED_PRODUCT_AD_ALIASES[placement]) {
    return RETIRED_PRODUCT_AD_ALIASES[placement];
  }
  if (RETIRED_HOMEPAGE_AD_ALIASES[placement]) {
    return RETIRED_HOMEPAGE_AD_ALIASES[placement];
  }
  const reverse = Object.entries(LEGACY_HOMEPAGE_AD_ALIASES).find(([, old]) => old === placement);
  return reverse ? reverse[0] : placement;
}

export function mergeAdSlotsForAdmin(saved = []) {
  const byKey = {};
  (saved || []).forEach((s) => {
    if (!s?.placement) return;
    const placement = normalizeSavedPlacement(s.placement);
    if (!byKey[placement] || String(s.code || '').trim()) {
      byKey[placement] = { ...s, placement };
    }
  });

  return AD_PLACEMENT_DEFINITIONS.map((def) => {
    const row = byKey[def.key];
    const shouldDecode = row && row.encoded !== false && !codeLooksPlainHtml(row.code);
    const code = row ? decodeAdCodeClient(row.code, shouldDecode) : '';
    return {
      placement: def.key,
      title: def.title,
      description: def.description,
      placeholder: def.placeholder,
      code,
      updatedAt: row?.updatedAt || null,
    };
  });
}
