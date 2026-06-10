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
