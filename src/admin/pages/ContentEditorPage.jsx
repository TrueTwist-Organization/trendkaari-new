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
  AlertTriangle, Check, Layout, ChevronUp, ChevronDown, Settings2,
} from 'lucide-react';
import { getAdminToken } from '../../api/client';
import { CELEBRITY_LOOKS } from '../../data/celebrityLooks';
import { TREND_PAGES } from '../../data/trendPages';
import { DISCOVERY_EXPERIENCE_BLOCKS, DEFAULT_DISCOVERY_CONFIG } from '../../data/discoveryExperience';
import { KNOWLEDGE_PAGES } from '../../data/fashionKnowledge';
import { FASHION_QUIZZES } from '../../data/fashionQuizzes';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function getToken() { return getAdminToken() || ''; }

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

/* ── Homepage Blocks Tab ─────────────────────────────────────────────────── */

const BLOCK_KINDS = [
  { value: 'quiz', label: 'Style Quiz' },
  { value: 'celebrity', label: 'Bollywood / Celebrity' },
  { value: 'viral', label: 'This Week / Viral' },
  { value: 'occasion', label: 'Occasion Picker' },
  { value: 'festive', label: 'Wedding & Festive' },
  { value: 'articles', label: 'Edit Desk / Articles' },
  { value: 'editorial', label: "Editor's Voice" },
  { value: 'debate', label: 'Style Debate' },
  { value: 'search', label: 'Trending Searches' },
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function parseOccasionChips(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, category, route] = line.split('|').map((s) => s.trim());
      const chip = { label };
      if (category) chip.category = category;
      if (route) chip.route = route;
      return chip;
    });
}

function formatOccasionChips(chips) {
  if (!Array.isArray(chips)) return '';
  return chips
    .map((c) => [c.label, c.category || '', c.route || ''].filter((_, i, arr) => i === 0 || arr[i]).join(' | '))
    .join('\n');
}

