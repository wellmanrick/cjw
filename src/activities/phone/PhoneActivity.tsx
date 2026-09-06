import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/settings';
import { songForCharacter } from '../../lib/songs';
import {
  playBell,
  playHello,
  playRingBurst,
  setMuted as setSoundMuted,
  startSong,
  stopSong,
  unlockAudio,
} from '../../lib/sound';
import { useWakeLock } from '../../lib/useWakeLock';
import { builtinCharacters, getBuiltinCharacter } from '../timer/characters';
import styles from './phone.module.css';

type Phase = 'idle' | 'ringing' | 'talking';

interface Props {
  onExit: () => void;
}

/* Pentatonic bells across two octaves — any mash of keys sounds musical. */
const KEYS: Array<{ label: string; freq: number; color: string }> = [
  { label: '1', freq: 261.63, color: '#f582ae' },
  { label: '2', freq: 293.66, color: '#ffd166' },
  { label: '3', freq: 329.63, color: '#8bd3dd' },
  { label: '4', freq: 392.0, color: '#b388eb' },
  { label: '5', freq: 440.0, color: '#79c270' },
  { label: '6', freq: 523.25, color: '#fb9b51' },
  { label: '7', freq: 587.33, color: '#8bd3dd' },
  { label: '8', freq: 659.25, color: '#f582ae' },
  { label: '9', freq: 783.99, color: '#ffd166' },
  { label: '★', freq: 880.0, color: '#b388eb' },
  { label: '0', freq: 1046.5, color: '#79c270' },
  { label: '♥', freq: 1174.66, color: '#fb9b51' },
];

const RING_MS = 3600;

function randomFriend(): string {
  return builtinCharacters[Math.floor(Math.random() * builtinCharacters.length)].id;
}

export function PhoneActivity({ onExit }: Props) {
  const [settings, setSettings] = useState(loadSettings);
  const [phase, setPhase] = useState<Phase>('idle');
  const [friendId, setFriendId] = useState<string | null>(null);
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  // Ring-ring... then the friend picks up.
  useEffect(() => {
    if (phase !== 'ringing') return;
    playRingBurst();
    const second = window.setTimeout(playRingBurst, 1800);
    const answer = window.setTimeout(() => {
      playHello();
      setPhase('talking');
    }, RING_MS);
    return () => {
      window.clearTimeout(second);
      window.clearTimeout(answer);
    };
  }, [phase]);

  // While talking, the friend sings its song.
  useEffect(() => {
    if (phase !== 'talking' || !friendId) return;
    const id = window.setTimeout(() => startSong(songForCharacter(friendId)), 600);
    return () => {
      window.clearTimeout(id);
      stopSong();
    };
  }, [phase, friendId]);

  const call = (id: string) => {
    unlockAudio();
    setFriendId(id);
    setPhase('ringing');
  };

  const hangUp = () => {
    stopSong();
    setPhase('idle');
    setFriendId(null);
  };

  const toggleMute = () => setSettings((s) => saveSettings({ muted: !s.muted }));
  const friend = friendId ? getBuiltinCharacter(friendId) : null;

  return (
    <div className={`screen ${styles.phoneScreen}`}>
      <header className={styles.header}>
        <button type="button" className={styles.iconButton} onClick={onExit} aria-label="Back">
          ←
        </button>
        <h1 className={styles.title}>Play Phone</h1>
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleMute}
          aria-label={settings.muted ? 'Unmute' : 'Mute'}
        >
          {settings.muted ? '🔇' : '🔊'}
        </button>
      </header>

      <div className={styles.phone}>
        <div className={styles.display}>
          {phase === 'idle' && (
            <>
              <p className={styles.displayText}>Who should we call?</p>
              <div className={styles.contacts}>
                <button
                  type="button"
                  className={`${styles.contact} ${styles.surpriseContact}`}
                  onClick={() => call(randomFriend())}
                  aria-label="Surprise friend"
                >
                  ?
                </button>
                {builtinCharacters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={styles.contact}
                    onClick={() => call(c.id)}
                    aria-label={`Call ${c.name}`}
                  >
                    {c.render('happy')}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === 'ringing' && friend && (
            <div className={styles.callView}>
              <div className={`${styles.callee} ${styles.calleeRinging}`}>{friend.render('excited')}</div>
              <p className={styles.displayText}>Ring ring… calling {friend.name}</p>
            </div>
          )}

          {phase === 'talking' && friend && (
            <div className={styles.callView}>
              <div className={styles.bubble}>Hi!</div>
              <div className={`${styles.callee} ${styles.calleeTalking}`}>{friend.render('party')}</div>
              <p className={styles.displayText}>{friend.name} says hello!</p>
            </div>
          )}
        </div>

        <div className={styles.keypad}>
          {KEYS.map((k) => (
            <button
              key={k.label}
              type="button"
              className={styles.key}
              style={{ background: k.color }}
              onPointerDown={() => playBell(k.freq)}
              aria-label={`Key ${k.label}`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <div className={styles.callBar}>
          {phase === 'idle' ? (
            <button type="button" className={styles.callButton} onClick={() => call(randomFriend())} aria-label="Call">
              📞
            </button>
          ) : (
            <button type="button" className={styles.hangUpButton} onClick={hangUp} aria-label="Hang up">
              📵
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
