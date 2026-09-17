import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { playBell, setMuted as setSoundMuted, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import styles from "./music.module.css";

interface Props {
  onExit: () => void;
}

const BARS = [
  { name: "Do", freq: 261.63, color: "#e85d4a" },
  { name: "Re", freq: 293.66, color: "#fb9b51" },
  { name: "Mi", freq: 329.63, color: "#ffd166" },
  { name: "Sol", freq: 392.0, color: "#4cc26b" },
  { name: "La", freq: 440.0, color: "#5ab0d4" },
  { name: "Do", freq: 523.25, color: "#7aa2e3" },
  { name: "Re", freq: 587.33, color: "#b388eb" },
  { name: "Mi", freq: 659.25, color: "#f582ae" },
];

export function MusicActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [lit, setLit] = useState<number | null>(null);
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  const play = (index: number, freq: number) => {
    unlockAudio();
    playBell(freq, 0.2, 1.4);
    setLit(index);
    window.setTimeout(() => setLit((cur) => (cur === index ? null : cur)), 180);
  };

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Music"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <p className={styles.hint}>Tap the bars</p>
      <div className={styles.rack}>
        {BARS.map((bar, i) => (
          <button
            key={`${bar.freq}-${i}`}
            type="button"
            className={`${styles.bar} ${lit === i ? styles.lit : ""}`}
            style={{
              background: bar.color,
              height: `${58 + i * 5}%`,
            }}
            onPointerDown={() => play(i, bar.freq)}
            aria-label={bar.name}
          />
        ))}
      </div>
    </div>
  );
}
