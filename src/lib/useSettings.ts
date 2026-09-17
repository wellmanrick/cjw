import { useEffect, useState } from "react";
import { DEFAULTS, loadSettings, saveSettings, type Settings } from "./settings";

/** SSR-safe settings: defaults on the server, persisted values after mount. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = (patch: Partial<Settings>) => {
    setSettings(saveSettings(patch));
  };

  return { settings, update };
}
