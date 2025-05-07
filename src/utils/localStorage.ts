const STORAGE_KEY = 'kanban-data';

export function loadState<T>(key = STORAGE_KEY): T | null {
  try {
    const serialized = window.localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized) as T;
  } catch {
    console.warn(`Could not load state for "${key}"`);
    return null;
  }
}

export function saveState<T>(state: T, key = STORAGE_KEY): void {
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(key, serialized);
  } catch {
    console.warn(`Could not save state for "${key}"`);
  }
}
