import test from 'node:test';
import assert from 'node:assert/strict';
import { loadProjectFromStorage, parseProject, ProjectFormatError, saveProjectToStorage, serializeProject } from '../src/project-store.mjs';

const project = {
  title: 'Uji Laras Etam',
  tracks: [{ id: 'demung', name: 'Demung', cells: [] }],
  measureCount: 8,
  beatsPerMeasure: 4,
  tempo: 84,
  custom: { preserved: true },
};

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

test('versioned serialization preserves project fields', () => {
  const result = parseProject(serializeProject(project, '2026-01-01T00:00:00.000Z'));
  assert.deepEqual(result, project);
});

test('parses legacy raw-state JSON', () => {
  assert.deepEqual(parseProject(JSON.stringify(project)), project);
});

test('rejects invalid project shapes and unsupported schema versions', () => {
  assert.throws(() => serializeProject({ ...project, tracks: null }), ProjectFormatError);
  assert.throws(() => parseProject(JSON.stringify({ format: 'laras-etam-project', schemaVersion: 999, project })), /Unsupported/);
});

test('saves and loads from browser storage', () => {
  const storage = memoryStorage();
  assert.equal(saveProjectToStorage(project, 'test', storage), 'laras-etam:project:test');
  assert.deepEqual(loadProjectFromStorage('test', storage), project);
  assert.equal(loadProjectFromStorage('missing', storage), null);
});

test('rejects malformed or oversized input', () => {
  assert.throws(() => parseProject('{'), /valid JSON/);
  assert.throws(() => parseProject('x'.repeat(8 * 1024 * 1024 + 1)), /8 MiB/);
});
