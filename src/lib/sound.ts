import type { Song, SongEvent } from './songs';

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

/** A short white-noise buffer for water/cheer textures. */
function noiseBuffer(seconds: number): AudioBuffer {
  const len = Math.floor(ctx!.sampleRate * seconds);
  const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Whooshy toilet flush: swirling band-passed water noise + a low gurgle. */
export function playFlush() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const dur = 2;

  // Swirling water — noise through a bandpass that sweeps up then drains back down.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(dur);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.2;
  band.frequency.setValueAtTime(420, now);
  band.frequency.exponentialRampToValueAtTime(1500, now + 0.7);
  band.frequency.exponentialRampToValueAtTime(280, now + dur);
  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(0, now);
  nGain.gain.linearRampToValueAtTime(0.16, now + 0.2);
  nGain.gain.setValueAtTime(0.16, now + dur - 0.5);
  nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  noise.connect(band).connect(nGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + dur);

  // Gurgle — a low sine wobbling under the swirl.
  const gurgle = ctx.createOscillator();
  const gGain = ctx.createGain();
  gurgle.type = 'sine';
  gurgle.frequency.setValueAtTime(95, now);
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 7;
  lfoGain.gain.value = 28;
  lfo.connect(lfoGain).connect(gurgle.frequency);
  gGain.gain.setValueAtTime(0, now);
  gGain.gain.linearRampToValueAtTime(0.07, now + 0.3);
  gGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  gurgle.connect(gGain).connect(ctx.destination);
  gurgle.start(now);
  gurgle.stop(now + dur);
  lfo.start(now);
  lfo.stop(now + dur);
}

/** Happy "yeaahhh" cheer: a crowd-ish noise swell + a bright chord sliding up. */
export function playCheer() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const dur = 1.3;

  // Crowd swell.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(dur);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 0.8;
  bp.frequency.setValueAtTime(700, now);
  bp.frequency.linearRampToValueAtTime(1700, now + 0.5);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0, now);
  ng.gain.linearRampToValueAtTime(0.12, now + 0.25);
  ng.gain.setValueAtTime(0.12, now + 0.7);
  ng.gain.exponentialRampToValueAtTime(0.001, now + dur);
  noise.connect(bp).connect(ng).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + dur);

  // Bright "yeah!" chord that scoops up into a major triad.
  for (const f of [392, 523.25, 659.25]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(f * 0.8, now);
    osc.frequency.linearRampToValueAtTime(f, now + 0.3);
    lp.type = 'lowpass';
    lp.frequency.value = 2600;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
    osc.connect(gain).connect(lp).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.05);
  }
}

/* --- Looped countdown songs (see songs.ts for the library) --- */
/**
 * Soft music-box note: sine fundamental + quiet octave shimmer + slight
 * detune, through a lowpass so it stays mellow on phone speakers.
 */
export function playSongEvent(target: BaseAudioContext, event: SongEvent, beatS: number, when: number) {
  const duration = Math.min(event.beats * beatS * 1.05, 1.6);
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

let songTimer = 0;
let activeSong: Song | null = null;
let songLoopStart = 0;
let songEventIndex = 0;

function songSchedulerTick() {
  if (!ctx || !activeSong) return;
  const song = activeSong;
  const horizon = ctx.currentTime + SONG_LOOKAHEAD_S;
  for (;;) {
    if (songEventIndex >= song.events.length) {
      songEventIndex = 0;
      songLoopStart += song.loopBeats * song.beatS;
    }
    const event = song.events[songEventIndex];
    const when = songLoopStart + event.at * song.beatS;
    if (when > horizon) break;
    if (!muted && when >= ctx.currentTime - 0.05) playSongEvent(ctx, event, song.beatS, when);
    songEventIndex += 1;
  }
}

/** Loop a song quietly; notes respect the mute toggle as they're scheduled. */
export function startSong(song: Song) {
  if (activeSong?.id === song.id && songTimer !== 0) return;
  stopSong();
  unlockAudio();
  if (!ctx) return;
  activeSong = song;
  songLoopStart = ctx.currentTime + 0.1;
  songEventIndex = 0;
  songSchedulerTick();
  songTimer = window.setInterval(songSchedulerTick, SONG_TICK_MS);
}

export function stopSong() {
  window.clearInterval(songTimer);
  songTimer = 0;
  activeSong = null;
}
