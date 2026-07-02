/* eslint-disable react-refresh/only-export-components -- data registry;
   the SVG components are implementation details. */
import type { ReactNode } from 'react';
import { getBuiltinCharacter } from './characters';
import styles from './timer.module.css';

export type SpotId =
  | 'egg'
  | 'pond'
  | 'hat'
  | 'cave'
  | 'bush'
  | 'barn'
  | 'doghouse'
  | 'garage'
  | 'mud'
  | 'box'
  | 'toybox'
  | 'dirtpile'
  | 'waves'
  | 'gift';

export interface HidingSpot {
  /** Friendly name, e.g. for accessibility labels. */
  name: string;
  /**
   * 'inside': the character stays nestled in the spot after the lid pops off
   * (chick in the cracked egg). 'above': it jumps up over the scenery
   * (frog out of the pond, bunny out of the hat).
   */
  reveal: 'inside' | 'above';
  /** How the lid leaves at reveal: flies off (default) or slides up (garage door). */
  lidStyle?: 'fly' | 'slide';
  /** Drawn behind the character (scenery). */
  back?: ReactNode;
  /** Drawn in front of the character — this is what hides it. */
  front: ReactNode;
  /** Optional cover that flies off at reveal (egg top, gift lid). */
  lid?: ReactNode;
}

const INK = '#5b4238';

const svgProps = {
  viewBox: '0 0 100 100',
  width: '100%',
  height: '100%',
  preserveAspectRatio: 'xMidYMid meet',
} as const;

/* Zigzag-cracked egg, drawn as a bottom shell (front) and a top shell (lid). */
const eggCrack = 'L 32 58 L 39 64 L 46 57 L 53 64 L 60 57 L 67 64 L 74 58';


/* --- Backdrop helpers: every scene gets a soft rounded sky panel --- */

function Sky({ fill }: { fill: string }) {
  return <rect x="2" y="2" width="96" height="96" rx="26" fill={fill} />;
}

function Sun({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ffd166" stroke={INK} strokeWidth="1.8" />
      <g stroke="#ffd166" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
        <line x1={x} y1={y - r - 6} x2={x} y2={y - r - 2.5} />
        <line x1={x - r - 5.5} y1={y - r * 0.8} x2={x - r - 2.5} y2={y - r * 0.55} />
        <line x1={x + r + 5.5} y1={y - r * 0.8} x2={x + r + 2.5} y2={y - r * 0.55} />
      </g>
    </g>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={styles.cloudDrift}>
        <ellipse cx="0" cy="0" rx="9.5" ry="4.6" fill="#fff" stroke={INK} strokeWidth="1.6" />
        <ellipse cx="7" cy="-3" rx="7" ry="4" fill="#fff" stroke={INK} strokeWidth="1.6" />
      </g>
    </g>
  );
}

function GrassHills() {
  return (
    <g>
      <ellipse cx="32" cy="99" rx="34" ry="15" fill="#a5d693" />
      <ellipse cx="72" cy="101" rx="30" ry="14" fill="#8fca7d" />
    </g>
  );
}

function TwinkleStar({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className={styles.twinkleDot}
        style={{ animationDelay: `${delay}s` }}
        d="M 0 -4 L 1.1 -1.1 L 4 0 L 1.1 1.1 L 0 4 L -1.1 1.1 L -4 0 L -1.1 -1.1 Z"
        fill="#ffd166"
        stroke={INK}
        strokeWidth="0.8"
      />
    </g>
  );
}

