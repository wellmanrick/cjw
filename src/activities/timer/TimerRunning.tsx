import { useEffect } from 'react';
import { HoldButton } from '../../components/HoldButton';
import { songForCharacter } from '../../lib/songs';
import { playAnimalStinger, playUrgencyAccent, startSong, stopSong } from '../../lib/sound';
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

  // The character calls out now and then — a moo, a woof, a quack — over the song.
  useEffect(() => {
    const first = window.setTimeout(() => playAnimalStinger(characterId), 1800);
    const loop = window.setInterval(() => playAnimalStinger(characterId), 7000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [characterId]);

  // A gentle accent in the final stretch (mute is read live inside the call).
  useEffect(() => {
    if (!lastTen) return;
    playUrgencyAccent();
    const loop = window.setInterval(playUrgencyAccent, 2000);
    return () => window.clearInterval(loop);
  }, [lastTen]);

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
