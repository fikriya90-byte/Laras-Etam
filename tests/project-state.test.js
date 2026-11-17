import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectState } from '../src/project-state.js';

function makeProject() {
  return {
    title: 'Skor Uji',
    tracks: [{ id: 'demung', name: 'Demung', cells: [] }],
    measureCount: 8,
    beatsPerMeasure: 4,
    tempo: 84,
  };
}

test('creates defensive copies and preserves valid state', () => {
  const state = createProjectState(makeProject());
  const copy = state.getState();
  copy.title = 'Diubah dari luar';
  assert.equal(state.getState().title, 'Skor Uji');
  assert.equal(state.canUndo(), false);
});

test('applies valid updates and supports undo/redo', () => {
  const state = createProjectState(makeProject());
  assert.equal(state.update((draft) => { draft.title = 'Gending Baru'; }, 'rename'), true);
  assert.equal(state.getState().title, 'Gending Baru');
  assert.equal(state.canUndo(), true);
  assert.equal(state.undo(), true);
  assert.equal(state.getState().title, 'Skor Uji');
  assert.equal(state.redo(), true);
  assert.equal(state.getState().title, 'Gending Baru');
});

test('rejects invalid changes and does not mutate the state on error', () => {
  const state = createProjectState(makeProject());
  assert.throws(() => state.update((draft) => {
    draft.tracks = null;
  }), /tracks must be an array/i);
  assert.equal(state.getState().title, 'Skor Uji');
});

test('clears redo stack after a new mutation and keeps history capped', () => {
  const state = createProjectState(makeProject(), { historyLimit: 2 });
  state.update((draft) => { draft.title = 'satu'; });
  state.update((draft) => { draft.title = 'dua'; });
  state.update((draft) => { draft.title = 'tiga'; });
  state.undo();
  assert.equal(state.getState().title, 'dua');
  assert.equal(state.canRedo(), true);
  state.update((draft) => { draft.title = 'baru'; });
  assert.equal(state.canRedo(), false);
});

test('validates initial data and historyLimit', () => {
  assert.throws(() => createProjectState({ title: 'invalid' }), /tracks must be an array/i);
  assert.throws(() => createProjectState(makeProject(), { historyLimit: 0 }), /positive integer/i);
});
