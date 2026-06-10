import type { ReactNode } from 'react';
import styles from './timer.module.css';

const SIZE = 320;
const STROKE = 20;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  /** 1 = full time left, 0 = done. */
  progress: number;
  pulsing?: boolean;
  children?: ReactNode;
}

/** SVG ring that depletes clockwise from 12 o'clock, shifting green -> red. */
export function CountdownRing({ progress, pulsing = false, children }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const hue = 130 * clamped;
  const color = `hsl(${hue}, 75%, 48%)`;

  return (
    <div className={`${styles.ringWrap} ${pulsing ? styles.ringPulse : ''}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.ringSvg}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(61, 44, 41, 0.08)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          className={styles.ringProgress}
        />
      </svg>
      <div className={styles.ringCenter}>{children}</div>
    </div>
  );
}
