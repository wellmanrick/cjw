import { useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { CharacterPicker } from "./CharacterPicker";
import styles from "./timer.module.css";

const PRESETS: Array<{ label: string; unit: string; minutes: number; seconds: number }> = [
  { label: "30", unit: "sec", minutes: 0, seconds: 30 },
  { label: "1", unit: "min", minutes: 1, seconds: 0 },
  { label: "2", unit: "min", minutes: 2, seconds: 0 },
  { label: "5", unit: "min", minutes: 5, seconds: 0 },
  { label: "10", unit: "min", minutes: 10, seconds: 0 },
];

interface Props {
  characterId: string;
  initialDurationMs: number;
  muted: boolean;
  onSelectCharacter: (id: string) => void;
  onToggleMute: () => void;
  onStart: (durationMs: number) => void;
  onBack: () => void;
}

export function TimerSetup({
  characterId,
  initialDurationMs,
  muted,
  onSelectCharacter,
  onToggleMute,
  onStart,
  onBack,
}: Props) {
  const [minutes, setMinutes] = useState(Math.floor(initialDurationMs / 60000));
  const [seconds, setSeconds] = useState(Math.floor((initialDurationMs % 60000) / 1000));
  const [showCustom, setShowCustom] = useState(false);

  const durationMs = (minutes * 60 + seconds) * 1000;

  const isPreset = (p: (typeof PRESETS)[number]) =>
    !showCustom && minutes === p.minutes && seconds === p.seconds;

  const step = (value: number, delta: number, max: number, set: (v: number) => void) =>
    set(Math.min(max, Math.max(0, value + delta)));

  return (
    <div className={`screen ${styles.setupScreen}`}>
      <ActivityHeader title="Timer" muted={muted} onToggleMute={onToggleMute} onBack={onBack} />

      <section>
        <h2 className={styles.sectionLabel}>Who hides?</h2>
        <CharacterPicker selectedId={characterId} onSelect={onSelectCharacter} />
      </section>

      <section>
        <h2 className={styles.sectionLabel}>How long?</h2>
        <div className={styles.presetRow}>
          {PRESETS.map((p) => (
            <button
              key={`${p.label}${p.unit}`}
              type="button"
              className={`${styles.presetButton} ${isPreset(p) ? styles.presetSelected : ""}`}
              onClick={() => {
                setMinutes(p.minutes);
                setSeconds(p.seconds);
                setShowCustom(false);
              }}
            >
              {p.label}
              <small>{p.unit}</small>
            </button>
          ))}
          <button
            type="button"
            className={`${styles.presetButton} ${showCustom ? styles.presetSelected : ""}`}
            onClick={() => setShowCustom((v) => !v)}
          >
            +
            <small>more</small>
          </button>
        </div>

        {showCustom && (
          <div className={styles.customRow}>
            <div className={styles.stepper}>
              <button type="button" onClick={() => step(minutes, 1, 99, setMinutes)} aria-label="More minutes">
                +
              </button>
              <div className={styles.stepperValue}>
                {minutes}
                <small>min</small>
              </div>
              <button type="button" onClick={() => step(minutes, -1, 99, setMinutes)} aria-label="Fewer minutes">
                −
              </button>
            </div>
            <div className={styles.stepper}>
              <button type="button" onClick={() => step(seconds, 5, 55, setSeconds)} aria-label="More seconds">
                +
              </button>
              <div className={styles.stepperValue}>
                {seconds}
                <small>sec</small>
              </div>
              <button type="button" onClick={() => step(seconds, -5, 55, setSeconds)} aria-label="Fewer seconds">
                −
              </button>
            </div>
          </div>
        )}
      </section>

      <button
        type="button"
        className={styles.startButton}
        disabled={durationMs === 0}
        onClick={() => onStart(durationMs)}
      >
        Start
      </button>
    </div>
  );
}
