const SCROLL_KEYS = [25, 50, 75, 100];

function round1(n) {
  return Math.round(n * 10) / 10;
}

function pct(part, total) {
  if (!total) return 0;
  return round1((part / total) * 100);
}

function normalizePageStats(pageStats = {}) {
  return Object.entries(pageStats).map(([page, stats]) => ({
    page,
    views: stats.views || 0,
    clicks: stats.clicks || 0,
    avgTimeSec: stats.views ? round1((stats.totalDurationMs || 0) / stats.views / 1000) : 0,
    scroll: {
      25: pct(stats.scroll?.[25] || 0, stats.views),
      50: pct(stats.scroll?.[50] || 0, stats.views),
      75: pct(stats.scroll?.[75] || 0, stats.views),
      100: pct(stats.scroll?.[100] || 0, stats.views),
    },
    scrollCounts: stats.scroll || { 25: 0, 50: 0, 75: 0, 100: 0 },
    heatmap: stats.heatmap || {},
  }));
}

function buildHeatmapGrid(heatmap = {}, cols = 10, rows = 10) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let max = 0;
  for (const [key, count] of Object.entries(heatmap)) {
    const [col, row] = key.split(',').map(Number);
    if (!Number.isFinite(col) || !Number.isFinite(row)) continue;
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col] = count;
      if (count > max) max = count;
    }
  }
  return { grid, max };
}

