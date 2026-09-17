import { useEffect, useRef, useState } from "react";
import { playCelebration, setMuted as setSoundMuted, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { Celebration } from "./Celebration";
import { TimerRunning } from "./TimerRunning";
import { TimerSetup } from "./TimerSetup";
import { builtinCharacters } from "./characters";
import { useCountdown } from "./useCountdown";

function resolveCharacter(characterId: string): string {
  if (characterId !== "surprise") return characterId;
  return builtinCharacters[Math.floor(Math.random() * builtinCharacters.length)].id;
}

interface Props {
  onExit: () => void;
}

export function TimerActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const timer = useCountdown();
  const celebratedRef = useRef(false);

  const roundCharacterId =
    activeCharacterId ??
    (settings.characterId === "surprise" ? builtinCharacters[0].id : settings.characterId);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    if (timer.status === "done" && !celebratedRef.current) {
      celebratedRef.current = true;
      playCelebration();
    }
    if (timer.status !== "done") celebratedRef.current = false;
  }, [timer.status]);

  const handleStart = (durationMs: number) => {
    unlockAudio();
    setActiveCharacterId(resolveCharacter(settings.characterId));
    update({ lastDurationMs: durationMs });
    timer.start(durationMs);
  };

  if (timer.status === "running" || timer.status === "paused") {
    return (
      <TimerRunning
        characterId={roundCharacterId}
        progress={timer.progress}
        remainingMs={timer.remainingMs}
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onCancel={timer.cancel}
      />
    );
  }

  if (timer.status === "done") {
    return (
      <Celebration
        characterId={roundCharacterId}
        onAgain={() => {
          setActiveCharacterId(resolveCharacter(settings.characterId));
          timer.start(timer.totalMs);
        }}
        onDone={timer.reset}
      />
    );
  }

  return (
    <TimerSetup
      characterId={settings.characterId}
      initialDurationMs={settings.lastDurationMs}
      muted={settings.muted}
      onSelectCharacter={(id) => update({ characterId: id })}
      onToggleMute={() => update({ muted: !settings.muted })}
      onStart={handleStart}
      onBack={onExit}
    />
  );
}
