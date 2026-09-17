import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { speak, playPeek, setMuted as setSoundMuted, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import { getBuiltinCharacter } from "../timer/characters";
import styles from "./find.module.css";

interface Props {
  onExit: () => void;
}

type Round =
  | { kind: "hide"; target: string; prompt: string; spots: number }
  | { kind: "scene"; target: string; prompt: string; decoys: string[] };

const ROUNDS: Round[] = [
  { kind: "hide", target: "builtin:trash", prompt: "Where is the trash truck?", spots: 3 },
  { kind: "hide", target: "builtin:digger", prompt: "Where is the digger?", spots: 3 },
  {
    kind: "scene",
    target: "builtin:plane",
    prompt: "Where is the airplane?",
    decoys: ["builtin:bunny", "builtin:bus", "builtin:digger"],
  },
  {
    kind: "scene",
    target: "builtin:bus",
    prompt: "Where is the school bus?",
    decoys: ["builtin:trash", "builtin:plane", "builtin:dozer"],
  },
];

const SPOT_COLORS = ["#79c270", "#8bd3dd", "#ffd166"];

export function FindActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [index, setIndex] = useState(0);
  const [hideAt, setHideAt] = useState(1);
  const [found, setFound] = useState(false);
  const [wiggle, setWiggle] = useState<number | null>(null);
  useWakeLock(true);
  const round = ROUNDS[index % ROUNDS.length];

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    setFound(false);
    setHideAt(Math.floor(Math.random() * 3));
    unlockAudio();
    const t = window.setTimeout(() => speak(round.prompt), 250);
    return () => window.clearTimeout(t);
  }, [index, round.prompt]);

  const win = () => {
    if (found) return;
    setFound(true);
    playPeek();
    speak("You found it");
    window.setTimeout(() => setIndex((i) => i + 1), 2200);
  };

  const miss = (n: number) => {
    if (found) return;
    setWiggle(n);
    window.setTimeout(() => setWiggle(null), 400);
  };

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Find"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <p className={styles.hint}>{found ? "You found it." : round.prompt}</p>

      {round.kind === "hide" && (
        <div className={styles.hills}>
          {SPOT_COLORS.map((color, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.hill} ${wiggle === i ? styles.wiggle : ""}`}
              style={{ background: color }}
              onClick={() => (i === hideAt ? win() : miss(i))}
              aria-label={i === hideAt && found ? "Found" : "Look here"}
            >
              {found && i === hideAt ? (
                getBuiltinCharacter(round.target).render("happy")
              ) : (
                <span className={styles.mound} />
              )}
            </button>
          ))}
        </div>
      )}

      {round.kind === "scene" && (
        <div className={styles.scene}>
          <button type="button" className={`${styles.prop} ${styles.sun}`} aria-hidden tabIndex={-1} />
          <button type="button" className={`${styles.prop} ${styles.tree}`} onClick={() => miss(9)} aria-label="Tree" />
          {round.decoys.map((id, i) => (
            <button
              key={id}
              type="button"
              className={`${styles.decoy} ${styles[`d${i}` as "d0" | "d1" | "d2"]}`}
              onClick={() => miss(i)}
              aria-label={getBuiltinCharacter(id).name}
            >
              {getBuiltinCharacter(id).render("happy")}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.target} ${found ? styles.found : ""}`}
            onClick={win}
            aria-label={getBuiltinCharacter(round.target).name}
          >
            {getBuiltinCharacter(round.target).render("happy")}
          </button>
        </div>
      )}
    </div>
  );
}
