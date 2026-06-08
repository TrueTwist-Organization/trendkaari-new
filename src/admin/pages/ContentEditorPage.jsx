/**
 * Content Editor — full CRUD for Celebrity Looks, Trend Pages,
 * Knowledge Guides, and Quizzes from the admin panel.
 *
 * Data flow:
 *   1. On mount → POST /api/admin/content/:type/seed (seeds store from static JS data)
 *   2. Lists items from /api/admin/content/:type
 *   3. Add / Edit → modal form → POST /api/admin/content/:type
 *   4. Delete → DELETE /api/admin/content/:type/:id
 *   5. Frontend site reads from /api/store/content?type=... (falls back to static JS data)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit2, Trash2, Save, X, RefreshCw,
  Star, TrendingUp, BookOpen, Sparkles,
  Upload, Image as ImageIcon,
  AlertTriangle, Check,
} from 'lucide-react';
import { CELEBRITY_LOOKS } from '../../data/celebrityLooks';
import { TREND_PAGES } from '../../data/trendPages';
import { KNOWLEDGE_PAGES } from '../../data/fashionKnowledge';
import { FASHION_QUIZZES } from '../../data/fashionQuizzes';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function getToken() { return localStorage.getItem('admin_token') || ''; }

async function apiFetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...opts.headers },
    ...opts,
    body: opts.body ? (typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function showToast(msg, type = 'info') {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    padding: '10px 18px', borderRadius: '8px',
    background: type === 'error' ? '#b71c1c' : type === 'success' ? '#1b5e20' : '#1a1a2e',
    color: '#fff', fontSize: '13px', fontWeight: 600,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ── Shared UI ───────────────────────────────────────────────────────────── */

function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--admin-text-soft, #888)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#666' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: 7,
  border: '1px solid var(--admin-border, #2a2a3e)',
  background: 'var(--admin-surface, #1a1a2e)',
  color: 'var(--admin-text, #e0e0e0)', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};

function Input({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />;
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />;
}

function Select({ value, onChange, options }) {
  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
      {options.map((o) => (
        <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
      ))}
    </select>
  );
}

function ImageField({ label, value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadErr('Please drop an image file (JPG, PNG, WebP).');
      return;
    }
    setUploading(true);
    setUploadErr('');
    const form = new FormData();
    form.append('images', file);
    try {
      const res = await fetch('/api/admin/images/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (data.urls?.[0]) onChange(data.urls[0]);
    } catch (err) {
      setUploadErr(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handlePaste = (e) => {
    const file = Array.from(e.clipboardData?.items || []).find((i) => i.kind === 'file')?.getAsFile();
    if (file) { e.preventDefault(); uploadFile(file); }
  };

  return (
    <Field label={label}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#600b45' : uploading ? '#c9a84c' : 'var(--admin-border, #2a2a3e)'}`,
          borderRadius: 10,
          padding: value ? '8px 12px' : '22px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(96,11,69,0.1)' : 'var(--admin-surface, #1a1a2e)',
          transition: 'all 0.15s',
          marginBottom: 8,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }}
        />

        {/* Preview thumbnail if image exists */}
        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', objectPosition: 'top', flexShrink: 0, border: '2px solid #600b45' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--admin-text, #e0e0e0)' }}>
                {uploading ? 'Uploading new image…' : 'Image set ✓'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--admin-text-soft, #888)', wordBreak: 'break-all' }}>{value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#600b45', fontWeight: 600 }}>
                Drop / click to replace
              </p>
            </div>
          </>
        ) : (
          <div style={{ width: '100%' }}>
            {uploading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#c9a84c' }}>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Uploading…</span>
              </div>
            ) : (
              <>
                <Upload size={22} style={{ color: '#600b45', marginBottom: 6 }} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--admin-text, #e0e0e0)' }}>
                  {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--admin-text-soft, #888)' }}>
                  JPG · PNG · WebP · max 8 MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {uploadErr && (
        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#ef9a9a' }}>
          <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{uploadErr}
        </p>
      )}

      {/* Manual URL input as fallback */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--admin-text-soft, #888)', flexShrink: 0 }}>Or paste URL:</span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="/product-media/photo.webp"
          style={{ ...inputStyle, flex: 1, height: 32, padding: '4px 10px', fontSize: 12 }}
        />
        {value && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 2 }}>
            <X size={14} />
          </button>
        )}
      </div>
    </Field>
  );
}

function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
      <div style={{ background: '#12121e', borderRadius: 14, width: '100%', maxWidth: 640, boxShadow: '0 8px 40px rgba(0,0,0,0.6)', border: '1px solid var(--admin-border, #2a2a3e)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--admin-border, #2a2a3e)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--admin-text, #e0e0e0)' }}>{title}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: '20px 22px', maxHeight: '70vh', overflowY: 'auto' }}>{children}</div>
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--admin-border, #2a2a3e)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="admin-cyber-btn admin-cyber-btn--ghost">Cancel</button>
          <button type="button" onClick={onSave} disabled={saving} className="admin-cyber-btn admin-cyber-btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {saving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Celebrity Looks Editor ───────────────────────────────────────────────── */

function CelebForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Celebrity Name *">
          <Input value={item.celebrity} onChange={set('celebrity')} placeholder="e.g. Deepika Padukone" />
        </Field>
        <Field label="Theme *">
          <Input value={item.theme} onChange={set('theme')} placeholder="e.g. Airport Look" />
        </Field>
      </div>
      <Field label="Card Title *">
        <Input value={item.title} onChange={set('title')} placeholder="e.g. Deepika's Classic Saree Elegance" />
      </Field>
      <ImageField label="Photo URL *" value={item.image} onChange={set('image')} />
      <Field label="Context">
        <Input value={item.context} onChange={set('context')} placeholder="e.g. Cannes Film Festival 2024" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Category">
          <Select value={item.category} onChange={set('category')} options={['lehengas','sarees','kurtas','co-ords','tops','women','men']} />
        </Field>
        <Field label="Knowledge Guide Slug">
          <Input value={item.knowledgeSlug} onChange={set('knowledgeSlug')} placeholder="e.g. what-is-anarkali" />
        </Field>
      </div>
      <Field label="Style Notes (one per line)" hint="Each line becomes a style tip shown on the page">
        <Textarea
          value={Array.isArray(item.styleNotes) ? item.styleNotes.join('\n') : (item.styleNotes || '')}
          onChange={(v) => set('styleNotes')(v.split('\n').filter(Boolean))}
          rows={4}
          placeholder={"Go for a silk blouse to elevate the look\nMatch with gold jhumkas"}
        />
      </Field>
      <Field label="Accent Color (hex)">
        <Input value={item.accent} onChange={set('accent')} placeholder="#c9a84c" />
      </Field>
    </div>
  );
}

/* ── Trend Pages Editor ───────────────────────────────────────────────────── */

function TrendForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title *">
          <Input value={item.title} onChange={set('title')} placeholder="Pastel Lehenga Trend" />
        </Field>
        <Field label="Slug *" hint="URL: /trends/your-slug">
          <Input value={item.slug} onChange={set('slug')} placeholder="pastel-lehenga-trend" />
        </Field>
      </div>
      <Field label="Eyebrow">
        <Input value={item.eyebrow} onChange={set('eyebrow')} placeholder="TRENDING NOW" />
      </Field>
      <Field label="Tagline">
        <Input value={item.tagline} onChange={set('tagline')} placeholder="The soft aesthetic taking over India" />
      </Field>
      <ImageField label="Hero Image URL" value={item.heroImage} onChange={set('heroImage')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Accent Color (hex)">
          <Input value={item.accent} onChange={set('accent')} placeholder="#c9a84c" />
        </Field>
        <Field label="Accent Light (hex)">
          <Input value={item.accentLight} onChange={set('accentLight')} placeholder="rgba(201,168,76,0.3)" />
        </Field>
      </div>
      <Field label="Categories (comma separated)">
        <Input
          value={Array.isArray(item.categories) ? item.categories.join(', ') : (item.categories || '')}
          onChange={(v) => set('categories')(v.split(',').map((s) => s.trim()).filter(Boolean))}
          placeholder="lehengas, sarees, co-ords"
        />
      </Field>
      <Field label="Description">
        <Textarea value={item.description} onChange={set('description')} rows={4} placeholder="Why this trend matters this season…" />
      </Field>
    </div>
  );
}

/* ── Knowledge Guide Editor ───────────────────────────────────────────────── */

const TOPICS = [
  { value: 'silhouettes', label: 'Silhouettes' },
  { value: 'fabrics', label: 'Fabrics' },
  { value: 'garments', label: 'Garments' },
  { value: 'colour', label: 'Colour' },
  { value: 'occasions', label: 'Occasions' },
  { value: 'styling', label: 'Styling' },
];

function GuideForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <Field label="Title *">
        <Input value={item.title} onChange={set('title')} placeholder="What is Anarkali?" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Slug *" hint="URL: /knowledge/your-slug">
          <Input value={item.slug} onChange={set('slug')} placeholder="what-is-anarkali" />
        </Field>
        <Field label="Topic">
          <Select value={item.topicSlug} onChange={set('topicSlug')} options={[{ value: '', label: 'Select topic…' }, ...TOPICS]} />
        </Field>
      </div>
      <ImageField label="Cover Image URL" value={item.image} onChange={set('image')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Read Time">
          <Input value={item.readTime} onChange={set('readTime')} placeholder="5 min read" />
        </Field>
        <Field label="Featured">
          <Select value={String(item.featured || false)} onChange={(v) => set('featured')(v === 'true')} options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes — show on homepage' }]} />
        </Field>
      </div>
      <Field label="Tags (comma separated)">
        <Input
          value={Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')}
          onChange={(v) => set('tags')(v.split(',').map((s) => s.trim()).filter(Boolean))}
          placeholder="anarkali, kurta, ethnic wear"
        />
      </Field>
      <Field label="Intro / Summary">
        <Textarea value={item.intro} onChange={set('intro')} rows={3} placeholder="A short introduction shown in previews and listings…" />
      </Field>
      <Field label="Body Content (markdown or plain text)">
        <Textarea value={item.body} onChange={set('body')} rows={8} placeholder={"## What is it?\n\nAnarkali is a long flared...\n\n## How to style it?"} />
      </Field>
      <Field label="Related Trend Slugs (comma separated)">
        <Input
          value={Array.isArray(item.relatedTrends) ? item.relatedTrends.join(', ') : (item.relatedTrends || '')}
          onChange={(v) => set('relatedTrends')(v.split(',').map((s) => s.trim()).filter(Boolean))}
          placeholder="pastel-lehengas, floral-kurtas"
        />
      </Field>
    </div>
  );
}

/* ── Quiz Editor (simplified) ─────────────────────────────────────────────── */

function QuizForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title *">
          <Input value={item.title} onChange={set('title')} placeholder="What's Your Style Personality?" />
        </Field>
        <Field label="Slug *" hint="URL: /quiz/your-slug">
          <Input value={item.slug} onChange={set('slug')} placeholder="style-personality" />
        </Field>
      </div>
      <Field label="Subtitle">
        <Input value={item.subtitle} onChange={set('subtitle')} placeholder="5 questions to discover your fashion DNA" />
      </Field>
      <Field label="Accent Color (hex)">
        <Input value={item.accent} onChange={set('accent')} placeholder="#600b45" />
      </Field>
      <div style={{
        padding: '12px 14px', borderRadius: 8,
        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
        fontSize: 12, color: 'var(--admin-text-soft, #888)', marginTop: 8,
      }}>
        <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 6, color: '#c9a84c' }} />
        Quiz questions and results are complex. For now you can edit basic info here. To edit questions, update <code>src/data/fashionQuizzes.js</code> in Cursor.
      </div>
    </div>
  );
}

/* ── Generic list tab ─────────────────────────────────────────────────────── */

