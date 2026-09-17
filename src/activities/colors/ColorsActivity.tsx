import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { playBell, setMuted as setSoundMuted, speak, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import styles from "./colors.module.css";

interface Props {
  onExit: () => void;
}

const PUDDLES = [
  { name: "Red", color: "#e85d4a", freq: 261.63 },
  { name: "Orange", color: "#fb9b51", freq: 293.66 },
  { name: "Yellow", color: "#ffd166", freq: 329.63 },
  { name: "Green", color: "#4cc26b", freq: 392.0 },
  { name: "Blue", color: "#5ab0d4", freq: 440.0 },
  { name: "Pink", color: "#f582ae", freq: 523.25 },
];

export function ColorsActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [active, setActive] = useState<string | null>(null);
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  const splash = (name: string, freq: number) => {
    unlockAudio();
    playBell(freq, 0.18, 1.2);
    speak(name);
    setActive(name);
    window.setTimeout(() => setActive((cur) => (cur === name ? null : cur)), 420);
  };

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Colors"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <p className={styles.hint}>Tap a color</p>
      <div className={styles.grid}>
        {PUDDLES.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`${styles.puddle} ${active === p.name ? styles.splash : ""}`}
            style={{ background: p.color }}
            onPointerDown={() => splash(p.name, p.freq)}
            aria-label={p.name}
          >
            <span className={styles.label}>{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
