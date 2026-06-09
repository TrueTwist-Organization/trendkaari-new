/** Pool of distinct guide card images — used to avoid duplicates side-by-side. */

export const GUIDE_IMAGE_POOL = [
  '/kurtas/Kurtas/9/DishaParmarVaidya_2_700x.webp',
  '/kurtas/Kurtas/1/LBL101KS612_1_700x.webp',
  '/kurtas/Kurtas/9/LBL101KS620_1_700x.webp',
  '/kurtas/Kurtas/1/LBL101KS612_3_202083ca-68f1-4ac5-8bf1-9932a8f97562_700x.webp',
  '/tops/4/1.webp',
  '/tops/7/1.webp',
  '/tops/9/2.webp',
  '/sarees/Sarees/1/0T3A5495_700x.webp',
  '/sarees/Sarees/9/L12.01.25_3441_700x.webp',
  '/co-ords/co-ord_set/9/3.webp',
  '/co-ords/co-ord_set/7/4.webp',
  '/lehengas/Lehengas/9/040A1707_700x.webp',
  '/lehengas/Lehengas/1/040A3523_700x.webp',
  '/suit-sets/Suit Sets/9/L12.01.25_1930_700x.webp',
];

/**
 * Ensure no two adjacent cards in the same grid row share the same image.
 * @param {Array<{ image?: string }>} pages
 * @param {number} columns — grid columns at target breakpoint (default 4)
 */
export function ensureUniqueGuideImages(pages, columns = 4) {
  if (!pages?.length) return [];

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
    let image = page.image || nextFromPool(new Set(assigned));

    const leftNeighbor = index % columns !== 0 ? assigned[index - 1] : null;
    if (leftNeighbor && image === leftNeighbor) {
      image = nextFromPool(new Set([leftNeighbor]));
    }

    assigned[index] = image;
    return { ...page, image };
  });
}
