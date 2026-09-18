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
const MAX_BUBBLES = 20;

function spawn(id: number, y?: number): Bubble {
  return {
    id,
    x: 8 + Math.random() * 84,
    y: y ?? 108 + Math.random() * 16,
    r: 24 + Math.random() * 38,
    vy: 0.12 + Math.random() * 0.22,
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
  const [windy, setWindy] = useState(false);
  const nextId = useRef(STARTER.length + 1);
  const popping = useRef(new Set<number>());
  const armed = useRef(false);
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  const addBubbles = (n: number) => {
    setBubbles((prev) => {
      const next = [...prev];
      const count = Math.min(n, MAX_BUBBLES - next.length);
      for (let i = 0; i < count; i++) next.push(spawn(nextId.current++));
      return next;
    });
  };

  useEffect(() => {
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
            x: Math.min(92, Math.max(8, b.x + Math.sin(b.wobble) * 0.12)),
          }))
          .filter((b) => b.y > -15 && !popping.current.has(b.id));
        if (next.length < 6 && Math.random() < 0.03) {
          next.push(spawn(nextId.current++));
        }
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let motionOn = false;
    let lastShake = 0;
    let lastBlow = 0;
    let raf = 0;
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let baseline = 0.04;
    let samples = 0;
    const data = new Uint8Array(1024);

    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.acceleration;
      const g = e.accelerationIncludingGravity;
      let mag = 0;
      if (a && (a.x != null || a.y != null || a.z != null)) {
        mag = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0);
      } else if (g) {
        mag = Math.abs(Math.hypot(g.x ?? 0, g.y ?? 0, g.z ?? 0) - 9.8);
      }
      const now = performance.now();
      if (mag > 11 && now - lastShake > 380) {
        lastShake = now;
        addBubbles(4 + Math.floor(Math.min(4, mag / 8)));
      }
    };

    const listenBlow = () => {
      if (!analyser) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const n = (data[i] - 128) / 128;
        sum += n * n;
      }
      const rms = Math.sqrt(sum / data.length);
      samples += 1;
      if (samples < 12) {
        baseline = Math.max(baseline, rms);
      } else {
        baseline = baseline * 0.97 + rms * 0.03;
      }
      const floor = Math.max(0.055, baseline * 2.6);
      const now = performance.now();
      if (rms > floor && now - lastBlow > 180) {
        lastBlow = now;
        addBubbles(rms > floor * 1.6 ? 3 : 2);
        setWindy(true);
        window.setTimeout(() => setWindy(false), 280);
      }
      raf = requestAnimationFrame(listenBlow);
    };

    const arm = () => {
      if (armed.current) return;
      armed.current = true;
      unlockAudio();
      window.addEventListener("devicemotion", onMotion);
      motionOn = true;

      void (async () => {
        try {
          const DEM = DeviceMotionEvent as unknown as {
            requestPermission?: () => Promise<string>;
          };
          if (typeof DEM.requestPermission === "function") {
            await Promise.race([
              DEM.requestPermission(),
              new Promise<string>((resolve) => window.setTimeout(() => resolve("timeout"), 1200)),
            ]);
          }
        } catch {
          /* motion denied */
        }

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });
          audioCtx = new AudioContext();
          if (audioCtx.state === "suspended") await audioCtx.resume();
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.35;
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          raf = requestAnimationFrame(listenBlow);
        } catch {
          /* mic denied — shake + tap still work */
        }
      })();
    };

    const onFirst = () => arm();
    document.addEventListener("pointerdown", onFirst, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onFirst);
      if (motionOn) window.removeEventListener("devicemotion", onMotion);
      cancelAnimationFrame(raf);
      source?.disconnect();
      stream?.getTracks().forEach((t) => t.stop());
      void audioCtx?.close();
    };
    // addBubbles is stable enough for this mount-only sensor wiring
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <p className={styles.hint}>Shake the phone. Blow on it. Tap to pop.</p>
      <div className={`${styles.pond} ${windy ? styles.windy : ""}`} aria-label="Bubble pond">
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
