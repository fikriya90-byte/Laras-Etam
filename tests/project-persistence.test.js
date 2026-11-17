import test from 'node:test';
import assert from 'node:assert/strict';
import { clearProjectState, getProjectStorageKey, loadProjectState, saveProjectState } from '../src/project-persistence.js';

function makeProject() {
  return {
    title: 'Pemetik Lagu',
    tracks: [{ id: 'track-1', name: 'Suling', cells: [] }],
    measureCount: 8,
    beatsPerMeasure: 4,
    tempo: 70,
  };
}

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test('saves a validated project and returns its storage key', () => {
  const storage = createMemoryStorage();
  const project = makeProject();
  const key = saveProjectState(project, 'autosave', storage);
  assert.equal(key, getProjectStorageKey('autosave'));
  assert.deepEqual(loadProjectState('autosave', storage), project);
});

test('loads null when no project has been saved', () => {
  const storage = createMemoryStorage();
  assert.equal(loadProjectState('missing', storage), null);
});

test('removes a saved project from storage', () => {
  const storage = createMemoryStorage();
  saveProjectState(makeProject(), 'latest', storage);
  assert.equal(clearProjectState('latest', storage), getProjectStorageKey('latest'));
  assert.equal(loadProjectState('latest', storage), null);
});

test('rejects invalid project payloads before writing them', () => {
  const storage = createMemoryStorage();
  assert.throws(() => saveProjectState({ title: 'invalid' }, 'broken', storage), /tracks must be an array/i);
  assert.equal(loadProjectState('broken', storage), null);
});
