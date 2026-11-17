/** Normalize a value for display without interpreting it as markup. */
export function normalizeText(value, fallback = '') {
  const normalizedFallback = fallback === null || fallback === undefined ? '' : String(fallback);
  if (value === null || value === undefined) return normalizedFallback;
  const text = String(value).replace(/\u0000/g, '');
  return text === '' ? normalizedFallback : text;
}

/**
 * Escape text for insertion into an HTML text-node context only.
 * Do not use this for attributes, URLs, CSS, scripts, or rich HTML.
 * Prefer setTextContent() when an element is available.
 */
export function escapeHtml(value, fallback = '') {
  return normalizeText(value, fallback)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Return display text; pair this with textContent, never innerHTML. */
export function toSafeText(value, fallback = '') {
  return normalizeText(value, fallback);
}

/**
 * Safely writes untrusted display text to an element using textContent.
 * Returns false when no compatible element was supplied.
 */
export function setTextContent(element, value, fallback = '') {
  if (!element || !('textContent' in element)) return false;
  element.textContent = toSafeText(value, fallback);
  return true;
}

/** Backward-compatible name; escaped output is for HTML text-node context only. */
export function safeTextForDom(value, fallback = '') {
  return escapeHtml(value, fallback);
}
