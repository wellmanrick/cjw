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
  // iOS (especially a home-screen PWA) only truly unlocks once an actual node
  // has played inside a user gesture — resume() alone leaves it silent.
  if (!unlockKicked && ctx.state !== 'closed') {
    unlockKicked = true;
    try {
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch {
      unlockKicked = false;
    }
  }
}

let unlockKicked = false;
let unlockInstalled = false;

/**
 * Make audio resilient on mobile: resume the context on the first touch/click
 * anywhere, and again whenever the app returns to the foreground (iOS suspends
 * audio when backgrounded or when launched from the home screen). Call once at
 * startup; idempotent.
 */
export function installAudioUnlock() {
  if (unlockInstalled || typeof document === 'undefined') return;
  unlockInstalled = true;
  const resume = () => unlockAudio();
  document.addEventListener('pointerdown', resume, { passive: true });
  document.addEventListener('touchend', resume, { passive: true });
  document.addEventListener('click', resume, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
  });
  const warm = () => {
    preloadVoices();
    document.removeEventListener('pointerdown', warm);
  };
  document.addEventListener('pointerdown', warm, { passive: true });
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
  /** Song notes feed this. */
  music: GainNode;
  /** One-shot effects (celebration, potty sounds) feed this directly. */
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
    conv.buffer = makeImpulse(ac, 0.55, 3.4);
    const wet = ac.createGain();
    wet.gain.value = 0.12;
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
  // Deterministic per-note humanization (hash of time+pitch) so playback
  // breathes a little instead of sounding machine-perfect, while offline
  // renders still match the live app exactly.
  const h = Math.sin(when * 12.9898 + event.freq * 0.017) * 43758.5453;
  const jitter = h - Math.floor(h); // 0..1
  const humanGain = 0.88 + 0.24 * jitter;
  when += jitter * 0.014;

  const duration = Math.min(event.beats * beatS * 0.98, 1.35);
  const master = getMaster(target);

  const filter = target.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = event.voice === 'melody' ? 1900 : 620;
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
          [1, event.gain, 'sine', 1],
          [1.003, event.gain * 0.35, 'triangle', 1.2],
          [2, event.gain * 0.18, 'sine', 2.8],
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
    gain.gain.linearRampToValueAtTime(gainValue * humanGain, when + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, when + tail);
    osc.connect(gain).connect(filter);
    osc.start(when);
    osc.stop(when + tail + 0.05);
  }
}

/* --- Play-phone sounds: keypad bells, ringing, and a hello --- */

/** One music-box bell note in the song voice (keypad taps, rings). */
export function playBell(freq: number, gain = 0.14, beats = 1) {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  playSongEvent(ctx, { at: 0, freq, beats, gain, voice: 'melody' }, 0.4, ctx.currentTime);
}

/** A cheerful "ring ring": eight quick alternating bells (~1.1s). */
export function playRingBurst() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (let i = 0; i < 8; i++) {
    const freq = i % 2 === 0 ? 659.25 : 523.25; // E5 / C5
    playSongEvent(ctx, { at: 0, freq, beats: 0.35, gain: 0.13, voice: 'melody' }, 0.4, now + i * 0.14);
  }
}

/** A rising two-note "hel-lo!" when a friend picks up. */
export function playHello() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  playSongEvent(ctx, { at: 0, freq: 523.25, beats: 0.6, gain: 0.16, voice: 'melody' }, 0.4, now);
  playSongEvent(ctx, { at: 0, freq: 659.25, beats: 1.0, gain: 0.14, voice: 'melody' }, 0.4, now + 0.28);
  window.setTimeout(() => speak("Hi."), 350);
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
      songLoopStart += song.loopBeats * song.beatS * 1.12;
    }
    const event = song.events[songEventIndex];
    const when = songLoopStart + event.at * song.beatS * 1.12;
    if (when > horizon) break;
    if (!muted && when >= ctx.currentTime - 0.05) playSongEvent(ctx, event, song.beatS * 1.12, when);
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

/** A short bubble-pop for taps that need a physical "burst". */
export function playPop() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.16);
}

/** Higher-pitch "peek!" for peekaboo reveals. */
export function playPeek() {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  playSongEvent(ctx, { at: 0, freq: 523.25, beats: 0.35, gain: 0.16, voice: "melody" }, 0.4, now);
  playSongEvent(ctx, { at: 0, freq: 783.99, beats: 0.55, gain: 0.16, voice: "melody" }, 0.4, now + 0.14);
}

