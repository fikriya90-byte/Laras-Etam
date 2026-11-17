export function normalizeTrack(track = {}, index = 0) {
  const cells = Array.isArray(track.cells) ? track.cells : [];
  return {
    id: typeof track.id === 'string' && track.id.trim() ? track.id : `track_${index + 1}`,
    name: typeof track.name === 'string' && track.name.trim() ? track.name : `Track ${index + 1}`,
    role: typeof track.role === 'string' ? track.role : 'generic',
    timbre: typeof track.timbre === 'string' ? track.timbre : 'default',
    muted: Boolean(track.muted),
    solo: Boolean(track.solo),
    volume: Number.isFinite(Number(track.volume)) ? Number(track.volume) : 0.8,
    pan: Number.isFinite(Number(track.pan)) ? Number(track.pan) : 0,
    cells,
    ...(track.customSamples ? { customSamples: track.customSamples } : {}),
  };
}

export function normalizeProjectValue(rawProject = {}) {
  const project = rawProject && typeof rawProject === 'object' ? rawProject : {};

  const title = typeof project.title === 'string' && project.title.trim() ? project.title.trim() : 'Untitled Project';
  const subtitle = typeof project.subtitle === 'string' ? project.subtitle : '';
  const composer = typeof project.composer === 'string' ? project.composer : '';
  const systemMode = project.systemMode === 'western' ? 'western' : 'gamelan';
  const gaya = ['surakarta', 'yogyakarta', 'jawatimuran'].includes(project.gaya) ? project.gaya : 'surakarta';
  const laras = ['slendro', 'pelog', 'gabungan'].includes(project.laras) ? project.laras : 'slendro';
  const gendingForm = ['lancaran', 'ketawang', 'ladrang', 'srepegan', 'bebas'].includes(project.gendingForm)
    ? project.gendingForm
    : 'lancaran';

  const measureCount = Number.isInteger(project.measureCount) ? project.measureCount : 8;
  const beatsPerMeasure = Number.isInteger(project.beatsPerMeasure) ? project.beatsPerMeasure : 4;
  const tempo = Number.isFinite(Number(project.tempo)) ? Number(project.tempo) : 84;
  const tracks = Array.isArray(project.tracks)
    ? project.tracks.map((track, index) => normalizeTrack(track, index))
    : [];

  return {
    title,
    subtitle,
    composer,
    systemMode,
    gaya,
    laras,
    gendingForm,
    westernKey: typeof project.westernKey === 'string' ? project.westernKey : 'Do = C',
    beatsPerMeasure,
    measureCount,
    tempo,
    activeVoice: Number.isInteger(project.activeVoice) ? project.activeVoice : 1,
    tracks,
    colotomic: project.colotomic && typeof project.colotomic === 'object' ? project.colotomic : {},
    measureMarks: project.measureMarks && typeof project.measureMarks === 'object' ? project.measureMarks : {},
    customSamples: project.customSamples && typeof project.customSamples === 'object' ? project.customSamples : {},
    savedProjects: Array.isArray(project.savedProjects) ? project.savedProjects : [],
  };
}

export function importProjectFromJson(rawJson) {
  const loaded = typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson ?? {});
  const parsed = parseProject(loaded);
  return normalizeProjectValue(parsed);
}

export function stateToProjectSnapshot(state = {}) {
  return normalizeProjectValue(state);
}

export function applyProjectToState(targetState, rawProject) {
  const normalized = normalizeProjectValue(rawProject);
  Object.assign(targetState, normalized);
  return targetState;
}

export function saveCurrentProjectSnapshot(state, id = 'current', storage = globalThis.localStorage) {
  const normalized = normalizeProjectValue(state);
  return saveProjectState(normalized, id, storage);
}

export function loadCurrentProjectSnapshot(id = 'current', storage = globalThis.localStorage) {
  const data = loadProjectState(id, storage);
  return data ? normalizeProjectValue(data) : null;
}

export { parseProject, serializeProject, validateProject } from './project-store.mjs';
export { saveProjectState, loadProjectState, clearProjectState } from './project-persistence.js';
