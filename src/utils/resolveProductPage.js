/** Resolve catalog + gift-combo product payloads for PDP routes. */

import { buildGiftComboPayload } from './giftComboProduct';
import { slugToCategory } from './categorySlug';

export function findCatalogProduct(productsList, id) {
  if (id == null || id === '') return null;
  const num = Number(id);
  return (
    productsList?.find(
      (p) => p.id === id || p.id === num || String(p.id) === String(id),
    ) || null
  );
}

export function findGiftComboForProduct(giftCombos, productId) {
  const num = Number(productId);
  if (Number.isNaN(num)) return null;
  return (
    giftCombos?.find(
      (c) =>
        c?.active !== false &&
        (Number(c.productId) === num ||
          c.galleryProductIds?.some((gid) => Number(gid) === num)),
    ) || null
  );
}

export function mergeProductForDetail(payload, productsList = []) {
  const id = payload?.id ?? payload?.productId;
  if (!id && !payload?.isGiftCombo) return null;

  const base = findCatalogProduct(productsList, id);
  const hero = payload.heroImage || payload.image;
  const fromPayload = payload.images?.length ? [...payload.images] : null;

  if (!base) {
    if (!payload?.isGiftCombo) return null;
    const images = fromPayload?.length ? fromPayload : hero ? [hero] : [];
    return {
      ...payload,
      id: payload.id ?? payload.productId,
      title: payload.title || payload.name,
      image: images[0] || hero || '',
      images: images.length ? images : hero ? [hero] : [],
      sizes: payload.sizes?.length ? payload.sizes : ['S', 'M', 'L', 'XL'],
    };
  }

  const catalog = base.images?.length ? [...base.images] : [base.image];
  const mergedList = fromPayload?.length
    ? fromPayload
    : hero
      ? [hero, ...catalog.filter((url) => url && url !== hero)]
      : catalog;
  const uniqueImages = [...new Set(mergedList.filter(Boolean))];

  return {
    ...base,
    title: payload.name || payload.title || base.title,
    description: payload.description || base.description,
    descriptionLong:
      payload.descriptionLong || payload.description || base.descriptionLong,
    price: payload.price ?? base.price,
    originalPrice: payload.originalPrice ?? base.originalPrice,
    discount: payload.discount ?? base.discount,
    image: uniqueImages[0] || base.image,
    images: uniqueImages.length ? uniqueImages : [base.image],
    aboutItems: payload.aboutItems?.length ? payload.aboutItems : base.aboutItems,
    highlights:
      payload.highlights && Object.keys(payload.highlights).length
        ? payload.highlights
        : base.highlights,
    isGiftCombo: payload.isGiftCombo ?? false,
    comboBadge: payload.comboBadge,
    comboIncludes: payload.comboIncludes,
    partnerProduct: payload.partnerProduct ?? null,
    comboGiftId: payload.comboGiftId,
  };
}

/**
 * Resolve product for /product/:id — prefers explicit combo payload, else catalog (+ optional combo enrich).
 */
export function resolveProductPage(
  productId,
  productsList = [],
  giftCombos = [],
  { preferGiftCombo = true } = {},
) {
  const parsed = parseInt(String(productId), 10);
  if (Number.isNaN(parsed)) return null;

  const catalog = findCatalogProduct(productsList, parsed);
  if (!catalog && !preferGiftCombo) return null;

  if (preferGiftCombo) {
    const combo = findGiftComboForProduct(giftCombos, parsed);
    if (combo) {
      const payload = buildGiftComboPayload(combo, productsList);
      const merged = mergeProductForDetail(payload, productsList);
      if (merged) return merged;
    }
  }

  return catalog;
}

const ROUTE_DEFAULTS = {
  activeCategory: 'all',
  selectedProduct: null,
  isCategoryPage: false,
  infoSlug: null,
  checkoutSlug: null,
  productId: null,
  quizSlug: null,
  quizResultKey: null,
  styleFinderResultKey: null,
  magazineCategorySlug: null,
  magazineArticleSlug: null,
  knowledgePageSlug: null,
  gameSlug: null,
  celebrityLookSlug: null,
  trendSlug: null,
};

export function parseRouteFromPath(pathname = '') {
  const segments = String(pathname || '').split('/').filter(Boolean);
  if (!segments.length) {
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'home',
    };
  }

  if (segments[0] === 'knowledge') {
    if (!segments[1]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'knowledge',
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'knowledge-page',
      knowledgePageSlug: decodeURIComponent(segments[1]),
    };
  }

  if (segments[0] === 'magazine') {
    if (!segments[1]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'magazine',
      };
    }
    if (segments[2]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'magazine-article',
        magazineCategorySlug: segments[1],
        magazineArticleSlug: decodeURIComponent(segments[2]),
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'magazine-category',
      magazineCategorySlug: segments[1],
    };
  }

  if (segments[0] === 'style-finder') {
    if (segments[1] === 'result' && segments[2]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'style-finder-result',
        styleFinderResultKey: decodeURIComponent(segments[2]),
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'style-finder',
    };
  }

  if (segments[0] === 'quiz') {
    if (!segments[1]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'quiz',
      };
    }
    if (segments[2] === 'result' && segments[3]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'quiz-result',
        quizSlug: segments[1],
        quizResultKey: decodeURIComponent(segments[3]),
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'quiz-flow',
      quizSlug: segments[1],
    };
  }

  if (segments[0] === 'discover') {
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'discover',
    };
  }

  if (segments[0] === 'celebrity-match') {
    if (segments[1]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'celebrity-look',
        celebrityLookSlug: decodeURIComponent(segments[1]),
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'celebrity-match',
    };
  }

  if (segments[0] === 'games') {
    if (!segments[1]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'games',
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'game-play',
      gameSlug: segments[1],
    };
  }

  if (segments[0] === 'category') {
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'home',
      activeCategory: slugToCategory(segments[1] || 'all'),
      isCategoryPage: true,
    };
  }

  if (segments[0] === 'product') {
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'product-detail',
      productId: parseInt(segments[1], 10),
    };
  }

  if (segments[0] === 'checkout') {
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'checkout',
      checkoutSlug: segments[1] || 'bag',
    };
  }

  if (segments[0] === 'info' && segments[1]) {
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'info',
      infoSlug: decodeURIComponent(segments[1]),
    };
  }

  if (segments[0] === 'trends') {
    if (segments[1]) {
      return {
        ...ROUTE_DEFAULTS,
        viewMode: 'trend-page',
        trendSlug: decodeURIComponent(segments[1]),
      };
    }
    return {
      ...ROUTE_DEFAULTS,
      viewMode: 'trends',
    };
  }

  return {
    ...ROUTE_DEFAULTS,
    viewMode: 'home',
  };
}
