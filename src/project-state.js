import { validateProject } from './project-store.mjs';

function clone(value) {
  return structuredClone(value);
}

function equalState(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

/**
 * Create a small, framework-independent project state container.
 * Mutations are validated and committed atomically; failed updates leave state unchanged.
 */
export function createProjectState(initialProject, { historyLimit = 100 } = {}) {
  if (!Number.isInteger(historyLimit) || historyLimit < 1) {
    throw new RangeError('historyLimit must be a positive integer.');
  }

  validateProject(initialProject);
  let current = clone(initialProject);
  const past = [];
  const future = [];
  const listeners = new Set();

  function publish(reason) {
    const snapshot = clone(current);
    for (const listener of listeners) {
      try {
        listener(clone(snapshot), { reason, canUndo: past.length > 0, canRedo: future.length > 0 });
      } catch (error) {
        // A subscriber must not roll back or interrupt a committed state change.
        globalThis.console?.error?.('Laras Etam project-state subscriber failed:', error);
      }
    }
  }

  function commit(nextProject, reason) {
    validateProject(nextProject);
    const next = clone(nextProject);
    if (equalState(current, next)) return false;

    past.push(clone(current));
    if (past.length > historyLimit) past.shift();
    current = next;
    future.length = 0;
    publish(reason);
    return true;
  }

  return Object.freeze({
    getState() {
      return clone(current);
    },

    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('listener must be a function.');
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** Mutator receives a draft. It may mutate that draft or return a replacement project. */
    update(mutator, reason = 'update') {
      if (typeof mutator !== 'function') throw new TypeError('mutator must be a function.');
      const draft = clone(current);
      const replacement = mutator(draft);
      return commit(replacement === undefined ? draft : replacement, reason);
    },

    replace(project, reason = 'replace') {
      return commit(project, reason);
    },

    undo() {
      if (past.length === 0) return false;
      future.push(clone(current));
      current = past.pop();
      publish('undo');
      return true;
    },

    redo() {
      if (future.length === 0) return false;
      past.push(clone(current));
      if (past.length > historyLimit) past.shift();
      current = future.pop();
      publish('redo');
      return true;
    },

    canUndo() {
      return past.length > 0;
    },

    canRedo() {
      return future.length > 0;
    },

    clearHistory() {
      past.length = 0;
      future.length = 0;
      publish('history-cleared');
    },
  });
}
