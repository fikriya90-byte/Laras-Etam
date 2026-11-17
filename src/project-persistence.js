import { parseProject, serializeProject, validateProject } from './project-store.mjs';

export const PROJECT_STORAGE_PREFIX = 'laras-etam:project:';

export function getProjectStorageKey(id = 'current') {
  return `${PROJECT_STORAGE_PREFIX}${id}`;
}

export function saveProjectState(project, id = 'current', storage = globalThis.localStorage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new Error('Browser storage is unavailable.');
  }
  const key = getProjectStorageKey(id);
  validateProject(project);
  storage.setItem(key, serializeProject(project));
  return key;
}

export function loadProjectState(id = 'current', storage = globalThis.localStorage) {
  if (!storage || typeof storage.getItem !== 'function') {
    throw new Error('Browser storage is unavailable.');
  }
  const key = getProjectStorageKey(id);
  const raw = storage.getItem(key);
  return raw === null ? null : parseProject(raw);
}

export function clearProjectState(id = 'current', storage = globalThis.localStorage) {
  if (!storage || typeof storage.removeItem !== 'function') {
    throw new Error('Browser storage is unavailable.');
  }
  const key = getProjectStorageKey(id);
  storage.removeItem(key);
  return key;
}
