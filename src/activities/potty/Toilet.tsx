import type { Mood } from '../timer/characters';
import styles from './potty.module.css';

const INK = '#5b4238';

interface Props {
  /** Calm and waiting, or mid-flush celebration. */
  flushing: boolean;
}

/** A friendly cartoon potty with a face — calm while waiting, swirling at the party. */
export function Toilet({ flushing }: Props) {
  const mood: Mood = flushing ? 'party' : 'happy';
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <ellipse cx="50" cy="94" rx="30" ry="4" fill="rgba(61,44,41,0.1)" />

      {/* tank + flush button */}
      <rect x="27" y="13" width="46" height="22" rx="6" fill="#eef4f8" stroke={INK} strokeWidth="2.8" />
      <rect x="44" y="8" width="12" height="7" rx="3" fill="#cdd9e1" stroke={INK} strokeWidth="2.2" />
      <rect x="22" y="20" width="7" height="4.5" rx="2" fill="#cdd9e1" stroke={INK} strokeWidth="2" />

      {/* bowl / pedestal (this is the face) */}
      <path d="M 30 49 Q 32 84 50 88 Q 68 84 70 49 Z" fill="#eef4f8" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <rect x="38" y="86" width="24" height="6.5" rx="3" fill="#dde7ee" stroke={INK} strokeWidth="2.4" />

      {/* seat rim + opening */}
      <ellipse cx="50" cy="46" rx="27" ry="13" fill="#eef4f8" stroke={INK} strokeWidth="2.8" />
      <ellipse cx="50" cy="46" rx="17" ry="7.6" fill="#bcd6e6" stroke={INK} strokeWidth="2.2" />

      {/* water (swirls when flushing) */}
      <g className={flushing ? styles.swirl : undefined} style={{ transformOrigin: '50px 47px' }}>
        <ellipse cx="50" cy="47" rx="13" ry="5.2" fill="#7cc6e8" />
        {flushing && (
          <>
            <path d="M 42 47 Q 50 42 58 47 Q 50 52 42 47 Z" fill="#a8def0" opacity="0.8" />
            <circle cx="45" cy="46" r="1.4" fill="#eaf6fb" />
            <circle cx="55" cy="48" r="1.1" fill="#eaf6fb" />
          </>
        )}
      </g>

      {/* shine */}
      <ellipse cx="40" cy="42" rx="5" ry="3" fill="#fff" opacity="0.4" transform="rotate(-25 40 42)" />

      {/* face on the pedestal */}
      <g>
        {mood === 'party' ? (
          <>
            <path d="M 37 62 q 5 -7 10 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 53 62 q 5 -7 10 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 40 68 q 10 13 20 0 z" fill="#7c2d3e" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M 45 74 q 5 4 10 0 q -5 3 -10 0 z" fill="#f0708d" />
          </>
        ) : (
          <>
            <g className={styles.blink}>
              <circle cx="42" cy="62" r="3.4" fill={INK} />
              <circle cx="58" cy="62" r="3.4" fill={INK} />
              <circle cx="43.2" cy="61" r="1" fill="#fff" />
              <circle cx="59.2" cy="61" r="1" fill="#fff" />
            </g>
            <path d="M 43 69 q 7 6 14 0" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          </>
        )}
        <g opacity="0.5">
          <ellipse cx="35" cy="68" rx="4" ry="2.6" fill="#f4a7bb" />
          <ellipse cx="65" cy="68" rx="4" ry="2.6" fill="#f4a7bb" />
        </g>
      </g>
    </svg>
  );
}
