/* eslint-disable react-refresh/only-export-components -- this file is a data
   registry of characters; the SVG components are implementation details. */
import type { ReactNode } from 'react';
import type { SpotId } from './hidingSpots';
import styles from './timer.module.css';

export type Mood = 'happy' | 'excited' | 'party';

export interface BuiltinCharacter {
  id: string;
  name: string;
  /** Where this character hides during the countdown. */
  spot: SpotId;
  render: (mood: Mood) => ReactNode;
}

/** Warm cocoa outline used across all art so it reads as drawn cartoon, not emoji. */
const INK = '#5b4238';

/**
 * Shared cartoon face: white-sclera eyes with pupils + highlights (they
 * blink!), little brows when excited, and an open laughing mouth at a party.
 */
function Face({ mood, cx, cy }: { mood: Mood; cx: number; cy: number }) {
  const eyeY = cy - 6;
  return (
    <g>
      {mood === 'party' ? (
        <>
          {/* Squeezed-shut happy eyes */}
          <path d={`M ${cx - 17} ${eyeY} q 6 -8 12 0`} stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 5} ${eyeY} q 6 -8 12 0`} stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Big laugh */}
          <path d={`M ${cx - 12} ${cy + 7} q 12 17 24 0 z`} fill="#7c2d3e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d={`M ${cx - 6.5} ${cy + 15.5} q 6.5 6 13 0 q -6.5 5 -13 0 z`} fill="#f0708d" />
        </>
      ) : (
        <>
          <g className={styles.blinkGroup}>
            <ellipse cx={cx - 11} cy={eyeY} rx="5" ry="6" fill="#fff" stroke={INK} strokeWidth="1.8" />
            <ellipse cx={cx + 11} cy={eyeY} rx="5" ry="6" fill="#fff" stroke={INK} strokeWidth="1.8" />
            <circle cx={cx - 10} cy={eyeY + 1} r={mood === 'excited' ? 3.2 : 2.7} fill={INK} />
            <circle cx={cx + 12} cy={eyeY + 1} r={mood === 'excited' ? 3.2 : 2.7} fill={INK} />
            <circle cx={cx - 9} cy={eyeY - 0.5} r="1.1" fill="#fff" />
            <circle cx={cx + 13} cy={eyeY - 0.5} r="1.1" fill="#fff" />
          </g>
          {mood === 'excited' && (
            <>
              <path d={`M ${cx - 16} ${eyeY - 10} q 5 -4 10 -1`} stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d={`M ${cx + 6} ${eyeY - 11} q 5 -3 10 1`} stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}
          {mood === 'excited' ? (
            <path d={`M ${cx - 8} ${cy + 8} q 8 11 16 0 z`} fill="#7c2d3e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          ) : (
            <path d={`M ${cx - 8} ${cy + 9} q 8 8 16 0`} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
    </g>
  );
}

function Cheeks({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g opacity="0.55">
      <ellipse cx={cx - 21} cy={cy + 4} rx="6" ry="4" fill={color} />
      <ellipse cx={cx + 21} cy={cy + 4} rx="6" ry="4" fill={color} />
    </g>
  );
}

/** Soft top-left shine that makes round shapes feel drawn and dimensional. */
function Shine({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <ellipse cx={cx - r * 0.4} cy={cy - r * 0.5} rx={r * 0.32} ry={r * 0.2} fill="#fff" opacity="0.35" transform={`rotate(-25 ${cx - r * 0.4} ${cy - r * 0.5})`} />;
}

interface BodyColors {
  body: string;
  belly?: string;
  feet?: string;
}

interface WithBodyProps {
  colors: BodyColors;
  head: ReactNode;
  /** Drawn behind the body (tails). */
  tail?: ReactNode;
  /** Whether the tail wags. */
  wag?: boolean;
  /** Drawn in front of the body (wings, collars). */
  extras?: ReactNode;
}

/**
 * Full critter: outlined round body with mitt arms, toe-line feet and a soft
 * belly; the head art (drawn in its own 100x100 space) scales down on top.
 */
function WithBody({ colors, head, tail, wag = false, extras }: WithBodyProps) {
  const { body, belly, feet = body } = colors;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {tail && <g className={wag ? styles.tailWag : undefined}>{tail}</g>}
      {/* feet */}
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <ellipse cx="41" cy="90.5" rx="8" ry="5" fill={feet} />
        <ellipse cx="59" cy="90.5" rx="8" ry="5" fill={feet} />
        <path d="M 38.5 86.5 L 38.5 90 M 43.5 86.5 L 43.5 90" strokeWidth="1.6" fill="none" />
        <path d="M 56.5 86.5 L 56.5 90 M 61.5 86.5 L 61.5 90" strokeWidth="1.6" fill="none" />
      </g>
      {/* body + arms */}
      <ellipse cx="50" cy="73" rx="18.5" ry="16.5" fill={body} stroke={INK} strokeWidth="2.6" />
      <ellipse cx="31" cy="70" rx="6" ry="9.5" fill={body} stroke={INK} strokeWidth="2.2" transform="rotate(24 31 70)" />
      <ellipse cx="69" cy="70" rx="6" ry="9.5" fill={body} stroke={INK} strokeWidth="2.2" transform="rotate(-24 69 70)" />
      {belly && <ellipse cx="50" cy="76.5" rx="11.5" ry="10" fill={belly} />}
      <Shine cx={43} cy={66} r={10} />
      {extras}
      <g transform="translate(15.5, -1) scale(0.69)">{head}</g>
    </svg>
  );
}

/* --- Heads (each drawn in a 100x100 space, centered around (50, 56)) --- */

function BunnyHead({ mood }: { mood: Mood }) {
  return (
    <g>
      {/* upright ear + one flopped at the tip */}
      <g stroke={INK} strokeWidth="2.8" strokeLinejoin="round">
        <path d="M 33 38 Q 26 8 38 4 Q 47 6 44 36 Z" fill="#fdf6f0" />
        <path d="M 57 36 Q 55 8 66 4 Q 78 8 67 26 Q 74 24 75 14 Q 80 26 66 38 Z" fill="#fdf6f0" />
      </g>
      <path d="M 36 32 Q 33 14 38 10 Q 42 13 41 32 Z" fill="#f6b8cb" />
      <path d="M 60 30 Q 59 13 64 10 Q 69 14 63 26 Z" fill="#f6b8cb" />
      <circle cx="50" cy="58" r="30" fill="#fdf6f0" stroke={INK} strokeWidth="2.8" />
      <Shine cx={50} cy={58} r={30} />
      <Cheeks cx={50} cy={58} color="#f6b8cb" />
      <Face mood={mood} cx={50} cy={56} />
      {/* nose, whisker dots, buck teeth */}
      <path d="M 46.5 59 Q 50 56.5 53.5 59 Q 50 63 46.5 59 Z" fill="#ee7da2" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {mood !== 'party' && (
        <g>
          <rect x="46" y="68" width="4" height="5.5" rx="1.2" fill="#fff" stroke={INK} strokeWidth="1.4" />
          <rect x="50.2" y="68" width="4" height="5.5" rx="1.2" fill="#fff" stroke={INK} strokeWidth="1.4" />
        </g>
      )}
      <g fill={INK} opacity="0.5">
        <circle cx="33" cy="60" r="1" />
        <circle cx="30" cy="64" r="1" />
        <circle cx="67" cy="60" r="1" />
        <circle cx="70" cy="64" r="1" />
      </g>
    </g>
  );
}

function ChickHead({ mood }: { mood: Mood }) {
  return (
    <g>
      {/* feather tuft */}
      <path d="M 44 12 Q 44 4 50 6 Q 49 9 49 12 Q 52 4 58 6 Q 55 10 53 14 Z" fill="#ffd43b" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="50" cy="56" r="30" fill="#ffe066" stroke={INK} strokeWidth="2.8" />
      <Shine cx={50} cy={56} r={30} />
      <Cheeks cx={50} cy={54} color="#fb9b51" />
      <Face mood={mood} cx={50} cy={50} />
      {/* little open beak */}
      <path d="M 43 61 L 50 58.5 L 57 61 L 50 68 Z" fill="#fb8b24" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 43 61 L 57 61" stroke={INK} strokeWidth="1.6" />
    </g>
  );
}

function FrogHead({ mood }: { mood: Mood }) {
  const eyeY = 26;
  return (
    <g>
      {/* eye bumps sit on top of the head */}
      <ellipse cx="50" cy="62" rx="32" ry="27" fill="#79c270" stroke={INK} strokeWidth="2.8" />
      <g stroke={INK} strokeWidth="2.4">
        <circle cx="31" cy={eyeY} r="12.5" fill="#79c270" />
        <circle cx="69" cy={eyeY} r="12.5" fill="#79c270" />
      </g>
      {mood === 'party' ? (
        <g stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d={`M 25 ${eyeY} q 6 -7 12 0`} />
          <path d={`M 63 ${eyeY} q 6 -7 12 0`} />
        </g>
      ) : (
        <g>
          <g className={styles.blinkGroup}>
            <circle cx="31" cy={eyeY} r="8" fill="#fff" stroke={INK} strokeWidth="1.8" />
            <circle cx="69" cy={eyeY} r="8" fill="#fff" stroke={INK} strokeWidth="1.8" />
            <circle cx="32.5" cy={eyeY + 1.5} r={mood === 'excited' ? 4.4 : 3.8} fill={INK} />
            <circle cx="70.5" cy={eyeY + 1.5} r={mood === 'excited' ? 4.4 : 3.8} fill={INK} />
            <circle cx="34" cy={eyeY - 0.5} r="1.3" fill="#fff" />
            <circle cx="72" cy={eyeY - 0.5} r="1.3" fill="#fff" />
          </g>
        </g>
      )}
      <Shine cx={50} cy={56} r={28} />
      {/* freckles + nostrils */}
      <g fill="#4e9e44">
        <circle cx="24" cy="56" r="2" />
        <circle cx="30" cy="50" r="1.5" />
        <circle cx="76" cy="56" r="2" />
        <circle cx="70" cy="50" r="1.5" />
      </g>
      <g fill={INK}>
        <circle cx="45" cy="48" r="1.4" />
        <circle cx="55" cy="48" r="1.4" />
      </g>
      <Cheeks cx={50} cy={62} color="#4e9e44" />
      {mood === 'party' ? (
        <>
          <path d="M 33 60 q 17 22 34 0 z" fill="#7c2d3e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 43 70 q 7 6 14 0 q -7 5 -14 0 z" fill="#f0708d" />
        </>
      ) : mood === 'excited' ? (
        <path d="M 37 60 q 13 14 26 0 z" fill="#7c2d3e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      ) : (
        <path d="M 35 59 q 15 14 30 0" stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

function CowHead({ mood }: { mood: Mood }) {
  return (
    <g>
      {/* horns + ears */}
      <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M 32 20 Q 24 12 27 5 Q 36 7 38 18" fill="#f3e3c3" />
        <path d="M 68 20 Q 76 12 73 5 Q 64 7 62 18" fill="#f3e3c3" />
        <ellipse cx="19" cy="38" rx="11.5" ry="7" fill="#f7f1e8" transform="rotate(-22 19 38)" />
        <ellipse cx="81" cy="38" rx="11.5" ry="7" fill="#f7f1e8" transform="rotate(22 81 38)" />
      </g>
      <ellipse cx="19.5" cy="38.5" rx="6" ry="3.5" fill="#f6b8cb" transform="rotate(-22 19.5 38.5)" />
      <ellipse cx="80.5" cy="38.5" rx="6" ry="3.5" fill="#f6b8cb" transform="rotate(22 80.5 38.5)" />
      <circle cx="50" cy="56" r="30" fill="#f7f1e8" stroke={INK} strokeWidth="2.8" />
      {/* patch over one eye + a head spot */}
      <path d="M 28 38 q 14 -11 23 3 q -11 10 -23 -3 z" fill="#57534e" />
      <path d="M 70 32 q 9 2 7 10 q -9 1 -7 -10 z" fill="#57534e" />
      <Shine cx={50} cy={56} r={30} />
      <Face mood={mood} cx={50} cy={48} />
      {/* big soft muzzle */}
      <ellipse cx="50" cy="71" rx="18" ry="11.5" fill="#f6b8cb" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="43" cy="70" rx="3.2" ry="4.5" fill="#c4708a" />
      <ellipse cx="57" cy="70" rx="3.2" ry="4.5" fill="#c4708a" />
      {mood === 'party' && <path d="M 44 77 q 6 4 12 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />}
    </g>
  );
}

function BearHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <g stroke={INK} strokeWidth="2.6">
        <circle cx="27" cy="30" r="12" fill="#bb8554" />
        <circle cx="73" cy="30" r="12" fill="#bb8554" />
      </g>
      <circle cx="27" cy="30" r="6" fill="#e9c19a" />
      <circle cx="73" cy="30" r="6" fill="#e9c19a" />
      <circle cx="50" cy="58" r="30" fill="#bb8554" stroke={INK} strokeWidth="2.8" />
      <Shine cx={50} cy={58} r={30} />
      <Cheeks cx={50} cy={56} color="#96623a" />
      <Face mood={mood} cx={50} cy={52} />
      {/* lighter muzzle with outlined nose */}
      <ellipse cx="50" cy="67" rx="13.5" ry="10" fill="#e9c19a" stroke={INK} strokeWidth="2.2" />
      <path d="M 45.5 62.5 Q 50 60 54.5 62.5 Q 53 67 50 67 Q 47 67 45.5 62.5 Z" fill={INK} />
      <path d="M 50 67 L 50 70.5" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M 46 71.5 q 4 3.5 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

function FoxHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 23 42 L 15 9 L 45 26 Z" fill="#ec8b3e" />
        <path d="M 77 42 L 85 9 L 55 26 Z" fill="#ec8b3e" />
      </g>
      <path d="M 25 35 L 21 17 L 38 27 Z" fill="#5b4238" opacity="0.85" />
      <path d="M 75 35 L 79 17 L 62 27 Z" fill="#5b4238" opacity="0.85" />
      <circle cx="50" cy="58" r="30" fill="#ec8b3e" stroke={INK} strokeWidth="2.8" />
      {/* white cheek mask with pointy fur edges */}
      <path d="M 50 88 C 38 88 28 80 25 71 Q 31 72 35 68 Q 40 60 50 64 Q 60 60 65 68 Q 69 72 75 71 C 72 80 62 88 50 88 Z" fill="#fdf6f0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <Shine cx={50} cy={56} r={30} />
      <Cheeks cx={50} cy={54} color="#c45f1c" />
      <Face mood={mood} cx={50} cy={52} />
      <path d="M 45.5 65 Q 50 62.5 54.5 65 Q 52.5 70 50 70 Q 47.5 70 45.5 65 Z" fill={INK} />
    </g>
  );
}

function DuckHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <path d="M 48 13 Q 52 3 61 6 Q 59 12 54 15 Z" fill="#fb8b24" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="50" cy="56" r="30" fill="#ffd95e" stroke={INK} strokeWidth="2.8" />
      <Shine cx={50} cy={56} r={30} />
      <Cheeks cx={50} cy={54} color="#fb9b51" />
      <Face mood={mood} cx={50} cy={50} />
      {/* outlined two-part bill */}
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <ellipse cx="50" cy="64" rx="14" ry="6.5" fill="#fb8b24" />
        <path d="M 36 63 Q 50 70 64 63" fill="none" strokeWidth="1.8" />
      </g>
      <circle cx="44" cy="61" r="1.3" fill={INK} />
      <circle cx="56" cy="61" r="1.3" fill={INK} />
    </g>
  );
}

function DogHead({ mood }: { mood: Mood }) {
  return (
    <g>
      {/* floppy outlined ears */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 27 26 Q 12 30 14 52 Q 22 56 30 48 Z" fill="#7d5638" />
        <path d="M 73 26 Q 88 30 86 52 Q 78 56 70 48 Z" fill="#7d5638" />
      </g>
      <circle cx="50" cy="56" r="30" fill="#b98a5d" stroke={INK} strokeWidth="2.8" />
      {/* patch over one eye */}
      <path d="M 56 38 q 13 -3 15 9 q -1 12 -14 10 q -8 -9 -1 -19 z" fill="#8a6240" />
      <Shine cx={50} cy={56} r={30} />
      <Cheeks cx={50} cy={56} color="#8a6240" />
      <Face mood={mood} cx={50} cy={52} />
      {/* muzzle + nose */}
      <ellipse cx="50" cy="68" rx="14" ry="10" fill="#efd9bd" stroke={INK} strokeWidth="2.2" />
      <path d="M 45 62.5 Q 50 60 55 62.5 Q 53.5 67.5 50 67.5 Q 46.5 67.5 45 62.5 Z" fill={INK} />
      {mood !== 'party' && <path d="M 50 67.5 L 50 71 M 46 72.5 q 4 3 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />}
      {/* tongue when partying */}
      {mood === 'party' && <path d="M 46 71 q 4 8 9 0 l -1 -3 q -3.5 3 -7 0 z" fill="#f0708d" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />}
    </g>
  );
}

function PigHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 27 34 L 20 13 L 42 24 Z" fill="#f4a8b8" />
        <path d="M 73 34 L 80 13 L 58 24 Z" fill="#f4a8b8" />
      </g>
      <path d="M 29 30 L 25 18 L 38 25 Z" fill="#d97a93" />
      <path d="M 71 30 L 75 18 L 62 25 Z" fill="#d97a93" />
      <circle cx="50" cy="56" r="30" fill="#f4a8b8" stroke={INK} strokeWidth="2.8" />
      <Shine cx={50} cy={56} r={30} />
      <Cheeks cx={50} cy={52} color="#d97a93" />
      <Face mood={mood} cx={50} cy={48} />
      {/* big outlined snout */}
      <ellipse cx="50" cy="64" rx="13" ry="9" fill="#ee8fa6" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="45.5" cy="64" rx="2.4" ry="4" fill={INK} opacity="0.8" />
      <ellipse cx="54.5" cy="64" rx="2.4" ry="4" fill={INK} opacity="0.8" />
    </g>
  );
}

function CatHead({ mood }: { mood: Mood }) {
  return (
    <g>
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 25 38 L 21 10 L 46 24 Z" fill="#9aa3ad" />
        <path d="M 75 38 L 79 10 L 54 24 Z" fill="#9aa3ad" />
      </g>
      <path d="M 28 32 L 26 17 L 39 25 Z" fill="#f6b8cb" />
      <path d="M 72 32 L 74 17 L 61 25 Z" fill="#f6b8cb" />
      <circle cx="50" cy="58" r="30" fill="#9aa3ad" stroke={INK} strokeWidth="2.8" />
      {/* fluffy cheek tufts */}
      <path d="M 21 62 q 6 -2 8 3 q -5 4 -8 -3 z M 22 70 q 6 -3 9 2 q -5 5 -9 -2 z" fill="#9aa3ad" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M 79 62 q -6 -2 -8 3 q 5 4 8 -3 z M 78 70 q -6 -3 -9 2 q 5 5 9 -2 z" fill="#9aa3ad" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* forehead stripes */}
      <g stroke="#6e7780" strokeWidth="2.6" strokeLinecap="round">
        <path d="M 44 30 q 1 5 0 8" fill="none" />
        <path d="M 50 29 q 1 5 0 9" fill="none" />
        <path d="M 56 30 q 1 5 0 8" fill="none" />
      </g>
      <Shine cx={50} cy={58} r={30} />
      <Cheeks cx={50} cy={56} color="#6e7780" />
      <Face mood={mood} cx={50} cy={52} />
      <path d="M 46.5 62 Q 50 60 53.5 62 Q 50 66 46.5 62 Z" fill="#ee7da2" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* whiskers */}
      <g stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        <path d="M 14 56 Q 24 57 31 59" fill="none" />
        <path d="M 15 64 Q 24 63 31 63" fill="none" />
        <path d="M 86 56 Q 76 57 69 59" fill="none" />
        <path d="M 85 64 Q 76 63 69 63" fill="none" />
      </g>
    </g>
  );
}

/** School bus with a friendly face — sings "The Wheels on the Bus". */
function Bus({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* body */}
      <rect x="7" y="32" width="86" height="48" rx="10" fill="#ffb703" stroke={INK} strokeWidth="2.8" />
      <rect x="7" y="32" width="86" height="11" rx="6" fill="#ffd166" />
      <path d="M 7 42 L 93 42" stroke={INK} strokeWidth="1.6" opacity="0.4" />
      {/* windows */}
      <rect x="15" y="46" width="17" height="14" rx="3.5" fill="#cdeefd" stroke={INK} strokeWidth="2" />
      <path d="M 17 57 q 6 -7 13 -9" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.7" />
      <rect x="64" y="44" width="22" height="17" rx="3.5" fill="#cdeefd" stroke={INK} strokeWidth="2" />
      <path d="M 67 59 q 8 -9 17 -12" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.7" />
      {/* stripe */}
      <rect x="7" y="64" width="86" height="5.5" fill="#e09f00" stroke={INK} strokeWidth="1.4" />
      {/* stop sign + lights */}
      <rect x="3" y="47" width="9" height="10" rx="2" fill="#e85d4a" stroke={INK} strokeWidth="2" />
      <circle cx="90" cy="74" r="3.2" fill="#ffd166" stroke={INK} strokeWidth="1.8" />
      <circle cx="10" cy="74" r="3.2" fill="#e85d4a" stroke={INK} strokeWidth="1.8" />
      {/* face on the side */}
      <Cheeks cx={48} cy={51} color="#f4845f" />
      <Face mood={mood} cx={48} cy={51} />
      {/* spinning outlined wheels */}
      <g className={styles.wheelSpin}>
        <circle cx="28" cy="80" r="10" fill="#57534e" stroke={INK} strokeWidth="2.6" />
        <circle cx="28" cy="80" r="4.6" fill="#d6d3d1" stroke={INK} strokeWidth="1.8" />
        <path d="M 28 70.5 L 28 75 M 28 85 L 28 89.5 M 18.5 80 L 23 80 M 33 80 L 37.5 80" stroke="#d6d3d1" strokeWidth="2.2" />
      </g>
      <g className={styles.wheelSpin}>
        <circle cx="72" cy="80" r="10" fill="#57534e" stroke={INK} strokeWidth="2.6" />
        <circle cx="72" cy="80" r="4.6" fill="#d6d3d1" stroke={INK} strokeWidth="1.8" />
        <path d="M 72 70.5 L 72 75 M 72 85 L 72 89.5 M 62.5 80 L 67 80 M 77 80 L 81.5 80" stroke="#d6d3d1" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

/* --- Tails and extras --- */

const dogTail = (
  <path d="M 66 78 Q 80 76 84 62 Q 88 58 90 62 Q 89 80 70 84 Z" fill="#b98a5d" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
);

const catTail = (
  <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
    <path d="M 66 80 Q 86 80 87 62 Q 87 54 81 56 Q 80 72 64 74 Z" fill="#9aa3ad" />
    <path d="M 83 60 q 3 -1 4 1 M 81 66 q 3 0 5 1" strokeWidth="2" fill="none" stroke="#6e7780" />
  </g>
);

const foxTail = (
  <g stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
    <path d="M 64 82 Q 88 84 92 64 Q 94 56 86 56 Q 70 58 62 72 Z" fill="#ec8b3e" />
    <path d="M 92 64 Q 94 56 86 56 Q 80 57 76 60 Q 84 60 86 66 Q 89 66 92 64 Z" fill="#fdf6f0" />
  </g>
);

const bunnyTail = <circle cx="68" cy="82" r="6.5" fill="#fff" stroke={INK} strokeWidth="2.2" />;

const pigTail = (
  <path d="M 67 76 q 8 -3 8 3 q 0 5 -6 4 q 5 0 4 -3 q -1 -3 -6 -1 z" fill="#ee8fa6" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
);

const cowTail = (
  <g stroke={INK} strokeWidth="2.2" strokeLinecap="round">
    <path d="M 67 72 Q 80 74 82 84" fill="none" />
    <path d="M 79 82 q 4 -1 5 3 q -3 3 -6 0 z" fill="#57534e" strokeLinejoin="round" />
  </g>
);

const chickWing = (
  <path d="M 33 72 Q 26 76 28 82 Q 34 83 38 77" fill="#ffd43b" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
);

const duckWing = (
  <path d="M 33 72 Q 25 76 28 83 Q 35 84 39 77" fill="#fb9b24" opacity="0.85" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
);

const dogCollar = (
  <g>
    <path d="M 34 61 Q 50 70 66 61 L 66 65 Q 50 74 34 65 Z" fill="#e85d4a" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="50" cy="70" r="3" fill="#ffd166" stroke={INK} strokeWidth="1.6" />
  </g>
);

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
    render: (mood) => <WithBody colors={{ body: '#fdf6f0', belly: '#fff' }} tail={bunnyTail} head={<BunnyHead mood={mood} />} />,
  },
  {
    id: 'builtin:chick',
    name: 'Chick',
    spot: 'egg',
    render: (mood) => <WithBody colors={{ body: '#ffe066', belly: '#fff3bf', feet: '#fb8b24' }} extras={chickWing} head={<ChickHead mood={mood} />} />,
  },
  {
    id: 'builtin:frog',
    name: 'Frog',
    spot: 'pond',
    render: (mood) => <WithBody colors={{ body: '#79c270', belly: '#d9f2d0' }} head={<FrogHead mood={mood} />} />,
  },
  {
    id: 'builtin:cow',
    name: 'Cow',
    spot: 'barn',
    render: (mood) => <WithBody colors={{ body: '#f7f1e8', belly: '#fff', feet: '#57534e' }} tail={cowTail} head={<CowHead mood={mood} />} />,
  },
  {
    id: 'builtin:dog',
    name: 'Puppy',
    spot: 'doghouse',
    render: (mood) => (
      <WithBody colors={{ body: '#b98a5d', belly: '#efd9bd' }} tail={dogTail} wag extras={dogCollar} head={<DogHead mood={mood} />} />
    ),
  },
  {
    id: 'builtin:pig',
    name: 'Piggy',
    spot: 'mud',
    render: (mood) => <WithBody colors={{ body: '#f4a8b8', belly: '#fbd7dd', feet: '#d97a93' }} tail={pigTail} head={<PigHead mood={mood} />} />,
  },
  {
    id: 'builtin:cat',
    name: 'Kitty',
    spot: 'box',
    render: (mood) => <WithBody colors={{ body: '#9aa3ad', belly: '#e2e6ea' }} tail={catTail} wag head={<CatHead mood={mood} />} />,
  },
  {
    id: 'builtin:bear',
    name: 'Bear',
    spot: 'cave',
    render: (mood) => <WithBody colors={{ body: '#bb8554', belly: '#e9c19a' }} head={<BearHead mood={mood} />} />,
  },
  {
    id: 'builtin:fox',
    name: 'Fox',
    spot: 'bush',
    render: (mood) => <WithBody colors={{ body: '#ec8b3e', belly: '#fdf6f0' }} tail={foxTail} head={<FoxHead mood={mood} />} />,
  },
  {
    id: 'builtin:duck',
    name: 'Duck',
    spot: 'pond',
    render: (mood) => <WithBody colors={{ body: '#ffd95e', belly: '#fff3bf', feet: '#fb8b24' }} extras={duckWing} head={<DuckHead mood={mood} />} />,
  },
];

export function getBuiltinCharacter(id: string): BuiltinCharacter {
  return builtinCharacters.find((c) => c.id === id) ?? builtinCharacters[0];
}
