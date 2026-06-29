import { useEffect } from 'react';
import { HoldButton } from '../../components/HoldButton';
import { songForCharacter } from '../../lib/songs';
import { startSong, stopSong } from '../../lib/sound';
import { playAnimalStinger, playUrgencyAccent } from '../../lib/soundEffects';
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

  // Every character sings its own tune while it hides.
  useEffect(() => {
    startSong(songForCharacter(characterId));
    return stopSong;
  }, [characterId]);

  // A small animal/machine sound now and then makes each character feel alive.
  useEffect(() => {
    const first = window.setTimeout(() => playAnimalStinger(characterId, muted), 1800);
    const loop = window.setInterval(() => playAnimalStinger(characterId, muted), 7000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [characterId, muted]);

  // The final stretch gets brighter so toddlers can feel the reveal coming.
  useEffect(() => {
    if (!lastTen) return;
    playUrgencyAccent(muted);
    const loop = window.setInterval(() => playUrgencyAccent(muted), 1000);
    return () => window.clearInterval(loop);
  }, [lastTen, muted]);

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
