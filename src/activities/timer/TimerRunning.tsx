import { useEffect, useRef } from 'react';
import { HoldButton } from '../../components/HoldButton';
import { playTick, startBusSong, stopBusSong } from '../../lib/sound';
import { useWakeLock } from '../../lib/useWakeLock';
import { CountdownRing } from './CountdownRing';
import { HidingScene } from './HidingScene';
import type { Mood } from './characters';
import styles from './timer.module.css';

interface Props {
  characterId: string;
  progress: number;
  remainingMs: number;
  muted: boolean;
  onToggleMute: () => void;
  onCancel: () => void;
}

function moodFor(progress: number): Mood {
  return progress > 0.5 ? 'happy' : 'excited';
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function TimerRunning({
  characterId,
  progress,
  remainingMs,
  muted,
  onToggleMute,
  onCancel,
}: Props) {
  useWakeLock(true);
  const lastTen = remainingMs <= 10_000;
  // The school bus sings "The Wheels on the Bus" instead of ticking.
  const singsInstead = characterId === 'builtin:bus';

  useEffect(() => {
    if (!singsInstead) return;
    startBusSong();
    return stopBusSong;
  }, [singsInstead]);

  // Tick-tock once per second while counting down.
  const secondsLeft = Math.ceil(remainingMs / 1000);
  const prevSecondsRef = useRef(secondsLeft);
  useEffect(() => {
    if (secondsLeft !== prevSecondsRef.current) {
      prevSecondsRef.current = secondsLeft;
      if (!singsInstead) playTick(secondsLeft <= 10);
    }
  }, [secondsLeft, singsInstead]);

  return (
    <div className={`screen ${styles.runningScreen}`}>
      <button
        type="button"
        className={styles.runningMute}
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <CountdownRing progress={progress} pulsing={lastTen}>
        <HidingScene
          characterId={characterId}
          mood={moodFor(progress)}
          revealed={false}
          excited={lastTen}
        />
      </CountdownRing>
      <div className={styles.remainingLabel}>{formatRemaining(remainingMs)}</div>
      <HoldButton onHoldComplete={onCancel} className={styles.stopButton}>
        Hold to stop
      </HoldButton>
    </div>
  );
}