function HomepageBlockForm({ item, onChange, isNew }) {
  const set = (key) => (val) => onChange({ ...item, [key]: val });
  const kind = item.kind || 'quiz';

  return (
    <div>
      {!isNew && (
        <Field label="Block ID" hint="Internal identifier — don’t change unless you know what you’re doing">
          <Input value={item.id} onChange={set('id')} />
        </Field>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title *">
          <Input value={item.title} onChange={set('title')} placeholder="e.g. Find Your Style DNA" />
        </Field>
        <Field label="Block Type">
          <Select value={kind} onChange={set('kind')} options={BLOCK_KINDS} />
        </Field>
      </div>
      <Field label="Tagline (eyebrow on poster)">
        <Input value={item.tagline} onChange={set('tagline')} placeholder="e.g. Who are you, stylistically?" />
      </Field>
      <Field label="Hook (description below title)" hint="2–3 lines shown in the section">
        <Textarea value={item.hook} onChange={set('hook')} placeholder="Describe this section…" rows={3} />
      </Field>
      <ImageField label="Poster Image" value={item.poster} onChange={set('poster')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Accent Color">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input type="color" value={item.accent || '#600b45'} onChange={(e) => set('accent')(e.target.value)}
              style={{ width: 44, height: 34, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent' }} />
            <Input value={item.accent} onChange={set('accent')} placeholder="#600b45" />
          </div>
        </Field>
        <Field label="Dark Poster Style">
          <Select
            value={String(item.dark || false)}
            onChange={(v) => set('dark')(v === 'true')}
            options={[{ value: 'false', label: 'Light overlay' }, { value: 'true', label: 'Dark overlay' }]}
          />
        </Field>
      </div>
      <Field label="CTA Button Text">
        <Input value={item.ctaText} onChange={set('ctaText')} placeholder="e.g. Discover your style type" />
      </Field>
      <Field label="Route / Link">
        <Input value={item.route} onChange={set('route')} placeholder="e.g. /quiz/personality" />
      </Field>

      {kind === 'quiz' && (
        <>
          <Field label="Quiz Question (homepage preview)">
            <Input value={item.quizQuestion} onChange={set('quizQuestion')} placeholder="Which vibe feels most like you?" />
          </Field>
          <Field label="Quiz Options (one per line)" hint="Shown as clickable preview buttons on homepage">
            <Textarea
              value={Array.isArray(item.previewOptions) ? item.previewOptions.map((o) => o.label).join('\n') : ''}
              onChange={(v) => set('previewOptions')(v.split('\n').filter(Boolean).map((label) => ({ label })))}
              rows={4}
              placeholder={'Clean & understated\nBold & statement\nSoft & romantic'}
            />
          </Field>
        </>
      )}

      {kind === 'occasion' && (
        <Field label="Occasion Chips (one per line: Label | category | route)" hint="Route is optional">
          <Textarea
            value={formatOccasionChips(item.occasionChips)}
            onChange={(v) => set('occasionChips')(parseOccasionChips(v))}
            rows={6}
            placeholder={'Wedding Guest | lehengas\nOffice | kurtas\nBrunch | co-ords | /shop/co-ords'}
          />
        </Field>
      )}

      {kind === 'festive' && (
        <Field label="Festive Chips (comma separated)">
          <Input
            value={Array.isArray(item.festiveChips) ? item.festiveChips.join(', ') : ''}
            onChange={(v) => set('festiveChips')(v.split(',').map((s) => s.trim()).filter(Boolean))}
            placeholder="Sangeet, Reception, Mehendi, Diwali"
          />
        </Field>
      )}

      {kind === 'viral' && (
        <Field label="Social Proof Count">
          <Input value={item.savesCount} onChange={set('savesCount')} placeholder="e.g. 3,200+" />
        </Field>
      )}

      {kind === 'editorial' && (
        <Field label="Editor Quote">
          <Input value={item.editorQuote} onChange={set('editorQuote')} placeholder="Three pieces I'd wear right now" />
        </Field>
      )}
    </div>
  );
}

function HomepageBlocksTab() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', item }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await apiFetch('/api/admin/content/homepage-blocks/seed', {
        method: 'POST',
        body: JSON.stringify({ items: DISCOVERY_EXPERIENCE_BLOCKS }),
      });
      const data = await apiFetch('/api/admin/content/homepage-blocks');
      setBlocks(data.items || []);
      setError('');
    } catch (err) {
      try {
        const data = await apiFetch('/api/admin/content/homepage-blocks');
        setBlocks(data.items?.length ? data.items : DISCOVERY_EXPERIENCE_BLOCKS);
      } catch {
        setBlocks(DISCOVERY_EXPERIENCE_BLOCKS);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveOrder = async (nextBlocks) => {
    setBlocks(nextBlocks);
    try {
      await apiFetch('/api/admin/content/homepage-blocks', {
        method: 'PUT',
        body: JSON.stringify({ items: nextBlocks }),
      });
      showToast('Order saved', 'success');
    } catch (err) {
      showToast(err.message, 'error');
      load();
    }
  };

  const moveBlock = (index, direction) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    saveOrder(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const item = { ...modal.item };
      if (modal.mode === 'add') {
        item.id = item.id || `${slugify(item.title) || 'chapter'}-${Date.now()}`;
      }
      await apiFetch('/api/admin/content/homepage-blocks', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      showToast('Block saved!', 'success');
      setModal(null);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (block) => {
    if (!window.confirm(`Delete chapter "${block.title}"?`)) return;
    try {
      await apiFetch(`/api/admin/content/homepage-blocks/${block.id}`, { method: 'DELETE' });
      showToast('Deleted', 'success');
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openAdd = () => setModal({
    mode: 'add',
    item: { kind: 'quiz', accent: '#600b45', route: '/', tagline: '', hook: '', ctaText: 'Explore' },
  });

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-text-soft)' }}>Loading blocks…</div>;

  return (
    <div>
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(183,28,28,0.12)', border: '1px solid #b71c1c', color: '#ef9a9a', fontSize: 12, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={13} /> {error} — showing static fallback
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          {blocks.length} chapters · drag order with arrows · changes go live instantly
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={load} className="admin-cyber-btn admin-cyber-btn--ghost" style={{ fontSize: 12, padding: '5px 12px' }}>
            <RefreshCw size={13} />
          </button>
          <button type="button" onClick={openAdd} className="admin-cyber-btn admin-cyber-btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Plus size={14} /> Add Chapter
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {blocks.map((block, index) => (
          <div key={block.id} className="glass-panel" style={{ borderRadius: 12, overflow: 'hidden', padding: 0, border: `2px solid ${block.accent || '#2a2a3e'}22` }}>
            <div style={{ height: 130, background: '#111', position: 'relative', overflow: 'hidden' }}>
              {block.poster ? (
                <img
                  src={block.poster}
                  alt={block.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: '#444' }}>
                  <ImageIcon size={28} />
                  <span style={{ fontSize: 11 }}>No image</span>
                </div>
              )}
              <div style={{ position: 'absolute', top: 8, left: 8, width: 10, height: 10, borderRadius: '50%', background: block.accent || '#600b45', boxShadow: '0 0 6px rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} title="Move left"
                  style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.4 : 1, padding: '2px 4px' }}>
                  <ChevronUp size={12} style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} title="Move right"
                  style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: index === blocks.length - 1 ? 'default' : 'pointer', opacity: index === blocks.length - 1 ? 0.4 : 1, padding: '2px 4px' }}>
                  <ChevronDown size={12} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>
            </div>

            <div style={{ padding: '12px 14px' }}>
              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 13, color: 'var(--admin-text, #e0e0e0)' }}>{block.title}</p>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--admin-text-soft, #888)' }}>{block.tagline}</p>
              <p style={{ margin: '0 0 10px', fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{block.kind || block.id}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setModal({ mode: 'edit', item: { ...block } })}
                  className="admin-cyber-btn admin-cyber-btn--ghost"
                  style={{ fontSize: 11, padding: '5px 10px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  <Edit2 size={11} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(block)}
                  style={{ padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(183,28,28,0.15)', color: '#ef9a9a' }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add New Chapter' : `Edit: ${modal.item.title}`}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        >
          <HomepageBlockForm
            item={modal.item}
            isNew={modal.mode === 'add'}
            onChange={(updated) => setModal((m) => ({ ...m, item: updated }))}
          />
        </Modal>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Discovery Extras Tab (polls, trending, rail labels) ───────────────── */

function formatPollOptions(options) {
  if (!Array.isArray(options)) return '';
  return options.map((o) => `${o.id} | ${o.label} | ${o.emoji || ''}`).join('\n');
}

function parsePollOptions(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, label, emoji] = line.split('|').map((s) => s.trim());
      return { id: id || slugify(label), label, emoji: emoji || '✨' };
    });
}

function formatTrendingItems(items) {
  if (!Array.isArray(items)) return '';
  return items.map((t) => {
    if (t.route) return `${t.label} | route:${t.route}`;
    if (t.category) return `${t.label} | category:${t.category}`;
    return t.label;
  }).join('\n');
}

function parseTrendingItems(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, target] = line.split('|').map((s) => s.trim());
      const item = { label };
      if (target?.startsWith('route:')) item.route = target.replace('route:', '').trim();
      else if (target?.startsWith('category:')) item.category = target.replace('category:', '').trim();
      return item;
    });
}

function formatChallenges(items) {
  if (!Array.isArray(items)) return '';
  return items.map((c) => `${c.id} | ${c.title} | ${c.hook} | ${c.route} | ${c.accent || '#600b45'}`).join('\n');
}

function parseChallenges(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, title, hook, route, accent] = line.split('|').map((s) => s.trim());
      return { id, title, hook, route, accent: accent || '#600b45' };
    });
}

function DiscoveryExtrasTab() {
  const [config, setConfig] = useState(DEFAULT_DISCOVERY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pollsText, setPollsText] = useState('');
  const [trendingText, setTrendingText] = useState('');
  const [challengesText, setChallengesText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await apiFetch('/api/admin/discovery-config/seed', {
        method: 'POST',
        body: JSON.stringify(DEFAULT_DISCOVERY_CONFIG),
      });
      const data = await apiFetch('/api/admin/discovery-config');
      const cfg = data.config || DEFAULT_DISCOVERY_CONFIG;
      setConfig(cfg);
      setPollsText(
        (cfg.fashionPolls || [])
          .map((p) => `${p.id}\nQ: ${p.question}\nSub: ${p.subtext || ''}\n${formatPollOptions(p.options)}`)
          .join('\n---\n'),
      );
      setTrendingText(formatTrendingItems(cfg.trendingSearches));
      setChallengesText(formatChallenges(cfg.styleChallenges));
    } catch (err) {
      showToast(err.message, 'error');
      setConfig(DEFAULT_DISCOVERY_CONFIG);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const parsePollsFromText = (text) => {
    return String(text || '')
      .split('\n---\n')
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block.split('\n');
        const id = lines[0]?.trim() || `poll-${Date.now()}`;
        const question = lines.find((l) => l.startsWith('Q:'))?.replace('Q:', '').trim() || '';
        const subtext = lines.find((l) => l.startsWith('Sub:'))?.replace('Sub:', '').trim() || '';
        const optLines = lines.filter((l) => !l.startsWith('Q:') && !l.startsWith('Sub:') && l !== id);
        return {
          id,
          question,
          subtext,
          options: parsePollOptions(optLines.join('\n')),
        };
      });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...config,
        fashionPolls: parsePollsFromText(pollsText),
        trendingSearches: parseTrendingItems(trendingText),
        styleChallenges: parseChallenges(challengesText),
        editorNotes: Array.isArray(config.editorNotes)
          ? config.editorNotes
          : String(config.editorNotes || '').split('\n').filter(Boolean),
      };
      await apiFetch('/api/admin/discovery-config', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setConfig(payload);
      showToast('Discovery extras saved!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-text-soft)' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button type="button" onClick={handleSave} disabled={saving} className="admin-cyber-btn admin-cyber-btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {saving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save All Extras'}
        </button>
      </div>

      <div className="glass-panel" style={{ padding: 18, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Chapter Rail Header</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Rail Label (e.g. THIS EDIT)">
            <Input value={config.stripLabel} onChange={(v) => setConfig({ ...config, stripLabel: v })} />
          </Field>
          <Field label="Rail Subtitle">
            <Input value={config.stripSub} onChange={(v) => setConfig({ ...config, stripSub: v })} />
          </Field>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 18, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Editor&apos;s Voice Notes</h3>
        <Field label="Product notes (one per line, max 3 shown)" hint="Shown under each editor pick on homepage">
          <Textarea
            value={Array.isArray(config.editorNotes) ? config.editorNotes.join('\n') : ''}
            onChange={(v) => setConfig({ ...config, editorNotes: v.split('\n').filter(Boolean) })}
            rows={4}
          />
        </Field>
      </div>

      <div className="glass-panel" style={{ padding: 18, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Style Debate Polls</h3>
        <Field label="Poll blocks (separate with ---)" hint="Format per poll: id on line 1, Q: question, Sub: subtext, then options as id | label | emoji">
          <Textarea value={pollsText} onChange={setPollsText} rows={14} />
        </Field>
      </div>

      <div className="glass-panel" style={{ padding: 18, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Style Challenge Links</h3>
        <Field label="One per line: id | title | hook | route | accent">
          <Textarea value={challengesText} onChange={setChallengesText} rows={6} />
        </Field>
      </div>

      <div className="glass-panel" style={{ padding: 18, borderRadius: 12, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800 }}>Trending in India</h3>
        <Field label="One per line: Label | route:/path OR Label | category:slug">
          <Textarea value={trendingText} onChange={setTrendingText} rows={10} />
        </Field>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Root export ──────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'homepage-blocks', label: 'Homepage Chapters', icon: Layout, custom: 'homepage-blocks' },
  { id: 'discovery-extras', label: 'Polls & Trending', icon: Settings2, custom: 'discovery-extras' },
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
  const [activeTab, setActiveTab] = useState('homepage-blocks');
  const tab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="admin-cyber-page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--admin-text, #e0e0e0)' }}>
          Content Editor
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Edit homepage chapters, polls, trending terms, and all editorial content. Drag & drop images directly in any form field.
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
          <strong style={{ color: '#c9a84c' }}>How it works:</strong> Content is seeded from your data files on first load, then stored in the database.{' '}
          Use <strong>Image Manager</strong> to upload photos → copy the URL → paste it in any image field, or drag & drop directly. Changes go live immediately.
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

      {tab?.custom === 'homepage-blocks' && (
        <HomepageBlocksTab key="homepage-blocks" />
      )}

      {tab?.custom === 'discovery-extras' && (
        <DiscoveryExtrasTab key="discovery-extras" />
      )}

      {tab && !tab.custom && (
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
