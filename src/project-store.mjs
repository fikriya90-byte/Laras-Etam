const FORMAT = 'laras-etam-project';
const VERSION = 1;
const MAX_BYTES = 8 * 1024 * 1024;

export class ProjectFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProjectFormatError';
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function validateProject(project) {
  if (!isRecord(project)) throw new ProjectFormatError('Project must be a JSON object.');
  if (typeof project.title !== 'string' || !project.title.trim()) {
    throw new ProjectFormatError('Project title is required.');
  }
  if (!Array.isArray(project.tracks)) throw new ProjectFormatError('Project tracks must be an array.');
  if (!Number.isInteger(project.measureCount) || project.measureCount < 1 || project.measureCount > 512) {
    throw new ProjectFormatError('measureCount must be an integer from 1 to 512.');
  }
  if (!Number.isInteger(project.beatsPerMeasure) || project.beatsPerMeasure < 1 || project.beatsPerMeasure > 32) {
    throw new ProjectFormatError('beatsPerMeasure must be an integer from 1 to 32.');
  }
  project.tracks.forEach((track, index) => {
    if (!isRecord(track) || typeof track.name !== 'string' || !Array.isArray(track.cells)) {
      throw new ProjectFormatError(`Track ${index + 1} has an invalid shape.`);
    }
  });
  return project;
}

export function serializeProject(project, savedAt = new Date().toISOString()) {
  validateProject(project);
  return JSON.stringify({ format: FORMAT, schemaVersion: VERSION, savedAt, project }, null, 2);
}

/** Accept versioned project files as well as legacy files containing raw state. */
export function parseProject(text) {
  if (typeof text !== 'string') throw new ProjectFormatError('Project content must be text.');
  if (new TextEncoder().encode(text).byteLength > MAX_BYTES) {
    throw new ProjectFormatError('Project file exceeds the 8 MiB limit.');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ProjectFormatError('Project file is not valid JSON.');
  }

  if (isRecord(parsed) && parsed.format === FORMAT) {
    if (parsed.schemaVersion !== VERSION) {
      throw new ProjectFormatError(`Unsupported project schema version: ${parsed.schemaVersion}.`);
    }
    return validateProject(parsed.project);
  }

  return validateProject(parsed);
}

export function saveProjectToStorage(project, id = 'current', storage = globalThis.localStorage) {
  if (!storage) throw new ProjectFormatError('Browser storage is unavailable.');
  const key = `laras-etam:project:${id}`;
  try {
    storage.setItem(key, serializeProject(project));
  } catch {
    throw new ProjectFormatError('Could not save project. Browser storage may be full or unavailable.');
  }
  return key;
}

export function loadProjectFromStorage(id = 'current', storage = globalThis.localStorage) {
  if (!storage) throw new ProjectFormatError('Browser storage is unavailable.');
  const text = storage.getItem(`laras-etam:project:${id}`);
  return text === null ? null : parseProject(text);
}
