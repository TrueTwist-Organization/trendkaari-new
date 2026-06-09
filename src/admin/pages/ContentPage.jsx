/**
 * Content Manager — edit celebrity looks, trends, guides, quizzes from admin.
 */
import { useState } from 'react';
import {
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  LayoutGrid,
  Plus,
  RefreshCw,
  Check,
  Edit2,
  Layers,
} from 'lucide-react';
import { CELEBRITY_LOOKS } from '../../data/celebrityLooks';
import { TREND_PAGES } from '../../data/trendPages';
import { KNOWLEDGE_PAGES, KNOWLEDGE_TOPICS } from '../../data/fashionKnowledge';
import { FASHION_QUIZZES } from '../../data/fashionQuizzes';
import { DISCOVERY_EXPERIENCE_BLOCKS } from '../../data/discoveryExperience';
import { useEditableContent } from '../content/useEditableContent';
import {
  Modal,
  CelebForm,
  TrendForm,
  GuideForm,
  QuizForm,
  ActionButtons,
} from '../content/ContentForms';

const TAB_CONFIG = {
  celebs: {
    label: 'Celebrity Looks',
    icon: Star,
    apiType: 'celebrity-looks',
    staticData: CELEBRITY_LOOKS,
    Form: CelebForm,
    editorTab: 'celebrity-looks',
  },
  trends: {
    label: 'Trend Pages',
    icon: TrendingUp,
    apiType: 'trend-pages',
    staticData: TREND_PAGES,
    Form: TrendForm,
    editorTab: 'trend-pages',
  },
  guides: {
    label: 'Knowledge Guides',
    icon: BookOpen,
    apiType: 'knowledge-pages',
    staticData: KNOWLEDGE_PAGES,
    Form: GuideForm,
    editorTab: 'knowledge-pages',
  },
  quizzes: {
    label: 'Quizzes',
    icon: Sparkles,
    apiType: 'quizzes',
    staticData: Object.values(FASHION_QUIZZES),
    Form: QuizForm,
    editorTab: 'quizzes',
  },
};

function StatBadge({ label, value, color = '#600b45' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '10px 18px',
        borderRadius: 10,
        background: 'var(--admin-surface, #1a1a2e)',
        border: '1px solid var(--admin-border, #2a2a3e)',
        minWidth: 90,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--admin-text-soft, #888)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  );
}

function TabToolbar({ count, loading, onRefresh, onAdd }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
      <span style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
        {loading ? 'Loading…' : `${count} items · edits save to database and go live`}
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onRefresh} className="admin-cyber-btn admin-cyber-btn--ghost" style={{ fontSize: 12, padding: '5px 12px' }}>
          <RefreshCw size={13} />
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="admin-cyber-btn admin-cyber-btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
        >
          <Plus size={14} /> Add New
        </button>
      </div>
    </div>
  );
}

function CelebsTab({ onNavigate }) {
  const cfg = TAB_CONFIG.celebs;
  const { items, loading, modal, saving, load, openAdd, openEdit, closeModal, handleSave, handleDelete, updateModalItem } =
    useEditableContent(cfg.apiType, cfg.staticData);
  const Form = cfg.Form;

  return (
    <div>
      <TabToolbar count={items.length} loading={loading} onRefresh={load} onAdd={() => openAdd({ theme: 'NEW', category: 'kurtas' })} />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <RefreshCw size={24} className="admin-spin" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {items.map((look) => (
            <div key={look.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
              <div style={{ position: 'relative', height: 160, background: '#111' }}>
                <img src={look.image} alt={look.celebrity} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                    padding: '24px 12px 10px',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{look.celebrity}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{look.context}</p>
                </div>
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: '#600b45',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 20,
                    textTransform: 'uppercase',
                  }}
                >
                  {look.theme}
                </span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600 }}>{look.title}</p>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
                  {look.category} · {look.knowledgeSlug || '—'}
                </p>
                <ActionButtons
                  previewHref={`/celebrity-match/${look.id}`}
                  onEdit={() => openEdit(look)}
                  onDelete={() => handleDelete(look)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={`${modal.mode === 'add' ? 'Add' : 'Edit'} Celebrity Look`} onClose={closeModal} onSave={handleSave} saving={saving}>
          <Form item={modal.item} onChange={updateModalItem} />
        </Modal>
      )}
    </div>
  );
}