export const hidingSpots: Record<SpotId, HidingSpot> = {
  egg: {
    name: 'Egg',
    back: (
      <svg {...svgProps}>
        <Sky fill="#fdf4e6" />
        <Sun x={78} y={22} r={7} />
        <g stroke="#e0b96a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M 16 90 q 10 -4 20 -1" />
          <path d="M 62 92 q 12 -5 22 -2" />
          <path d="M 24 94 q 14 -3 26 0" />
        </g>
      </svg>
    ),
    reveal: 'inside',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="92" rx="36" ry="6" fill="rgba(61,44,41,0.1)" />
        <path d={`M 26 58 ${eggCrack} L 74 58 A 25 30 0 0 1 26 58 Z`} fill="#fdf3e7" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 32 72 q 4 6 10 7" stroke="#e0d5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    lid: (
      <svg {...svgProps}>
        <path d="M 26 58 A 25 32 0 0 1 74 58 L 67 64 L 60 57 L 53 64 L 46 57 L 39 64 L 32 58 Z" fill="#fdf3e7" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <ellipse cx="40" cy="38" rx="7" ry="4" fill="#fff" opacity="0.6" transform="rotate(-30 40 38)" />
      </svg>
    ),
  },
  pond: {
    name: 'Pond',
    reveal: 'above',
    back: (
      <svg {...svgProps}>
        <Sky fill="#e4f5fb" />
        <Sun x={22} y={22} r={7} />
        <g stroke="#5e8c4a" strokeWidth="3" strokeLinecap="round">
          <line x1="16" y1="70" x2="16" y2="44" />
          <line x1="86" y1="74" x2="86" y2="52" />
        </g>
        <ellipse cx="16" cy="40" rx="4.5" ry="9" fill="#7f4f24" stroke={INK} strokeWidth="1.8" />
        <ellipse cx="86" cy="48" rx="4" ry="7.5" fill="#7f4f24" stroke={INK} strokeWidth="1.8" />
      </svg>
    ),
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="78" rx="40" ry="15" fill="#8bd3dd" stroke={INK} strokeWidth="2.4" />
        <ellipse cx="50" cy="76" rx="33" ry="11" fill="#a8e0e8" />
        <ellipse className={styles.ripple} cx="40" cy="77" rx="12" ry="4" fill="none" stroke="#e3f6f9" strokeWidth="2" />
        <ellipse className={`${styles.ripple} ${styles.rippleLate}`} cx="62" cy="80" rx="10" ry="3.4" fill="none" stroke="#e3f6f9" strokeWidth="2" />
        <ellipse cx="72" cy="72" rx="8.5" ry="3.8" fill="#5e8c4a" stroke={INK} strokeWidth="1.8" />
        <circle cx="72" cy="71" r="1.8" fill="#f0708d" stroke={INK} strokeWidth="1.2" />
      </svg>
    ),
  },
  hat: {
    name: 'Magic hat',
    back: (
      <svg {...svgProps}>
        <Sky fill="#f3ecfb" />
        <TwinkleStar x={20} y={26} s={1.4} />
        <TwinkleStar x={80} y={20} s={1.1} delay={0.9} />
        <TwinkleStar x={66} y={38} s={0.9} delay={1.6} />
        <TwinkleStar x={32} y={44} s={0.8} delay={0.5} />
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="87" rx="35" ry="8.5" fill="#2b2d42" stroke={INK} strokeWidth="2.4" />
        <path d="M 32 87 L 34 48 L 66 48 L 68 87 Z" fill="#3d405b" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <ellipse cx="50" cy="48" rx="16" ry="4.5" fill="#22243a" stroke={INK} strokeWidth="2" />
        <rect x="32.5" y="70" width="35" height="7.5" fill="#f0708d" stroke={INK} strokeWidth="1.8" rx="2" />
        <path d="M 37 84 Q 36 60 38 52" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.25" strokeLinecap="round" />
        {/* little stars around the brim */}
        <g fill="#ffd166" stroke={INK} strokeWidth="1">
          <path d="M 25 60 l 1.4 2.8 3 .4 -2.2 2.1 .6 3 -2.8 -1.5 -2.7 1.5 .5 -3 -2.2 -2.1 3 -.4 z" />
          <path d="M 74 64 l 1.1 2.2 2.4 .3 -1.7 1.7 .4 2.4 -2.2 -1.2 -2.1 1.2 .4 -2.4 -1.8 -1.7 2.4 -.3 z" />
        </g>
      </svg>
    ),
  },
  cave: {
    name: 'Cave',
    back: (
      <svg {...svgProps}>
        <Sky fill="#34345c" />
        <circle cx="74" cy="24" r="10" fill="#fdf3d7" />
        <circle cx="69" cy="21" r="9" fill="#34345c" />
        <TwinkleStar x={24} y={22} s={1.2} />
        <TwinkleStar x={44} y={34} s={0.8} delay={1.2} />
        <TwinkleStar x={86} y={44} s={0.9} delay={0.6} />
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <path d="M 8 92 Q 12 52 50 50 Q 88 52 92 92 Z" fill="#9a8c98" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 30 92 Q 33 68 50 67 Q 67 68 70 92 Z" fill="#453d4f" stroke={INK} strokeWidth="2.2" />
        <path d="M 20 70 q 4 -8 10 -9 M 74 66 q 5 3 7 9" stroke="#7d6f7d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <g stroke={INK} strokeWidth="1.8">
          <ellipse cx="20" cy="90" rx="6.5" ry="3.2" fill="#5e8c4a" />
          <ellipse cx="81" cy="91" rx="7" ry="3.2" fill="#5e8c4a" />
        </g>
      </svg>
    ),
  },
  bush: {
    name: 'Bush',
    back: (
      <svg {...svgProps}>
        <Sky fill="#eef8ea" />
        <Sun x={22} y={22} r={7} />
        <g transform="translate(72 34)">
          <g className={styles.cloudDrift}>
            <ellipse cx="-3" cy="0" rx="3.2" ry="4.4" fill="#f0708d" stroke={INK} strokeWidth="1.4" transform="rotate(-30)" />
            <ellipse cx="3" cy="0" rx="3.2" ry="4.4" fill="#f4a7bb" stroke={INK} strokeWidth="1.4" transform="rotate(30)" />
            <line x1="0" y1="2" x2="0" y2="6" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <g stroke={INK} strokeWidth="2.4">
          <circle cx="29" cy="77" r="17" fill="#5e8c4a" />
          <circle cx="71" cy="77" r="17" fill="#5e8c4a" />
          <circle cx="50" cy="71" r="20" fill="#79c270" />
          <circle cx="37" cy="83" r="13" fill="#79c270" />
          <circle cx="64" cy="84" r="12" fill="#5e8c4a" />
        </g>
        <g stroke={INK} strokeWidth="1.4">
          <circle cx="44" cy="67" r="3" fill="#f0708d" />
          <circle cx="58" cy="76" r="3" fill="#ffd166" />
          <circle cx="32" cy="73" r="3" fill="#f0708d" />
        </g>
        <g fill="#fff">
          <circle cx="43" cy="66" r="0.9" />
          <circle cx="57" cy="75" r="0.9" />
          <circle cx="31" cy="72" r="0.9" />
        </g>
      </svg>
    ),
  },
  barn: {
    name: 'Barn',
    back: (
      <svg {...svgProps}>
        <Sky fill="#fdf2df" />
        <Sun x={20} y={22} r={8} />
        <Cloud x={70} y={24} />
        <GrassHills />
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="92" rx="40" ry="5" fill="rgba(61,44,41,0.1)" />
        <path d="M 22 92 L 22 62 L 50 44 L 78 62 L 78 92 Z" fill="#e85d4a" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 18 64 L 50 43 L 82 64" stroke="#a64133" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 18 64 L 50 43 L 82 64" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <rect x="40" y="68" width="20" height="24" rx="2" fill="#fdf3e7" stroke={INK} strokeWidth="2.4" />
        <path d="M 40 68 L 60 92 M 60 68 L 40 92" stroke="#e85d4a" strokeWidth="3" />
        <circle cx="50" cy="58" r="4.5" fill="#fdf3e7" stroke={INK} strokeWidth="2" />
      </svg>
    ),
  },
  doghouse: {
    name: 'Doghouse',
    back: (
      <svg {...svgProps}>
        <Sky fill="#e9f4fd" />
        <Sun x={80} y={22} r={7} />
        <Cloud x={26} y={24} />
        <GrassHills />
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="92" rx="40" ry="5" fill="rgba(61,44,41,0.1)" />
        <path d="M 26 92 L 26 60 L 50 46 L 74 60 L 74 92 Z" fill="#d8a657" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 21 62 L 50 44 L 79 62" stroke="#8a5a3b" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 21 62 L 50 44 L 79 62" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M 38 92 L 38 74 A 12 12 0 0 1 62 74 L 62 92 Z" fill="#4a3a30" stroke={INK} strokeWidth="2.2" />
        {/* bone over the door */}
        <g fill="#fdf3e7" stroke={INK} strokeWidth="1.6">
          <circle cx="44" cy="55" r="2.6" />
          <circle cx="44" cy="59" r="2.6" />
          <circle cx="56" cy="55" r="2.6" />
          <circle cx="56" cy="59" r="2.6" />
          <rect x="44" y="54.5" width="12" height="5" rx="2" />
        </g>
      </svg>
    ),
  },
  garage: {
    name: 'Garage',
    back: (
      <svg {...svgProps}>
        <Sky fill="#e7eef7" />
        <Cloud x={26} y={22} />
        <Cloud x={74} y={32} s={0.75} />
      </svg>
    ),
    reveal: 'above',
    lidStyle: 'slide',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="93" rx="42" ry="4" fill="rgba(61,44,41,0.1)" />
        <rect x="16" y="56" width="68" height="36" rx="3" fill="#8ecae6" stroke={INK} strokeWidth="2.6" />
        <path d="M 10 58 L 50 42 L 90 58 L 86 63 L 50 49 L 14 63 Z" fill="#4a6fa5" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        {/* dark doorway the bus hides in */}
        <rect x="26" y="64" width="48" height="28" rx="2" fill="#33304a" stroke={INK} strokeWidth="2.2" />
        <g stroke="#fff" strokeWidth="2" strokeDasharray="5 4" opacity="0.7">
          <line x1="4" y1="93" x2="96" y2="93" />
        </g>
      </svg>
    ),
    /* The roll-up door — slides up out of the way at reveal */
    lid: (
      <svg {...svgProps}>
        <rect x="26" y="64" width="48" height="28" rx="2" fill="#3d405b" stroke={INK} strokeWidth="2.2" />
        <g stroke="#5a5e85" strokeWidth="2.4">
          <line x1="27" y1="71" x2="73" y2="71" />
          <line x1="27" y1="78" x2="73" y2="78" />
          <line x1="27" y1="85" x2="73" y2="85" />
        </g>
        <circle cx="50" cy="89" r="1.8" fill="#d6d3d1" stroke={INK} strokeWidth="1.2" />
      </svg>
    ),
  },
  mud: {
    name: 'Mud puddle',
    back: (
      <svg {...svgProps}>
        <Sky fill="#f8f0e0" />
        <Sun x={22} y={22} r={7} />
        <Cloud x={72} y={26} s={0.9} />
        <GrassHills />
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="78" rx="40" ry="15" fill="#8a5a3b" stroke={INK} strokeWidth="2.4" />
        <ellipse cx="50" cy="76" rx="33" ry="11" fill="#a47148" />
        <ellipse cx="38" cy="76" rx="10" ry="3" fill="#b98860" />
        <ellipse cx="66" cy="81" rx="8" ry="2.5" fill="#b98860" />
        {/* mud bubbles plopping */}
        <g stroke={INK} strokeWidth="1.4">
          <circle className={styles.ripple} cx="30" cy="72" r="3.4" fill="#b98860" />
          <circle className={`${styles.ripple} ${styles.rippleLate}`} cx="68" cy="74" r="2.8" fill="#b98860" />
        </g>
      </svg>
    ),
  },
  box: {
    name: 'Cardboard box',
    back: (
      <svg {...svgProps}>
        <Sky fill="#f4efe7" />
        <g opacity="0.55">
          <circle cx="22" cy="26" r="4" fill="#d8a657" />
          <circle cx="76" cy="20" r="3" fill="#8bd3dd" />
          <circle cx="60" cy="36" r="2.5" fill="#f0708d" />
          <circle cx="34" cy="42" r="2.5" fill="#ffd166" />
        </g>
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="93" rx="36" ry="5" fill="rgba(61,44,41,0.1)" />
        <rect x="26" y="58" width="48" height="34" rx="2" fill="#d8a657" stroke={INK} strokeWidth="2.6" />
        <path d="M 26 58 L 12 50 L 14 64 L 26 68 Z" fill="#c9924b" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M 74 58 L 88 50 L 86 64 L 74 68 Z" fill="#c9924b" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="47" y="58" width="6" height="34" fill="#e8c184" stroke={INK} strokeWidth="1.4" />
        {/* paw prints on the box */}
        <g fill="#8a5a3b" opacity="0.8">
          <circle cx="36" cy="78" r="2.4" />
          <circle cx="33" cy="74" r="1.1" />
          <circle cx="36" cy="73" r="1.1" />
          <circle cx="39" cy="74" r="1.1" />
          <circle cx="63" cy="84" r="2.4" />
          <circle cx="60" cy="80" r="1.1" />
          <circle cx="63" cy="79" r="1.1" />
          <circle cx="66" cy="80" r="1.1" />
        </g>
      </svg>
    ),
  },
  toybox: {
    name: 'Toy chest',
    back: (
      <svg {...svgProps}>
        <Sky fill="#fdeff3" />
        <g opacity="0.6">
          <circle cx="24" cy="24" r="4" fill="#8bd3dd" />
          <circle cx="74" cy="20" r="3.2" fill="#ffd166" />
          <circle cx="58" cy="34" r="2.6" fill="#b388eb" />
          <circle cx="36" cy="42" r="2.6" fill="#f0708d" />
        </g>
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="93" rx="36" ry="5" fill="rgba(61,44,41,0.1)" />
        <rect x="24" y="60" width="52" height="32" rx="4" fill="#5fbfcc" stroke={INK} strokeWidth="2.6" />
        <rect x="24" y="60" width="52" height="6" fill="#4aa3b0" />
        {/* toys peeking over the rim */}
        <g stroke={INK} strokeWidth="1.8">
          <rect x="29" y="68" width="11" height="11" rx="1.5" fill="#ffd166" />
          <circle cx="68" cy="74" r="6" fill="#f0708d" />
          <path d="M 62.5 73 q 5.5 -4 11 0" fill="none" stroke="#fff" strokeWidth="2" />
        </g>
        <path d="M 32 71 l 5 5 M 37 71 l -5 5" stroke={INK} strokeWidth="1.6" />
      </svg>
    ),
    lid: (
      <svg {...svgProps}>
        <rect x="21" y="48" width="58" height="13" rx="5" fill="#4aa3b0" stroke={INK} strokeWidth="2.4" />
        <rect x="44" y="44" width="12" height="8" rx="3" fill="#ffd166" stroke={INK} strokeWidth="2" />
      </svg>
    ),
  },
  dirtpile: {
    name: 'Dirt pile',
    back: (
      <svg {...svgProps}>
        <Sky fill="#e9f4fd" />
        <Sun x={22} y={22} r={8} />
        <Cloud x={72} y={26} />
      </svg>
    ),
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <path d="M 10 92 Q 18 58 50 56 Q 82 58 90 92 Z" fill="#a47148" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M 24 80 q 6 -8 14 -6 M 60 72 q 8 0 12 6" stroke="#8a5a3b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="86" r="3" fill="#8a5a3b" />
        <circle cx="66" cy="84" r="2.4" fill="#8a5a3b" />
        {/* traffic cones */}
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path d="M 13 90 L 18 74 L 23 90 Z" fill="#fb8b24" />
          <rect x="10" y="89" width="16" height="4" rx="2" fill="#fb8b24" />
          <path d="M 15.5 83 L 20.5 83" stroke="#fff" strokeWidth="2.4" />
          <path d="M 77 90 L 82 74 L 87 90 Z" fill="#fb8b24" />
          <rect x="74" y="89" width="16" height="4" rx="2" fill="#fb8b24" />
          <path d="M 79.5 83 L 84.5 83" stroke="#fff" strokeWidth="2.4" />
        </g>
      </svg>
    ),
  },
  waves: {
    name: 'Ocean waves',
    reveal: 'above',
    back: (
      <svg {...svgProps}>
        <rect x="2" y="2" width="96" height="96" rx="26" fill="#dff1fb" />
        <circle cx="80" cy="30" r="9" fill="#ffd166" stroke={INK} strokeWidth="1.8" />
        <g stroke="#ffd166" strokeWidth="2.4" strokeLinecap="round" opacity="0.8">
          <line x1="80" y1="16" x2="80" y2="20" />
          <line x1="69" y1="22" x2="72" y2="25" />
          <line x1="91" y1="22" x2="88" y2="25" />
        </g>
        <g className={styles.cloudDrift} fill="#fff" stroke={INK} strokeWidth="1.6" opacity="0.9">
          <ellipse cx="22" cy="30" rx="9" ry="4.5" />
          <ellipse cx="29" cy="27" rx="7" ry="4" />
        </g>
      </svg>
    ),
    front: (
      <svg {...svgProps}>
        <path d="M 4 74 Q 12 64 22 72 Q 32 64 42 72 Q 52 64 62 72 Q 72 64 82 72 Q 92 64 96 72 L 96 82 Q 96 95 84 95 L 16 95 Q 4 95 4 82 Z" fill="#5fa8d3" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M 4 82 Q 14 74 24 81 Q 34 74 44 81 Q 54 74 64 81 Q 74 74 84 81 Q 92 76 96 81 L 96 84 Q 96 95 84 95 L 16 95 Q 4 95 4 84 Z" fill="#7cc6e8" stroke={INK} strokeWidth="2" />
        <ellipse className={styles.ripple} cx="34" cy="78" rx="9" ry="2.6" fill="none" stroke="#eaf6fb" strokeWidth="2" />
        <ellipse className={`${styles.ripple} ${styles.rippleLate}`} cx="64" cy="80" rx="8" ry="2.4" fill="none" stroke="#eaf6fb" strokeWidth="2" />
        <g fill="#eaf6fb">
          <circle cx="14" cy="73" r="2" />
          <circle cx="48" cy="71" r="2.2" />
          <circle cx="82" cy="72" r="2" />
        </g>
      </svg>
    ),
  },
  gift: {
    name: 'Present',
    back: (
      <svg {...svgProps}>
        <Sky fill="#fdeff3" />
        <g stroke={INK} strokeWidth="1.2">
          <path d="M 10 12 L 22 12 L 16 22 Z" fill="#8bd3dd" />
          <path d="M 30 12 L 42 12 L 36 22 Z" fill="#ffd166" />
          <path d="M 50 12 L 62 12 L 56 22 Z" fill="#f0708d" />
          <path d="M 70 12 L 82 12 L 76 22 Z" fill="#b388eb" />
        </g>
        <path d="M 8 11.5 L 88 11.5" stroke={INK} strokeWidth="1.4" />
      </svg>
    ),
    reveal: 'inside',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="93" rx="34" ry="5" fill="rgba(61,44,41,0.1)" />
        <rect x="26" y="60" width="48" height="32" rx="4" fill="#8bd3dd" stroke={INK} strokeWidth="2.6" />
        <rect x="45" y="60" width="10" height="32" fill="#f0708d" stroke={INK} strokeWidth="1.8" />
        <path d="M 31 66 q 4 -3 8 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
      </svg>
    ),
    lid: (
      <svg {...svgProps}>
        <rect x="22" y="50" width="56" height="12" rx="4" fill="#5fbfcc" stroke={INK} strokeWidth="2.4" />
        <rect x="45" y="50" width="10" height="12" fill="#f0708d" stroke={INK} strokeWidth="1.8" />
        <path d="M 50 50 q -10 -12 -2 -14 q 6 0 2 14 q 10 -12 2 -14" stroke="#f0708d" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
};

/** Which spot a character (builtin or uploaded photo) hides in. */
export function spotForCharacter(characterId: string): SpotId {
  if (characterId.startsWith('photo:')) return 'gift';
  return getBuiltinCharacter(characterId).spot;
}
