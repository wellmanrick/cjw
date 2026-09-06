/* eslint-disable react-refresh/only-export-components -- data registry;
   the SVG components are implementation details. */
import type { ComponentType, ReactNode } from 'react';
import { PhoneActivity } from './phone/PhoneActivity';
import { PottyActivity } from './potty/PottyActivity';
import { Toilet } from './potty/Toilet';
import { TimerActivity } from './timer/TimerActivity';

export interface ActivityDef {
  id: string;
  title: string;
  /** Artwork shown on the home screen tile. */
  icon: ReactNode;
  Component: ComponentType<{ onExit: () => void }>;
}

const INK = '#5b4238';

/** Friendly alarm clock in the app's outlined cartoon style. */
function ClockIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* bells + legs */}
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M 24 22 Q 14 12 24 8 Q 34 8 34 18 Z" fill="#e85d4a" />
        <path d="M 76 22 Q 86 12 76 8 Q 66 8 66 18 Z" fill="#e85d4a" />
        <path d="M 30 82 L 22 92 M 70 82 L 78 92" fill="none" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="52" r="36" fill="#e85d4a" stroke={INK} strokeWidth="2.8" />
      <circle cx="50" cy="52" r="27" fill="#fdf6f0" stroke={INK} strokeWidth="2.2" />
      <ellipse cx="38" cy="38" rx="7" ry="4.5" fill="#fff" opacity="0.5" transform="rotate(-30 38 38)" />
      {/* tick marks */}
      <g stroke={INK} strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="29" x2="50" y2="34" />
        <line x1="50" y1="70" x2="50" y2="75" />
        <line x1="27" y1="52" x2="32" y2="52" />
        <line x1="68" y1="52" x2="73" y2="52" />
      </g>
      {/* hands */}
      <g stroke={INK} strokeWidth="3" strokeLinecap="round">
        <line x1="50" y1="52" x2="50" y2="38" />
        <line x1="50" y1="52" x2="61" y2="58" />
      </g>
      <circle cx="50" cy="52" r="3" fill="#e85d4a" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

/** Toy phone in the same outlined style. */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <rect x="22" y="8" width="56" height="84" rx="14" fill="#3d405b" stroke={INK} strokeWidth="2.8" />
      <rect x="29" y="18" width="42" height="30" rx="7" fill="#dff1fb" stroke={INK} strokeWidth="2.2" />
      <g stroke={INK} strokeWidth="1.6">
        <circle cx="38" cy="59" r="5.5" fill="#f582ae" />
        <circle cx="50" cy="59" r="5.5" fill="#ffd166" />
        <circle cx="62" cy="59" r="5.5" fill="#8bd3dd" />
        <circle cx="38" cy="72" r="5.5" fill="#b388eb" />
        <circle cx="50" cy="72" r="5.5" fill="#79c270" />
        <circle cx="62" cy="72" r="5.5" fill="#fb9b51" />
        <circle cx="50" cy="84" r="4.5" fill="#4cc26b" />
      </g>
      {/* a little smiling face on the screen */}
      <circle cx="43" cy="30" r="2.4" fill={INK} />
      <circle cx="57" cy="30" r="2.4" fill={INK} />
      <path d="M 43 37 q 7 6 14 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="22" rx="4" ry="2.4" fill="#fff" opacity="0.6" transform="rotate(-25 36 22)" />
    </svg>
  );
}

/** Add new age-appropriate activities here as the app grows. */
export const activities: ActivityDef[] = [
  {
    id: 'timer',
    title: 'Timer',
    icon: <ClockIcon />,
    Component: TimerActivity,
  },
  {
    id: 'potty',
    title: 'Potty Time',
    icon: <Toilet flushing={false} />,
    Component: PottyActivity,
  },
  {
    id: 'phone',
    title: 'Play Phone',
    icon: <PhoneIcon />,
    Component: PhoneActivity,
  },
];
