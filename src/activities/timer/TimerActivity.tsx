import { useEffect, useRef, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/settings';
import { playCelebration, setMuted as setSoundMuted, unlockAudio } from '../../lib/sound';
import { Celebration } from './Celebration';
import { TimerRunning } from './TimerRunning';
import { TimerSetup } from './TimerSetup';
import { builtinCharacters } from './characters';
import { useCountdown } from './useCountdown';

function resolveCharacter(characterId: string): string {
  if (characterId !== 'surprise') return characterId;
  return builtinCharacters[Math.floor(Math.random() * builtinCharacters.length)].id;
}

interface Props {
  onExit: () => void;
}

export function TimerActivity({ onExit }: Props) {
  const [settings, setSettings] = useState(loadSettings);
  // The character actually hiding this round — resolved from 'surprise' at start.
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const timer = useCountdown();
  const celebratedRef = useRef(false);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    if (timer.status === 'done' && !celebratedRef.current) {
      celebratedRef.current = true;
      playCelebration();
    }
    if (timer.status !== 'done') celebratedRef.current = false;
  }, [timer.status]);

  const handleStart = (durationMs: number) => {
    unlockAudio();
    setActiveCharacterId(resolveCharacter(settings.characterId));
    setSettings(saveSettings({ lastDurationMs: durationMs }));
    timer.start(durationMs);
  };

  // activeCharacterId is set in handleStart; the fallback only guards first render.
  const roundCharacterId =
    activeCharacterId ?? (settings.characterId === 'surprise' ? builtinCharacters[0].id : settings.characterId);

  if (timer.status === 'running' || timer.status === 'paused') {
    return (
      <TimerRunning
        characterId={roundCharacterId}
        progress={timer.progress}
        remainingMs={timer.remainingMs}
        onCancel={timer.cancel}
      />
    );
  }

  if (timer.status === 'done') {
    return (
      <Celebration
        characterId={roundCharacterId}
        onAgain={() => {
          // A fresh surprise each round if "surprise" is selected.
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
      onSelectCharacter={(id) => setSettings(saveSettings({ characterId: id }))}
      onToggleMute={() => setSettings((s) => saveSettings({ muted: !s.muted }))}
      onStart={handleStart}
      onBack={onExit}
    />
  );
}
