import { normalizeAdPlaintext } from './adSlotCode.js';

function looksLikeAdHtml(text = '') {
  const raw = String(text || '');
  return (
    /<(script|div|ins|iframe|img|a)[\s>]/i.test(raw) ||
    /div-gpt-ad|adsbygoogle/i.test(raw)
  );
}

/** True when saved slot decodes to real ad markup (not corrupt/garbage saves). */
export function isValidAdSlot(slot) {
  if (!slot?.placement) return false;
  const plain = normalizeAdPlaintext(slot.code, { encoded: slot.encoded !== false });
  return looksLikeAdHtml(plain);
}

export function sanitizeAdSlotList(list = []) {
  return (list || []).filter(isValidAdSlot);
}
