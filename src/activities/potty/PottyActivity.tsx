import { useEffect, useState } from 'react';
import { Confetti } from '../../components/Confetti';
import { loadSettings, saveSettings } from '../../lib/settings';
import { SONGS } from '../../lib/songs';
import {
  playCelebration,
  playCheer,
  playFlush,
  setMuted as setSoundMuted,
  startSong,
  stopSong,
  unlockAudio,
} from '../../lib/sound';
import { useWakeLock } from '../../lib/useWakeLock';
import { Toilet } from './Toilet';
import styles from './potty.module.css';

type Phase = 'sitting' | 'celebrating';

interface Props {
  onExit: () => void;
}

export function PottyActivity({ onExit }: Props) {
  const [settings, setSettings] = useState(loadSettings);
  const [phase, setPhase] = useState<Phase>('sitting');
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  // The jingle loops while sitting, and stops the moment we celebrate or leave.
  useEffect(() => {
    if (phase !== 'sitting') return;
    startSong(SONGS.potty);
    return stopSong;
  }, [phase]);

  const celebrate = () => {
    unlockAudio();
    stopSong();
    playCheer();
    playCelebration();
    window.setTimeout(playFlush, 250);
    setPhase('celebrating');
  };

  const toggleMute = () => setSettings((s) => saveSettings({ muted: !s.muted }));

  if (phase === 'celebrating') {
    return (
      <div className={`screen ${styles.celebrateScreen}`}>
        <Confetti />
        <h1 className={styles.yay}>Yeaaah!</h1>
        <div className={styles.toilet}>
          <Toilet flushing />
        </div>
        <p className={styles.praise}>You did it! 🎉</p>
        <div className={styles.buttons}>
          <button type="button" className={styles.againButton} onClick={() => setPhase('sitting')}>
            🔁 Again
          </button>
          <button type="button" className={styles.doneButton} onClick={onExit}>
            ✅ Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`screen ${styles.sitScreen}`}>
      <header className={styles.header}>
        <button type="button" className={styles.iconButton} onClick={onExit} aria-label="Back">
          ←
        </button>
        <h1 className={styles.title}>Potty Time</h1>
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleMute}
          aria-label={settings.muted ? 'Unmute' : 'Mute'}
        >
          {settings.muted ? '🔇' : '🔊'}
        </button>
      </header>
      <div className={styles.toilet}>
        <Toilet flushing={false} />
      </div>
      <p className={styles.prompt}>Let's go potty!</p>
      <button type="button" className={styles.goButton} onClick={celebrate}>
        I went potty! 🎉
      </button>
    </div>
  );
}
