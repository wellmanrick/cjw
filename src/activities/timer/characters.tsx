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

function Bunny({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <ellipse cx="38" cy="22" rx="8" ry="20" fill="#f5f0eb" stroke="#e0d5cc" strokeWidth="2" />
      <ellipse cx="62" cy="22" rx="8" ry="20" fill="#f5f0eb" stroke="#e0d5cc" strokeWidth="2" />
      <ellipse cx="38" cy="24" rx="4" ry="13" fill="#f9c5d5" />
      <ellipse cx="62" cy="24" rx="4" ry="13" fill="#f9c5d5" />
      <circle cx="50" cy="58" r="32" fill="#f5f0eb" stroke="#e0d5cc" strokeWidth="2" />
      <Cheeks cx={50} cy={58} color="#f9c5d5" />
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#f582ae" />
      <Face mood={mood} cx={50} cy={56} />
    </svg>
  );
}

function Bear({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="28" cy="30" r="12" fill="#c68958" />
      <circle cx="72" cy="30" r="12" fill="#c68958" />
      <circle cx="28" cy="30" r="6" fill="#e8b88a" />
      <circle cx="72" cy="30" r="6" fill="#e8b88a" />
      <circle cx="50" cy="58" r="32" fill="#c68958" />
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#e8b88a" />
      <ellipse cx="50" cy="61" rx="5" ry="4" fill="#3d2c29" />
      <Cheeks cx={50} cy={56} color="#a96b3f" />
      <Face mood={mood} cx={50} cy={52} />
    </svg>
  );
}

function Frog({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
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
    </svg>
  );
}

function Fox({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M 22 42 L 16 12 L 44 28 Z" fill="#e8833a" />
      <path d="M 78 42 L 84 12 L 56 28 Z" fill="#e8833a" />
      <path d="M 24 36 L 21 19 L 38 29 Z" fill="#f9c5d5" />
      <path d="M 76 36 L 79 19 L 62 29 Z" fill="#f9c5d5" />
      <circle cx="50" cy="58" r="32" fill="#e8833a" />
      <path d="M 50 90 a 32 32 0 0 1 -26 -14 q 10 -18 26 -8 q 16 -10 26 8 a 32 32 0 0 1 -26 14 z" fill="#fdf3e7" />
      <ellipse cx="50" cy="68" rx="5" ry="4" fill="#3d2c29" />
      <Cheeks cx={50} cy={56} color="#c45f1c" />
      <Face mood={mood} cx={50} cy={52} />
    </svg>
  );
}

function Duck({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M 50 12 q 14 -6 12 8 z" fill="#f7b733" />
      <circle cx="50" cy="56" r="33" fill="#ffd95e" />
      <ellipse cx="50" cy="66" rx="13" ry="8" fill="#f7913d" />
      <ellipse cx="50" cy="63.5" rx="13" ry="4" fill="#f7b733" />
      <Cheeks cx={50} cy={54} color="#f7913d" />
      <Face mood={mood} cx={50} cy={50} />
    </svg>
  );
}

function Chick({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M 46 14 q 4 -8 8 0" stroke="#f7b733" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="56" r="33" fill="#ffe066" />
      <ellipse cx="22" cy="62" rx="9" ry="14" fill="#ffd43b" transform="rotate(20 22 62)" />
      <ellipse cx="78" cy="62" rx="9" ry="14" fill="#ffd43b" transform="rotate(-20 78 62)" />
      <path d="M 44 62 L 50 70 L 56 62 Z" fill="#f7913d" />
      <Cheeks cx={50} cy={54} color="#f7913d" />
      <Face mood={mood} cx={50} cy={50} />
    </svg>
  );
}

function Cow({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M 30 22 q -10 -8 -4 -14 q 8 0 10 10" fill="#e8d8c3" />
      <path d="M 70 22 q 10 -8 4 -14 q -8 0 -10 10" fill="#e8d8c3" />
      <ellipse cx="20" cy="38" rx="12" ry="7" fill="#f5efe6" transform="rotate(-20 20 38)" />
      <ellipse cx="80" cy="38" rx="12" ry="7" fill="#f5efe6" transform="rotate(20 80 38)" />
      <circle cx="50" cy="56" r="33" fill="#f5efe6" />
      <path d="M 28 36 q 12 -10 20 2 q -10 8 -20 -2 z" fill="#4a4a4a" />
      <path d="M 74 70 q 4 12 -6 14 q -8 -8 0 -16 z" fill="#4a4a4a" />
      <ellipse cx="50" cy="72" rx="17" ry="12" fill="#f4b8c1" />
      <ellipse cx="43" cy="71" rx="3.5" ry="4.5" fill="#c98897" />
      <ellipse cx="57" cy="71" rx="3.5" ry="4.5" fill="#c98897" />
      <Face mood={mood} cx={50} cy={48} />
    </svg>
  );
}

export const builtinCharacters: BuiltinCharacter[] = [
  { id: 'builtin:bunny', name: 'Bunny', spot: 'hat', render: (mood) => <Bunny mood={mood} /> },
  { id: 'builtin:chick', name: 'Chick', spot: 'egg', render: (mood) => <Chick mood={mood} /> },
  { id: 'builtin:frog', name: 'Frog', spot: 'pond', render: (mood) => <Frog mood={mood} /> },
  { id: 'builtin:cow', name: 'Cow', spot: 'barn', render: (mood) => <Cow mood={mood} /> },
  { id: 'builtin:bear', name: 'Bear', spot: 'cave', render: (mood) => <Bear mood={mood} /> },
  { id: 'builtin:fox', name: 'Fox', spot: 'bush', render: (mood) => <Fox mood={mood} /> },
  { id: 'builtin:duck', name: 'Duck', spot: 'pond', render: (mood) => <Duck mood={mood} /> },
];

export function getBuiltinCharacter(id: string): BuiltinCharacter {
  return builtinCharacters.find((c) => c.id === id) ?? builtinCharacters[0];
}
