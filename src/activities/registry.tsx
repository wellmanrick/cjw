/* eslint-disable react-refresh/only-export-components -- data registry;
   the SVG components are implementation details. */
import type { ComponentType, ReactNode } from "react";
import { BookActivity } from "./book/BookActivity";
import { BubblesActivity } from "./bubbles/BubblesActivity";
import { ColorsActivity } from "./colors/ColorsActivity";
import { FindActivity } from "./find/FindActivity";
import { MatchActivity } from "./match/MatchActivity";
import { MusicActivity } from "./music/MusicActivity";
import { PeekabooActivity } from "./peekaboo/PeekabooActivity";
import { PhoneActivity } from "./phone/PhoneActivity";
import { PottyActivity } from "./potty/PottyActivity";
import { Toilet } from "./potty/Toilet";
import { getBuiltinCharacter } from "./timer/characters";
import { TimerActivity } from "./timer/TimerActivity";
import { TrucksActivity } from "./trucks/TrucksActivity";

export interface ActivityDef {
  id: string;
  title: string;
  color: string;
  /** Artwork shown on the home screen tile. */
  icon: ReactNode;
  Component: ComponentType<{ onExit: () => void }>;
}

const INK = "#5b4238";

function ClockIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 24 22 Q 14 12 24 8 Q 34 8 34 18 Z" fill="#e85d4a" />
        <path d="M 76 22 Q 86 12 76 8 Q 66 8 66 18 Z" fill="#e85d4a" />
        <path d="M 30 82 L 22 92 M 70 82 L 78 92" fill="none" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="52" r="36" fill="#e85d4a" stroke={INK} strokeWidth="2.8" />
      <circle cx="50" cy="52" r="27" fill="#fdf6f0" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="38" cy="38" rx="7" ry="4.5" fill="#fff" opacity="0.5" transform="rotate(-30 38 38)" />
      <g stroke={INK} strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="29" x2="50" y2="34" />
        <line x1="50" y1="70" x2="50" y2="75" />
        <line x1="27" y1="52" x2="32" y2="52" />
        <line x1="68" y1="52" x2="73" y2="52" />
      </g>
      <g stroke={INK} strokeWidth="3" strokeLinecap="round">
        <line x1="50" y1="52" x2="50" y2="38" />
        <line x1="50" y1="52" x2="61" y2="58" />
      </g>
      <circle cx="50" cy="52" r="3" fill="#e85d4a" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="22" y="8" width="56" height="84" rx="14" fill="#3d405b" stroke={INK} strokeWidth="2.8" />
      <rect x="29" y="18" width="42" height="30" rx="7" fill="#dff1fb" stroke={INK} strokeWidth="2.2" />
      <g stroke={INK} strokeWidth="1.6">
        <circle cx="38" cy="59" r="5.5" fill="#f582ae" />
        <circle cx="50" cy="59" r="5.5" fill="#ffd166" />
        <circle cx="62" cy="59" r="5.5" fill="#8bd3dd" />
        <circle cx="38" cy="72" r="5.5" fill="#fb9b51" />
        <circle cx="50" cy="72" r="5.5" fill="#79c270" />
        <circle cx="62" cy="72" r="5.5" fill="#e85d4a" />
        <circle cx="50" cy="84" r="4.5" fill="#4cc26b" />
      </g>
      <circle cx="43" cy="30" r="2.4" fill={INK} />
      <circle cx="57" cy="30" r="2.4" fill={INK} />
      <path d="M 43 37 q 7 6 14 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="22" rx="4" ry="2.4" fill="#fff" opacity="0.6" transform="rotate(-25 36 22)" />
    </svg>
  );
}

function PeekIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="18" y="14" width="64" height="74" rx="10" fill="#f582ae" stroke={INK} strokeWidth="2.8" />
      <rect x="26" y="22" width="28" height="58" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="2.2" />
      <circle cx="48" cy="52" r="5" fill="#fff8e8" stroke={INK} strokeWidth="2" />
      <circle cx="62" cy="40" r="10" fill="#fdf6f0" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="58" cy="28" rx="4" ry="10" fill="#fdf6f0" stroke={INK} strokeWidth="2" />
      <ellipse cx="66" cy="28" rx="4" ry="10" fill="#fdf6f0" stroke={INK} strokeWidth="2" />
      <circle cx="59" cy="39" r="1.6" fill={INK} />
      <circle cx="65" cy="39" r="1.6" fill={INK} />
      <path d="M 59 45 q 3 3 6 0" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ColorsIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="38" cy="40" r="22" fill="#e85d4a" stroke={INK} strokeWidth="2.6" />
      <circle cx="64" cy="38" r="20" fill="#ffd166" stroke={INK} strokeWidth="2.6" />
      <circle cx="50" cy="62" r="22" fill="#8bd3dd" stroke={INK} strokeWidth="2.6" />
      <circle cx="36" cy="64" r="14" fill="#4cc26b" stroke={INK} strokeWidth="2.4" />
    </svg>
  );
}

function BubblesIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="40" cy="58" r="24" fill="#8bd3dd" stroke={INK} strokeWidth="2.6" opacity="0.95" />
      <circle cx="64" cy="40" r="18" fill="#b8e0f0" stroke={INK} strokeWidth="2.4" />
      <circle cx="72" cy="68" r="12" fill="#dff6fb" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="32" cy="48" rx="7" ry="4" fill="#fff" opacity="0.55" transform="rotate(-30 32 48)" />
      <ellipse cx="58" cy="32" rx="5" ry="3" fill="#fff" opacity="0.55" transform="rotate(-30 58 32)" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="16" y="48" width="12" height="36" rx="4" fill="#e85d4a" stroke={INK} strokeWidth="2.2" />
      <rect x="32" y="38" width="12" height="46" rx="4" fill="#ffd166" stroke={INK} strokeWidth="2.2" />
      <rect x="48" y="28" width="12" height="56" rx="4" fill="#4cc26b" stroke={INK} strokeWidth="2.2" />
      <rect x="64" y="20" width="12" height="64" rx="4" fill="#5ab0d4" stroke={INK} strokeWidth="2.2" />
      <rect x="80" y="34" width="10" height="50" rx="4" fill="#f582ae" stroke={INK} strokeWidth="2.2" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="10" y="22" width="36" height="52" rx="8" fill="#8bd3dd" stroke={INK} strokeWidth="2.6" />
      <rect x="54" y="22" width="36" height="52" rx="8" fill="#fffdf8" stroke={INK} strokeWidth="2.6" />
      <circle cx="72" cy="48" r="10" fill="#6fbf73" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

function FindIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <ellipse cx="50" cy="78" rx="36" ry="16" fill="#79c270" stroke={INK} strokeWidth="2.6" />
      <circle cx="50" cy="40" r="16" fill="#fdf6f0" stroke={INK} strokeWidth="2.4" />
      <circle cx="45" cy="38" r="2.4" fill={INK} />
      <circle cx="55" cy="38" r="2.4" fill={INK} />
    </svg>
  );
}

function BookIcon() {
  return (
    <img
      src="/photos/bb-conrad.jpg"
      alt=""
      width={100}
      height={100}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", borderRadius: 18 }}
    />
  );
}

export const activities: ActivityDef[] = [
  {
    id: "trucks",
    title: "Trucks",
    color: "#e6f4e4",
    icon: getBuiltinCharacter("builtin:trash").render("happy"),
    Component: TrucksActivity,
  },
  { id: "book", title: "Vermont", color: "#fde4ef", icon: <BookIcon />, Component: BookActivity },
  { id: "match", title: "Match", color: "#d7f3f8", icon: <MatchIcon />, Component: MatchActivity },
  { id: "find", title: "Find", color: "#e4f5d8", icon: <FindIcon />, Component: FindActivity },
  { id: "timer", title: "Timer", color: "#fde0d8", icon: <ClockIcon />, Component: TimerActivity },
  { id: "peekaboo", title: "Peekaboo", color: "#fde4ef", icon: <PeekIcon />, Component: PeekabooActivity },
  { id: "phone", title: "Phone", color: "#dce8f8", icon: <PhoneIcon />, Component: PhoneActivity },
  { id: "colors", title: "Colors", color: "#fff3c4", icon: <ColorsIcon />, Component: ColorsActivity },
  { id: "bubbles", title: "Bubbles", color: "#d7f3f8", icon: <BubblesIcon />, Component: BubblesActivity },
  { id: "music", title: "Music", color: "#e4f5d8", icon: <MusicIcon />, Component: MusicActivity },
  { id: "potty", title: "Potty", color: "#eef4f8", icon: <Toilet flushing={false} />, Component: PottyActivity },
];
