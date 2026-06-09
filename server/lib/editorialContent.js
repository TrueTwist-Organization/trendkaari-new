/**
 * Editorial content store helpers.
 * Reads from store; seeds from static JS data on first run.
 * Content types: celebrity_looks | trend_pages | knowledge_pages | quizzes
 */
import { readStore, updateStore } from './store.js';

const TYPES = ['celebrity_looks', 'trend_pages', 'knowledge_pages', 'quizzes'];

export function getContent(type) {
  const store = readStore();
  return store[type] || [];
}

export async function upsertContentItem(type, item) {
  return updateStore((store) => {
    const list = store[type] || [];
    const idx = list.findIndex((x) => x.id === item.id || x.slug === item.slug);
    if (idx >= 0) list[idx] = { ...list[idx], ...item };
    else list.unshift(item);
    store[type] = list;
    return store;
  });
}

export async function deleteContentItem(type, id) {
  return updateStore((store) => {
    const list = store[type] || [];
    store[type] = list.filter((x) => x.id !== id && x.slug !== id);
    return store;
  });
}

/** Seed a content type from a static array if the store has nothing for it. */
export async function seedContentIfEmpty(type, staticItems) {
  const store = readStore();
  if (!store[type] || store[type].length === 0) {
    await updateStore((s) => {
      s[type] = staticItems;
      return s;
    });
  }
}

/** Replace an entire content list (e.g. reorder homepage blocks). */
export async function setContent(type, items) {
  return updateStore((store) => {
    store[type] = items;
    return store;
  });
}

/** Discovery extras: chapter rail labels, polls, challenges, trending, editor notes. */
export function getDiscoveryConfig() {
  const store = readStore();
  return store.discovery_config || null;
}

export async function setDiscoveryConfig(config) {
  return updateStore((store) => {
    store.discovery_config = config;
    return store;
  });
}

export async function seedDiscoveryConfigIfEmpty(defaults) {
  const store = readStore();
  if (!store.discovery_config) {
    await updateStore((s) => {
      s.discovery_config = defaults;
      return s;
    });
  }
}

/** Homepage shell: trust bar, market map, hero, intros, spotlight, finale. */
export function getHomepageConfig() {
  const store = readStore();
  return store.homepage_config || null;
}

export async function setHomepageConfig(config) {
  return updateStore((store) => {
    store.homepage_config = config;
    return store;
  });
}

export async function seedHomepageConfigIfEmpty(defaults) {
  const store = readStore();
  if (!store.homepage_config) {
    await updateStore((s) => {
      s.homepage_config = defaults;
      return s;
    });
  }
}
