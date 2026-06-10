let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

/** Must be called from a user gesture (e.g. the Start tap) so mobile browsers allow audio. */
export function unlockAudio() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
}

function playNote(frequency: number, startAt: number, duration: number, gainValue: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/** Cheerful ascending arpeggio + closing chord. */
export function playCelebration() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;

  const now = ctx.currentTime;

  // "Pop!" as the character bursts out of its hiding spot
  const pop = ctx.createOscillator();
  const popGain = ctx.createGain();
  pop.type = 'sine';
  pop.frequency.setValueAtTime(260, now);
  pop.frequency.exponentialRampToValueAtTime(880, now + 0.09);
  popGain.gain.setValueAtTime(0.3, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  pop.connect(popGain).connect(ctx.destination);
  pop.start(now);
  pop.stop(now + 0.2);

  const arpeggio = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  arpeggio.forEach((freq, i) => {
    playNote(freq, now + 0.15 + i * 0.13, 0.45, 0.25);
    playNote(freq * 1.5, now + 0.15 + i * 0.13, 0.45, 0.06); // sparkle a fifth up
  });
  // Final chord
  const chordAt = now + 0.15 + arpeggio.length * 0.13 + 0.05;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq) => {
    playNote(freq, chordAt, 1.1, 0.12);
  });
}

/** Soft tick-tock for the countdown; brighter and a touch louder in the last seconds. */
let tickTock = false;
export function playTick(urgent = false) {
  if (muted || !ctx) return;
  tickTock = !tickTock;
  const frequency = urgent ? (tickTock ? 1318.5 : 987.8) : (tickTock ? 880 : 659.25);
  playNote(frequency, ctx.currentTime, 0.07, urgent ? 0.08 : 0.035);
}
