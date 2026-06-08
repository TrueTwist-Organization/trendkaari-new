import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Route, MousePointerClick, Clock, Layers } from 'lucide-react';
import { fetchJourneyAnalytics } from '../../api/adminApi';
import { buildJourneyReport, mergeAggregates } from '../../utils/journeyAnalyticsEngine';
import { getLocalJourneyAggregate } from '../../utils/journeyTracker';
import './JourneyReportsPage.css';

function HeatmapGrid({ grid, max }) {
  const peak = max || 1;
  return (
    <div className="journey-heatmap-grid" aria-label="Click heatmap">
      {grid.flatMap((row, rowIdx) =>
        row.map((value, colIdx) => {
          const intensity = value / peak;
          const alpha = 0.08 + intensity * 0.82;
          return (
            <div
              key={`${rowIdx}-${colIdx}`}
              className="journey-heatmap-cell"
              title={`${value} clicks`}
              style={{ background: `rgba(96, 11, 69, ${alpha})` }}
            />
          );
        }),
      )}
    </div>
  );
}

export default function JourneyReportsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [aggregate, setAggregate] = useState(null);

  const load = () => {
    setRefreshing(true);
    setError('');
    fetchJourneyAnalytics()
      .then((payload) => {
        const local = getLocalJourneyAggregate();
        const merged = mergeAggregates(payload?.aggregate || {}, local);
        setAggregate(merged);
      })
      .catch((err) => {
        const local = getLocalJourneyAggregate();
        setAggregate(local);
        setError(err.message || 'Server data unavailable — showing local browser sessions.');
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const report = useMemo(
    () => (aggregate ? buildJourneyReport(aggregate) : null),
    [aggregate],
  );

  if (loading) {
    return (
      <div className="admin-cyber-page" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <span className="admin-chrome-loader admin-chrome-loader--lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="journey-empty admin-cyber-page">
        <p>No journey data yet. Browse the storefront to collect sessions.</p>
      </div>
    );
  }

  const { sessionMetrics } = report;
  const hasData = report.totalEvents > 0 || sessionMetrics.totalSessions > 0;

  return (
    <div className="admin-cyber-page journey-reports">
      <div className="journey-reports__header">
        <div>
          <h1 className="admin-cyber-page__title">User Journey Insights</h1>
          <p className="admin-cyber-page__subtitle">
            Pages per session, scroll depth, time on site, click paths, and heatmaps
          </p>
        </div>
        <button
          type="button"
          className="admin-cyber-btn admin-cyber-btn--ghost"
          onClick={load}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'admin-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="admin-cyber-note" role="status">
          {error}
        </p>
      )}

      {!hasData ? (
        <div className="journey-panel journey-empty">
          Visit pages on the storefront — metrics appear here after clicks, scrolls, and navigation.
        </div>
      ) : (
        <>
          <div className="journey-reports__grid">
            <div className="journey-metric-card">
              <div className="journey-metric-card__label">
                <Layers size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Pages / session
              </div>
              <div className="journey-metric-card__value">{sessionMetrics.pagesPerSession}</div>
              <div className="journey-metric-card__hint">
                {sessionMetrics.totalSessions} sessions tracked
              </div>
            </div>
            <div className="journey-metric-card">
              <div className="journey-metric-card__label">
                <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Time on site
              </div>
              <div className="journey-metric-card__value">{sessionMetrics.avgTimeOnSiteSec}s</div>
              <div className="journey-metric-card__hint">
                {sessionMetrics.avgTimePerPageSec}s avg per page
              </div>
            </div>
            <div className="journey-metric-card">
              <div className="journey-metric-card__label">Bounce rate</div>
              <div className="journey-metric-card__value">{sessionMetrics.bounceRate}%</div>
              <div className="journey-metric-card__hint">Single-page sessions</div>
            </div>
            <div className="journey-metric-card">
              <div className="journey-metric-card__label">
                <MousePointerClick size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Events
              </div>
              <div className="journey-metric-card__value">{report.totalEvents}</div>
              <div className="journey-metric-card__hint">Views, scrolls, clicks</div>
            </div>
          </div>

          <div className="journey-panel">
            <h2 className="journey-panel__title">Scroll depth by page</h2>
            <div className="journey-scroll-row" style={{ fontWeight: 700, color: 'var(--admin-text-soft)' }}>
              <span>Page</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
            {report.scrollOverview.map((row) => (
              <div key={row.page} className="journey-scroll-row">
                <span title={row.page}>{row.page}</span>
                {row.depths.map((d) => (
                  <div key={d.depth} title={`${d.pct}% reach ${d.depth}% depth`}>
                    <div style={{ marginBottom: 4 }}>{d.pct}%</div>
                    <div
                      className="journey-scroll-bar"
                      style={{ width: `${Math.max(4, d.pct)}%` }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="journey-panel">
            <h2 className="journey-panel__title">
              <Route size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Top click paths
            </h2>
            <div className="journey-path-list">
              {report.clickPaths.length ? (
                report.clickPaths.map((path) => (
                  <div key={`${path.from}-${path.to}`} className="journey-path-item">
                    <span>
                      {path.from} → {path.to}
                    </span>
                    <span className="journey-path-item__count">{path.count}</span>
                  </div>
                ))
              ) : (
                <p className="journey-empty">Navigate between pages to build path data.</p>
              )}
            </div>
          </div>

          <div className="journey-panel">
            <h2 className="journey-panel__title">Click heatmaps (viewport)</h2>
            <div className="journey-heatmap-wrap">
              {report.heatmapPages.map((page) => (
                <div key={page.page} className="journey-heatmap-card">
                  <p className="journey-heatmap-card__page">
                    {page.page} · {page.views} views
                  </p>
                  <HeatmapGrid grid={page.grid} max={page.max} />
                </div>
              ))}
            </div>
          </div>

          <div className="journey-panel">
            <h2 className="journey-panel__title">Optimization opportunities</h2>
            <div className="journey-rec-list">
              {report.recommendations.map((rec) => (
                <div key={rec.title} className={`journey-rec journey-rec--${rec.priority}`}>
                  <p className="journey-rec__title">{rec.title}</p>
                  <p className="journey-rec__detail">{rec.detail}</p>
                  <p className="journey-rec__metric">{rec.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
