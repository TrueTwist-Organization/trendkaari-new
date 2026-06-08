const SESSION_KEY = 'trendkaari_journey_session_v1';
const QUEUE_KEY = 'trendkaari_journey_queue_v1';
const LOCAL_AGG_KEY = 'trendkaari_journey_local_agg_v1';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_QUEUE = 120;
const SCROLL_MILESTONES = [25, 50, 75, 100];
const HEATMAP_COLS = 10;
const HEATMAP_ROWS = 10;

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `j_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function readQueue() {
  return safeParse(sessionStorage.getItem(QUEUE_KEY) || localStorage.getItem(QUEUE_KEY), []);
}

function writeQueue(events) {
  const trimmed = events.slice(-MAX_QUEUE);
  try {
    sessionStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
  } catch {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
    } catch {
      /* quota */
    }
  }
}

function readSession() {
  const stored = safeParse(sessionStorage.getItem(SESSION_KEY), null);
  if (!stored?.id) return null;
  if (Date.now() - (stored.lastActive || stored.startedAt) > SESSION_TIMEOUT_MS) return null;
  return stored;
}

function writeSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* private mode */
  }
}

export function getOrCreateSession() {
  const existing = readSession();
  if (existing) return existing;
  const session = {
    id: uid(),
    startedAt: Date.now(),
    lastActive: Date.now(),
    pageCount: 0,
    pages: [],
    lastPage: null,
  };
  writeSession(session);
  return session;
}

export function touchSession() {
  const session = getOrCreateSession();
  session.lastActive = Date.now();
  writeSession(session);
  return session;
}

function enqueue(event) {
  const queue = readQueue();
  queue.push({ ...event, ts: event.ts || Date.now() });
  writeQueue(queue);
  mergeLocalAggregate(event);
}

function heatmapCell(xPct, yPct) {
  const col = Math.min(HEATMAP_COLS - 1, Math.max(0, Math.floor((xPct / 100) * HEATMAP_COLS)));
  const row = Math.min(HEATMAP_ROWS - 1, Math.max(0, Math.floor((yPct / 100) * HEATMAP_ROWS)));
  return `${col},${row}`;
}

function mergeLocalAggregate(event) {
  try {
    const agg = safeParse(localStorage.getItem(LOCAL_AGG_KEY), {
      sessions: [],
      pageStats: {},
      pathEdges: {},
      totalEvents: 0,
    });

    agg.totalEvents += 1;

    if (event.type === 'page_view') {
      const session = readSession();
      if (session) {
        const idx = agg.sessions.findIndex((s) => s.id === session.id);
        const snapshot = {
          id: session.id,
          startedAt: session.startedAt,
          pageCount: session.pageCount,
          lastPage: event.page,
          updatedAt: Date.now(),
        };
        if (idx >= 0) agg.sessions[idx] = snapshot;
        else agg.sessions.unshift(snapshot);
        agg.sessions = agg.sessions.slice(0, 200);
      }

      if (event.fromPage && event.page) {
        const edge = `${event.fromPage} → ${event.page}`;
        agg.pathEdges[edge] = (agg.pathEdges[edge] || 0) + 1;
      }

      const page = event.page || '/';
      if (!agg.pageStats[page]) {
        agg.pageStats[page] = {
          views: 0,
          scroll: { 25: 0, 50: 0, 75: 0, 100: 0 },
          totalDurationMs: 0,
          clicks: 0,
          heatmap: {},
        };
      }
      agg.pageStats[page].views += 1;
    }

    if (event.type === 'scroll') {
      const page = event.page || '/';
      if (!agg.pageStats[page]) {
        agg.pageStats[page] = {
          views: 0,
          scroll: { 25: 0, 50: 0, 75: 0, 100: 0 },
          totalDurationMs: 0,
          clicks: 0,
          heatmap: {},
        };
      }
      const pct = Number(event.depth);
      if (SCROLL_MILESTONES.includes(pct)) {
        agg.pageStats[page].scroll[pct] = (agg.pageStats[page].scroll[pct] || 0) + 1;
      }
    }

    if (event.type === 'click') {
      const page = event.page || '/';
      if (!agg.pageStats[page]) {
        agg.pageStats[page] = {
          views: 0,
          scroll: { 25: 0, 50: 0, 75: 0, 100: 0 },
          totalDurationMs: 0,
          clicks: 0,
          heatmap: {},
        };
      }
      agg.pageStats[page].clicks += 1;
      if (Number.isFinite(event.xPct) && Number.isFinite(event.yPct)) {
        const cell = heatmapCell(event.xPct, event.yPct);
        agg.pageStats[page].heatmap[cell] = (agg.pageStats[page].heatmap[cell] || 0) + 1;
      }
    }

    if (event.type === 'page_exit' && event.durationMs > 0) {
      const page = event.page || '/';
      if (!agg.pageStats[page]) {
        agg.pageStats[page] = {
          views: 0,
          scroll: { 25: 0, 50: 0, 75: 0, 100: 0 },
          totalDurationMs: 0,
          clicks: 0,
          heatmap: {},
        };
      }
      agg.pageStats[page].totalDurationMs += event.durationMs;
    }

    localStorage.setItem(LOCAL_AGG_KEY, JSON.stringify(agg));
  } catch {
    /* quota */
  }
}

export function getLocalJourneyAggregate() {
  return safeParse(localStorage.getItem(LOCAL_AGG_KEY), {
    sessions: [],
    pageStats: {},
    pathEdges: {},
    totalEvents: 0,
  });
}

export function trackPageView({ page, viewMode, label, fromPage }) {
  const session = touchSession();
  session.pageCount += 1;
  session.pages.push({ page, viewMode, ts: Date.now() });
  session.pages = session.pages.slice(-40);

  enqueue({
    type: 'page_view',
    sessionId: session.id,
    page,
    viewMode,
    label,
    fromPage: fromPage || session.lastPage,
  });

  session.lastPage = page;
  writeSession(session);
}

export function trackPageExit({ page, viewMode, durationMs, maxScrollDepth }) {
  enqueue({
    type: 'page_exit',
    sessionId: getOrCreateSession().id,
    page,
    viewMode,
    durationMs: Math.round(durationMs),
    maxScrollDepth,
  });
}

export function trackScrollDepth({ page, viewMode, depth }) {
  enqueue({
    type: 'scroll',
    sessionId: getOrCreateSession().id,
    page,
    viewMode,
    depth,
  });
}

export function trackClick({ page, viewMode, xPct, yPct, label, tag, href }) {
  enqueue({
    type: 'click',
    sessionId: getOrCreateSession().id,
    page,
    viewMode,
    xPct: Math.round(xPct),
    yPct: Math.round(yPct),
    label: String(label || '').slice(0, 120),
    tag: tag || '',
    href: href || '',
  });
}

export function drainEventQueue() {
  const events = readQueue();
  writeQueue([]);
  return events;
}

export function peekEventQueue() {
  return readQueue();
}

export function restoreEventQueue(events) {
  if (!events?.length) return;
  writeQueue([...events, ...readQueue()].slice(-MAX_QUEUE));
}

export { SCROLL_MILESTONES, HEATMAP_COLS, HEATMAP_ROWS };
