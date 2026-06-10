import { useCallback, useEffect, useReducer, useRef } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

export interface TimerState {
  status: TimerStatus;
  totalMs: number;
  remainingMs: number;
}

type Action =
  | { type: 'start'; totalMs: number; now: number }
  | { type: 'tick'; now: number }
  | { type: 'pause'; now: number }
  | { type: 'resume'; now: number }
  | { type: 'cancel' }
  | { type: 'reset' };

interface InternalState extends TimerState {
  /** Wall-clock end time (Date.now() based) while running. */
  endAt: number | null;
}

const initialState: InternalState = {
  status: 'idle',
  totalMs: 0,
  remainingMs: 0,
  endAt: null,
};

function reducer(state: InternalState, action: Action): InternalState {
  switch (action.type) {
    case 'start':
      return {
        status: 'running',
        totalMs: action.totalMs,
        remainingMs: action.totalMs,
        endAt: action.now + action.totalMs,
      };
    case 'tick': {
      if (state.status !== 'running' || state.endAt === null) return state;
      const remainingMs = Math.max(0, state.endAt - action.now);
      if (remainingMs <= 0) {
        return { ...state, status: 'done', remainingMs: 0, endAt: null };
      }
      return { ...state, remainingMs };
    }
    case 'pause': {
      if (state.status !== 'running' || state.endAt === null) return state;
      return {
        ...state,
        status: 'paused',
        remainingMs: Math.max(0, state.endAt - action.now),
        endAt: null,
      };
    }
    case 'resume': {
      if (state.status !== 'paused') return state;
      return { ...state, status: 'running', endAt: action.now + state.remainingMs };
    }
    case 'cancel':
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

/**
 * Wall-clock-anchored countdown. Remaining time is always computed from an
 * absolute end timestamp, so backgrounded/throttled tabs stay correct: on
 * return, the next tick (forced by visibilitychange) recomputes from Date.now().
 */
export function useCountdown() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const rafRef = useRef(0);

  const running = state.status === 'running';

  useEffect(() => {
    if (!running) return;

    let lastUpdate = 0;
    const loop = () => {
      const now = Date.now();
      // Throttle state updates to ~10/sec; the ring smooths the gap with CSS.
      if (now - lastUpdate >= 100) {
        lastUpdate = now;
        dispatch({ type: 'tick', now });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        dispatch({ type: 'tick', now: Date.now() });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [running]);

  const start = useCallback((totalMs: number) => {
    dispatch({ type: 'start', totalMs, now: Date.now() });
  }, []);
  const pause = useCallback(() => dispatch({ type: 'pause', now: Date.now() }), []);
  const resume = useCallback(() => dispatch({ type: 'resume', now: Date.now() }), []);
  const cancel = useCallback(() => dispatch({ type: 'cancel' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return {
    status: state.status,
    totalMs: state.totalMs,
    remainingMs: state.remainingMs,
    /** 1 at full time remaining, 0 when done. */
    progress: state.totalMs > 0 ? state.remainingMs / state.totalMs : 0,
    start,
    pause,
    resume,
    cancel,
    reset,
  };
}
