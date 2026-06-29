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
 * A master bus per audio context: notes feed a compressor (to glue the loop
 * and tame peaks) and a gentle reverb send (so notes ring and blend instead
 * of sounding bare). Cached per context so the offline render and the live
 * app share the exact same sound.
 */
interface MasterBus {
  /** Song notes feed this; it can be ducked under a sound effect. */
  music: GainNode;
  /** One-shot effects (animal calls, accents) feed this directly. */
  dry: AudioNode;
  reverb: AudioNode;
}
const masterBuses = new WeakMap<BaseAudioContext, MasterBus>();

/** Synthesized impulse response: white noise with an exponential decay tail. */
function makeImpulse(ac: BaseAudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function getMaster(ac: BaseAudioContext): MasterBus {
  let bus = masterBuses.get(ac);
  if (!bus) {
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 26;
    comp.ratio.value = 3;
    comp.attack.value = 0.006;
    comp.release.value = 0.22;
    comp.connect(ac.destination);

    const conv = ac.createConvolver();
    conv.buffer = makeImpulse(ac, 1.7, 2.6);
    const wet = ac.createGain();
    wet.gain.value = 0.26;
    conv.connect(wet).connect(comp);

    const music = ac.createGain();
    music.gain.value = 1;
    music.connect(comp);

    bus = { music, dry: comp, reverb: conv };
    masterBuses.set(ac, bus);
  }
  return bus;
}

/**
 * Warm bell / celesta note: a bright, fast-decaying attack chime over a softer
 * singing fundamental, lightly detuned for warmth, through a lowpass and into
 * the master bus (dry + reverb send).
 */
export function playSongEvent(target: BaseAudioContext, event: SongEvent, beatS: number, when: number) {
  const duration = Math.min(event.beats * beatS * 1.1, 1.9);
  const master = getMaster(target);

  const filter = target.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = event.voice === 'melody' ? 3000 : 700;
  filter.Q.value = 0.4;
  filter.connect(master.music);
  // Reverb send (a little less for the bass so the low end stays tidy).
  const send = target.createGain();
  send.gain.value = event.voice === 'melody' ? 1 : 0.4;
  filter.connect(send).connect(master.reverb);

  // [freq multiple, peak gain, waveform, decay scale] — bigger decay = shorter.
  const layers: Array<[number, number, OscillatorType, number]> =
    event.voice === 'melody'
      ? [
          [1, event.gain, 'sine', 1], // singing fundamental
          [1.001, event.gain * 0.5, 'triangle', 1.15], // gentle detune warmth
          [2, event.gain * 0.5, 'sine', 2.4], // bright "ting" attack
          [3, event.gain * 0.16, 'sine', 4], // sparkle transient
        ]
      : [
          [1, event.gain, 'triangle', 1], // round bass body
          [0.5, event.gain * 0.4, 'sine', 1], // sub for warmth
        ];

  for (const [mult, gainValue, type, decayScale] of layers) {
    const osc = target.createOscillator();
    const gain = target.createGain();
    osc.type = type;
    osc.frequency.value = event.freq * mult;
    const tail = Math.max(0.12, duration / decayScale);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(gainValue, when + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, when + tail);
    osc.connect(gain).connect(filter);
    osc.start(when);
    osc.stop(when + tail + 0.05);
  }
}

/* --- Character sound effects (animal calls, urgency accents) --- */

/** A pitched effect tone, routed through the shared master (dry + reverb). */
function fxChirp(
  ac: BaseAudioContext,
  startAt: number,
  from: number,
  to: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = 'sine',
) {
  const master = getMaster(ac);
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, startAt);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, startAt + duration);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.connect(gain).connect(master.dry);
  const send = ac.createGain();
  send.gain.value = 0.25;
  gain.connect(send).connect(master.reverb);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/** A band-passed noise burst (growls, splashes), routed through the master. */
function fxNoiseBurst(
  ac: BaseAudioContext,
  startAt: number,
  duration: number,
  gainValue: number,
  frequency: number,
) {
  const master = getMaster(ac);
  const source = ac.createBufferSource();
  source.buffer = makeImpulse(ac, duration, 0); // flat white-noise window
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = frequency;
  band.Q.value = 1.8;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  source.connect(band).connect(gain).connect(master.dry);
  const send = ac.createGain();
  send.gain.value = 0.2;
  gain.connect(send).connect(master.reverb);
  source.start(startAt);
  source.stop(startAt + duration);
}

