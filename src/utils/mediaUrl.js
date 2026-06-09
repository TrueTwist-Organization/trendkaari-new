/**
 * Admin uploads are stored on the API host under /product-media/ and /combos/.
 * Resolve those paths to a URL the browser can load in dev, preview, and production.
 */

const API_BASE = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const API_MEDIA_PREFIXES = ['/product-media/', '/combos/'];

function isLocalDevHost() {
  if (typeof window === 'undefined') return false;
  return /localhost|127\.0\.0\.1/.test(window.location.hostname);
}

function isApiHostedMediaPath(url) {
  return API_MEDIA_PREFIXES.some((prefix) => url.startsWith(prefix));
}

export function getMediaOrigin() {
  if (API_BASE) return API_BASE;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Turn /product-media/… into a fetchable URL (API host in prod, relative on local Vite). */
export function resolveMediaUrl(src) {
  const url = String(src || '').trim();
  if (!url || /^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  if (!url.startsWith('/') || !isApiHostedMediaPath(url)) return url;

  if (isLocalDevHost()) {
    return url;
  }

  const origin = getMediaOrigin();
  return origin ? `${origin}${url}` : url;
}

export function resolveMediaUrls(urls = []) {
  return urls.map(resolveMediaUrl).filter(Boolean);
}
