import { CELEBRITY_LOOKS } from '../data/celebrityLooks';

let cachedLooks = null;
let fetchPromise = null;

/** Admin-edited looks from store API, falling back to static catalog. */
export async function fetchCelebrityLooks() {
  if (cachedLooks) return cachedLooks;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/api/store/content?type=celebrity-looks')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const items = Array.isArray(data?.items) ? data.items.filter((item) => item?.id) : [];
      cachedLooks = items.length ? items : CELEBRITY_LOOKS;
      return cachedLooks;
    })
    .catch(() => {
      cachedLooks = CELEBRITY_LOOKS;
      return cachedLooks;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function getCelebrityLookById(looks, id) {
  if (!id || !Array.isArray(looks)) return null;
  const normalized = decodeURIComponent(String(id));
  return looks.find((look) => look.id === normalized) ?? null;
}

export function isValidCelebrityLookId(id, looks = CELEBRITY_LOOKS) {
  return Boolean(getCelebrityLookById(looks, id));
}

export { CELEBRITY_LOOKS };
