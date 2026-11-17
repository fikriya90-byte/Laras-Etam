import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectState } from '../src/project-state.js';

function makeProject() {
  return {
    title: 'Skor uji',
    tracks: [{ id: 'demung', name: 'Demung', cells: [] }],
    measureCount: 8,
    beatsPerMeasure: 4,
    tempo: 84,
  };
}

test('returns defensive copies so callers cannot mutate state accidentally', () => {
  const state = createProjectState(makeProject());
  const copy = state.getState();
  copy.title = 'diubah dari luar';
  assert.equal(state.getState().title, 'Skor uji');
});

test('commits valid updates, emits a notification, and supports undo/redo', () => {
  const state = createProjectState(makeProject());
  const events = [];
  state.subscribe((project, event) => events.push([project.title, event.reason]));

  assert.equal(state.update((draft) => { draft.title = 'Gending Baru'; }, 'rename'), true);
  assert.equal(state.getState().title, 'Gending Baru');
  assert.equal(state.canUndo(), true);
  assert.deepEqual(events, [['Gending Baru', 'rename']]);

  assert.equal(state.undo(), true);
  assert.equal(state.getState().title, 'Skor uji');
  assert.equal(state.canRedo(), true);
  assert.equal(state.redo(), true);
  assert.equal(state.getState().title, 'Gending Baru');
});

test('rejects invalid updates atomically and clears redo after a new edit', () => {
  const state = createProjectState(makeProject());
  state.update((draft) => { draft.title = 'Edit'; });
  state.undo();

  assert.throws(() => state.update((draft) => { draft.tracks = null; }), /tracks must be an array/);
  assert.equal(state.getState().title, 'Skor uji');
  assert.equal(state.canRedo(), true);

  state.update((draft) => { draft.tempo = 90; });
  assert.equal(state.canRedo(), false);
});

test('caps undo history and does not create history for no-op updates', () => {
  const state = createProjectState(makeProject(), { historyLimit: 2 });
  assert.equal(state.update((draft) => { draft.title = draft.title; }), false);
  state.update((draft) => { draft.title = 'one'; });
  state.update((draft) => { draft.title = 'two'; });
  state.update((draft) => { draft.title = 'three'; });
  assert.equal(state.undo(), true);
  assert.equal(state.getState().title, 'two');
  assert.equal(state.undo(), true);
  assert.equal(state.getState().title, 'one');
  assert.equal(state.undo(), false);
});

test('unsubscribes listeners and isolates listener exceptions', () => {
  const state = createProjectState(makeProject());
  let calls = 0;
  const unsubscribe = state.subscribe(() => { calls += 1; });
  const originalError = console.error;
  console.error = () => {};
  state.subscribe(() => { throw new Error('test subscriber error'); });
  try {
    state.update((draft) => { draft.title = 'updated'; });
  } finally {
    console.error = originalError;
  }
  unsubscribe();
  state.update((draft) => { draft.title = 'updated again'; });
  assert.equal(calls, 1);
  assert.equal(state.getState().title, 'updated again');
});

test('requires a valid initial project and valid history limit', () => {
  assert.throws(() => createProjectState({ title: 'missing fields' }), /tracks must be an array/);
  assert.throws(() => createProjectState(makeProject(), { historyLimit: 0 }), /positive integer/);
});
