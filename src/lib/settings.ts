export interface Settings {
  muted: boolean;
  /** 'builtin:<name>' or 'photo:<uuid>' */
  characterId: string;
  lastDurationMs: number;
}

const STORAGE_KEY = 'cjw.settings.v1';

const DEFAULTS: Settings = {
  muted: false,
  characterId: 'builtin:bunny',
  lastDurationMs: 5 * 60 * 1000,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(patch: Partial<Settings>): Settings {
  const next = { ...loadSettings(), ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable — settings just won't persist.
  }
  return next;
}