function ContentTab({ type, apiType, staticData, FormComponent, getCardProps, tabIcon: TabIcon }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', item }
  const [saving, setSaving] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const seed = useCallback(async () => {
    try {
      await apiFetch(`/api/admin/content/${apiType}/seed`, {
        method: 'POST',
        body: JSON.stringify({ items: staticData }),
      });
      setSeeded(true);
    } catch {
      setSeeded(true);
    }
  }, [apiType, staticData]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/admin/content/${apiType}`);
      setItems(data.items || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [apiType]);

  useEffect(() => {
    seed().then(load);
  }, [seed, load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/admin/content/${apiType}`, {
        method: 'POST',
        body: JSON.stringify(modal.item),
      });
      showToast('Saved!', 'success');
      setModal(null);
      await load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const key = item.id || item.slug;
    if (!window.confirm(`Delete "${item.title || item.celebrity || key}"?`)) return;
    try {
      await apiFetch(`/api/admin/content/${apiType}/${key}`, { method: 'DELETE' });
      showToast('Deleted', 'success');
      setItems((prev) => prev.filter((x) => (x.id || x.slug) !== key));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openAdd = () => setModal({ mode: 'add', item: {} });
  const openEdit = (item) => setModal({ mode: 'edit', item: { ...item } });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          {loading ? 'Loading…' : `${items.length} items`}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={load} className="admin-cyber-btn admin-cyber-btn--ghost" style={{ fontSize: 12, padding: '5px 12px' }}>
            <RefreshCw size={13} />
          </button>
          <button type="button" onClick={openAdd} className="admin-cyber-btn admin-cyber-btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {items.map((item) => {
            const { img, title, sub, badge } = getCardProps(item);
            const key = item.id || item.slug;
            return (
              <div key={key} className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', padding: 0 }}>
                {img && (
                  <div style={{ height: 120, background: '#111', position: 'relative', overflow: 'hidden' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    {badge && (
                      <span style={{ position: 'absolute', top: 8, right: 8, background: '#600b45', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase' }}>
                        {badge}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 13, color: 'var(--admin-text, #e0e0e0)' }}>{title}</p>
                  {sub && <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>{sub}</p>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => openEdit(item)} className="admin-cyber-btn admin-cyber-btn--ghost" style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Edit2 size={11} /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(item)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(183,28,28,0.15)', color: '#ef9a9a', fontSize: 11 }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal
          title={`${modal.mode === 'add' ? 'Add New' : 'Edit'} ${type}`}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        >
          <FormComponent
            item={modal.item}
            onChange={(updated) => setModal((m) => ({ ...m, item: updated }))}
          />
        </Modal>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Root export ──────────────────────────────────────────────────────────── */

const TABS = [
  {
    id: 'celebrity-looks', label: 'Celebrity Looks', icon: Star,
    apiType: 'celebrity-looks',
    staticData: CELEBRITY_LOOKS,
    Form: CelebForm,
    card: (item) => ({ img: item.image, title: item.celebrity || item.title, sub: item.theme, badge: item.category }),
  },
  {
    id: 'trend-pages', label: 'Trend Pages', icon: TrendingUp,
    apiType: 'trend-pages',
    staticData: TREND_PAGES,
    Form: TrendForm,
    card: (item) => ({ img: item.heroImage, title: item.title, sub: item.tagline, badge: item.slug }),
  },
  {
    id: 'knowledge-pages', label: 'Knowledge Guides', icon: BookOpen,
    apiType: 'knowledge-pages',
    staticData: KNOWLEDGE_PAGES,
    Form: GuideForm,
    card: (item) => ({ img: item.image, title: item.title, sub: item.intro || item.topicSlug, badge: item.readTime }),
  },
  {
    id: 'quizzes', label: 'Quizzes', icon: Sparkles,
    apiType: 'quizzes',
    staticData: Object.values(FASHION_QUIZZES),
    Form: QuizForm,
    card: (item) => ({ img: null, title: item.title, sub: item.subtitle, badge: `/${item.slug}` }),
  },
];

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('celebrity-looks');
  const tab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="admin-cyber-page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--admin-text, #e0e0e0)' }}>
          Content Editor
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Add, edit, or delete Celebrity Looks, Trend Pages, Knowledge Guides, and Quizzes. Changes are saved to the database and appear on the live site instantly.
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        marginBottom: 22, padding: '12px 16px', borderRadius: 10,
        background: 'rgba(96,11,69,0.08)', border: '1px solid rgba(96,11,69,0.2)',
        fontSize: 12, color: 'var(--admin-text-soft, #888)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Check size={14} style={{ color: '#c9a84c', flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ color: '#c9a84c' }}>How it works:</strong> Content is seeded from your data files on first load, then stored in the database. Use <strong>Image Manager</strong> to upload photos → copy the URL → paste it in the image field below. Changes go live immediately.
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--admin-border, #2a2a3e)', marginBottom: 24 }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: 'none', borderRadius: '8px 8px 0 0',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === id ? 'var(--admin-surface, #1a1a2e)' : 'transparent',
              color: activeTab === id ? 'var(--admin-text, #e0e0e0)' : 'var(--admin-text-soft, #888)',
              borderBottom: `2px solid ${activeTab === id ? '#600b45' : 'transparent'}`,
              transition: 'all 0.15s',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab && (
        <ContentTab
          key={tab.id}
          type={tab.label}
          apiType={tab.apiType}
          staticData={tab.staticData}
          FormComponent={tab.Form}
          getCardProps={tab.card}
          tabIcon={tab.icon}
        />
      )}
    </div>
  );
}
