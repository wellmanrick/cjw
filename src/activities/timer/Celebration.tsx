import { HidingScene } from './HidingScene';
import styles from './timer.module.css';

const CONFETTI_COLORS = ['#f582ae', '#8bd3dd', '#f7b733', '#4cc26b', '#b388eb', '#e8833a'];
const CONFETTI_COUNT = 80;

interface Props {
  characterId: string;
  onAgain: () => void;
  onDone: () => void;
}

interface ConfettiPiece {
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  size: number;
}

// Generated once per app load (render must stay pure, so no Math.random there).
const pieces: ConfettiPiece[] = Array.from({ length: CONFETTI_COUNT }, () => ({
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2.5 + Math.random() * 2,
  rotation: 360 + Math.random() * 720,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  size: 8 + Math.random() * 8,
}));

/* Twinkling stars anchored around the character. */
const SPARKLES = [
  { x: -8, y: 4, size: 26, delay: 0 },
  { x: 96, y: 12, size: 20, delay: 0.5 },
  { x: -4, y: 58, size: 18, delay: 0.9 },
  { x: 99, y: 64, size: 24, delay: 0.3 },
  { x: 22, y: -10, size: 18, delay: 0.7 },
  { x: 74, y: -6, size: 22, delay: 1.1 },
];

export function Celebration({ characterId, onAgain, onDone }: Props) {
  return (
    <div className={`screen ${styles.celebrationScreen}`}>
      <div className={styles.confettiLayer} aria-hidden>
        {pieces.map((p, i) => (
          <span
            key={i}
            className={styles.confetti}
            style={{
              left: `${p.left}%`,
              backgroundColor: p.color,
              width: p.size,
              height: p.size * 0.6,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              ['--confetti-spin' as string]: `${p.rotation}deg`,
            }}
          />
        ))}
      </div>
      <h1 className={styles.allDone}>All done!</h1>
      <div className={styles.celebrationCharacter}>
        {SPARKLES.map((sp, i) => (
          <svg
            key={i}
            className={styles.sparkle}
            style={{ left: `${sp.x}%`, top: `${sp.y}%`, width: sp.size, animationDelay: `${sp.delay}s` }}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M 12 1 L 14.5 9.5 L 23 12 L 14.5 14.5 L 12 23 L 9.5 14.5 L 1 12 L 9.5 9.5 Z" fill="#ffd166" stroke="#e09f00" strokeWidth="1" />
          </svg>
        ))}
        <HidingScene characterId={characterId} mood="party" revealed />
      </div>
      <div className={styles.celebrationButtons}>
        <button type="button" className={styles.againButton} onClick={onAgain}>
          🔁 Again
        </button>
        <button type="button" className={styles.doneButton} onClick={onDone}>
          ✅ Done
        </button>
      </div>
    </div>
  );
}
