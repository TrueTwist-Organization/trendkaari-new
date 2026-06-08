const STORAGE_KEY = 'trendkaari_view_history_v1';
const MAX_VIEWS = 40;
const MAX_CATEGORIES = 20;

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { views: [], categories: [] };
    const parsed = JSON.parse(raw);
    return {
      views: Array.isArray(parsed.views) ? parsed.views : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    };
  } catch {
    return { views: [], categories: [] };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota or private mode */
  }
}

export function recordProductView(product) {
  if (!product?.id) return;
  const store = readStore();
  const entry = {
    id: product.id,
    category: product.category || '',
    subCategory: product.subCategory || '',
    title: product.title || '',
    ts: Date.now(),
  };
  const views = [entry, ...store.views.filter((v) => v.id !== product.id)].slice(0, MAX_VIEWS);
  writeStore({ ...store, views });
}

export function recordCategoryBrowse(category) {
  const cat = String(category || '').trim().toLowerCase();
  if (!cat || cat === 'all') return;
  const store = readStore();
  const entry = { category: cat, ts: Date.now() };
  const categories = [
    entry,
    ...store.categories.filter((c) => c.category !== cat),
  ].slice(0, MAX_CATEGORIES);
  writeStore({ ...store, categories });
}

export function getViewHistory() {
  return readStore();
}

export function getRecentlyViewedIds(limit = 12) {
  return readStore()
    .views.slice(0, limit)
    .map((v) => v.id);
}

export function getRecentViewCategories(limit = 5) {
  const seen = new Set();
  const out = [];
  for (const v of readStore().views) {
    const cat = (v.category || v.subCategory || '').toLowerCase();
    if (!cat || seen.has(cat)) continue;
    seen.add(cat);
    out.push(cat);
    if (out.length >= limit) break;
  }
  for (const c of readStore().categories) {
    if (out.length >= limit) break;
    if (!seen.has(c.category)) {
      seen.add(c.category);
      out.push(c.category);
    }
  }
  return out;
}

export function getLastViewedProduct() {
  return readStore().views[0] || null;
}
