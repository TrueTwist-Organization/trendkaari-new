/**
 * Image Manager — browse all product images, upload new ones, copy URLs.
 * Tabs: Uploaded | Lehengas | Sarees | Kurtas | Co-ords | Tops | Mens | …
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Search,
  ImageIcon,
  FolderOpen,
  AlertCircle,
  X,
} from 'lucide-react';
import { apiFetch, getAdminToken } from '../../api/client';

const BASE_URL = 'http://localhost:5173';

function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    padding: '10px 18px', borderRadius: '8px',
    background: type === 'error' ? '#b71c1c' : type === 'success' ? '#1b5e20' : '#1a1a2e',
    color: '#fff', fontSize: '13px', fontWeight: 600,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    animation: 'fadeIn 0.2s ease',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function ImageCard({ img, onCopy, onDelete, canDelete }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [broken, setBroken] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${BASE_URL}${img.url}`).then(() => {
      setCopied(true);
      onCopy(img.url);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${img.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await apiFetch('/api/admin/images', {
        method: 'DELETE',
        body: JSON.stringify({ filePath: img.url }),
      });
      onDelete(img.url);
      toast('Image deleted', 'success');
    } catch (err) {
      toast(err.message || 'Delete failed', 'error');
      setDeleting(false);
    }
  };

  return (
    <div style={{
      borderRadius: 10, overflow: 'hidden',
      background: 'var(--admin-surface, #1a1a2e)',
      border: '1px solid var(--admin-border, #2a2a3e)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', paddingBottom: '100%', background: '#111' }}>
        {broken ? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#555', gap: 6,
          }}>
            <AlertCircle size={24} />
            <span style={{ fontSize: 11 }}>No preview</span>
          </div>
        ) : (
          <img
            src={img.url}
            alt={img.name}
            onError={() => setBroken(true)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center',
            }}
          />
        )}
      </div>
      <div style={{ padding: '8px 10px' }}>
        <p style={{
          margin: '0 0 6px', fontSize: 11,
          color: 'var(--admin-text-soft, #888)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.4,
        }} title={img.url}>{img.url}</p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy URL"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: copied ? '#1b5e20' : 'rgba(255,255,255,0.08)',
              color: copied ? '#a5d6a7' : 'var(--admin-text-soft, #888)',
              fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete"
              style={{
                padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: 'rgba(183,28,28,0.15)', color: '#ef9a9a',
                fontSize: 11, transition: 'all 0.15s',
              }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DropZone({ onUpload, uploading }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    onUpload(Array.from(files));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? '#600b45' : 'var(--admin-border, #2a2a3e)'}`,
        borderRadius: 12, padding: '32px 24px',
        textAlign: 'center', cursor: 'pointer',
        background: dragging ? 'rgba(96,11,69,0.1)' : 'var(--admin-surface, #1a1a2e)',
        transition: 'all 0.15s', marginBottom: 20,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload size={32} style={{ color: '#600b45', marginBottom: 10 }} />
      <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--admin-text, #e0e0e0)', fontSize: 14 }}>
        {uploading ? 'Uploading…' : 'Drop images here or click to browse'}
      </p>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
        JPG, PNG, WebP · max 8 MB each · multiple files OK
      </p>
    </div>
  );
}

export default function ImageManagerPage() {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('product-media');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [lastCopied, setLastCopied] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await apiFetch('/api/admin/images/categories');
      setCategories(data);
    } catch {
      /* fallback to defaults */
    }
  }, []);

  const loadImages = useCallback(async (cat) => {
    setLoading(true);
    setImages([]);
    try {
      const data = await apiFetch(`/api/admin/images?category=${cat}`);
      setImages(data.images || []);
    } catch (err) {
      toast(err.message || 'Failed to load images', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadImages(activeTab);
  }, [activeTab, loadImages]);

  const handleUpload = async (files) => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    try {
      const token = getAdminToken();
      const res = await fetch('/api/admin/images/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      toast(`${data.urls?.length || 0} image(s) uploaded!`, 'success');
      if (activeTab === 'product-media') {
        await loadImages('product-media');
      } else {
        setActiveTab('product-media');
      }
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (url) => {
    setImages((prev) => prev.filter((img) => img.url !== url));
  };

  const filtered = search.trim()
    ? images.filter((img) => img.url.toLowerCase().includes(search.toLowerCase()))
    : images;

  return (
    <div className="admin-cyber-page">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--admin-text, #e0e0e0)' }}>
          Image Manager
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--admin-text-soft, #888)' }}>
          Browse all product images · Upload new ones · Copy URLs to use anywhere on the site.
        </p>
        {lastCopied && (
          <div style={{
            marginTop: 10, padding: '8px 14px', borderRadius: 8,
            background: 'rgba(27,94,32,0.15)', border: '1px solid rgba(27,94,32,0.3)',
            fontSize: 12, color: '#a5d6a7',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Check size={14} />
            Copied: <code style={{ wordBreak: 'break-all' }}>{lastCopied}</code>
          </div>
        )}
      </div>

      {/* Upload zone (always visible) */}
      <DropZone onUpload={handleUpload} uploading={uploading} />

      {/* How to use */}
      <div style={{
        marginBottom: 20, padding: '12px 16px', borderRadius: 10,
        background: 'rgba(96,11,69,0.08)', border: '1px solid rgba(96,11,69,0.2)',
        fontSize: 12, color: 'var(--admin-text-soft, #888)',
      }}>
        <strong style={{ color: '#c9a84c' }}>How to use:</strong> Upload your image above → it appears in the <strong>Uploaded</strong> tab → click <strong>Copy URL</strong> → paste it anywhere in the admin (product images, hero, celebrity looks, etc.)
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { key: 'product-media', label: 'Uploaded ⭐' },
          { key: 'lehengas', label: 'Lehengas' },
          { key: 'sarees', label: 'Sarees' },
          { key: 'kurtas', label: 'Kurtas' },
          { key: 'co-ords', label: 'Co-ords' },
          { key: 'tops', label: 'Tops' },
          { key: 'mens', label: 'Mens' },
          { key: 'dresses', label: 'Dresses' },
          { key: 'dupatta-sets', label: 'Dupatta Sets' },
          { key: 'suit-sets', label: 'Suit Sets' },
          { key: 'banners', label: 'Banners' },
          { key: 'combos', label: 'Combos' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: activeTab === key ? '#600b45' : 'var(--admin-surface, #1a1a2e)',
              color: activeTab === key ? '#fff' : 'var(--admin-text-soft, #888)',
              border: `1px solid ${activeTab === key ? '#600b45' : 'var(--admin-border, #2a2a3e)'}`,
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => loadImages(activeTab)}
          style={{
            marginLeft: 'auto', padding: '6px 10px', borderRadius: 20,
            border: '1px solid var(--admin-border, #2a2a3e)',
            background: 'transparent', color: 'var(--admin-text-soft, #888)',
            cursor: 'pointer', fontSize: 12,
          }}
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
        <input
          type="text"
          placeholder="Filter images…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', paddingLeft: 36, paddingRight: 12, height: 38, borderRadius: 8,
            border: '1px solid var(--admin-border, #2a2a3e)',
            background: 'var(--admin-surface, #1a1a2e)',
            color: 'var(--admin-text, #e0e0e0)', fontSize: 13,
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Count */}
      <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--admin-text-soft, #888)' }}>
        {loading ? 'Loading…' : `${filtered.length} image${filtered.length !== 1 ? 's' : ''}${search ? ' matching filter' : ''}`}
      </p>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--admin-text-soft, #888)' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 12 }}>Loading images…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 48,
          background: 'var(--admin-surface, #1a1a2e)',
          borderRadius: 12, border: '1px dashed var(--admin-border, #2a2a3e)',
        }}>
          <FolderOpen size={40} style={{ color: '#444', marginBottom: 12 }} />
          <p style={{ color: 'var(--admin-text-soft, #888)', fontSize: 13, margin: 0 }}>
            {search ? 'No images match your search' : 'No images found in this category'}
          </p>
          {activeTab === 'product-media' && !search && (
            <p style={{ color: 'var(--admin-text-soft, #888)', fontSize: 12, marginTop: 8 }}>
              Upload images using the drop zone above — they'll appear here.
            </p>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
        }}>
          {filtered.map((img) => (
            <ImageCard
              key={img.url}
              img={img}
              onCopy={(url) => setLastCopied(url)}
              onDelete={handleDelete}
              canDelete={activeTab === 'product-media'}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
