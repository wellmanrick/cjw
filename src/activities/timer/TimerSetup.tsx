import { useState } from 'react';
import { CharacterPicker } from './CharacterPicker';
import styles from './timer.module.css';

const PRESETS_MINUTES = [1, 2, 5, 10, 15];

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

  const step = (
    value: number,
    delta: number,
    max: number,
    set: (v: number) => void,
  ) => set(Math.min(max, Math.max(0, value + delta)));

  return (
    <div className={`screen ${styles.setupScreen}`}>
      <header className={styles.setupHeader}>
        <button type="button" className={styles.iconButton} onClick={onBack} aria-label="Back">
          ←
        </button>
        <h1 className={styles.setupTitle}>Timer</h1>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </header>

      <section>
        <h2 className={styles.sectionLabel}>Who's counting down?</h2>
        <CharacterPicker selectedId={characterId} onSelect={onSelectCharacter} />
      </section>

      <section>
        <h2 className={styles.sectionLabel}>How long?</h2>
        <div className={styles.presetRow}>
          {PRESETS_MINUTES.map((m) => (
            <button
              key={m}
              type="button"
              className={`${styles.presetButton} ${
                !showCustom && minutes === m && seconds === 0 ? styles.presetSelected : ''
              }`}
              onClick={() => {
                setMinutes(m);
                setSeconds(0);
                setShowCustom(false);
              }}
            >
              {m}
              <small>min</small>
            </button>
          ))}
          <button
            type="button"
            className={`${styles.presetButton} ${showCustom ? styles.presetSelected : ''}`}
            onClick={() => setShowCustom((v) => !v)}
          >
            ✏️
            <small>custom</small>
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
        ▶ Start
      </button>
    </div>
  );
}