/**
 * Schedule a character's signature call into a context at a given time.
 * Exported so the offline renderer can preview each animal; the live app
 * uses playAnimalStinger() below.
 */
export function scheduleAnimalStinger(ac: BaseAudioContext, characterId: string, now: number) {
  switch (characterId) {
    case 'builtin:cow':
      fxChirp(ac, now, 180, 105, 0.42, 0.13, 'sine');
      fxChirp(ac, now + 0.06, 245, 130, 0.38, 0.05, 'triangle');
      break;
    case 'builtin:dog':
      fxChirp(ac, now, 270, 155, 0.13, 0.14, 'square');
      fxChirp(ac, now + 0.18, 310, 170, 0.12, 0.1, 'square');
      break;
    case 'builtin:duck':
      fxChirp(ac, now, 620, 360, 0.12, 0.11, 'sawtooth');
      fxChirp(ac, now + 0.14, 560, 330, 0.12, 0.09, 'sawtooth');
      break;
    case 'builtin:frog':
      fxChirp(ac, now, 125, 165, 0.18, 0.11, 'sawtooth');
      fxChirp(ac, now + 0.2, 135, 180, 0.16, 0.09, 'sawtooth');
      break;
    case 'builtin:cat':
      fxChirp(ac, now, 520, 880, 0.28, 0.09, 'triangle');
      fxChirp(ac, now + 0.18, 760, 540, 0.28, 0.05, 'sine');
      break;
    case 'builtin:pig':
      fxChirp(ac, now, 210, 170, 0.12, 0.1, 'sawtooth');
      fxChirp(ac, now + 0.13, 230, 185, 0.12, 0.09, 'sawtooth');
      break;
    case 'builtin:shark':
      fxNoiseBurst(ac, now, 0.5, 0.07, 900);
      fxChirp(ac, now + 0.05, 360, 520, 0.22, 0.05, 'sine');
      break;
    case 'builtin:digger':
      fxNoiseBurst(ac, now, 0.25, 0.08, 280);
      fxChirp(ac, now + 0.05, 95, 70, 0.22, 0.08, 'sawtooth');
      break;
    case 'builtin:bus':
      fxChirp(ac, now, 420, 420, 0.16, 0.1, 'square');
      fxChirp(ac, now + 0.22, 330, 330, 0.16, 0.08, 'square');
      break;
    case 'builtin:chick':
      fxChirp(ac, now, 920, 1180, 0.08, 0.08, 'triangle');
      fxChirp(ac, now + 0.1, 980, 1320, 0.08, 0.07, 'triangle');
      break;
    case 'builtin:monster':
      fxChirp(ac, now, 95, 65, 0.38, 0.11, 'sawtooth');
      fxChirp(ac, now + 0.12, 180, 240, 0.2, 0.06, 'square');
      break;
    case 'builtin:bunny':
      fxChirp(ac, now, 700, 920, 0.07, 0.06, 'sine');
      fxChirp(ac, now + 0.1, 760, 1000, 0.07, 0.05, 'sine');
      break;
    default:
      fxChirp(ac, now, 660, 880, 0.16, 0.06, 'triangle');
  }
}

/** Briefly dip the song so a sound effect can land on top of it. */
function duckMusic() {
  if (!ctx) return;
  const m = getMaster(ctx).music.gain;
  const now = ctx.currentTime;
  m.cancelScheduledValues(now);
  m.setValueAtTime(m.value, now);
  m.linearRampToValueAtTime(0.45, now + 0.05);
  m.linearRampToValueAtTime(1, now + 0.55);
}

/** Play the character's signature call live, ducking the song under it. */
export function playAnimalStinger(characterId: string) {
  if (muted || !ctx || characterId.startsWith('photo:')) return;
  unlockAudio();
  duckMusic();
  scheduleAnimalStinger(ctx, characterId, ctx.currentTime);
}

/** A gentle two-note accent for the final seconds of a countdown. */
export function playUrgencyAccent() {
  if (muted || !ctx) return;
  unlockAudio();
  const now = ctx.currentTime;
  fxChirp(ctx, now, 880, 880, 0.16, 0.05, 'triangle');
  fxChirp(ctx, now + 0.09, 1318.5, 1318.5, 0.18, 0.03, 'sine');
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
