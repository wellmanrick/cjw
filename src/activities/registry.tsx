/* eslint-disable react-refresh/only-export-components -- data registry;
   the SVG components are implementation details. */
import type { ComponentType, ReactNode } from 'react';
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
];
