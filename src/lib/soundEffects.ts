let effectsCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!effectsCtx) effectsCtx = new AudioContext();
  if (effectsCtx.state === 'suspended') void effectsCtx.resume();
  return effectsCtx;
}

function chirp(
  ac: AudioContext,
  startAt: number,
  from: number,
  to: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = 'sine',
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, startAt);
  osc.frequency.exponentialRampToValueAtTime(to, startAt + duration);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function noiseBurst(ac: AudioContext, startAt: number, duration: number, gainValue: number, frequency: number) {
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac, duration);
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = frequency;
  band.Q.value = 1.8;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  source.connect(band).connect(gain).connect(ac.destination);
  source.start(startAt);
  source.stop(startAt + duration);
}

/** Character flavor sounds that sit on top of the looped songs. */
export function playAnimalStinger(characterId: string, muted: boolean) {
  if (muted || characterId.startsWith('photo:')) return;
  const ac = getCtx();
  if (!ac) return;

  const now = ac.currentTime;
  switch (characterId) {
    case 'builtin:cow':
      chirp(ac, now, 180, 105, 0.42, 0.13, 'sine');
      chirp(ac, now + 0.06, 245, 130, 0.38, 0.05, 'triangle');
      break;
    case 'builtin:dog':
      chirp(ac, now, 270, 155, 0.13, 0.14, 'square');
      chirp(ac, now + 0.18, 310, 170, 0.12, 0.1, 'square');
      break;
    case 'builtin:duck':
      chirp(ac, now, 620, 360, 0.12, 0.11, 'sawtooth');
      chirp(ac, now + 0.14, 560, 330, 0.12, 0.09, 'sawtooth');
      break;
    case 'builtin:frog':
      chirp(ac, now, 125, 165, 0.18, 0.11, 'sawtooth');
      chirp(ac, now + 0.2, 135, 180, 0.16, 0.09, 'sawtooth');
      break;
    case 'builtin:cat':
      chirp(ac, now, 520, 880, 0.28, 0.09, 'triangle');
      chirp(ac, now + 0.18, 760, 540, 0.28, 0.05, 'sine');
      break;
    case 'builtin:pig':
      chirp(ac, now, 210, 170, 0.12, 0.1, 'sawtooth');
      chirp(ac, now + 0.13, 230, 185, 0.12, 0.09, 'sawtooth');
      break;
    case 'builtin:shark':
      noiseBurst(ac, now, 0.5, 0.07, 900);
      chirp(ac, now + 0.05, 360, 520, 0.22, 0.05, 'sine');
      break;
    case 'builtin:digger':
      noiseBurst(ac, now, 0.25, 0.08, 280);
      chirp(ac, now + 0.05, 95, 70, 0.22, 0.08, 'sawtooth');
      break;
    case 'builtin:bus':
      chirp(ac, now, 420, 420, 0.16, 0.1, 'square');
      chirp(ac, now + 0.22, 330, 330, 0.16, 0.08, 'square');
      break;
    case 'builtin:chick':
      chirp(ac, now, 920, 1180, 0.08, 0.08, 'triangle');
      chirp(ac, now + 0.1, 980, 1320, 0.08, 0.07, 'triangle');
      break;
    case 'builtin:monster':
      chirp(ac, now, 95, 65, 0.38, 0.11, 'sawtooth');
      break;
    default:
      chirp(ac, now, 660, 880, 0.16, 0.06, 'triangle');
  }
}

/** A tiny sparkle/countdown tick used only in the final ten seconds. */
export function playUrgencyAccent(muted: boolean) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  chirp(ac, now, 1046.5, 1046.5, 0.18, 0.07, 'triangle');
  chirp(ac, now + 0.08, 1568, 1568, 0.16, 0.04, 'sine');
}
