import type { ComponentType } from 'react';
import { TimerActivity } from './timer/TimerActivity';

export interface ActivityDef {
  id: string;
  title: string;
  /** Emoji shown on the home screen tile. */
  icon: string;
  Component: ComponentType<{ onExit: () => void }>;
}

/** Add new age-appropriate activities here as the app grows. */
export const activities: ActivityDef[] = [
  {
    id: 'timer',
    title: 'Timer',
    icon: '⏰',
    Component: TimerActivity,
  },
];
