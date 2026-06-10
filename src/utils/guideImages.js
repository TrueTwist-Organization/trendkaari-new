/** Guide & editorial card image helpers — pool lives in pageImageDedupe.js */
import { createPageImageRegistry, GUIDE_IMAGE_POOL } from './pageImageDedupe';

export { GUIDE_IMAGE_POOL };

/**
 * Ensure cards avoid duplicate images within a grid row and (optionally) across a whole page.
 * @param {Array<{ image?: string }>} pages
 * @param {number} columns — grid columns at target breakpoint (default 4)
 * @param {Set<string>} [usedImages] — shared set to dedupe across multiple grids on one page
 */
export function ensureUniqueGuideImages(pages, columns = 4, usedImages = null) {
  if (!pages?.length) return [];

  const globalUsed = usedImages instanceof Set ? usedImages : new Set();
  const assigned = [];
  let poolIdx = 0;

  const nextFromPool = (avoid = new Set()) => {
    for (let i = 0; i < GUIDE_IMAGE_POOL.length; i++) {
      const candidate = GUIDE_IMAGE_POOL[(poolIdx + i) % GUIDE_IMAGE_POOL.length];
      if (!avoid.has(candidate)) {
        poolIdx = (poolIdx + i + 1) % GUIDE_IMAGE_POOL.length;
        return candidate;
      }
    }
    return GUIDE_IMAGE_POOL[poolIdx++ % GUIDE_IMAGE_POOL.length];
  };

  return pages.map((page, index) => {
    const leftNeighbor = index % columns !== 0 ? assigned[index - 1] : null;
    const avoid = new Set(globalUsed);
    if (leftNeighbor) avoid.add(leftNeighbor);

    let image = page.image;
    if (!image || avoid.has(image)) {
      image = nextFromPool(avoid);
    }

    assigned[index] = image;
    globalUsed.add(image);
    return { ...page, image };
  });
}

/** Hub listing cards — always pick unique pool images (ignore CMS duplicates / similar kurtas). */
export function assignHubGuideImages(pages, columns = 4, usedImages = null) {
  return ensureUniqueGuideImages(
    pages.map((page) => ({ ...page, image: '' })),
    columns,
    usedImages,
  );
}

/**
 * Discovery loop cards — replace missing or duplicate thumbnails with pool images.
 * @param {Array<{ image?: string | null }>} items
 * @param {Set<string>} [reservedImages] — images already shown above on the same page
 */
export function ensureUniqueLoopImages(items, reservedImages = null) {
  if (!items?.length) return [];

  const registry = createPageImageRegistry(reservedImages);

  return items.map((item) => {
    const image = registry.reserve(item.image);
    return { ...item, image };
  });
}
