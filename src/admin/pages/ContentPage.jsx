/**
 * Content Manager — admin page for all editorial content types.
 *
 * Tabs:
 *   1. Celebrity Looks   (/celebrity-match/:id)
 *   2. Trend Pages       (/trends/:slug)
 *   3. Knowledge Guides  (/knowledge/:slug)
 *   4. Fashion Quizzes   (/quiz/:slug)
 *   5. Homepage Blocks   (discoveryExperience.js)
 */
import { useState } from 'react';
import {
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  LayoutGrid,
  ExternalLink,
  Eye,
  Tag,
  Clock,
  ChevronRight,
  Film,
} from 'lucide-react';
import { CELEBRITY_LOOKS } from '../../data/celebrityLooks';
import { TREND_PAGES } from '../../data/trendPages';
import { KNOWLEDGE_PAGES, KNOWLEDGE_TOPICS } from '../../data/fashionKnowledge';
import { FASHION_QUIZZES } from '../../data/fashionQuizzes';
import { DISCOVERY_EXPERIENCE_BLOCKS as DISCOVERY_BLOCKS } from '../../data/discoveryExperience';

const TABS = [
  { id: 'celebs',    label: 'Celebrity Looks',   icon: Star,       count: CELEBRITY_LOOKS.length },
  { id: 'trends',    label: 'Trend Pages',        icon: TrendingUp, count: TREND_PAGES.length },
  { id: 'guides',    label: 'Knowledge Guides',   icon: BookOpen,   count: KNOWLEDGE_PAGES.length },
  { id: 'quizzes',   label: 'Quizzes',            icon: Sparkles,   count: Object.keys(FASHION_QUIZZES).length },
  { id: 'homepage',  label: 'Homepage Blocks',    icon: LayoutGrid, count: DISCOVERY_BLOCKS.length },
];

function StatBadge({ label, value, color = '#600b45' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 2,
      padding: '10px 18px', borderRadius: 10,
      background: 'var(--admin-surface, #1a1a2e)',
      border: '1px solid var(--admin-border, #2a2a3e)',
      minWidth: 90,
    }}>
      <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--admin-text-soft, #888)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}

