import { useEffect, useState } from "react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { playVehicleSound, speak, setMuted as setSoundMuted, unlockAudio, type VehicleKind } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import { VEHICLE_IDS, getBuiltinCharacter } from "../timer/characters";
import styles from "./trucks.module.css";

interface Props {
  onExit: () => void;
}

const KIND_BY_ID: Record<string, VehicleKind> = {
  "builtin:trash": "trash",
  "builtin:digger": "digger",
  "builtin:dozer": "dozer",
  "builtin:dump": "dump",
  "builtin:plane": "plane",
  "builtin:bus": "bus",
};

const JOB_LINE: Record<string, string> = {
  "builtin:trash": "The trash truck picks up the trash.",
  "builtin:digger": "The digger scoops the dirt.",
  "builtin:dozer": "The dozer pushes the dirt.",
  "builtin:dump": "The dump truck dumps the dirt.",
  "builtin:plane": "The airplane flies up high.",
  "builtin:bus": "The school bus is rolling.",
};

const LOT = VEHICLE_IDS.map((id) => getBuiltinCharacter(id));

export function TrucksActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [selected, setSelected] = useState("builtin:trash");
  const [acting, setActing] = useState(false);
  const [actKey, setActKey] = useState(0);
  useWakeLock(true);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  const go = (id: string) => {
    unlockAudio();
    const kind = KIND_BY_ID[id] ?? "bus";
    setSelected(id);
    setActing(true);
    setActKey((k) => k + 1);
    playVehicleSound(kind);
    window.setTimeout(() => speak(JOB_LINE[id] ?? getBuiltinCharacter(id).name), 500);
    window.setTimeout(() => setActing(false), 3200);
  };

  const vehicle = getBuiltinCharacter(selected);
  const kind = KIND_BY_ID[selected] ?? "bus";

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Trucks"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <p className={styles.hint}>Tap a truck. Watch it work.</p>
      <button
        type="button"
        className={`${styles.yard} ${styles[kind]} ${acting ? styles.acting : ""}`}
        onClick={() => go(selected)}
        aria-label={vehicle.name}
      >
        <div className={styles.sky} />
        <div className={styles.ground} />
        {(kind === "digger" || kind === "dozer" || kind === "dump") && (
          <div className={`${styles.dirt} ${acting ? styles.dirtMove : ""}`} />
        )}
        {kind === "trash" && <div className={styles.dumpster} />}
        <div key={actKey} className={`${styles.actor} ${acting ? styles[`act_${kind}`] : ""}`}>
          {vehicle.render("happy")}
        </div>
      </button>
      <div className={styles.picker}>
        {LOT.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`${styles.pick} ${selected === v.id ? styles.pickOn : ""}`}
            onClick={() => go(v.id)}
            aria-label={v.name}
          >
            {v.render("happy")}
          </button>
        ))}
      </div>
    </div>
  );
}
