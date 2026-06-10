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

/* --- "The Wheels on the Bus" (traditional) — looped countdown song --- */

const C3 = 130.81, F3 = 174.61, G3 = 196.0, A3 = 220.0;
const C4 = 261.63, E4 = 329.63, F4 = 349.23, G4 = 392.0, A4 = 440.0, C5 = 523.25;

export interface SongEvent {
  /** Beat position within the loop. */
  at: number;
  freq: number;
  /** Length in beats. */
  beats: number;
  gain: number;
  voice: 'melody' | 'bass';
}

export const BUS_BEAT_S = 0.42;
export const BUS_LOOP_BEATS = 34;

function buildBusSong(): SongEvent[] {
  const events: SongEvent[] = [];
  const mel = (at: number, freq: number, beats: number) =>
    events.push({ at, freq, beats, gain: 0.11, voice: 'melody' });
  const bass = (at: number, freq: number, beats: number) =>
    events.push({ at, freq, beats, gain: 0.055, voice: 'bass' });

  const wheelsOnTheBus = (at: number) => {
    // "The wheels on the bus go round and round"
    mel(at, C4, 1);
    mel(at + 1, F4, 1);
    mel(at + 2, F4, 0.5);
    mel(at + 2.5, F4, 0.5);
    mel(at + 3, F4, 1);
    mel(at + 4, A4, 1);
    mel(at + 5, C5, 1);
    mel(at + 6, A4, 1);
    mel(at + 7, F4, 2);
    // gentle oom-pah underneath (F major)
    for (let b = 1; b < 8; b += 2) {
      bass(at + b, F3, 1);
      bass(at + b + 1, C4, 0.8);
    }
  };

  wheelsOnTheBus(0);
  // "round and round" (C7 -> F)
  mel(9, G4, 1);
  mel(10, E4, 1);
  mel(11, C4, 2);
  bass(9, G3, 2);
  bass(11, C3, 2);
  // "round and round" (F)
  mel(13, A4, 1);
  mel(14, F4, 1);
  mel(15, C4, 2);
  bass(13, F3, 2);
  bass(15, A3, 2);

  wheelsOnTheBus(17);
  // "all through the town" (C7 -> F)
  mel(26, A4, 1);
  mel(27, G4, 1);
  mel(28, G4, 1);
  mel(29, F4, 3);
  bass(26, G3, 2);
  bass(28, C3, 1);
  bass(29, F3, 3);
  // the rest of the loop is a breath before it starts again

  return events.sort((a, b) => a.at - b.at);
}

export const BUS_EVENTS = buildBusSong();

/**
 * Soft music-box note: sine fundamental + quiet octave shimmer + slight
 * detune, through a lowpass so it stays mellow on phone speakers.
 */
export function playBusEvent(target: BaseAudioContext, event: SongEvent, when: number) {
  const duration = Math.min(event.beats * BUS_BEAT_S * 1.05, 1.6);
  const filter = target.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = event.voice === 'melody' ? 2400 : 900;
  filter.connect(target.destination);

  const layers: Array<[number, number, OscillatorType]> =
    event.voice === 'melody'
      ? [
          [event.freq, event.gain, 'sine'],
          [event.freq * 2, event.gain * 0.22, 'sine'],
          [event.freq * 1.004, event.gain * 0.3, 'triangle'],
        ]
      : [[event.freq, event.gain, 'sine']];

  for (const [freq, gainValue, type] of layers) {
    const osc = target.createOscillator();
    const gain = target.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(gainValue, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, when + duration);
    osc.connect(gain).connect(filter);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }
}

/* Lookahead scheduler on the audio clock, so the rhythm never drifts. */
const SONG_LOOKAHEAD_S = 0.3;
const SONG_TICK_MS = 120;

let busSongTimer = 0;
let busLoopStart = 0;
let busEventIndex = 0;

function busSchedulerTick() {
  if (!ctx) return;
  const horizon = ctx.currentTime + SONG_LOOKAHEAD_S;
  for (;;) {
    if (busEventIndex >= BUS_EVENTS.length) {
      busEventIndex = 0;
      busLoopStart += BUS_LOOP_BEATS * BUS_BEAT_S;
    }
    const event = BUS_EVENTS[busEventIndex];
    const when = busLoopStart + event.at * BUS_BEAT_S;
    if (when > horizon) break;
    if (!muted && when >= ctx.currentTime - 0.05) playBusEvent(ctx, event, when);
    busEventIndex += 1;
  }
}

/** Loop the song quietly; notes respect the mute toggle as they're scheduled. */
export function startBusSong() {
  if (busSongTimer !== 0) return;
  unlockAudio();
  if (!ctx) return;
  busLoopStart = ctx.currentTime + 0.1;
  busEventIndex = 0;
  busSchedulerTick();
  busSongTimer = window.setInterval(busSchedulerTick, SONG_TICK_MS);
}

export function stopBusSong() {
  window.clearInterval(busSongTimer);
  busSongTimer = 0;
}
