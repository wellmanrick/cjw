/* eslint-disable react-refresh/only-export-components -- this file is a data
   registry of characters; the SVG components are implementation details. */
import type { ReactNode } from 'react';
import type { SpotId } from './hidingSpots';

export type Mood = 'happy' | 'excited' | 'party';

export interface BuiltinCharacter {
  id: string;
  name: string;
  /** Where this character hides during the countdown. */
  spot: SpotId;
  render: (mood: Mood) => ReactNode;
}

/** Shared eyes + mouth so every animal reacts to the countdown the same way. */
function Face({ mood, cx, cy }: { mood: Mood; cx: number; cy: number }) {
  const eyeY = cy - 6;
  return (
    <g>
      {mood === 'party' ? (
        <>
          {/* Closed happy eyes ^ ^ */}
          <path d={`M ${cx - 16} ${eyeY} q 5 -7 10 0`} stroke="#3d2c29" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 6} ${eyeY} q 5 -7 10 0`} stroke="#3d2c29" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Big open smile */}
          <path d={`M ${cx - 12} ${cy + 8} q 12 16 24 0 z`} fill="#3d2c29" />
          <path d={`M ${cx - 6} ${cy + 15} q 6 5 12 0 q -6 4 -12 0 z`} fill="#f582ae" />
        </>
      ) : (
        <>
          <circle cx={cx - 11} cy={eyeY} r={mood === 'excited' ? 5 : 4} fill="#3d2c29" />
          <circle cx={cx + 11} cy={eyeY} r={mood === 'excited' ? 5 : 4} fill="#3d2c29" />
          <circle cx={cx - 9.5} cy={eyeY - 1.5} r={1.5} fill="#fff" />
          <circle cx={cx + 12.5} cy={eyeY - 1.5} r={1.5} fill="#fff" />
          {mood === 'excited' ? (
            <path d={`M ${cx - 8} ${cy + 9} q 8 10 16 0 z`} fill="#3d2c29" />
          ) : (
            <path d={`M ${cx - 8} ${cy + 9} q 8 8 16 0`} stroke="#3d2c29" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </g>
  );
}

function Cheeks({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g opacity="0.6">
      <ellipse cx={cx - 22} cy={cy + 4} rx="6" ry="4" fill={color} />
      <ellipse cx={cx + 22} cy={cy + 4} rx="6" ry="4" fill={color} />
    </g>
  );
}

interface BodyColors {
  body: string;
  belly?: string;
  feet?: string;
  stroke?: string;
}

/**
 * Full critter = round body with arms, feet, and belly, plus the head art
 * (drawn in its own 100x100 space) scaled down and placed on top.
 */
function WithBody({ colors, head }: { colors: BodyColors; head: ReactNode }) {
  const { body, belly, feet = body, stroke } = colors;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <ellipse cx="42" cy="91" rx="7.5" ry="4.5" fill={feet} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
      <ellipse cx="58" cy="91" rx="7.5" ry="4.5" fill={feet} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
      <ellipse cx="50" cy="74" rx="18" ry="16" fill={body} stroke={stroke} strokeWidth={stroke ? 2 : 0} />
      <ellipse cx="31.5" cy="71" rx="5.5" ry="9" fill={body} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} transform="rotate(22 31.5 71)" />
      <ellipse cx="68.5" cy="71" rx="5.5" ry="9" fill={body} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} transform="rotate(-22 68.5 71)" />
      {belly && <ellipse cx="50" cy="77" rx="11" ry="10" fill={belly} />}
      <g transform="translate(15.5, -1) scale(0.69)">{head}</g>
    </svg>
  );
}

/* --- Heads (each drawn in a 100x100 space, centered around (50, 56)) --- */

function BunnyHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <ellipse cx="38" cy="22" rx="8" ry="20" fill="#f5f0eb" stroke="#e0d5cc" strokeWidth="2" />
      <ellipse cx="62" cy="22" rx="8" ry="20" fill="#f5f0eb" stroke="#e0d5cc" strokeWidth="2" />
      <ellipse cx="38" cy="24" rx="4" ry="13" fill="#f9c5d5" />
      <ellipse cx="62" cy="24" rx="4" ry="13" fill="#f9c5d5" />
      <circle cx="50" cy="58" r="32" fill="#f5f0eb" stroke="#e0d5cc" strokeWidth="2" />
      <Cheeks cx={50} cy={58} color="#f9c5d5" />
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#f582ae" />
      <Face mood={mood} cx={50} cy={56} />
    </g>
  );
}

function ChickHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 46 14 q 4 -8 8 0" stroke="#f7b733" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="56" r="33" fill="#ffe066" />
      <path d="M 44 62 L 50 70 L 56 62 Z" fill="#f7913d" />
      <Cheeks cx={50} cy={54} color="#f7913d" />
      <Face mood={mood} cx={50} cy={50} />
    </g>
  );
}

function FrogHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <circle cx="32" cy="28" r="13" fill="#7bc96f" />
      <circle cx="68" cy="28" r="13" fill="#7bc96f" />
      <circle cx="32" cy="28" r="8" fill="#fff" />
      <circle cx="68" cy="28" r="8" fill="#fff" />
      <circle cx="32" cy="28" r="4" fill="#3d2c29" />
      <circle cx="68" cy="28" r="4" fill="#3d2c29" />
      <ellipse cx="50" cy="60" rx="34" ry="30" fill="#7bc96f" />
      <Cheeks cx={50} cy={62} color="#4e9e44" />
      {mood === 'party' ? (
        <>
          <path d="M 35 62 q 15 20 30 0 z" fill="#3d2c29" />
          <path d="M 43 70 q 7 6 14 0 q -7 5 -14 0 z" fill="#f582ae" />
        </>
      ) : mood === 'excited' ? (
        <path d="M 38 62 q 12 12 24 0 z" fill="#3d2c29" />
      ) : (
        <path d="M 36 62 q 14 12 28 0" stroke="#3d2c29" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

function CowHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 30 22 q -10 -8 -4 -14 q 8 0 10 10" fill="#e8d8c3" />
      <path d="M 70 22 q 10 -8 4 -14 q -8 0 -10 10" fill="#e8d8c3" />
      <ellipse cx="20" cy="38" rx="12" ry="7" fill="#f5efe6" transform="rotate(-20 20 38)" />
      <ellipse cx="80" cy="38" rx="12" ry="7" fill="#f5efe6" transform="rotate(20 80 38)" />
      <circle cx="50" cy="56" r="33" fill="#f5efe6" />
      <path d="M 28 36 q 12 -10 20 2 q -10 8 -20 -2 z" fill="#4a4a4a" />
      <ellipse cx="50" cy="72" rx="17" ry="12" fill="#f4b8c1" />
      <ellipse cx="43" cy="71" rx="3.5" ry="4.5" fill="#c98897" />
      <ellipse cx="57" cy="71" rx="3.5" ry="4.5" fill="#c98897" />
      <Face mood={mood} cx={50} cy={48} />
    </g>
  );
}

function BearHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <circle cx="28" cy="30" r="12" fill="#c68958" />
      <circle cx="72" cy="30" r="12" fill="#c68958" />
      <circle cx="28" cy="30" r="6" fill="#e8b88a" />
      <circle cx="72" cy="30" r="6" fill="#e8b88a" />
      <circle cx="50" cy="58" r="32" fill="#c68958" />
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#e8b88a" />
      <ellipse cx="50" cy="61" rx="5" ry="4" fill="#3d2c29" />
      <Cheeks cx={50} cy={56} color="#a96b3f" />
      <Face mood={mood} cx={50} cy={52} />
    </g>
  );
}

function FoxHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 22 42 L 16 12 L 44 28 Z" fill="#e8833a" />
      <path d="M 78 42 L 84 12 L 56 28 Z" fill="#e8833a" />
      <path d="M 24 36 L 21 19 L 38 29 Z" fill="#f9c5d5" />
      <path d="M 76 36 L 79 19 L 62 29 Z" fill="#f9c5d5" />
      <circle cx="50" cy="58" r="32" fill="#e8833a" />
      <path d="M 50 90 a 32 32 0 0 1 -26 -14 q 10 -18 26 -8 q 16 -10 26 8 a 32 32 0 0 1 -26 14 z" fill="#fdf3e7" />
      <ellipse cx="50" cy="68" rx="5" ry="4" fill="#3d2c29" />
      <Cheeks cx={50} cy={56} color="#c45f1c" />
      <Face mood={mood} cx={50} cy={52} />
    </g>
  );
}

function DuckHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 50 12 q 14 -6 12 8 z" fill="#f7b733" />
      <circle cx="50" cy="56" r="33" fill="#ffd95e" />
      <ellipse cx="50" cy="66" rx="13" ry="8" fill="#f7913d" />
      <ellipse cx="50" cy="63.5" rx="13" ry="4" fill="#f7b733" />
      <Cheeks cx={50} cy={54} color="#f7913d" />
      <Face mood={mood} cx={50} cy={50} />
    </g>
  );
}

function DogHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <ellipse cx="22" cy="44" rx="10" ry="18" fill="#8a5a3b" transform="rotate(14 22 44)" />
      <ellipse cx="78" cy="44" rx="10" ry="18" fill="#8a5a3b" transform="rotate(-14 78 44)" />
      <circle cx="50" cy="56" r="32" fill="#b08968" />
      <ellipse cx="50" cy="68" rx="15" ry="11" fill="#e6ccb2" />
      <ellipse cx="50" cy="61" rx="6" ry="4.5" fill="#3d2c29" />
      <ellipse cx="38" cy="32" rx="9" ry="6" fill="#e6ccb2" transform="rotate(-20 38 32)" />
      <Cheeks cx={50} cy={56} color="#8a5a3b" />
      <Face mood={mood} cx={50} cy={52} />
    </g>
  );
}

function PigHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 26 34 L 20 16 L 40 26 Z" fill="#e898a6" />
      <path d="M 74 34 L 80 16 L 60 26 Z" fill="#e898a6" />
      <circle cx="50" cy="56" r="32" fill="#f4b8c1" />
      <ellipse cx="50" cy="64" rx="13" ry="9" fill="#e898a6" />
      <ellipse cx="45" cy="64" rx="2.5" ry="4" fill="#c96f81" />
      <ellipse cx="55" cy="64" rx="2.5" ry="4" fill="#c96f81" />
      <Cheeks cx={50} cy={52} color="#e898a6" />
      <Face mood={mood} cx={50} cy={48} />
    </g>
  );
}

function CatHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 24 40 L 20 12 L 44 26 Z" fill="#adb5bd" />
      <path d="M 76 40 L 80 12 L 56 26 Z" fill="#adb5bd" />
      <path d="M 27 35 L 25 19 L 40 28 Z" fill="#f9c5d5" />
      <path d="M 73 35 L 75 19 L 60 28 Z" fill="#f9c5d5" />
      <circle cx="50" cy="56" r="32" fill="#adb5bd" />
      <path d="M 47 60 L 53 60 L 50 64 Z" fill="#f582ae" />
      <g stroke="#868e96" strokeWidth="2" strokeLinecap="round">
        <line x1="14" y1="56" x2="30" y2="58" />
        <line x1="14" y1="64" x2="30" y2="62" />
        <line x1="86" y1="56" x2="70" y2="58" />
        <line x1="86" y1="64" x2="70" y2="62" />
      </g>
      <Cheeks cx={50} cy={56} color="#868e96" />
      <Face mood={mood} cx={50} cy={52} />
    </g>
  );
}

/** School bus with a friendly face — sings "The Wheels on the Bus" while counting down. */
function Bus({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* body */}
      <rect x="8" y="34" width="84" height="46" rx="9" fill="#ffb703" />
      <rect x="8" y="34" width="84" height="10" rx="5" fill="#ffd166" />
      {/* windows */}
      <rect x="16" y="42" width="16" height="14" rx="3" fill="#cdeefd" stroke="#e09f00" strokeWidth="1.5" />
      <rect x="64" y="42" width="20" height="16" rx="3" fill="#cdeefd" stroke="#e09f00" strokeWidth="1.5" />
      {/* stripe */}
      <rect x="8" y="62" width="84" height="5" fill="#e09f00" />
      {/* lights + stop sign */}
      <circle cx="89" cy="72" r="3" fill="#ffd166" stroke="#e09f00" strokeWidth="1.5" />
      <circle cx="11" cy="72" r="3" fill="#e85d4a" />
      <rect x="6" y="46" width="7" height="9" rx="2" fill="#e85d4a" />
      {/* wheels */}
      <circle cx="28" cy="80" r="9.5" fill="#3d2c29" />
      <circle cx="72" cy="80" r="9.5" fill="#3d2c29" />
      <circle cx="28" cy="80" r="4.5" fill="#9a8c98" />
      <circle cx="72" cy="80" r="4.5" fill="#9a8c98" />
      {/* face on the side */}
      <Cheeks cx={48} cy={50} color="#f4845f" />
      <Face mood={mood} cx={48} cy={50} />
    </svg>
  );
}

export const builtinCharacters: BuiltinCharacter[] = [
  {
    id: 'builtin:bus',
    name: 'School bus',
    spot: 'garage',
    render: (mood) => <Bus mood={mood} />,
  },
  {
    id: 'builtin:bunny',
    name: 'Bunny',
    spot: 'hat',
    render: (mood) => <WithBody colors={{ body: '#f5f0eb', belly: '#fff', stroke: '#e0d5cc' }} head={<BunnyHead mood={mood} />} />,
  },
  {
    id: 'builtin:chick',
    name: 'Chick',
    spot: 'egg',
    render: (mood) => <WithBody colors={{ body: '#ffe066', belly: '#fff3bf', feet: '#f7913d' }} head={<ChickHead mood={mood} />} />,
  },
  {
    id: 'builtin:frog',
    name: 'Frog',
    spot: 'pond',
    render: (mood) => <WithBody colors={{ body: '#7bc96f', belly: '#d9f2d0' }} head={<FrogHead mood={mood} />} />,
  },
  {
    id: 'builtin:cow',
    name: 'Cow',
    spot: 'barn',
    render: (mood) => <WithBody colors={{ body: '#f5efe6', belly: '#fff', feet: '#4a4a4a' }} head={<CowHead mood={mood} />} />,
  },
  {
    id: 'builtin:dog',
    name: 'Puppy',
    spot: 'doghouse',
    render: (mood) => <WithBody colors={{ body: '#b08968', belly: '#e6ccb2' }} head={<DogHead mood={mood} />} />,
  },
  {
    id: 'builtin:pig',
    name: 'Piggy',
    spot: 'mud',
    render: (mood) => <WithBody colors={{ body: '#f4b8c1', belly: '#fbd7dd', feet: '#c98897' }} head={<PigHead mood={mood} />} />,
  },
  {
    id: 'builtin:cat',
    name: 'Kitty',
    spot: 'box',
    render: (mood) => <WithBody colors={{ body: '#adb5bd', belly: '#dee2e6' }} head={<CatHead mood={mood} />} />,
  },
  {
    id: 'builtin:bear',
    name: 'Bear',
    spot: 'cave',
    render: (mood) => <WithBody colors={{ body: '#c68958', belly: '#e8b88a' }} head={<BearHead mood={mood} />} />,
  },
  {
    id: 'builtin:fox',
    name: 'Fox',
    spot: 'bush',
    render: (mood) => <WithBody colors={{ body: '#e8833a', belly: '#fdf3e7' }} head={<FoxHead mood={mood} />} />,
  },
  {
    id: 'builtin:duck',
    name: 'Duck',
    spot: 'pond',
    render: (mood) => <WithBody colors={{ body: '#ffd95e', belly: '#fff3bf', feet: '#f7913d' }} head={<DuckHead mood={mood} />} />,
  },
];

export function getBuiltinCharacter(id: string): BuiltinCharacter {
  return builtinCharacters.find((c) => c.id === id) ?? builtinCharacters[0];
}
