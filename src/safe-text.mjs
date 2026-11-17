export function normalizeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  const text = String(value).replace(/\u0000/g, '');
  return text === '' ? fallback : text;
}

export function escapeHtml(value, fallback = '') {
  const text = normalizeText(value, fallback);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function toSafeText(value, fallback = '') {
  return normalizeText(value, fallback);
}

export function safeTextForDom(value, fallback = '') {
  return escapeHtml(value, fallback);
}
