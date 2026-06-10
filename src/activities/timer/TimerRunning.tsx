import { HoldButton } from '../../components/HoldButton';
import { useWakeLock } from '../../lib/useWakeLock';
import { CountdownRing } from './CountdownRing';
import { HidingScene } from './HidingScene';
import type { Mood } from './characters';
import styles from './timer.module.css';

interface Props {
  characterId: string;
  progress: number;
  remainingMs: number;
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

export function TimerRunning({ characterId, progress, remainingMs, onCancel }: Props) {
  useWakeLock(true);
  const lastTen = remainingMs <= 10_000;

  return (
    <div className={`screen ${styles.runningScreen}`}>
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
