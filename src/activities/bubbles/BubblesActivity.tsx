import { useEffect, useRef, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { playPop, setMuted as setSoundMuted, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import styles from "./bubbles.module.css";

interface Props {
  onExit: () => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  vy: number;
  wobble: number;
  color: string;
}

const COLORS = ["#8bd3dd", "#f582ae", "#ffd166", "#79c270", "#b8e0f0", "#fbd7dd"];

function spawn(id: number, y?: number): Bubble {
  return {
    id,
    x: 8 + Math.random() * 84,
    y: y ?? 108 + Math.random() * 20,
    r: 28 + Math.random() * 34,
    vy: 0.12 + Math.random() * 0.18,
    wobble: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

const STARTER: Bubble[] = [
  { id: 1, x: 22, y: 62, r: 48, vy: 0.14, wobble: 0.2, color: COLORS[0] },
  { id: 2, x: 48, y: 40, r: 36, vy: 0.16, wobble: 1.1, color: COLORS[1] },
  { id: 3, x: 74, y: 70, r: 42, vy: 0.12, wobble: 2.0, color: COLORS[2] },
  { id: 4, x: 36, y: 82, r: 30, vy: 0.18, wobble: 0.7, color: COLORS[3] },
  { id: 5, x: 62, y: 28, r: 34, vy: 0.15, wobble: 1.6, color: COLORS[4] },
];

export function BubblesActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [bubbles, setBubbles] = useState<Bubble[]>(STARTER);
  const nextId = useRef(STARTER.length + 1);
  const popping = useRef(new Set<number>());
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    const seed: Bubble[] = [...STARTER];
    setBubbles(seed);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 16.67);
      last = now;
      setBubbles((prev) => {
        const next = prev
          .map((b) => ({
            ...b,
            y: b.y - b.vy * dt * 1.6,
            wobble: b.wobble + 0.04 * dt,
            x: b.x + Math.sin(b.wobble) * 0.12,
          }))
          .filter((b) => b.y + b.r > -10 && !popping.current.has(b.id));
        if (next.length < 8 && Math.random() < 0.08) {
          next.push(spawn(nextId.current++));
        }
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pop = (id: number) => {
    unlockAudio();
    playPop();
    popping.current.add(id);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    window.setTimeout(() => popping.current.delete(id), 300);
  };

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Bubbles"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <div className={styles.pond} aria-label="Bubble pond">
        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            className={styles.bubble}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.r,
              height: b.r,
              background: b.color,
              marginLeft: -b.r / 2,
              marginTop: -b.r / 2,
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              pop(b.id);
            }}
            aria-label="Pop bubble"
          />
        ))}
      </div>
    </div>
  );
}
