import { validateProject } from './project-store.mjs';

function clone(value) {
  return structuredClone(value);
}

function isEquivalent(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function createProjectState(initialProject, { historyLimit = 50 } = {}) {
  if (!Number.isInteger(historyLimit) || historyLimit < 1) {
    throw new RangeError('historyLimit must be a positive integer.');
  }

  validateProject(initialProject);

  let current = clone(initialProject);
  const undoStack = [];
  const redoStack = [];
  const listeners = new Set();

  function notify(reason) {
    const snapshot = clone(current);
    for (const listener of listeners) {
      try {
        listener(snapshot, {
          reason,
          canUndo: undoStack.length > 0,
          canRedo: redoStack.length > 0,
        });
      } catch (error) {
        console.error('Project state listener failed:', error);
      }
    }
  }

  function commit(nextProject, reason) {
    validateProject(nextProject);
    const candidate = clone(nextProject);
    if (isEquivalent(current, candidate)) return false;

    undoStack.push(clone(current));
    if (undoStack.length > historyLimit) undoStack.shift();
    current = candidate;
    redoStack.length = 0;
    notify(reason);
    return true;
  }

  return Object.freeze({
    getState() {
      return clone(current);
    },

    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('listener must be a function');
      }
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    update(mutator, reason = 'update') {
      if (typeof mutator !== 'function') {
        throw new TypeError('mutator must be a function');
      }
      const draft = clone(current);
      const result = mutator(draft);
      const next = result === undefined ? draft : result;
      return commit(next, reason);
    },

    replace(project, reason = 'replace') {
      return commit(project, reason);
    },

    undo() {
      if (undoStack.length === 0) return false;
      redoStack.push(clone(current));
      current = undoStack.pop();
      notify('undo');
      return true;
    },

    redo() {
      if (redoStack.length === 0) return false;
      undoStack.push(clone(current));
      if (undoStack.length > historyLimit) undoStack.shift();
      current = redoStack.pop();
      notify('redo');
      return true;
    },

    canUndo() {
      return undoStack.length > 0;
    },

    canRedo() {
      return redoStack.length > 0;
    },
  });
}
