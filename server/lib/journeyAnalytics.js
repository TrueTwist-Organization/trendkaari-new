import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data/journey-analytics.json');

const EMPTY = {
  sessions: [],
  pageStats: {},
  pathEdges: {},
  totalEvents: 0,
  updatedAt: null,
};

const SCROLL_KEYS = [25, 50, 75, 100];
const HEATMAP_COLS = 10;
const HEATMAP_ROWS = 10;

function heatmapCell(xPct, yPct) {
  const col = Math.min(HEATMAP_COLS - 1, Math.max(0, Math.floor((xPct / 100) * HEATMAP_COLS)));
  const row = Math.min(HEATMAP_ROWS - 1, Math.max(0, Math.floor((yPct / 100) * HEATMAP_ROWS)));
  return `${col},${row}`;
}

function readFile() {
  try {
    if (!fs.existsSync(DATA_PATH)) return { ...EMPTY };
    const parsed = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      pageStats: parsed.pageStats && typeof parsed.pageStats === 'object' ? parsed.pageStats : {},
      pathEdges: parsed.pathEdges && typeof parsed.pathEdges === 'object' ? parsed.pathEdges : {},
      totalEvents: Number(parsed.totalEvents) || 0,
      updatedAt: parsed.updatedAt || null,
    };
  } catch {
    return { ...EMPTY };
  }
}

function writeFile(data) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    DATA_PATH,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
    'utf8',
  );
}

function ensurePage(store, page) {
  if (!store.pageStats[page]) {
    store.pageStats[page] = {
      views: 0,
      scroll: { 25: 0, 50: 0, 75: 0, 100: 0 },
      totalDurationMs: 0,
      clicks: 0,
      heatmap: {},
    };
  }
  return store.pageStats[page];
}

function upsertSession(store, event) {
  const idx = store.sessions.findIndex((s) => s.id === event.sessionId);
  const snapshot = {
    id: event.sessionId,
    startedAt: event.startedAt || Date.now(),
    pageCount: event.pageCount || 1,
    lastPage: event.page,
    updatedAt: Date.now(),
  };
  if (idx >= 0) {
    store.sessions[idx] = { ...store.sessions[idx], ...snapshot };
  } else {
    store.sessions.unshift(snapshot);
  }
  store.sessions = store.sessions.slice(0, 500);
}

export function ingestJourneyEvents(events = []) {
  if (!events.length) return readFile();

  const store = readFile();
  let pageCountBySession = {};

  for (const event of events) {
    if (!event?.type || !event.sessionId) continue;
    store.totalEvents += 1;

    const page = String(event.page || '/');

    if (event.type === 'page_view') {
      pageCountBySession[event.sessionId] = (pageCountBySession[event.sessionId] || 0) + 1;
      upsertSession(store, {
        ...event,
        pageCount: pageCountBySession[event.sessionId],
      });

      if (event.fromPage && event.page) {
        const edge = `${event.fromPage} → ${event.page}`;
        store.pathEdges[edge] = (store.pathEdges[edge] || 0) + 1;
      }

      ensurePage(store, page).views += 1;
    }

    if (event.type === 'scroll') {
      const depth = Number(event.depth);
      if (SCROLL_KEYS.includes(depth)) {
        ensurePage(store, page).scroll[depth] += 1;
      }
    }

    if (event.type === 'click') {
      const stats = ensurePage(store, page);
      stats.clicks += 1;
      if (Number.isFinite(event.xPct) && Number.isFinite(event.yPct)) {
        const cell = heatmapCell(event.xPct, event.yPct);
        stats.heatmap[cell] = (stats.heatmap[cell] || 0) + 1;
      }
    }

    if (event.type === 'page_exit') {
      const durationMs = Number(event.durationMs) || 0;
      if (durationMs > 0) {
        ensurePage(store, page).totalDurationMs += durationMs;
      }
    }
  }

  writeFile(store);
  return store;
}

export function readJourneyAggregate() {
  return readFile();
}