function topClickPaths(pathEdges = {}, limit = 12) {
  return Object.entries(pathEdges)
    .map(([path, count]) => {
      const [from, to] = path.split(' → ');
      return { from: from || path, to: to || '', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function computeSessionMetrics(sessions = [], pageStats = {}) {
  const list = sessions.filter((s) => s.pageCount > 0);
  const totalSessions = list.length || 1;
  const pagesPerSession = list.length
    ? round1(list.reduce((sum, s) => sum + (s.pageCount || 0), 0) / list.length)
    : 0;
  const singlePageSessions = list.filter((s) => (s.pageCount || 0) <= 1).length;
  const bounceRate = pct(singlePageSessions, list.length);

  const totalDurationMs = Object.values(pageStats).reduce(
    (sum, p) => sum + (p.totalDurationMs || 0),
    0,
  );
  const totalViews = Object.values(pageStats).reduce((sum, p) => sum + (p.views || 0), 0);
  const avgTimeOnSiteSec = list.length
    ? round1(totalDurationMs / list.length / 1000)
    : round1(totalDurationMs / 1000);

  return {
    totalSessions: list.length,
    pagesPerSession,
    bounceRate,
    avgTimeOnSiteSec,
    avgTimePerPageSec: totalViews ? round1(totalDurationMs / totalViews / 1000) : 0,
  };
}

function buildRecommendations({ sessionMetrics, pages, clickPaths }) {
  const recs = [];

  if (sessionMetrics.bounceRate >= 55) {
    recs.push({
      priority: 'high',
      title: 'High single-page bounce',
      detail: `${sessionMetrics.bounceRate}% of sessions view only one page. Add stronger "Explore" CTAs above the fold on home and category pages.`,
      metric: `${sessionMetrics.bounceRate}% bounce`,
    });
  }

  if (sessionMetrics.pagesPerSession < 2.5) {
    recs.push({
      priority: 'high',
      title: 'Low session depth',
      detail: `Average ${sessionMetrics.pagesPerSession} pages per session. Surface Endless Discovery rails earlier and link quizzes/games from the homepage hero.`,
      metric: `${sessionMetrics.pagesPerSession} pages/session`,
    });
  }

  if (sessionMetrics.avgTimeOnSiteSec < 45) {
    recs.push({
      priority: 'medium',
      title: 'Short time on site',
      detail: `Visitors spend ~${sessionMetrics.avgTimeOnSiteSec}s per session. Add interactive hooks (style quiz, viral hub, mini games) within the first scroll.`,
      metric: `${sessionMetrics.avgTimeOnSiteSec}s avg`,
    });
  }

  const lowScrollPages = pages
    .filter((p) => p.views >= 5 && p.scroll[50] < 35)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  lowScrollPages.forEach((p) => {
    recs.push({
      priority: 'medium',
      title: `Low scroll on ${p.page}`,
      detail: `Only ${p.scroll[50]}% reach 50% depth. Move key product rails and CTAs higher; shorten content above the fold.`,
      metric: `${p.scroll[50]}% @ 50% depth`,
    });
  });

  const highClickLowScroll = pages
    .filter((p) => p.views >= 5 && p.clicks >= 8 && p.scroll[50] < 40)
    .slice(0, 2);

  highClickLowScroll.forEach((p) => {
    recs.push({
      priority: 'medium',
      title: `Click-heavy but shallow on ${p.page}`,
      detail: `${p.clicks} clicks but ${p.scroll[50]}% scroll depth — users may be hunting for links. Simplify nav and highlight primary actions.`,
      metric: `${p.clicks} clicks`,
    });
  });

  const productPaths = clickPaths.filter(
    (p) => !String(p.to).includes('/product/') && p.count >= 3,
  );
  if (productPaths.length >= 2) {
    recs.push({
      priority: 'low',
      title: 'Discovery paths skip product pages',
      detail: `Top flows like "${productPaths[0].from} → ${productPaths[0].to}" rarely lead to PDPs. Insert product cards in those transition pages.`,
      metric: `${productPaths[0].count} transitions`,
    });
  }

  const topPage = pages.sort((a, b) => b.views - a.views)[0];
  if (topPage && topPage.avgTimeSec > 0 && topPage.avgTimeSec < 8 && topPage.views >= 10) {
    recs.push({
      priority: 'low',
      title: `Quick exits from ${topPage.page}`,
      detail: `High traffic but only ${topPage.avgTimeSec}s avg time — test a clearer next-step module at 25% scroll.`,
      metric: `${topPage.avgTimeSec}s on page`,
    });
  }

  if (!recs.length) {
    recs.push({
      priority: 'low',
      title: 'Journey looks healthy',
      detail: 'Keep collecting data — no major friction signals yet. Review heatmaps after more sessions.',
      metric: 'OK',
    });
  }

  const order = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 8);
}

export function buildJourneyReport(aggregate = {}) {
  const pages = normalizePageStats(aggregate.pageStats || {});
  const sessionMetrics = computeSessionMetrics(aggregate.sessions || [], aggregate.pageStats || {});
  const clickPaths = topClickPaths(aggregate.pathEdges || {});

  const topPages = [...pages].sort((a, b) => b.views - a.views).slice(0, 8);
  const heatmapPages = topPages.map((p) => ({
    page: p.page,
    views: p.views,
    ...buildHeatmapGrid(p.heatmap),
  }));

  const scrollOverview = topPages.map((p) => ({
    page: p.page,
    views: p.views,
    depths: SCROLL_KEYS.map((k) => ({ depth: k, pct: p.scroll[k] })),
  }));

  const recommendations = buildRecommendations({ sessionMetrics, pages, clickPaths });

  return {
    generatedAt: new Date().toISOString(),
    totalEvents: aggregate.totalEvents || 0,
    sessionMetrics,
    topPages,
    scrollOverview,
    clickPaths,
    heatmapPages,
    recommendations,
  };
}

export function mergeAggregates(base = {}, incoming = {}) {
  const out = {
    sessions: [...(base.sessions || [])],
    pageStats: { ...(base.pageStats || {}) },
    pathEdges: { ...(base.pathEdges || {}) },
    totalEvents: (base.totalEvents || 0) + (incoming.totalEvents || 0),
  };

  for (const session of incoming.sessions || []) {
    const idx = out.sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) out.sessions[idx] = { ...out.sessions[idx], ...session };
    else out.sessions.unshift(session);
  }
  out.sessions = out.sessions.slice(0, 500);

  for (const [page, stats] of Object.entries(incoming.pageStats || {})) {
    if (!out.pageStats[page]) {
      out.pageStats[page] = {
        views: 0,
        scroll: { 25: 0, 50: 0, 75: 0, 100: 0 },
        totalDurationMs: 0,
        clicks: 0,
        heatmap: {},
      };
    }
    const target = out.pageStats[page];
    target.views += stats.views || 0;
    target.clicks += stats.clicks || 0;
    target.totalDurationMs += stats.totalDurationMs || 0;
    for (const k of SCROLL_KEYS) {
      target.scroll[k] = (target.scroll[k] || 0) + (stats.scroll?.[k] || 0);
    }
    for (const [cell, count] of Object.entries(stats.heatmap || {})) {
      target.heatmap[cell] = (target.heatmap[cell] || 0) + count;
    }
  }

  for (const [edge, count] of Object.entries(incoming.pathEdges || {})) {
    out.pathEdges[edge] = (out.pathEdges[edge] || 0) + count;
  }

  return out;
}
