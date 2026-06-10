import { useEffect, useRef, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/settings';
import { playCelebration, setMuted as setSoundMuted, unlockAudio } from '../../lib/sound';
import { Celebration } from './Celebration';
import { TimerRunning } from './TimerRunning';
import { TimerSetup } from './TimerSetup';
import { useCountdown } from './useCountdown';

interface Props {
  onExit: () => void;
}

export function TimerActivity({ onExit }: Props) {
  const [settings, setSettings] = useState(loadSettings);
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
    setSettings(saveSettings({ lastDurationMs: durationMs }));
    timer.start(durationMs);
  };

  if (timer.status === 'running' || timer.status === 'paused') {
    return (
      <TimerRunning
        characterId={settings.characterId}
        progress={timer.progress}
        remainingMs={timer.remainingMs}
        onCancel={timer.cancel}
      />
    );
  }

  if (timer.status === 'done') {
    return (
      <Celebration
        characterId={settings.characterId}
        onAgain={() => timer.start(timer.totalMs)}
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
