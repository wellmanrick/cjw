import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './components.module.css';

interface Props {
  /** How long the press must be held, in ms. */
  holdMs?: number;
  onHoldComplete: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Requires a continuous press to activate — taps and swipes do nothing.
 * A fill animation shows hold progress; releasing early cancels.
 */
export function HoldButton({ holdMs = 2000, onHoldComplete, children, className = '' }: Props) {
  const [holding, setHolding] = useState(false);
  const timeoutRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const begin = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    completedRef.current = false;
    setHolding(true);
    timeoutRef.current = window.setTimeout(() => {
      completedRef.current = true;
      setHolding(false);
      onHoldComplete();
    }, holdMs);
  };

  const end = () => {
    if (completedRef.current) return;
    window.clearTimeout(timeoutRef.current);
    setHolding(false);
  };

  return (
    <button
      type="button"
      className={`${styles.holdButton} ${className}`}
      onPointerDown={begin}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={end}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span
        className={styles.holdFill}
        style={{ transition: holding ? `transform ${holdMs}ms linear` : 'none' }}
        data-holding={holding}
      />
      <span className={styles.holdLabel}>{children}</span>
    </button>
  );
}
