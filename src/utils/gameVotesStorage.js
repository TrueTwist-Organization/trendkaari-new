/** Persist mini-game votes in localStorage — aggregate + per-user history. */

const STORAGE_KEY = 'trendkaari_game_votes_v1';

function emptyStore() {
  return {
    version: 1,
    ratings: {},
    styles: {},
    battles: {},
    user: {},
  };
}

function hashSeed(input) {
  let h = 2166136261;
  const s = String(input);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function loadGameVotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return { ...emptyStore(), ...parsed };
  } catch {
    return emptyStore();
  }
}

export function saveGameVotes(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota */
  }
}

function ensureRatingEntry(store, productId) {
  const key = String(productId);
  if (!store.ratings[key]) {
    store.ratings[key] = { sum: 0, count: 0, stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
  return store.ratings[key];
}

function seedRatingBaseline(productId) {
  const h = hashSeed(`rate-${productId}`);
  const avg = 3.2 + (h % 17) / 10;
  const count = 24 + (h % 180);
  const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (let i = 0; i < count; i += 1) {
    const star = Math.min(5, Math.max(1, Math.round(avg + ((hashSeed(`${productId}-${i}`) % 7) - 3) * 0.35)));
    stars[star] += 1;
  }
  const sum = Object.entries(stars).reduce((acc, [star, n]) => acc + Number(star) * n, 0);
  return { sum, count, stars };
}

function seedStyleBaseline(optionId) {
  const h = hashSeed(`style-${optionId}`);
  return 35 + (h % 220);
}

function seedBattleBaseline(productId) {
  const h = hashSeed(`battle-${productId}`);
  const matches = 18 + (h % 90);
  const wins = Math.round(matches * (0.35 + (h % 30) / 100));
  return { wins, matches };
}

export function recordProductRating(productId, stars) {
  const rating = Math.min(5, Math.max(1, Math.round(Number(stars) || 0)));
  if (!rating) return loadGameVotes();

  const store = loadGameVotes();
  const entry = ensureRatingEntry(store, productId);
  entry.sum += rating;
  entry.count += 1;
  entry.stars[rating] = (entry.stars[rating] || 0) + 1;

  store.user.rateOutfit = store.user.rateOutfit || {};
  store.user.rateOutfit[String(productId)] = {
    stars: rating,
    at: Date.now(),
  };

  saveGameVotes(store);
  return store;
}

export function recordStyleVote(optionId) {
  if (!optionId) return loadGameVotes();
  const store = loadGameVotes();
  store.styles[optionId] = (store.styles[optionId] || 0) + 1;
  store.user.chooseStyle = { optionId, at: Date.now() };
  saveGameVotes(store);
  return store;
}

export function recordBattleVote(winnerId, loserId) {
  if (!winnerId || !loserId) return loadGameVotes();

  const store = loadGameVotes();
  const winKey = String(winnerId);
  const loseKey = String(loserId);

  if (!store.battles[winKey]) store.battles[winKey] = { wins: 0, matches: 0 };
  if (!store.battles[loseKey]) store.battles[loseKey] = { wins: 0, matches: 0 };

  store.battles[winKey].wins += 1;
  store.battles[winKey].matches += 1;
  store.battles[loseKey].matches += 1;

  store.user.lookBattle = store.user.lookBattle || [];
  store.user.lookBattle.push({
    winnerId: winKey,
    loserId: loseKey,
    at: Date.now(),
  });

  saveGameVotes(store);
  return store;
}

export function getProductRatingStats(productId) {
  const store = loadGameVotes();
  const key = String(productId);
  const stored = store.ratings[key];
  const seed = seedRatingBaseline(productId);

  const sum = (stored?.sum || 0) + seed.sum;
  const count = (stored?.count || 0) + seed.count;
  const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (let s = 1; s <= 5; s += 1) {
    stars[s] = (stored?.stars?.[s] || 0) + (seed.stars[s] || 0);
  }

  return {
    average: count ? sum / count : 0,
    count,
    stars,
    userStars: store.user.rateOutfit?.[key] ?? null,
  };
}

export function getStyleVoteStats() {
  const store = loadGameVotes();
  const totals = {};
  let totalVotes = 0;

  for (const option of ['minimal', 'bold', 'festive', 'classic']) {
    const votes = (store.styles[option] || 0) + seedStyleBaseline(option);
    totals[option] = votes;
    totalVotes += votes;
  }

  return {
    totals,
    totalVotes,
    userChoice: store.user.chooseStyle?.optionId ?? null,
    percentages: Object.fromEntries(
      Object.entries(totals).map(([id, votes]) => [
        id,
        totalVotes ? Math.round((votes / totalVotes) * 100) : 0,
      ]),
    ),
  };
}

export function getBattleStats(productIds = []) {
  const store = loadGameVotes();
  const stats = productIds.map((id) => {
    const key = String(id);
    const stored = store.battles[key] || { wins: 0, matches: 0 };
    const seed = seedBattleBaseline(id);
    const wins = stored.wins + seed.wins;
    const matches = stored.matches + seed.matches;
    return {
      productId: id,
      wins,
      matches,
      winRate: matches ? Math.round((wins / matches) * 100) : 0,
    };
  });

  stats.sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);
  return {
    leaderboard: stats,
    userBattles: store.user.lookBattle || [],
  };
}

export function getGameHubStats() {
  const store = loadGameVotes();
  const ratingVotes = Object.values(store.ratings).reduce((sum, r) => sum + (r.count || 0), 0);
  const styleVotes = Object.values(store.styles).reduce((sum, n) => sum + n, 0);
  const battleVotes = Object.values(store.battles).reduce((sum, b) => sum + (b.matches || 0), 0);

  return {
    'rate-outfit': ratingVotes + 480,
    'choose-style': styleVotes + 620,
    'look-battle': Math.round(battleVotes / 2) + 340,
  };
}