/** Recorded parent voice (Luna) — much warmer than the computer voice. */
const VOICE_CLIPS: Record<string, string> = {
  "Trash truck": "/voice/trash-truck.mp3",
  "Digger": "/voice/digger.mp3",
  "Dozer": "/voice/dozer.mp3",
  "Dump truck": "/voice/dump-truck.mp3",
  "Airplane": "/voice/airplane.mp3",
  "School bus": "/voice/school-bus.mp3",
  "They match": "/voice/they-match.mp3",
  "You found it": "/voice/you-found-it.mp3",
  "Peek a boo": "/voice/peekaboo.mp3",
  Peekaboo: "/voice/peekaboo.mp3",
  "Where is the trash truck?": "/voice/wheres-trash.mp3",
  "Where is the digger?": "/voice/wheres-digger.mp3",
  "Where is the airplane?": "/voice/wheres-plane.mp3",
  "Where is the school bus?": "/voice/wheres-bus.mp3",
  "The trash truck picks up the trash.": "/voice/job-trash.mp3",
  "The digger scoops the dirt.": "/voice/job-digger.mp3",
  "The dozer pushes the dirt.": "/voice/job-dozer.mp3",
  "The dump truck dumps the dirt.": "/voice/job-dump.mp3",
  "The airplane flies up high.": "/voice/job-plane.mp3",
  "The school bus is rolling.": "/voice/job-bus.mp3",
  Hi: "/voice/hi.mp3",
  "Hi.": "/voice/hi.mp3",
  "Hi!": "/voice/hi.mp3",
  Red: "/voice/red.mp3",
  Orange: "/voice/orange.mp3",
  Yellow: "/voice/yellow.mp3",
  Green: "/voice/green.mp3",
  Blue: "/voice/blue.mp3",
  Pink: "/voice/pink.mp3",
  "All done": "/voice/all-done.mp3",
  "All done!": "/voice/all-done.mp3",
  "Turn the page.": "/voice/turn-the-page.mp3",
  "Let's find a friend.": "/voice/lets-find.mp3",
  Bunny: "/voice/bunny.mp3",
};

const clipBuffers = new Map<string, AudioBuffer>();
let clipSource: AudioBufferSourceNode | null = null;

async function loadClip(url: string): Promise<AudioBuffer | null> {
  if (!ctx) return null;
  try {
    const res = await fetch(url);
    const raw = await res.arrayBuffer();
    return await ctx.decodeAudioData(raw.slice(0));
  } catch {
    return null;
  }
}

function startClip(buffer: AudioBuffer) {
  if (!ctx || muted) return;
  try {
    clipSource?.stop();
  } catch {
    /* already stopped */
  }
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.value = 0.95;
  src.connect(gain).connect(ctx.destination);
  src.start();
  clipSource = src;
}

/** Warm recorded voice when we have a clip; otherwise a gentle spoken fallback. */
export function speak(text: string) {
  if (muted) return;
  unlockAudio();
  const url = VOICE_CLIPS[text];
  if (url && ctx) {
    const cached = clipBuffers.get(url);
    if (cached) {
      startClip(cached);
      return;
    }
    void loadClip(url).then((buf) => {
      if (!buf) return;
      clipBuffers.set(url, buf);
      startClip(buf);
    });
    return;
  }
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82;
  utterance.pitch = 1.12;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function preloadVoices() {
  if (typeof window === "undefined") return;
  unlockAudio();
  for (const url of new Set(Object.values(VOICE_CLIPS))) {
    if (clipBuffers.has(url)) continue;
    void loadClip(url).then((buf) => {
      if (buf) clipBuffers.set(url, buf);
    });
  }
}

export type VehicleKind = "trash" | "digger" | "dozer" | "dump" | "plane" | "bus";

function playTone(
  freq: number,
  when: number,
  dur: number,
  gainValue = 0.16,
  type: OscillatorType = "square",
) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(gainValue, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur + 0.04);
}

function playThud(when: number, freq = 160, dur = 0.22, gainValue = 0.2) {
  if (!ctx) return;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(dur);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainValue, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
  noise.connect(lp).connect(gain).connect(ctx.destination);
  noise.start(when);
  noise.stop(when + dur);
}

function playEngine(when: number, dur: number, base = 140, chugHz = 7) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.value = base;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = chugHz;
  lfoGain.gain.value = 22;
  lfo.connect(lfoGain).connect(osc.frequency);
  lp.type = "lowpass";
  lp.frequency.value = 520;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.12, when + 0.08);
  gain.gain.setValueAtTime(0.12, when + dur - 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
  osc.connect(lp).connect(gain).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur);
  lfo.start(when);
  lfo.stop(when + dur);
}

/** Signature toy-vehicle noises for the garage. */
export function playVehicleSound(kind: VehicleKind) {
  if (muted) return;
  unlockAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (kind === "trash") {
    for (let i = 0; i < 4; i++) playTone(1000, now + i * 0.42, 0.2, 0.12, "square");
    return;
  }
  if (kind === "bus") {
    const honk = (t: number) => {
      playTone(185, t, 0.38, 0.14, "sawtooth");
      playTone(233, t, 0.38, 0.12, "sawtooth");
    };
    honk(now);
    honk(now + 0.5);
    return;
  }
  if (kind === "plane") {
    playEngine(now, 1.15, 165, 22);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(1.1);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(500, now);
    bp.frequency.exponentialRampToValueAtTime(1800, now + 0.9);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.04, now);
    ng.gain.linearRampToValueAtTime(0.1, now + 0.25);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    noise.connect(bp).connect(ng).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.1);
    return;
  }
  if (kind === "dump") {
    playEngine(now, 0.55, 150, 6);
    playTone(210, now, 0.5, 0.08, "sine");
    playTone(280, now + 0.35, 0.18, 0.1, "sine");
    playThud(now + 0.7, 140, 0.28, 0.24);
    return;
  }
  if (kind === "dozer") {
    playEngine(now, 1.0, 128, 6);
    playThud(now + 0.35, 180, 0.16, 0.16);
    playThud(now + 0.7, 160, 0.18, 0.18);
    return;
  }
  playTone(180, now, 0.28, 0.1, "square");
  playTone(240, now + 0.18, 0.22, 0.1, "square");
  playEngine(now, 0.7, 145, 8);
  playThud(now + 0.55, 170, 0.2, 0.18);
}



