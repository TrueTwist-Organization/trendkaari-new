/** Build game rounds from catalog + expose result helpers. */

import { filterProductsByCategory } from './categoryFilter';
import { STYLE_GAME_OPTIONS, getGameBySlug } from '../data/fashionGames';
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

export function buildLookBattles(allProducts, rounds = 5) {
  if (!allProducts?.length) return [];
  const pool = seededShuffle(allProducts, `battle-${weekSeed()}`);
  const battles = [];

  for (let i = 0; i < pool.length - 1 && battles.length < rounds; i += 2) {
    battles.push({
      id: `battle-${battles.length + 1}`,
      left: pool[i],
      right: pool[i + 1],
    });
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

export function buildGameSession(gameSlug, allProducts) {
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
    const battles = buildLookBattles(allProducts, game.rounds);
    return { game, type: 'battle', battles };
  }

  return null;
}

export function formatVoteCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k votes`;
  return `${count} votes`;
}
