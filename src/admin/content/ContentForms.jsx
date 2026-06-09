import { useEffect, useRef, useState } from 'react';
import { Save, X, RefreshCw, Upload, AlertTriangle } from 'lucide-react';
import { apiFetch, getToken } from './adminContentApi';

export const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 7,
  border: '1px solid var(--admin-border, #2a2a3e)',
  background: 'var(--admin-surface, #1a1a2e)',
  color: 'var(--admin-text, #e0e0e0)',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};

export function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--admin-text-soft, #888)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {children}
      {hint && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#666' }}>{hint}</p>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: 'pointer' }}
    >
      {options.map((o) => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
  );
}

export function ImageField({ label, value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file?.type?.startsWith('image/')) {
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

  return (
    <Field label={label}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) uploadFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#600b45' : uploading ? '#c9a84c' : 'var(--admin-border, #2a2a3e)'}`,
          borderRadius: 10,
          padding: value ? '8px 12px' : '22px 16px',
          cursor: 'pointer',
          background: dragging ? 'rgba(96,11,69,0.1)' : 'var(--admin-surface, #1a1a2e)',
          marginBottom: 8,
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
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f);
            e.target.value = '';
          }}
        />
        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                objectFit: 'cover',
                flexShrink: 0,
                border: '2px solid #600b45',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--admin-text, #e0e0e0)' }}>
                {uploading ? 'Uploading…' : 'Image set'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--admin-text-soft, #888)', wordBreak: 'break-all' }}>
                {value}
              </p>
            </div>
          </>
        ) : (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Upload size={22} style={{ color: '#600b45', marginBottom: 6 }} />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Drag & drop or click to upload</p>
          </div>
        )}
      </div>
      {uploadErr && <p style={{ margin: '0 0 6px', fontSize: 12, color: '#ef9a9a' }}>{uploadErr}</p>}
      <Input value={value} onChange={onChange} placeholder="/product-media/photo.webp" />
    </Field>
  );
}

export function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#12121e',
          borderRadius: 14,
          width: '100%',
          maxWidth: 680,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          border: '1px solid var(--admin-border, #2a2a3e)',
        }}
      >
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--admin-border, #2a2a3e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--admin-text, #e0e0e0)' }}>{title}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '20px 22px', maxHeight: '70vh', overflowY: 'auto' }}>{children}</div>
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--admin-border, #2a2a3e)',
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
          }}
        >
          <button type="button" onClick={onClose} className="admin-cyber-btn admin-cyber-btn--ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="admin-cyber-btn admin-cyber-btn--primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {saving ? <RefreshCw size={14} className="admin-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function JsonField({ label, value, onChange, hint }) {
  const [text, setText] = useState(() => JSON.stringify(value ?? [], null, 2));
  const [err, setErr] = useState('');

  useEffect(() => {
    setText(JSON.stringify(value ?? [], null, 2));
    setErr('');
  }, [value]);

  const commit = (v) => {
    setText(v);
    try {
      onChange(JSON.parse(v || '[]'));
      setErr('');
    } catch {
      setErr('Invalid JSON — fix before saving.');
    }
  };

  return (
    <Field label={label} hint={hint || err}>
      <Textarea value={text} onChange={commit} rows={10} />
    </Field>
  );
}

export function CelebForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <Field label="ID (URL slug)" hint="/celebrity-match/your-id">
        <Input value={item.id} onChange={set('id')} placeholder="deepika-airport" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Celebrity Name *">
          <Input value={item.celebrity} onChange={set('celebrity')} placeholder="Deepika Padukone" />
        </Field>
        <Field label="Theme *">
          <Input value={item.theme} onChange={set('theme')} placeholder="EFFORTLESS" />
        </Field>
      </div>
      <Field label="Card Title *">
        <Input value={item.title} onChange={set('title')} placeholder="Quiet Luxury Kurta Set" />
      </Field>
      <Field label="Hook (short line)">
        <Input value={item.hook} onChange={set('hook')} placeholder="One-line teaser" />
      </Field>
      <ImageField label="Card Photo *" value={item.image} onChange={set('image')} />
      <ImageField label="Hero Photo" value={item.heroImage} onChange={set('heroImage')} />
      <Field label="Context">
        <Input value={item.context} onChange={set('context')} placeholder="Airport, Mumbai" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Category">
          <Select
            value={item.category}
            onChange={set('category')}
            options={['lehengas', 'sarees', 'kurtas', 'co-ords', 'tops', 'women', 'men', 'suit sets']}
          />
        </Field>
        <Field label="Knowledge Guide Slug">
          <Input value={item.knowledgeSlug} onChange={set('knowledgeSlug')} placeholder="what-is-anarkali" />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Quiz Slug">
          <Input value={item.quizSlug} onChange={set('quizSlug')} placeholder="festival-look" />
        </Field>
        <Field label="Magazine Category">
          <Input value={item.articleCategory} onChange={set('articleCategory')} placeholder="festival-fashion" />
        </Field>
      </div>
      <Field label="Style Notes (one per line)">
        <Textarea
          value={Array.isArray(item.styleNotes) ? item.styleNotes.join('\n') : ''}
          onChange={(v) => set('styleNotes')(v.split('\n').filter(Boolean))}
          rows={4}
        />
      </Field>
      <Field label="Accent Color">
        <Input value={item.accent} onChange={set('accent')} placeholder="#600b45" />
      </Field>
    </div>
  );
}

