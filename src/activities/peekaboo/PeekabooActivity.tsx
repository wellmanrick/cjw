import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { playPeek, setMuted as setSoundMuted, speak, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import { builtinCharacters } from "../timer/characters";
import styles from "./peekaboo.module.css";

interface Props {
  onExit: () => void;
}

const DOORS = [
  { id: "a", color: "#f582ae" },
  { id: "b", color: "#8bd3dd" },
  { id: "c", color: "#ffd166" },
  { id: "d", color: "#79c270" },
];

const PEEK_FRIENDS = builtinCharacters.filter((c) =>
  [
    "builtin:trash",
    "builtin:digger",
    "builtin:plane",
    "builtin:dozer",
    "builtin:bunny",
    "builtin:dump",
    "builtin:bus",
    "builtin:dog",
    "builtin:chick",
    "builtin:frog",
  ].includes(c.id),
);

function randomFriend(except?: string) {
  const pool = PEEK_FRIENDS.filter((c) => c.id !== except);
  return pool[Math.floor(Math.random() * pool.length)] ?? PEEK_FRIENDS[0];
}

export function PeekabooActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [openId, setOpenId] = useState<string | null>(null);
  const [friendByDoor, setFriendByDoor] = useState(() =>
    Object.fromEntries(DOORS.map((d, i) => [d.id, PEEK_FRIENDS[i % PEEK_FRIENDS.length]])),
  );
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    if (!openId) return;
    const t = window.setTimeout(() => setOpenId(null), 2200);
    return () => window.clearTimeout(t);
  }, [openId]);

  const openDoor = (id: string) => {
    if (openId) return;
    unlockAudio();
    const friend = friendByDoor[id];
    playPeek();
    speak("Peek a boo");
    setOpenId(id);
    window.setTimeout(() => {
      setFriendByDoor((prev) => ({ ...prev, [id]: randomFriend(friend.id) }));
    }, 2300);
  };

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Peekaboo"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <p className={styles.hint}>Tap a door</p>
      <div className={styles.grid}>
        {DOORS.map((door) => {
          const open = openId === door.id;
          const friend = friendByDoor[door.id];
          return (
            <button
              key={door.id}
              type="button"
              className={`${styles.door} ${open ? styles.doorOpen : ""}`}
              style={{ ["--door-color" as string]: door.color }}
              onClick={() => openDoor(door.id)}
              aria-label={open ? friend.name : "Closed door"}
            >
              <span className={styles.friend}>{friend.render(open ? "party" : "happy")}</span>
              <span className={styles.panel} aria-hidden>
                <span className={styles.knob} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
