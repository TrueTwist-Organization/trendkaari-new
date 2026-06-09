/** Build game rounds from catalog + expose result helpers. */

import { filterProductsByCategory } from './categoryFilter';
import { STYLE_GAME_OPTIONS, getGameBySlug } from '../data/fashionGames';
import { MIN_RAIL_PRODUCTS } from './recommendationEngine';
import {
  getBattleStats,
  getProductRatingStats,
  getStyleVoteStats,
} from './gameVotesStorage';

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

function weekSeed() {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

export function buildRateOutfitRounds(allProducts, rounds = 5) {
  if (!allProducts?.length) return [];
  const pool = seededShuffle(
    [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    `rate-outfit-${weekSeed()}`,
  );
  return pool.slice(0, rounds).map((product, index) => ({
    id: `rate-${product.id}-${index}`,
    product,
    stats: getProductRatingStats(product.id),
  }));
}

export function buildStyleGameOptions(allProducts) {
  return STYLE_GAME_OPTIONS.map((option) => {
    const inCategory = filterProductsByCategory(allProducts, option.shopCategory);
    const pool = inCategory.length ? inCategory : allProducts;
    const picks = seededShuffle(pool, `style-${option.id}-${weekSeed()}`).slice(0, 3);
    const stats = getStyleVoteStats();

    return {
      ...option,
      image: picks[0]?.image || '/kurtas/Kurtas/1/040A2925_700x.webp',
      products: picks,
      votes: stats.totals[option.id] || 0,
      percent: stats.percentages[option.id] || 0,
    };
  });
}

export function filterProductsByGender(products, gender = 'women') {
  const g = String(gender || 'women').toLowerCase();
  return (products || []).filter((p) => {
    const cat = (p.category || '').toLowerCase();
    if (g === 'men') return cat === 'men' || cat === 'gents';
    return cat === 'women';
  });
}

/** Pair looks within the same gender; prefer same sub-category matchups. */
export function buildLookBattles(allProducts, rounds = 5, { gender = 'women' } = {}) {
  const pool = filterProductsByGender(allProducts, gender);
  if (pool.length < 2) return [];

  const seed = `battle-${gender}-${weekSeed()}`;
  const battles = [];
  const used = new Set();

  const bySubCategory = pool.reduce((acc, product) => {
    const key = (product.subCategory || 'other').toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {});

  for (const key of seededShuffle(Object.keys(bySubCategory), seed)) {
    const items = seededShuffle(bySubCategory[key], `${seed}-${key}`);
    for (let i = 0; i < items.length - 1 && battles.length < rounds; i += 2) {
      const left = items[i];
      const right = items[i + 1];
      if (used.has(left.id) || used.has(right.id)) continue;
      used.add(left.id);
      used.add(right.id);
      battles.push({
        id: `battle-${battles.length + 1}`,
        left,
        right,
      });
    }
  }

  if (battles.length < rounds) {
    const remaining = seededShuffle(
      pool.filter((p) => !used.has(p.id)),
      `${seed}-fill`,
    );
    for (let i = 0; i < remaining.length - 1 && battles.length < rounds; i += 2) {
      battles.push({
        id: `battle-${battles.length + 1}`,
        left: remaining[i],
        right: remaining[i + 1],
      });
    }
  }

  return battles;
}

export function getRateOutfitResults(productIds) {
  return productIds.map((id) => ({
    productId: id,
    stats: getProductRatingStats(id),
  })).sort((a, b) => b.stats.average - a.stats.average);
}

export function getChooseStyleResults() {
  const stats = getStyleVoteStats();
  return STYLE_GAME_OPTIONS.map((option) => ({
    ...option,
    votes: stats.totals[option.id] || 0,
    percent: stats.percentages[option.id] || 0,
    isUserChoice: stats.userChoice === option.id,
  })).sort((a, b) => b.percent - a.percent);
}

export function getLookBattleResults(productIds) {
  return getBattleStats(productIds);
}

export function buildGameSession(gameSlug, allProducts, options = {}) {
  const game = getGameBySlug(gameSlug);
  if (!game || !allProducts?.length) return null;

  if (game.type === 'rate') {
    const rounds = buildRateOutfitRounds(allProducts, game.rounds);
    return { game, type: 'rate', rounds };
  }

  if (game.type === 'pick-one') {
    return { game, type: 'pick-one', options: buildStyleGameOptions(allProducts) };
  }

  if (game.type === 'battle') {
    const gender = options.gender || 'women';
    const battles = buildLookBattles(allProducts, game.rounds, { gender });
    return { game, type: 'battle', battles, gender };
  }

  return null;
}

export function formatVoteCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k votes`;
  return `${count} votes`;
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

function backfillRail(allProducts, picked, limit, exclude, seed) {
  if (picked.length >= MIN_RAIL_PRODUCTS) return picked.slice(0, limit);
  const out = [...picked];
  for (const p of seededShuffle(allProducts, seed)) {
    if (exclude.has(p.id) || out.some((x) => x.id === p.id)) continue;
    out.push(p);
    exclude.add(p.id);
    if (out.length >= Math.max(MIN_RAIL_PRODUCTS, limit)) break;
  }
  return out.slice(0, limit);
}

function pickLaneProducts(allProducts, option, limit, exclude) {
  const pool = filterProductsByCategory(allProducts, option.shopCategory);
  const source = pool.length ? pool : allProducts;
  const ranked = seededShuffle(source, `game-hub-${option.id}-${weekSeed()}`);
  const picked = takeUnique(ranked, limit, exclude);
  return backfillRail(allProducts, picked, limit, exclude, `game-hub-fill-${option.id}`);
}

/** Product rails mapped to the four style lanes used in Choose Your Style. */
export function buildGameHubDiscoveryRails(allProducts, productsPerRail = 8) {
  if (!allProducts?.length) return null;

  const lanes = STYLE_GAME_OPTIONS;
  const exclude = new Set();

  const minimal = lanes.find((l) => l.id === 'minimal') || lanes[0];
  const bold = lanes.find((l) => l.id === 'bold') || lanes[1];
  const festive = lanes.find((l) => l.id === 'festive') || lanes[2];

  return {
    similarProducts: {
      id: 'game-minimal-lane',
      title: `${minimal.label} picks`,
      hook: minimal.hook,
      tone: 'related',
      products: pickLaneProducts(allProducts, minimal, productsPerRail, exclude),
      category: minimal.shopCategory,
    },
    similarStyles: {
      id: 'game-bold-lane',
      title: `${bold.label} picks`,
      hook: bold.hook,
      tone: 'similar',
      products: pickLaneProducts(allProducts, bold, productsPerRail, exclude),
      category: bold.shopCategory,
    },
    trendingProducts: {
      id: 'game-festive-lane',
      title: `${festive.label} picks`,
      hook: festive.hook,
      tone: 'hot',
      products: pickLaneProducts(allProducts, festive, productsPerRail, exclude),
      category: festive.shopCategory,
    },
  };
}
