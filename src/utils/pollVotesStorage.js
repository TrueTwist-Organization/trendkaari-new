const STORAGE_KEY = 'trendkaari_poll_votes_v1';

function emptyStore() {
  return { polls: {} };
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

export function loadPollVotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return { ...emptyStore(), ...JSON.parse(raw) };
  } catch {
    return emptyStore();
  }
}

function savePollVotes(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
}

function seedPollCounts(pollId, optionIds) {
  const h = hashSeed(pollId);
  const counts = {};
  let total = 0;
  optionIds.forEach((id, i) => {
    const n = 40 + ((h + i * 97) % 120);
    counts[id] = n;
    total += n;
  });
  return { counts, total, userVote: null };
}

export function getPollResults(pollId, optionIds) {
  const store = loadPollVotes();
  if (!store.polls[pollId]) {
    store.polls[pollId] = seedPollCounts(pollId, optionIds);
    savePollVotes(store);
  }
  return store.polls[pollId];
}

export function castPollVote(pollId, optionId, optionIds) {
  const store = loadPollVotes();
  if (!store.polls[pollId]) {
    store.polls[pollId] = seedPollCounts(pollId, optionIds);
  }
  const poll = store.polls[pollId];
  if (poll.userVote === optionId) return poll;
  if (poll.userVote && poll.counts[poll.userVote]) {
    poll.counts[poll.userVote] = Math.max(0, poll.counts[poll.userVote] - 1);
    poll.total = Math.max(0, poll.total - 1);
  }
  poll.counts[optionId] = (poll.counts[optionId] || 0) + 1;
  poll.total = (poll.total || 0) + 1;
  poll.userVote = optionId;
  savePollVotes(store);
  return poll;
}