export function TrendForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title *">
          <Input value={item.title} onChange={set('title')} />
        </Field>
        <Field label="Slug *">
          <Input value={item.slug} onChange={set('slug')} placeholder="festival-fashion" />
        </Field>
      </div>
      <Field label="Eyebrow">
        <Input value={item.eyebrow} onChange={set('eyebrow')} />
      </Field>
      <Field label="Tagline">
        <Input value={item.tagline} onChange={set('tagline')} />
      </Field>
      <ImageField label="Hero Image" value={item.heroImage} onChange={set('heroImage')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Accent Color">
          <Input value={item.accent} onChange={set('accent')} placeholder="#e65100" />
        </Field>
        <Field label="Accent Light">
          <Input value={item.accentLight} onChange={set('accentLight')} placeholder="rgba(230,81,0,0.25)" />
        </Field>
      </div>
      <Field label="Categories (comma separated)">
        <Input
          value={Array.isArray(item.categories) ? item.categories.join(', ') : ''}
          onChange={(v) => set('categories')(v.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      </Field>
      <Field label="Description">
        <Textarea value={item.description} onChange={set('description')} rows={4} />
      </Field>
      <Field label="Celebrity IDs (comma separated)">
        <Input
          value={Array.isArray(item.celebrityIds) ? item.celebrityIds.join(', ') : ''}
          onChange={(v) => set('celebrityIds')(v.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      </Field>
      <JsonField
        label="Editorial blocks (JSON)"
        value={item.editorial}
        onChange={set('editorial')}
        hint="Paragraphs, headings, lists shown on the trend page"
      />
    </div>
  );
}

const TOPICS = [
  { value: 'silhouettes', label: 'Silhouettes' },
  { value: 'fabrics', label: 'Fabrics' },
  { value: 'garments', label: 'Garments' },
  { value: 'colour', label: 'Colour' },
  { value: 'occasions', label: 'Occasions' },
  { value: 'styling', label: 'Styling' },
];

export function GuideForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <Field label="Title *">
        <Input value={item.title} onChange={set('title')} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Slug *">
          <Input value={item.slug} onChange={set('slug')} />
        </Field>
        <Field label="Topic">
          <Select value={item.topicSlug} onChange={set('topicSlug')} options={[{ value: '', label: 'Select…' }, ...TOPICS]} />
        </Field>
      </div>
      <ImageField label="Cover Image" value={item.image} onChange={set('image')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Read Time">
          <Input value={item.readTime} onChange={set('readTime')} placeholder="5 min read" />
        </Field>
        <Field label="Featured">
          <Select
            value={String(item.featured || false)}
            onChange={(v) => set('featured')(v === 'true')}
            options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Yes' },
            ]}
          />
        </Field>
      </div>
      <Field label="Tags (comma separated)">
        <Input
          value={Array.isArray(item.tags) ? item.tags.join(', ') : ''}
          onChange={(v) => set('tags')(v.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      </Field>
      <Field label="Intro / Dek">
        <Textarea value={item.intro || item.dek} onChange={set('intro')} rows={3} />
      </Field>
      <JsonField
        label="Article sections (JSON)"
        value={item.sections}
        onChange={set('sections')}
        hint='Types: paragraph, heading, list, tip — e.g. {"type":"paragraph","text":"..."}'
      />
      <Field label="Related Trend Slugs">
        <Input
          value={Array.isArray(item.relatedTrends) ? item.relatedTrends.join(', ') : ''}
          onChange={(v) => set('relatedTrends')(v.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      </Field>
    </div>
  );
}

export function QuizForm({ item, onChange }) {
  const set = (k) => (v) => onChange({ ...item, [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Title *">
          <Input value={item.title} onChange={set('title')} />
        </Field>
        <Field label="Slug *">
          <Input value={item.slug} onChange={set('slug')} />
        </Field>
      </div>
      <Field label="Subtitle">
        <Input value={item.subtitle} onChange={set('subtitle')} />
      </Field>
      <Field label="Accent Color">
        <Input value={item.accent} onChange={set('accent')} placeholder="#600b45" />
      </Field>
      <JsonField label="Quiz steps (JSON)" value={item.steps} onChange={set('steps')} />
      <JsonField label="Quiz results (JSON object)" value={item.results} onChange={set('results')} />
    </div>
  );
}

export function ActionButtons({ onEdit, onDelete, previewHref }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {previewHref ? (
        <a
          href={`http://localhost:5173${previewHref}`}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-cyber-btn admin-cyber-btn--ghost"
          style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          Preview
        </a>
      ) : null}
      <button
        type="button"
        onClick={onEdit}
        className="admin-cyber-btn admin-cyber-btn--primary"
        style={{ fontSize: 12, padding: '4px 10px' }}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        style={{
          padding: '4px 10px',
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
          background: 'rgba(183,28,28,0.15)',
          color: '#ef9a9a',
          fontSize: 12,
        }}
      >
        Delete
      </button>
    </div>
  );
}