function TrendsTab() {
  const cfg = TAB_CONFIG.trends;
  const { items, loading, modal, saving, load, openAdd, openEdit, closeModal, handleSave, handleDelete, updateModalItem } =
    useEditableContent(cfg.apiType, cfg.staticData);
  const Form = cfg.Form;

  return (
    <div>
      <TabToolbar count={items.length} loading={loading} onRefresh={load} onAdd={() => openAdd({ accent: '#e65100', categories: [] })} />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <RefreshCw size={24} className="admin-spin" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {items.map((trend) => (
            <div key={trend.slug} className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
              <div style={{ position: 'relative', height: 140, background: '#111' }}>
                <img src={trend.heroImage} alt={trend.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${trend.accentLight || 'rgba(0,0,0,0.5)'}, rgba(0,0,0,0.7))`,
                  }}
                />
                <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff' }}>{trend.title}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{trend.eyebrow}</p>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--admin-text-soft, #888)', lineHeight: 1.5 }}>{trend.tagline}</p>
                <ActionButtons
                  previewHref={`/trends/${trend.slug}`}
                  onEdit={() => openEdit(trend)}
                  onDelete={() => handleDelete(trend)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={`${modal.mode === 'add' ? 'Add' : 'Edit'} Trend Page`} onClose={closeModal} onSave={handleSave} saving={saving}>
          <Form item={modal.item} onChange={updateModalItem} />
        </Modal>
      )}
    </div>
  );
}

function GuidesTab() {
  const [filterTopic, setFilterTopic] = useState('all');
  const cfg = TAB_CONFIG.guides;
  const { items, loading, modal, saving, load, openAdd, openEdit, closeModal, handleSave, handleDelete, updateModalItem } =
    useEditableContent(cfg.apiType, cfg.staticData);
  const Form = cfg.Form;
  const filtered = filterTopic === 'all' ? items : items.filter((p) => p.topicSlug === filterTopic);

  return (
    <div>
      <TabToolbar count={items.length} loading={loading} onRefresh={load} onAdd={() => openAdd({ topicSlug: 'styling', sections: [] })} />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        <button
          type="button"
          className={`admin-cyber-btn ${filterTopic === 'all' ? 'admin-cyber-btn--primary' : 'admin-cyber-btn--ghost'}`}
          style={{ fontSize: 11, padding: '4px 10px' }}
          onClick={() => setFilterTopic('all')}
        >
          All
        </button>
        {KNOWLEDGE_TOPICS.map((t) => (
          <button
            key={t.slug}
            type="button"
            className={`admin-cyber-btn ${filterTopic === t.slug ? 'admin-cyber-btn--primary' : 'admin-cyber-btn--ghost'}`}
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={() => setFilterTopic(t.slug)}
          >
            {t.title}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <RefreshCw size={24} className="admin-spin" />
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border, #2a2a3e)' }}>
              {['Title', 'Topic', 'Read Time', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    color: 'var(--admin-text-soft, #888)',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((page, i) => {
              const topic = KNOWLEDGE_TOPICS.find((t) => t.slug === page.topicSlug);
              return (
                <tr key={page.id || page.slug} style={{ borderBottom: '1px solid var(--admin-border, #2a2a3e)', background: i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={page.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      <span style={{ fontWeight: 600 }}>{page.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>{topic?.title || page.topicSlug}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--admin-text-soft, #888)' }}>{page.readTime}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <ActionButtons previewHref={`/knowledge/${page.slug}`} onEdit={() => openEdit(page)} onDelete={() => handleDelete(page)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {modal && (
        <Modal title={`${modal.mode === 'add' ? 'Add' : 'Edit'} Knowledge Guide`} onClose={closeModal} onSave={handleSave} saving={saving}>
          <Form item={modal.item} onChange={updateModalItem} />
        </Modal>
      )}
    </div>
  );
}

function QuizzesTab() {
  const cfg = TAB_CONFIG.quizzes;
  const { items, loading, modal, saving, load, openAdd, openEdit, closeModal, handleSave, handleDelete, updateModalItem } =
    useEditableContent(cfg.apiType, cfg.staticData);
  const Form = cfg.Form;

  return (
    <div>
      <TabToolbar count={items.length} loading={loading} onRefresh={load} onAdd={() => openAdd({ accent: '#600b45', steps: [], results: {} })} />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <RefreshCw size={24} className="admin-spin" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {items.map((quiz) => (
            <div key={quiz.slug} className="glass-panel" style={{ borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${quiz.accent || '#600b45'}33`,
                    border: `2px solid ${quiz.accent || '#600b45'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={20} style={{ color: quiz.accent || '#600b45' }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{quiz.title}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--admin-text-soft, #888)' }}>/{quiz.slug}</p>
                </div>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>{quiz.subtitle}</p>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
                {quiz.steps?.length || 0} questions · {Object.keys(quiz.results || {}).length} results
              </p>
              <ActionButtons previewHref={`/quiz/${quiz.slug}`} onEdit={() => openEdit(quiz)} onDelete={() => handleDelete(quiz)} />
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={`${modal.mode === 'add' ? 'Add' : 'Edit'} Quiz`} onClose={closeModal} onSave={handleSave} saving={saving}>
          <Form item={modal.item} onChange={updateModalItem} />
        </Modal>
      )}
    </div>
  );
}

function HomepageTab({ onNavigate }) {
  const blocks = DISCOVERY_EXPERIENCE_BLOCKS || [];
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: '14px 16px',
          borderRadius: 10,
          background: 'rgba(96,11,69,0.08)',
          border: '1px solid rgba(96,11,69,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Homepage chapters, hero layout, polls & trending are edited in <strong>Homepage &amp; Content</strong>.
        </p>
        <button
          type="button"
          className="admin-cyber-btn admin-cyber-btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          onClick={() => onNavigate?.('content-editor')}
        >
          <Edit2 size={14} /> Edit Homepage
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blocks.map((block, i) => (
          <div key={block.id || i} className="glass-panel" style={{ borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{block.title || block.id}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>{block.hook || block.tagline}</p>
            </div>
            <span style={{ fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>{block.kind || block.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContentPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('celebs');

  return (
    <div className="admin-cyber-page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Content Manager</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Edit celebrity looks, trend pages, guides, and quizzes — changes go live on the site immediately.
        </p>
      </div>

      <div
        style={{
          marginBottom: 22,
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(96,11,69,0.08)',
          border: '1px solid rgba(96,11,69,0.2)',
          fontSize: 12,
          color: 'var(--admin-text-soft, #888)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <Check size={14} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
        <div>
          Click <strong>Edit</strong> on any card to update text, images, and links. Use <strong>Image Manager</strong> to upload photos, then paste or drag into image fields.
          Homepage hero &amp; chapters → <button type="button" className="admin-cyber-btn admin-cyber-btn--ghost" style={{ fontSize: 11, padding: '2px 8px', verticalAlign: 'middle' }} onClick={() => onNavigate?.('content-editor')}><Layers size={12} /> Homepage &amp; Content</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--admin-border, #2a2a3e)', marginBottom: 24 }}>
        {[
          { id: 'celebs', label: 'Celebrity Looks', icon: Star },
          { id: 'trends', label: 'Trend Pages', icon: TrendingUp },
          { id: 'guides', label: 'Knowledge Guides', icon: BookOpen },
          { id: 'quizzes', label: 'Quizzes', icon: Sparkles },
          { id: 'homepage', label: 'Homepage Blocks', icon: LayoutGrid },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: activeTab === id ? 'var(--admin-surface, #1a1a2e)' : 'transparent',
              color: activeTab === id ? 'var(--admin-text, #e0e0e0)' : 'var(--admin-text-soft, #888)',
              borderBottom: `2px solid ${activeTab === id ? '#600b45' : 'transparent'}`,
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'celebs' && <CelebsTab onNavigate={onNavigate} />}
      {activeTab === 'trends' && <TrendsTab />}
      {activeTab === 'guides' && <GuidesTab />}
      {activeTab === 'quizzes' && <QuizzesTab />}
      {activeTab === 'homepage' && <HomepageTab onNavigate={onNavigate} />}

      <style>{`.admin-spin { animation: adminSpin 1s linear infinite; } @keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
