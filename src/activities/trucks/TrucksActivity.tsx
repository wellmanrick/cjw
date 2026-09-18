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

const INK = "#5b4238";

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

function Clouds() {
  return (
    <svg className={styles.clouds} viewBox="0 0 400 80" aria-hidden>
      <g fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <g className={styles.cloudDrift}>
          <ellipse cx="70" cy="38" rx="28" ry="16" />
          <ellipse cx="92" cy="34" rx="22" ry="14" />
          <ellipse cx="50" cy="36" rx="16" ry="11" />
        </g>
        <g className={styles.cloudDriftSlow}>
          <ellipse cx="310" cy="28" rx="24" ry="14" />
          <ellipse cx="330" cy="26" rx="16" ry="11" />
        </g>
      </g>
    </svg>
  );
}

function Sun() {
  return (
    <svg className={styles.sun} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="16" fill="#ffd166" stroke={INK} strokeWidth="3" />
      <circle cx="26" cy="26" r="5" fill="#fff3bf" opacity="0.7" />
    </svg>
  );
}

function Dumpster() {
  return (
    <svg className={styles.propDumpster} viewBox="0 0 100 90" aria-hidden>
      <ellipse cx="50" cy="84" rx="32" ry="5" fill="rgba(61,44,41,0.14)" />
      <path d="M 14 28 L 20 74 Q 50 82 80 74 L 86 28 Z" fill="#4f8f53" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M 22 40 h 56 M 24 52 h 52" stroke={INK} strokeWidth="2" opacity="0.22" />
      <rect x="10" y="16" width="80" height="16" rx="5" fill="#6fbf73" stroke={INK} strokeWidth="2.6" />
      <rect x="18" y="20" width="18" height="8" rx="2" fill="#cdeefd" stroke={INK} strokeWidth="1.6" />
      <rect x="64" y="20" width="18" height="8" rx="2" fill="#cdeefd" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

function DirtPile({ moving }: { moving: boolean }) {
  return (
    <svg className={`${styles.propDirt} ${moving ? styles.dirtMove : ""}`} viewBox="0 0 120 70" aria-hidden>
      <ellipse cx="60" cy="62" rx="48" ry="7" fill="rgba(61,44,41,0.12)" />
      <path d="M 10 58 Q 22 18 48 22 Q 60 8 78 24 Q 102 16 110 58 Z" fill="#c4894a" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M 28 50 Q 48 30 70 48" fill="#e0a36a" stroke="none" />
    </svg>
  );
}

function Road() {
  return (
    <div className={styles.road} aria-hidden>
      <span className={styles.lane} />
    </div>
  );
}

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
    window.setTimeout(() => speak(JOB_LINE[id] ?? getBuiltinCharacter(id).name), 480);
  };

  const vehicle = getBuiltinCharacter(selected);
  const kind = KIND_BY_ID[selected] ?? "bus";
  const dirtJob = kind === "digger" || kind === "dozer" || kind === "dump";

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Trucks"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <div className={`${styles.yard} ${styles[kind]} ${acting ? styles.acting : ""}`}>
        <div className={styles.sky} />
        <Sun />
        <Clouds />
        <div className={styles.ground} />
        {kind === "bus" && <Road />}
        {kind === "plane" && <div className={styles.runway} aria-hidden />}
        {kind === "trash" && <Dumpster />}
        {dirtJob && <DirtPile moving={acting && (kind === "dozer" || kind === "dump")} />}
        <button
          key={actKey}
          type="button"
          className={`${styles.actor} ${acting ? styles[`act_${kind}`] : styles.idle}`}
          onClick={() => go(selected)}
          aria-label={vehicle.name}
        >
          {vehicle.render("happy")}
        </button>
      </div>
      <p className={styles.caption}>{vehicle.name}</p>
      <div className={styles.picker}>
        {LOT.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`${styles.pick} ${selected === v.id ? styles.pickOn : ""}`}
            onClick={() => go(v.id)}
            aria-label={v.name}
            aria-pressed={selected === v.id}
          >
            {v.render("happy")}
          </button>
        ))}
      </div>
    </div>
  );
}
