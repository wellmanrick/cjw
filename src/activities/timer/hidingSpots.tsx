import type { ReactNode } from 'react';
import { getBuiltinCharacter } from './characters';

export type SpotId =
  | 'egg'
  | 'pond'
  | 'hat'
  | 'cave'
  | 'bush'
  | 'barn'
  | 'doghouse'
  | 'mud'
  | 'box'
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
  /** Drawn behind the character (scenery). */
  back?: ReactNode;
  /** Drawn in front of the character — this is what hides it. */
  front: ReactNode;
  /** Optional cover that flies off at reveal (egg top, gift lid). */
  lid?: ReactNode;
}

const svgProps = {
  viewBox: '0 0 100 100',
  width: '100%',
  height: '100%',
  preserveAspectRatio: 'xMidYMid meet',
} as const;

/* Zigzag-cracked egg, drawn as a bottom shell (front) and a top shell (lid). */
const eggCrack = 'L 32 58 L 39 64 L 46 57 L 53 64 L 60 57 L 67 64 L 74 58';

export const hidingSpots: Record<SpotId, HidingSpot> = {
  egg: {
    name: 'Egg',
    reveal: 'inside',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="92" rx="36" ry="6" fill="rgba(61,44,41,0.08)" />
        <path d={`M 26 58 ${eggCrack} L 74 58 A 25 30 0 0 1 26 58 Z`} fill="#fdf3e7" stroke="#e0d5cc" strokeWidth="2" />
      </svg>
    ),
    lid: (
      <svg {...svgProps}>
        <path d="M 26 58 A 25 32 0 0 1 74 58 L 67 64 L 60 57 L 53 64 L 46 57 L 39 64 L 32 58 Z" fill="#fdf3e7" stroke="#e0d5cc" strokeWidth="2" />
      </svg>
    ),
  },
  pond: {
    name: 'Pond',
    reveal: 'above',
    back: (
      <svg {...svgProps}>
        <line x1="16" y1="70" x2="16" y2="46" stroke="#6a994e" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="16" cy="42" rx="4" ry="8" fill="#7f4f24" />
        <line x1="86" y1="74" x2="86" y2="54" stroke="#6a994e" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="86" cy="50" rx="3.5" ry="7" fill="#7f4f24" />
      </svg>
    ),
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="78" rx="40" ry="15" fill="#8bd3dd" />
        <ellipse cx="50" cy="76" rx="34" ry="11" fill="#a8e0e8" />
        <ellipse cx="38" cy="76" rx="10" ry="3" fill="#c9edf2" />
        <ellipse cx="68" cy="81" rx="8" ry="2.5" fill="#c9edf2" />
        <ellipse cx="72" cy="73" rx="8" ry="3.5" fill="#6a994e" />
        <circle cx="72" cy="73" r="1.5" fill="#f582ae" />
      </svg>
    ),
  },
  hat: {
    name: 'Magic hat',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="88" rx="34" ry="8" fill="#2b2d42" />
        <path d="M 32 88 L 34 48 L 66 48 L 68 88 Z" fill="#3d405b" />
        <ellipse cx="50" cy="48" rx="16" ry="4.5" fill="#22243a" />
        <rect x="32" y="72" width="36" height="7" fill="#f582ae" rx="2" />
      </svg>
    ),
  },
  cave: {
    name: 'Cave',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <path d="M 8 92 Q 12 52 50 50 Q 88 52 92 92 Z" fill="#9a8c98" />
        <path d="M 30 92 Q 33 68 50 67 Q 67 68 70 92 Z" fill="#4a4453" />
        <ellipse cx="22" cy="90" rx="6" ry="3" fill="#6a994e" />
        <ellipse cx="80" cy="91" rx="7" ry="3" fill="#6a994e" />
      </svg>
    ),
  },
  bush: {
    name: 'Bush',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <circle cx="30" cy="78" r="17" fill="#6a994e" />
        <circle cx="70" cy="78" r="17" fill="#6a994e" />
        <circle cx="50" cy="72" r="20" fill="#7bc96f" />
        <circle cx="38" cy="83" r="14" fill="#7bc96f" />
        <circle cx="63" cy="84" r="13" fill="#6a994e" />
        <circle cx="44" cy="68" r="2.5" fill="#f582ae" />
        <circle cx="58" cy="76" r="2.5" fill="#f7b733" />
        <circle cx="33" cy="74" r="2.5" fill="#f582ae" />
      </svg>
    ),
  },
  barn: {
    name: 'Barn',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="92" rx="40" ry="5" fill="rgba(61,44,41,0.08)" />
        <path d="M 22 92 L 22 62 L 50 44 L 78 62 L 78 92 Z" fill="#e85d4a" />
        <path d="M 18 64 L 50 42 L 82 64 L 78 60 L 50 48 L 22 60 Z" fill="#a64133" />
        <path d="M 18 64 L 50 43 L 82 64" stroke="#a64133" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="40" y="68" width="20" height="24" rx="2" fill="#fdf3e7" />
        <path d="M 40 68 L 60 92 M 60 68 L 40 92" stroke="#e85d4a" strokeWidth="3" />
        <rect x="40" y="68" width="20" height="24" rx="2" fill="none" stroke="#a64133" strokeWidth="2.5" />
      </svg>
    ),
  },
  doghouse: {
    name: 'Doghouse',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="92" rx="40" ry="5" fill="rgba(61,44,41,0.08)" />
        <path d="M 26 92 L 26 60 L 50 46 L 74 60 L 74 92 Z" fill="#d8a657" />
        <path d="M 21 62 L 50 44 L 79 62" stroke="#8a5a3b" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M 38 92 L 38 74 A 12 12 0 0 1 62 74 L 62 92 Z" fill="#5c4033" />
        <circle cx="50" cy="56" r="4" fill="#8a5a3b" />
      </svg>
    ),
  },
  mud: {
    name: 'Mud puddle',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="78" rx="40" ry="15" fill="#8a5a3b" />
        <ellipse cx="50" cy="76" rx="34" ry="11" fill="#a47148" />
        <ellipse cx="38" cy="76" rx="10" ry="3" fill="#b98860" />
        <ellipse cx="66" cy="81" rx="8" ry="2.5" fill="#b98860" />
        <circle cx="26" cy="68" r="3" fill="#a47148" />
        <circle cx="74" cy="66" r="2.5" fill="#a47148" />
        <circle cx="60" cy="63" r="2" fill="#a47148" />
      </svg>
    ),
  },
  box: {
    name: 'Cardboard box',
    reveal: 'above',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="93" rx="36" ry="5" fill="rgba(61,44,41,0.08)" />
        <rect x="26" y="58" width="48" height="34" rx="2" fill="#d8a657" />
        <rect x="26" y="58" width="48" height="34" rx="2" fill="none" stroke="#b07d3f" strokeWidth="2.5" />
        <path d="M 26 58 L 12 50 L 14 64 L 26 68 Z" fill="#c9924b" stroke="#b07d3f" strokeWidth="2" />
        <path d="M 74 58 L 88 50 L 86 64 L 74 68 Z" fill="#c9924b" stroke="#b07d3f" strokeWidth="2" />
        <rect x="47" y="58" width="6" height="34" fill="#e8c184" />
      </svg>
    ),
  },
  gift: {
    name: 'Present',
    reveal: 'inside',
    front: (
      <svg {...svgProps}>
        <ellipse cx="50" cy="93" rx="34" ry="5" fill="rgba(61,44,41,0.08)" />
        <rect x="26" y="60" width="48" height="32" rx="4" fill="#8bd3dd" />
        <rect x="45" y="60" width="10" height="32" fill="#f582ae" />
      </svg>
    ),
    lid: (
      <svg {...svgProps}>
        <rect x="22" y="50" width="56" height="12" rx="4" fill="#5fbfcc" />
        <rect x="45" y="50" width="10" height="12" fill="#f582ae" />
        <path d="M 50 50 q -10 -12 -2 -14 q 6 0 2 14 q 10 -12 2 -14" stroke="#f582ae" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
};

/** Which spot a character (builtin or uploaded photo) hides in. */
export function spotForCharacter(characterId: string): SpotId {
  if (characterId.startsWith('photo:')) return 'gift';
  return getBuiltinCharacter(characterId).spot;
}
