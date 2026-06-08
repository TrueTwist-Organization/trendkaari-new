/** Viral Fashion Hub — auto-refreshes weekly from live catalog signals. */

import { CELEBRITY_LOOKS } from '../data/celebrityLooks';
import { filterProductsByCategory } from './categoryFilter';
import {
  formatViewCount,
  getEditorsPicks,
  getViralFashion,
} from './discoveryEngine';

function hashSeed(input) {
  let h = 2166136261;
  const s = String(input);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle(list, seed) {
  const arr = [...list];
  let s = hashSeed(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function takeUnique(products, limit, exclude = new Set()) {
  const out = [];
  for (const p of products) {
    if (exclude.has(p.id)) continue;
    out.push(p);
    exclude.add(p.id);
    if (out.length >= limit) break;
  }
  return out;
}

function titleIncludes(product, ...terms) {
  const t = (product.title || '').toLowerCase();
  return terms.some((term) => t.includes(term));
}

function syntheticViewScore(product) {
  const rating = product.rating || 4;
  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  return Math.round(rating * 2400 + discount * 45 + ((product.id || 0) % 900));
}

function syntheticSalesScore(product) {
  const rating = product.rating || 4;
  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
  const valueBoost = (product.price || 0) <= 999 ? 120 : 40;
  return Math.round(rating * 620 + discount * 12 + valueBoost + ((product.id || 0) % 480));
}

export function getViralWeekSeed(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function getViralHubRefreshLabel(date = new Date()) {
  const seed = getViralWeekSeed(date);
  const [, week] = seed.split('-W');
  return `Week ${Number(week)} · auto-refreshes every Monday`;
}

function formatInstagramSaves(product, weekSeed) {
  const base = ((product.id || 0) * 19 + hashSeed(`${weekSeed}-ig-${product.id}`)) % 5200 + 900;
  if (base >= 1000) return `${(base / 1000).toFixed(1)}k saves`;
  return `${base} saves`;
}

function formatUnitsSold(product, rank) {
  const base = syntheticSalesScore(product);
  const sold = Math.round(base * (1.1 - rank * 0.04));
  if (sold >= 1000) return `${(sold / 1000).toFixed(1)}k sold`;
  return `${sold}+ sold`;
}

export function getMostViralThisWeek(products, limit = 14, exclude = new Set(), weekSeed) {
  const seed = weekSeed || getViralWeekSeed();
  const pool = getViralFashion(products, Math.max(limit * 3, 40), exclude);
  const ranked = seededShuffle(pool, `viral-week-${seed}`)
    .sort((a, b) => syntheticViewScore(b) - syntheticViewScore(a));

  return takeUnique(ranked, limit, exclude).map((product, index) => ({
    ...product,
    viralRank: index + 1,
    viralLabel: index === 0 ? '#1 this week' : index < 3 ? `#${index + 1} this week` : 'Going viral',
    viewLabel: formatViewCount(syntheticViewScore(product)),
  }));
}

export function getInstagramTrending(products, limit = 14, exclude = new Set(), weekSeed) {
  const seed = weekSeed || getViralWeekSeed();
  const pool = products.filter((p) => {
    const cat = (p.subCategory || p.category || '').toLowerCase();
    return (
      ['lehengas', 'sarees', 'co-ords', 'suit sets', 'tops', 'kurtas'].includes(cat) ||
      titleIncludes(p, 'emerald', 'red', 'pink', 'gold', 'sequin', 'embellish', 'print', 'floral', 'pastel')
    );
  });

  const shuffled = seededShuffle(pool.length >= limit ? pool : products, `instagram-${seed}`);
  return takeUnique(shuffled, limit, exclude).map((product) => ({
    ...product,
    instagramLabel: formatInstagramSaves(product, seed),
  }));
}

export function getCelebrityInspiredSection(allProducts, weekSeed) {
  const seed = weekSeed || getViralWeekSeed();
  const order = seededShuffle(CELEBRITY_LOOKS, `celebrity-${seed}`);

  return order.map((look) => {
    const inCategory = filterProductsByCategory(allProducts, look.category);
    const picks = seededShuffle(
      inCategory.length >= 3 ? inCategory : allProducts,
      `${seed}-${look.id}`,
    ).slice(0, 3);

    return {
      ...look,
      products: picks,
    };
  });
}

export function getBestSellerRankings(products, limit = 14, exclude = new Set(), weekSeed) {
  const seed = weekSeed || getViralWeekSeed();
  const ranked = [...products]
    .sort((a, b) => syntheticSalesScore(b) - syntheticSalesScore(a));
  const rotated = seededShuffle(ranked.slice(0, limit * 3), `bestseller-${seed}`).sort(
    (a, b) => syntheticSalesScore(b) - syntheticSalesScore(a),
  );

  return takeUnique(rotated, limit, exclude).map((product, index) => ({
    ...product,
    salesRank: index + 1,
    salesLabel: formatUnitsSold(product, index),
  }));
}

export function getTopRatedProducts(products, limit = 14, exclude = new Set()) {
  const rated = products.filter((p) => (p.rating || 0) >= 3.8);
  const sorted = [...(rated.length >= limit ? rated : products)].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0) || syntheticViewScore(b) - syntheticViewScore(a),
  );

  return takeUnique(sorted, limit, exclude).map((product) => ({
    ...product,
    ratingLabel: `${(product.rating || 4).toFixed(1)}★ rated`,
  }));
}

export function getFashionUnderPrice(products, maxPrice, limit = 14, exclude = new Set(), weekSeed) {
  const seed = weekSeed || getViralWeekSeed();
  const pool = products.filter((p) => (p.price || 0) > 0 && (p.price || 0) <= maxPrice);
  const sorted = seededShuffle(
    pool.sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    `under-${maxPrice}-${seed}`,
  );

  return takeUnique(sorted.length ? sorted : products, limit, exclude);
}

export function buildViralFashionHub(products, date = new Date()) {
  if (!products?.length) return null;

  const weekSeed = getViralWeekSeed(date);
  const exclude = new Set();
  const take = (fn, limit = 14) => {
    const items = fn(products, limit, exclude, weekSeed);
    items.forEach((p) => exclude.add(p.id));
    return items;
  };

  const sections = [
    {
      id: 'most-viral-week',
      type: 'product-rail',
      title: 'Most Viral This Week',
      hook: 'The 14 looks breaking feeds right now — rankings reset every Monday',
      cta: 'See what’s blowing up',
      category: 'lehengas',
      tone: 'viral-hot',
      badgeKey: 'viralLabel',
      showViews: true,
      products: take(getMostViralThisWeek),
    },
    {
      id: 'instagram-trending',
      type: 'product-rail',
      title: 'Trending On Instagram',
      hook: 'Screenshot-worthy fits your explore page is already stealing',
      cta: 'Open the IG edit',
      category: 'co-ords',
      tone: 'instagram',
      badgeKey: 'instagramLabel',
      products: take(getInstagramTrending),
    },
    {
      id: 'celebrity-inspired',
      type: 'celebrity',
      title: 'Celebrity Inspired Looks',
      hook: 'Red carpet energy, everyday prices — tap a star look, shop your version',
      cta: 'Browse all inspired edits',
      category: 'lehengas',
      tone: 'celebrity',
      looks: getCelebrityInspiredSection(products, weekSeed),
    },
    {
      id: 'best-sellers',
      type: 'ranked-rail',
      title: 'Best Seller Rankings',
      hook: 'The chart toppers nobody stops reordering — see who’s #1',
      cta: 'View full chart',
      category: 'kurtas',
      tone: 'bestseller',
      badgeKey: 'salesLabel',
      rankKey: 'salesRank',
      products: take(getBestSellerRankings),
    },
    {
      id: 'top-rated',
      type: 'product-rail',
      title: 'Top Rated Products',
      hook: '4★ and above — see why shoppers won’t scroll past these',
      cta: 'Shop highest rated',
      category: 'sarees',
      tone: 'rated',
      badgeKey: 'ratingLabel',
      products: take(getTopRatedProducts),
    },
    {
      id: 'under-499',
      type: 'product-rail',
      title: 'Fashion Under ₹499',
      hook: 'Full outfits under a coffee budget — yes, really. Tap before they vanish',
      cta: 'Grab steals under ₹499',
      category: 'tops',
      tone: 'budget-499',
      priceCap: 499,
      products: take((list, limit, ex, seed) => getFashionUnderPrice(list, 499, limit, ex, seed)),
    },
    {
      id: 'under-999',
      type: 'product-rail',
      title: 'Fashion Under ₹999',
      hook: 'Looks triple the price — the sweet spot edit everyone bookmarks',
      cta: 'Explore under ₹999',
      category: 'kurtas',
      tone: 'budget-999',
      priceCap: 999,
      products: take((list, limit, ex, seed) => getFashionUnderPrice(list, 999, limit, ex, seed)),
    },
  ];

  const fillerPool = getEditorsPicks(products, 20, new Set());
  for (const section of sections) {
    if (section.type === 'celebrity') continue;
    if (section.products.length >= 4) continue;
    const needed = 4 - section.products.length;
    const extra = fillerPool.filter((p) => !exclude.has(p.id)).slice(0, needed);
    extra.forEach((p) => exclude.add(p.id));
    section.products = [...section.products, ...extra];
  }

  return {
    weekSeed,
    refreshLabel: getViralHubRefreshLabel(date),
    sections: sections.filter((s) => s.type === 'celebrity' || s.products?.length >= 4),
  };
}

export function countViralHubClicks(hub) {
  if (!hub?.sections?.length) return 0;
  return hub.sections.reduce((sum, section) => {
    if (section.type === 'celebrity') {
      return sum + (section.looks?.length || 0) * 4;
    }
    return sum + (section.products?.length || 0);
  }, 0);
}
