import { getProductImageCandidates, getProductPrimaryImage } from './productImages';

/** Pool of distinct card images — interleaved by category for visual variety. */
export const GUIDE_IMAGE_POOL = [
  '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
  '/tops/4/1.webp',
  '/sarees/Sarees/1/0T3A5495_700x.webp',
  '/lehengas/Lehengas/1/040A3523_700x.webp',
  '/co-ords/co-ord_set/9/3.webp',
  '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
  '/tops/7/1.webp',
  '/sarees/Sarees/9/L12.01.25_3441_700x.webp',
  '/lehengas/Lehengas/9/040A1707_700x.webp',
  '/co-ords/co-ord_set/7/4.webp',
  '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp',
  '/tops/9/2.webp',
  '/kurtas/Kurtas/1/LBL101KS612_3_202083ca-68f1-4ac5-8bf1-9932a8f97562_700x.webp',
  '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp',
];

/**
 * Tracks image URLs already shown on a page and assigns unique fallbacks when needed.
 */
export function createPageImageRegistry(initialUsed = null) {
  const used = initialUsed instanceof Set ? initialUsed : new Set();
  let poolIdx = 0;

  const nextFromPool = (avoid = used) => {
    for (let i = 0; i < GUIDE_IMAGE_POOL.length; i += 1) {
      const candidate = GUIDE_IMAGE_POOL[(poolIdx + i) % GUIDE_IMAGE_POOL.length];
      if (!avoid.has(candidate)) {
        poolIdx = (poolIdx + i + 1) % GUIDE_IMAGE_POOL.length;
        return candidate;
      }
    }
    const fallback = GUIDE_IMAGE_POOL[poolIdx % GUIDE_IMAGE_POOL.length];
    poolIdx += 1;
    return fallback;
  };

  const reserve = (preferred, extraCandidates = []) => {
    const candidates = [preferred, ...extraCandidates]
      .map((value) => String(value || '').trim())
      .filter(Boolean);

    for (const url of candidates) {
      if (!used.has(url)) {
        used.add(url);
        return url;
      }
    }

    const fallback = nextFromPool();
    used.add(fallback);
    return fallback;
  };

  const assignProductImage = (product) => {
    if (!product) return product;
    const image = reserve(null, getProductImageCandidates(product));
    return { ...product, image };
  };

  const assignProducts = (products) => (products || []).map(assignProductImage);

  const assignItemImage = (item, imageKey = 'image') => {
    if (!item) return item;
    const image = reserve(item[imageKey]);
    return { ...item, [imageKey]: image };
  };

  const assignItemsWithImage = (items, imageKey = 'image') =>
    (items || []).map((item) => assignItemImage(item, imageKey));

  return {
    used,
    reserve,
    assignProductImage,
    assignProducts,
    assignItemImage,
    assignItemsWithImage,
    nextFromPool,
  };
}

/** Seed registry with primary images already visible on the page (e.g. product grid). */
export function seedRegistryFromProducts(products, registry = null) {
  const reg = registry || createPageImageRegistry();
  for (const product of products || []) {
    const primary = getProductPrimaryImage(product);
    if (primary) reg.used.add(primary);
  }
  return reg;
}

export function dedupeDiscoveryRail(rail, registry) {
  if (!rail?.products?.length) return rail;
  return { ...rail, products: registry.assignProducts(rail.products) };
}

export function dedupeDiscoveryRails(rails, reservedImages = null) {
  const registry = createPageImageRegistry(reservedImages);
  return {
    rails: (rails || []).map((rail) => dedupeDiscoveryRail(rail, registry)),
    usedImages: registry.used,
  };
}

/** Endless discovery payload — product rails + reading cards. */
export function dedupeEndlessDiscovery(discovery, reservedImages = null) {
  if (!discovery) return { discovery: null, usedImages: reservedImages || new Set() };

  const registry = createPageImageRegistry(reservedImages);

  const next = {
    ...discovery,
    similarProducts: dedupeDiscoveryRail(discovery.similarProducts, registry),
    similarStyles: dedupeDiscoveryRail(discovery.similarStyles, registry),
    trendingProducts: dedupeDiscoveryRail(discovery.trendingProducts, registry),
    relatedReading: registry.assignItemsWithImage(discovery.relatedReading || []),
  };

  return { discovery: next, usedImages: registry.used };
}
