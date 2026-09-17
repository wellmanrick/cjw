import { useMemo } from "react";
import styles from "./components.module.css";

const CONFETTI_COLORS = ["#f582ae", "#8bd3dd", "#f7b733", "#4cc26b", "#e85d4a", "#e8833a"];
const CONFETTI_COUNT = 80;

interface ConfettiPiece {
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  size: number;
}

function makePieces(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    rotation: 360 + Math.random() * 720,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 8,
  }));
}

/** A full-screen shower of falling confetti. Used by every celebration. */
export function Confetti() {
  const pieces = useMemo(makePieces, []);
  return (
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
            ["--confetti-spin" as string]: `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
