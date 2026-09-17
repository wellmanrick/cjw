import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { speak, setMuted as setSoundMuted, playPop, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import { getBuiltinCharacter } from "../timer/characters";
import styles from "./match.module.css";

interface Props {
  onExit: () => void;
}

const PAIR_IDS = ["builtin:trash", "builtin:digger", "builtin:plane"] as const;

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const STARTER = [...PAIR_IDS, ...PAIR_IDS].map((id, i) => ({ key: `${id}-${i}`, id }));

export function MatchActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [deck, setDeck] = useState(STARTER);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  useWakeLock(true);

  useEffect(() => {
    setDeck(shuffle(STARTER));
  }, []);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  const tap = (key: string, id: string) => {
    if (lock || flipped.includes(key) || matched.includes(id)) return;
    unlockAudio();
    playPop();
    const next = [...flipped, key];
    setFlipped(next);
    if (next.length < 2) return;
    const [a, b] = next;
    const idA = deck.find((c) => c.key === a)?.id;
    const idB = deck.find((c) => c.key === b)?.id;
    setLock(true);
    if (idA && idA === idB) {
      window.setTimeout(() => {
        setMatched((m) => [...m, idA]);
        setFlipped([]);
        setLock(false);
        speak("They match");
        if (matched.length + 1 === PAIR_IDS.length) {
          window.setTimeout(() => speak("All done"), 900);
          window.setTimeout(() => {
            setMatched([]);
            setFlipped([]);
            setDeck(shuffle(STARTER));
          }, 2800);
        }
      }, 600);
    } else {
      window.setTimeout(() => {
        setFlipped([]);
        setLock(false);
      }, 1100);
    }
  };

  const done = matched.length === PAIR_IDS.length;

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Match"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <p className={styles.hint}>{done ? "All done." : "Find two the same."}</p>
      <div className={styles.grid}>
        {deck.map((card) => {
          const open = flipped.includes(card.key) || matched.includes(card.id);
          const friend = getBuiltinCharacter(card.id);
          return (
            <button
              key={card.key}
              type="button"
              className={`${styles.card} ${open ? styles.open : ""}`}
              onClick={() => tap(card.key, card.id)}
              aria-label={open ? friend.name : "Hidden card"}
            >
              {open ? friend.render("happy") : <span className={styles.back}>?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
