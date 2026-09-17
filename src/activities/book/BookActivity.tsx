import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { playVehicleSound, speak, setMuted as setSoundMuted, unlockAudio, type VehicleKind } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import { getBuiltinCharacter } from "../timer/characters";
import styles from "./book.module.css";

interface Props {
  onExit: () => void;
}

const PAGES: Array<{ id: string; kind: VehicleKind; line: string }> = [
  { id: "builtin:trash", kind: "trash", line: "The trash truck picks up the trash." },
  { id: "builtin:digger", kind: "digger", line: "The digger scoops the dirt." },
  { id: "builtin:dozer", kind: "dozer", line: "The dozer pushes the dirt." },
  { id: "builtin:dump", kind: "dump", line: "The dump truck dumps the dirt." },
  { id: "builtin:plane", kind: "plane", line: "The airplane flies up high." },
  { id: "builtin:bus", kind: "bus", line: "The school bus is rolling." },
];

export function BookActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [page, setPage] = useState(0);
  useWakeLock(true);
  const current = PAGES[page];
  const vehicle = getBuiltinCharacter(current.id);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    unlockAudio();
    const sound = window.setTimeout(() => playVehicleSound(current.kind), 200);
    const line = window.setTimeout(() => speak(current.line), 700);
    return () => {
      window.clearTimeout(sound);
      window.clearTimeout(line);
    };
  }, [page, current.kind, current.line]);

  const next = () => {
    unlockAudio();
    setPage((p) => (p + 1) % PAGES.length);
  };

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Book"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <button type="button" className={styles.page} onClick={next} aria-label="Turn the page">
        <div className={`${styles.art} ${styles[current.kind]}`}>{vehicle.render("happy")}</div>
        <p className={styles.line}>{current.line}</p>
        <span className={styles.turn}>Tap to turn the page</span>
      </button>
    </div>
  );
}