function PreviewBtn({ href }) {
  return (
    <a
      href={`http://localhost:5173${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="admin-cyber-btn admin-cyber-btn--ghost"
      style={{ fontSize: 12, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
    >
      <ExternalLink size={12} />
      Preview
    </a>
  );
}

/* ── Celebrity Looks ────────────────────────────────────────────────────── */

function CelebsTab() {
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Film size={16} style={{ color: '#600b45' }} />
        <span style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Data file: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>src/data/celebrityLooks.js</code>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {CELEBRITY_LOOKS.map((look) => (
          <div key={look.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
            <div style={{ position: 'relative', height: 160, background: '#111' }}>
              <img
                src={look.image}
                alt={look.celebrity}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '24px 12px 10px',
              }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{look.celebrity}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{look.context}</p>
              </div>
              <span style={{
                position: 'absolute', top: 8, right: 8,
                background: '#600b45', color: '#fff',
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                textTransform: 'uppercase',
              }}>{look.theme}</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: 'var(--admin-text, #e0e0e0)' }}>{look.title}</p>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
                Category: <strong style={{ color: 'var(--admin-text, #e0e0e0)' }}>{look.category}</strong>
                &nbsp;·&nbsp;
                Guide: <strong style={{ color: 'var(--admin-text, #e0e0e0)' }}>{look.knowledgeSlug}</strong>
              </p>
              <div style={{ fontSize: 12, color: 'var(--admin-text-soft, #888)', marginBottom: 10 }}>
                <strong>Style notes:</strong> {look.styleNotes?.length || 0} tips
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <PreviewBtn href={`/celebrity-match/${look.id}`} />
                <span style={{
                  fontSize: 11, padding: '4px 8px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--admin-text-soft, #888)',
                }}>ID: {look.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Trend Pages ────────────────────────────────────────────────────────── */

function TrendsTab() {
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Film size={16} style={{ color: '#1565c0' }} />
        <span style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Data file: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>src/data/trendPages.js</code>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {TREND_PAGES.map((trend) => (
          <div key={trend.slug} className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
            <div style={{ position: 'relative', height: 140, background: '#111' }}>
              <img
                src={trend.heroImage}
                alt={trend.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${trend.accentLight || 'rgba(0,0,0,0.5)'}, rgba(0,0,0,0.7))`,
              }} />
              <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff' }}>{trend.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{trend.eyebrow}</p>
              </div>
              <div style={{
                position: 'absolute', top: 10, right: 10,
                width: 14, height: 14, borderRadius: '50%',
                background: trend.accent,
                border: '2px solid rgba(255,255,255,0.4)',
              }} title={trend.accent} />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--admin-text-soft, #888)', lineHeight: 1.5 }}>
                {trend.tagline}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {(trend.categories || []).map((c) => (
                  <span key={c} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.08)', color: 'var(--admin-text-soft, #888)',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>{c}</span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--admin-text-soft, #888)', marginBottom: 10 }}>
                {trend.celebrityIds?.length || 0} celebrity looks &nbsp;·&nbsp;
                {trend.quizzes?.length || 0} quizzes &nbsp;·&nbsp;
                {trend.knowledgePages?.length || 0} guides
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <PreviewBtn href={`/trends/${trend.slug}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Knowledge Guides ───────────────────────────────────────────────────── */

function GuidesTab() {
  const [filterTopic, setFilterTopic] = useState('all');
  const filtered = filterTopic === 'all'
    ? KNOWLEDGE_PAGES
    : KNOWLEDGE_PAGES.filter((p) => p.topicSlug === filterTopic);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          <Film size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Data file: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>src/data/fashionKnowledge.js</code>
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`admin-cyber-btn ${filterTopic === 'all' ? 'admin-cyber-btn--primary' : 'admin-cyber-btn--ghost'}`}
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={() => setFilterTopic('all')}
          >
            All ({KNOWLEDGE_PAGES.length})
          </button>
          {KNOWLEDGE_TOPICS.map((t) => (
            <button
              key={t.slug}
              type="button"
              className={`admin-cyber-btn ${filterTopic === t.slug ? 'admin-cyber-btn--primary' : 'admin-cyber-btn--ghost'}`}
              style={{ fontSize: 11, padding: '4px 10px' }}
              onClick={() => setFilterTopic(t.slug)}
            >
              {t.title} ({KNOWLEDGE_PAGES.filter((p) => p.topicSlug === t.slug).length})
            </button>
          ))}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--admin-border, #2a2a3e)' }}>
            {['Title', 'Topic', 'Read Time', 'Tags', 'Cross-links', 'Actions'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--admin-text-soft, #888)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((page, i) => {
            const topic = KNOWLEDGE_TOPICS.find((t) => t.slug === page.topicSlug);
            return (
              <tr
                key={page.id}
                style={{
                  borderBottom: '1px solid var(--admin-border, #2a2a3e)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                }}
              >
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={page.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--admin-text, #e0e0e0)' }}>{page.title}</p>
                      {page.featured && (
                        <span style={{ fontSize: 10, color: '#c9a84c', fontWeight: 700 }}>★ FEATURED</span>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 20,
                    background: topic?.accent + '22' || 'rgba(255,255,255,0.08)',
                    color: topic?.accent || 'var(--admin-text-soft, #888)',
                    fontWeight: 600,
                  }}>
                    {topic?.title || page.topicSlug}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--admin-text-soft, #888)' }}>
                  <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {page.readTime}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(page.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} style={{
                        fontSize: 10, padding: '2px 6px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.06)', color: 'var(--admin-text-soft, #888)',
                      }}>
                        <Tag size={8} style={{ verticalAlign: 'middle', marginRight: 2 }} />{tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
                  {page.relatedTrends?.length || 0} trends &nbsp;·&nbsp;
                  {page.relatedCelebrityIds?.length || 0} celebs &nbsp;·&nbsp;
                  {page.relatedQuizSlugs?.length || 0} quizzes
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <PreviewBtn href={`/knowledge/${page.slug}`} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Quizzes ────────────────────────────────────────────────────────────── */

function QuizzesTab() {
  const quizzes = Object.values(FASHION_QUIZZES);
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Film size={16} style={{ color: '#880e4f' }} />
        <span style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Data file: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>src/data/fashionQuizzes.js</code>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {quizzes.map((quiz) => (
          <div key={quiz.slug} className="glass-panel" style={{ borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: quiz.accent + '33', border: `2px solid ${quiz.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={20} style={{ color: quiz.accent }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--admin-text, #e0e0e0)', fontSize: 14 }}>{quiz.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--admin-text-soft, #888)' }}>/{quiz.slug}</p>
              </div>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--admin-text-soft, #888)', lineHeight: 1.5 }}>
              {quiz.subtitle}
            </p>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--admin-text-soft, #888)', marginBottom: 14 }}>
              <span><strong style={{ color: 'var(--admin-text, #e0e0e0)' }}>{quiz.steps?.length || 0}</strong> questions</span>
              <span><strong style={{ color: 'var(--admin-text, #e0e0e0)' }}>{Object.keys(quiz.results || {}).length}</strong> result profiles</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--admin-text-soft, #888)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result profiles</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.values(quiz.results || {}).map((r) => (
                  <div key={r.key || r.title} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ fontSize: 16 }}>{r.emoji}</span>
                    <span style={{ color: 'var(--admin-text, #e0e0e0)', fontWeight: 600 }}>{r.title}</span>
                    <ChevronRight size={12} style={{ color: 'var(--admin-text-soft, #888)', marginLeft: 'auto' }} />
                    <span style={{ fontSize: 11, color: 'var(--admin-text-soft, #888)' }}>{r.discoverCategory}</span>
                  </div>
                ))}
              </div>
            </div>
            <PreviewBtn href={`/quiz/${quiz.slug}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Homepage Blocks ────────────────────────────────────────────────────── */

function HomepageTab() {
  const blocks = DISCOVERY_BLOCKS || [];
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Film size={16} style={{ color: '#e65100' }} />
        <span style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Data file: <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>src/data/discoveryExperience.js</code>
        </span>
      </div>
      {blocks.length === 0 ? (
        <p style={{ color: 'var(--admin-text-soft, #888)', fontSize: 13 }}>No DISCOVERY_BLOCKS exported. Check discoveryExperience.js.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blocks.map((block, i) => (
            <div key={block.id || i} className="glass-panel" style={{ borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: block.accent ? block.accent + '33' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                {block.emoji || '📦'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: 'var(--admin-text, #e0e0e0)' }}>
                  {block.label || block.id}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
                  {block.hook || block.dek || block.sub || '—'}
                </p>
              </div>
              <div style={{ fontSize: 12, color: 'var(--admin-text-soft, #888)', textAlign: 'right' }}>
                <div>type: <strong style={{ color: 'var(--admin-text, #e0e0e0)' }}>{block.type}</strong></div>
                {block.route && (
                  <div>route: <strong style={{ color: 'var(--admin-text, #e0e0e0)' }}>{block.route}</strong></div>
                )}
              </div>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--admin-border, #2a2a3e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'var(--admin-text-soft, #888)',
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Root export ────────────────────────────────────────────────────────── */

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('celebs');

  const totalContent =
    CELEBRITY_LOOKS.length +
    TREND_PAGES.length +
    KNOWLEDGE_PAGES.length +
    Object.keys(FASHION_QUIZZES).length;

  return (
    <div className="admin-cyber-page">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--admin-text, #e0e0e0)' }}>
          Content Manager
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          All editorial content powering the discovery ecosystem — celebrity looks, trend pages, guides, quizzes, and homepage blocks.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatBadge label="Total Content" value={totalContent} color="#c9a84c" />
        <StatBadge label="Celebrity Looks" value={CELEBRITY_LOOKS.length} color="#600b45" />
        <StatBadge label="Trend Pages" value={TREND_PAGES.length} color="#1565c0" />
        <StatBadge label="Knowledge Guides" value={KNOWLEDGE_PAGES.length} color="#e65100" />
        <StatBadge label="Quizzes" value={Object.keys(FASHION_QUIZZES).length} color="#880e4f" />
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 4, flexWrap: 'wrap',
        borderBottom: '1px solid var(--admin-border, #2a2a3e)',
        marginBottom: 24, paddingBottom: 0,
      }}>
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              border: 'none', borderRadius: '8px 8px 0 0',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === id
                ? 'var(--admin-surface, #1a1a2e)'
                : 'transparent',
              color: activeTab === id
                ? 'var(--admin-text, #e0e0e0)'
                : 'var(--admin-text-soft, #888)',
              borderBottom: activeTab === id
                ? '2px solid #600b45'
                : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <Icon size={14} />
            {label}
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: activeTab === id ? '#600b45' : 'rgba(255,255,255,0.1)',
              color: activeTab === id ? '#fff' : 'var(--admin-text-soft, #888)',
              borderRadius: 20, padding: '1px 6px',
            }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'celebs'   && <CelebsTab />}
        {activeTab === 'trends'   && <TrendsTab />}
        {activeTab === 'guides'   && <GuidesTab />}
        {activeTab === 'quizzes'  && <QuizzesTab />}
        {activeTab === 'homepage' && <HomepageTab />}
      </div>

      {/* Info footer */}
      <div style={{
        marginTop: 32, padding: '14px 18px', borderRadius: 10,
        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
        fontSize: 13, color: 'var(--admin-text-soft, #888)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Eye size={16} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ color: '#c9a84c' }}>Read-only view.</strong>&nbsp;
          Content is stored in <code>src/data/</code> files. Click <strong>Preview</strong> on any item to see it live on the site.
          To edit content, update the corresponding data file in Cursor and save — changes reflect immediately.
        </div>
      </div>
    </div>
  );
}
