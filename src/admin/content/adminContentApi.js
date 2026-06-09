import { getAdminToken } from '../../api/client';

export function getToken() {
  return getAdminToken() || '';
}

export async function apiFetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...opts.headers,
    },
    ...opts,
    body: opts.body
      ? typeof opts.body === 'string'
        ? opts.body
        : JSON.stringify(opts.body)
      : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export function showToast(msg, type = 'info') {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    padding: '10px 18px',
    borderRadius: '8px',
    background: type === 'error' ? '#b71c1c' : type === 'success' ? '#1b5e20' : '#1a1a2e',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
