import { Confetti } from '../../components/Confetti';
import { HidingScene } from './HidingScene';
import styles from './timer.module.css';

interface Props {
  characterId: string;
  onAgain: () => void;
  onDone: () => void;
}

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
      <Confetti />
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
