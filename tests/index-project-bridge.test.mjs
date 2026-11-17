import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProjectValue, importProjectFromJson, stateToProjectSnapshot } from '../src/index-project-bridge.js';

test('normalizeProjectValue fills legacy gaps with safe defaults', () => {
  const result = normalizeProjectValue({
    title: '  Demo  ',
    tracks: [{ name: 'Demung', cells: [{ val: '1' }] }],
  });

  assert.equal(result.title, 'Demo');
  assert.equal(result.systemMode, 'gamelan');
  assert.equal(result.laras, 'slendro');
  assert.equal(result.measureCount, 8);
  assert.equal(result.tracks[0].name, 'Demung');
  assert.deepEqual(result.colotomic, {});
});

test('importProjectFromJson accepts legacy project payloads', () => {
  const raw = {
    title: 'Legacy Score',
    systemMode: 'western',
    laras: 'pelog',
    tracks: [{ name: 'Piano', cells: [{ val: '1' }] }],
    measureCount: 16,
    beatsPerMeasure: 4,
  };

  const result = importProjectFromJson(raw);
  assert.equal(result.title, 'Legacy Score');
  assert.equal(result.systemMode, 'western');
  assert.equal(result.laras, 'pelog');
  assert.equal(result.tracks.length, 1);
});

test('stateToProjectSnapshot keeps normalized structure for a live state object', () => {
  const snapshot = stateToProjectSnapshot({
    title: 'Real Time',
    frase: 'skip me',
    tracks: [{ id: 't1', name: 'Saron', role: 'saron', cells: [{ val: '5' }] }],
  });

  assert.equal(snapshot.title, 'Real Time');
  assert.equal(snapshot.tracks[0].id, 't1');
  assert.equal(snapshot.tracks[0].role, 'saron');
  assert.equal(snapshot.beatsPerMeasure, 4);
});
