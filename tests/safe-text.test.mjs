import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, normalizeText, safeTextForDom, setTextContent, toSafeText } from '../src/safe-text.mjs';

test('normalizes nullish, empty, and NUL-containing values', () => {
  assert.equal(normalizeText(null, 'N/A'), 'N/A');
  assert.equal(normalizeText('', 'fallback'), 'fallback');
  assert.equal(normalizeText('  hello  '), '  hello  ');
  assert.equal(normalizeText('a\u0000b'), 'ab');
  assert.equal(normalizeText(undefined, null), '');
});

test('escapes HTML-sensitive text for an HTML text-node context', () => {
  const input = '<script>alert("x")</script> & <b>bold</b>';
  assert.equal(escapeHtml(input), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &lt;b&gt;bold&lt;/b&gt;');
  assert.equal(safeTextForDom('A & B', 'fallback'), 'A &amp; B');
});

test('preserves ordinary display text without interpreting markup', () => {
  assert.equal(toSafeText('Piano / Gamelan'), 'Piano / Gamelan');
  assert.equal(toSafeText(undefined, 'fallback'), 'fallback');
});

test('writes untrusted strings through textContent, not HTML parsing', () => {
  const element = { textContent: '' };
  assert.equal(setTextContent(element, '<img src=x onerror=alert(1)>'), true);
  assert.equal(element.textContent, '<img src=x onerror=alert(1)>');
  assert.equal(setTextContent({}, 'ignored'), false);
});
