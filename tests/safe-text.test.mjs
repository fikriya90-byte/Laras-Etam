import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, normalizeText, safeTextForDom, toSafeText } from '../src/safe-text.mjs';

test('normalizes nullish and empty values with a fallback', () => {
  assert.equal(normalizeText(null, 'N/A'), 'N/A');
  assert.equal(normalizeText('', 'fallback'), 'fallback');
  assert.equal(normalizeText('  hello  '), '  hello  ');
});

test('escapes HTML-sensitive text for DOM insertion', () => {
  const input = '<script>alert("x")</script> & <b>bold</b>';
  assert.equal(escapeHtml(input), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &lt;b&gt;bold&lt;/b&gt;');
  assert.equal(safeTextForDom('A & B', 'fallback'), 'A &amp; B');
});

test('preserves plain text while preventing unsafe content from becoming raw HTML', () => {
  assert.equal(toSafeText('Piano / Gamelan'), 'Piano / Gamelan');
  assert.equal(toSafeText(undefined, 'fallback'), 'fallback');
});
