/** Mini fashion games — quick vote-based play with community results. */

export const FASHION_GAMES = {
  'rate-outfit': {
    id: 'rate-outfit',
    slug: 'rate-outfit',
    type: 'rate',
    title: 'Rate This Outfit',
    subtitle: '1–5 stars · 5 looks',
    description: 'Swipe through five outfits and rate each one — then see how your taste compares to the crowd.',
    accent: '#e65100',
    rounds: 5,
    cta: 'Start rating',
  },
  'choose-style': {
    id: 'choose-style',
    slug: 'choose-style',
    type: 'pick-one',
    title: 'Choose Your Favorite Style',
    subtitle: 'Pick one vibe',
    description: 'Four style lanes — minimal, bold, festive, or classic. One tap, instant community results.',
    accent: '#4527a0',
    cta: 'Pick your style',
  },
  'look-battle': {
    id: 'look-battle',
    slug: 'look-battle',
    type: 'battle',
    title: 'Which Look Wins?',
    subtitle: 'Head-to-head · 5 battles',
    description: 'Two looks enter, one look wins. Vote through five matchups and see the leaderboard.',
    accent: '#c62828',
    rounds: 5,
    cta: 'Enter the arena',
  },
};

export const STYLE_GAME_OPTIONS = [
  {
    id: 'minimal',
    label: 'Minimal Chic',
    hook: 'Clean lines, neutral palette, quiet luxury',
    shopCategory: 'tops',
    accent: '#546e7a',
  },
  {
    id: 'bold',
    label: 'Bold Statement',
    hook: 'Colour pop, drama, and main-character energy',
    shopCategory: 'lehengas',
    accent: '#c62828',
  },
  {
    id: 'festive',
    label: 'Festive Glow',
    hook: 'Rich embroidery, celebration-ready silhouettes',
    shopCategory: 'sarees',
    accent: '#6a1b9a',
  },
  {
    id: 'classic',
    label: 'Classic Elegant',
    hook: 'Timeless ethnic polish — never out of style',
    shopCategory: 'suit sets',
    accent: '#1565c0',
  },
];

export function getAllGames() {
  return Object.values(FASHION_GAMES);
}

export function getGameBySlug(slug) {
  return FASHION_GAMES[slug] || null;
}

export function isValidGameSlug(slug) {
  return Boolean(slug && FASHION_GAMES[slug]);
}

export function getGamesHubPath() {
  return '/games';
}

export function getGamePlayPath(slug) {
  return `/games/${slug}`;
}
