/**
 * Song library for the countdown — classic public-domain toddler tunes,
 * each defined as melody + soft bass events on a beat grid.
 */

export interface SongEvent {
  /** Beat position within the loop. */
  at: number;
  freq: number;
  /** Length in beats. */
  beats: number;
  gain: number;
  voice: 'melody' | 'bass';
}

export interface Song {
  id: string;
  name: string;
  /** Seconds per beat. */
  beatS: number;
  /** Total loop length in beats (including the closing breath). */
  loopBeats: number;
  events: SongEvent[];
}

/* Note frequencies (equal temperament, A4 = 440). */
const C3 = 130.81, D3 = 146.83, F3 = 174.61, G3 = 196.0, A3 = 220.0, Bb3 = 233.08;
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.0, A4 = 440.0, Bb4 = 466.16, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46;

const MELODY_GAIN = 0.11;
const BASS_GAIN = 0.05;

type Note = [freq: number, beats: number, gain?: number];

class SongBuilder {
  events: SongEvent[] = [];

  /** Append notes sequentially starting at `at`; returns the end beat. */
  melody(at: number, notes: Note[]): number {
    return this.add('melody', MELODY_GAIN, at, notes);
  }

  bass(at: number, notes: Note[]): number {
    return this.add('bass', BASS_GAIN, at, notes);
  }

  private add(voice: SongEvent['voice'], defaultGain: number, at: number, notes: Note[]): number {
    for (const [freq, beats, gain] of notes) {
      if (freq > 0) this.events.push({ at, freq, beats, gain: gain ?? defaultGain, voice });
      at += beats;
    }
    return at;
  }

  build(id: string, name: string, beatS: number, loopBeats: number): Song {
    return { id, name, beatS, loopBeats, events: this.events.sort((a, b) => a.at - b.at) };
  }
}

function wheelsOnTheBus(): Song {
  const s = new SongBuilder();
  const verse = (at: number) => {
    // "The wheels on the bus go round and round"
    s.melody(at, [[C4, 1], [F4, 1], [F4, 0.5], [F4, 0.5], [F4, 1], [A4, 1], [C5, 1], [A4, 1], [F4, 2]]);
    for (let b = 1; b < 8; b += 2) s.bass(at + b, [[F3, 1], [C4, 0.8]]);
  };
  verse(0);
  // "round and round" (C7 -> F), twice
  s.melody(9, [[G4, 1], [E4, 1], [C4, 2]]);
  s.bass(9, [[G3, 2], [C3, 2]]);
  s.melody(13, [[A4, 1], [F4, 1], [C4, 2]]);
  s.bass(13, [[F3, 2], [A3, 2]]);
  verse(17);
  // "all through the town"
  s.melody(26, [[A4, 1], [G4, 1], [G4, 1], [F4, 3]]);
  s.bass(26, [[G3, 2], [C3, 1], [F3, 3]]);
  return s.build('wheels', 'The Wheels on the Bus', 0.42, 34);
}

function twinkleTwinkle(): Song {
  const s = new SongBuilder();
  // "Twinkle twinkle little star, how I wonder what you are"
  s.melody(0, [[C4, 1], [C4, 1], [G4, 1], [G4, 1], [A4, 1], [A4, 1], [G4, 2]]);
  s.melody(8, [[F4, 1], [F4, 1], [E4, 1], [E4, 1], [D4, 1], [D4, 1], [C4, 2]]);
  s.bass(0, [[C3, 2], [C3, 2], [F3, 2], [C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2]]);
  // "Up above the world so high, like a diamond in the sky"
  s.melody(16, [[G4, 1], [G4, 1], [F4, 1], [F4, 1], [E4, 1], [E4, 1], [D4, 2]]);
  s.melody(24, [[G4, 1], [G4, 1], [F4, 1], [F4, 1], [E4, 1], [E4, 1], [D4, 2]]);
  s.bass(16, [[C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2], [F3, 2], [C3, 2], [G3, 2]]);
  // closing line repeats the opening
  s.melody(32, [[C4, 1], [C4, 1], [G4, 1], [G4, 1], [A4, 1], [A4, 1], [G4, 2]]);
  s.melody(40, [[F4, 1], [F4, 1], [E4, 1], [E4, 1], [D4, 1], [D4, 1], [C4, 2]]);
  s.bass(32, [[C3, 2], [C3, 2], [F3, 2], [C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2]]);
  return s.build('twinkle', 'Twinkle Twinkle Little Star', 0.4, 51);
}

function maryHadALittleLamb(): Song {
  const s = new SongBuilder();
  s.melody(0, [[E4, 1], [D4, 1], [C4, 1], [D4, 1], [E4, 1], [E4, 1], [E4, 2]]);
  s.melody(8, [[D4, 1], [D4, 1], [D4, 2], [E4, 1], [G4, 1], [G4, 2]]);
  s.melody(16, [[E4, 1], [D4, 1], [C4, 1], [D4, 1], [E4, 1], [E4, 1], [E4, 1], [E4, 1]]);
  s.melody(24, [[D4, 1], [D4, 1], [E4, 1], [D4, 1], [C4, 4]]);
  s.bass(0, [[C3, 4], [C3, 4], [G3, 4], [C3, 4], [C3, 4], [C3, 4], [G3, 2], [C3, 4]]);
  return s.build('mary', 'Mary Had a Little Lamb', 0.42, 31);
}

function rowYourBoat(): Song {
  const s = new SongBuilder();
  // "Row, row, row your boat, gently down the stream"
  s.melody(0, [[C4, 1.5], [C4, 1.5], [C4, 1], [D4, 0.5], [E4, 1.5]]);
  s.melody(6, [[E4, 1], [D4, 0.5], [E4, 1], [F4, 0.5], [G4, 3]]);
  // "merrily, merrily, merrily, merrily"
  s.melody(12, [[C5, 0.5], [C5, 0.5], [C5, 0.5], [G4, 0.5], [G4, 0.5], [G4, 0.5], [E4, 0.5], [E4, 0.5], [E4, 0.5], [C4, 0.5], [C4, 0.5], [C4, 0.5]]);
  // "life is but a dream"
  s.melody(18, [[G4, 1], [F4, 0.5], [E4, 1], [D4, 0.5], [C4, 3]]);
  s.bass(0, [[C3, 3], [C3, 3], [C3, 3], [C3, 3], [C3, 3], [C3, 3], [G3, 1.5], [C3, 3]]);
  return s.build('row', 'Row Row Row Your Boat', 0.46, 24);
}

function oldMacdonald(): Song {
  const s = new SongBuilder();
  const line = (at: number, pickup: boolean) => {
    if (pickup) s.melody(at - 1, [[D4, 1]]);
    s.melody(at, [[G4, 1], [G4, 1], [G4, 1], [D4, 1], [E4, 1], [E4, 1], [D4, 2]]);
    // "E-I-E-I-O"
    s.melody(at + 8, [[B4, 1], [B4, 1], [A4, 1], [A4, 1], [G4, 3]]);
    s.bass(at, [[G3, 2], [G3, 2], [C3, 2], [G3, 2], [C3, 2], [D3, 2], [G3, 3]]);
  };
  line(0, false); // "Old MacDonald had a farm, E-I-E-I-O"
  line(16, true); // "And on that farm he had a cow, E-I-E-I-O"
  return s.build('macdonald', 'Old MacDonald Had a Farm', 0.42, 33);
}

function bingo(): Song {
  const s = new SongBuilder();
  // "There was a farmer had a dog, and Bingo was his name-o"
  s.melody(0, [[G4, 1], [C5, 1], [C5, 1], [C5, 1], [G4, 1], [A4, 1], [A4, 1], [G4, 2]]);
  s.melody(9, [[G4, 1], [C5, 1], [C5, 1], [D5, 1], [D5, 1], [E5, 1], [C5, 2]]);
  s.bass(1, [[C3, 2], [F3, 2], [C3, 2], [G3, 2], [C3, 2], [G3, 2], [C3, 2]]);
  // "B-I-N-G-O" x3, stepping down
  s.melody(17, [[E5, 1], [E5, 1], [F5, 1], [F5, 1], [F5, 2]]);
  s.melody(23, [[D5, 1], [D5, 1], [E5, 1], [E5, 1], [E5, 2]]);
  s.melody(29, [[C5, 1], [C5, 1], [D5, 1], [D5, 1], [D5, 2]]);
  s.bass(17, [[C3, 2], [F3, 4], [G3, 2], [C3, 4], [F3, 2], [G3, 4]]);
  // "and Bingo was his name-o!"
  s.melody(35, [[G4, 1], [C5, 1], [C5, 1], [D5, 1], [D5, 1], [E5, 1], [C5, 3]]);
  s.bass(35, [[G3, 2], [G3, 2], [C3, 3]]);
  return s.build('bingo', 'BINGO', 0.4, 44);
}

function ifYoureHappy(): Song {
  const s = new SongBuilder();
  const clap = (at: number) => {
    s.melody(at, [[F5, 0.4, 0.14], [0, 0.35], [F5, 0.4, 0.14]]);
  };
  // "If you're happy and you know it, clap your hands" (clap clap!)
  s.melody(0, [[C4, 0.5], [C4, 0.5], [F4, 0.75], [F4, 0.25], [F4, 0.5], [F4, 0.5], [F4, 0.5], [F4, 0.5], [D4, 0.5], [E4, 0.5], [F4, 1.5]]);
  clap(6.5);
  s.bass(1, [[F3, 2], [F3, 2], [C3, 2]]);
  // second line, up a step, ending on G
  s.melody(8, [[C4, 0.5], [C4, 0.5], [G4, 0.75], [G4, 0.25], [G4, 0.5], [G4, 0.5], [G4, 0.5], [G4, 0.5], [E4, 0.5], [F4, 0.5], [G4, 1.5]]);
  clap(14.5);
  s.bass(9, [[C3, 2], [C3, 2], [F3, 2]]);
  // closing line resolves home
  s.melody(16, [[C4, 0.5], [C4, 0.5], [F4, 0.75], [F4, 0.25], [F4, 0.5], [F4, 0.5], [F4, 0.5], [F4, 0.5], [G4, 0.5], [E4, 0.5], [F4, 2]]);
  clap(23);
  s.bass(17, [[F3, 2], [Bb3, 2], [C3, 1], [F3, 2]]);
  return s.build('happy', "If You're Happy and You Know It", 0.4, 27);
}

function popGoesTheWeasel(): Song {
  const s = new SongBuilder();
  // "All around the cobbler's bench, the monkey chased the weasel"
  s.melody(0, [[G3, 1], [C4, 1], [C4, 0.5], [D4, 1], [D4, 0.5], [E4, 0.5], [G4, 0.5], [E4, 0.5], [C4, 1.5]]);
  s.melody(7, [[G3, 1], [C4, 1], [C4, 0.5], [D4, 1], [F4, 0.5], [E4, 0.5], [C4, 2]]);
  s.bass(1, [[C3, 3], [G3, 3], [C3, 3], [G3, 1.5], [C3, 1.5]]);
  // "The monkey thought 'twas all in fun" ... "POP! goes the weasel"
  s.melody(13.5, [[G3, 1], [C4, 1], [C4, 0.5], [D4, 1], [D4, 0.5], [E4, 0.5], [G4, 0.5], [E4, 0.5], [C4, 1.5]]);
  s.melody(20.5, [[A4, 1.5, 0.16], [D4, 1], [F4, 0.5], [E4, 0.5], [C4, 2]]); // the "Pop!"
  s.bass(14.5, [[C3, 3], [G3, 3], [F3, 1.5], [G3, 1.5], [C3, 2]]);
  return s.build('weasel', 'Pop Goes the Weasel', 0.4, 28);
}

function frereJacques(): Song {
  const s = new SongBuilder();
  // "Are you sleeping, are you sleeping"
  s.melody(0, [[C4, 1], [D4, 1], [E4, 1], [C4, 1], [C4, 1], [D4, 1], [E4, 1], [C4, 1]]);
  // "Brother John, Brother John"
  s.melody(8, [[E4, 1], [F4, 1], [G4, 2], [E4, 1], [F4, 1], [G4, 2]]);
  // "Morning bells are ringing, morning bells are ringing"
  s.melody(16, [[G4, 0.5], [A4, 0.5], [G4, 0.5], [F4, 0.5], [E4, 1], [C4, 1], [G4, 0.5], [A4, 0.5], [G4, 0.5], [F4, 0.5], [E4, 1], [C4, 1]]);
  // "Ding dang dong, ding dang dong"
  s.melody(24, [[C4, 1], [G3, 1], [C4, 2], [C4, 1], [G3, 1], [C4, 2]]);
  s.bass(0, [[C3, 4], [C3, 4], [C3, 2], [G3, 2], [C3, 2], [G3, 2], [C3, 4], [C3, 4], [G3, 2], [C3, 2], [G3, 2], [C3, 2]]);
  return s.build('frere', 'Frère Jacques', 0.44, 31);
}

function londonBridge(): Song {
  const s = new SongBuilder();
  // "London Bridge is falling down"
  s.melody(0, [[G4, 1.5], [A4, 0.5], [G4, 1], [F4, 1], [E4, 1], [F4, 1], [G4, 2]]);
  // "falling down, falling down"
  s.melody(8, [[D4, 1], [E4, 1], [F4, 2], [E4, 1], [F4, 1], [G4, 2]]);
  // "London Bridge is falling down"
  s.melody(16, [[G4, 1.5], [A4, 0.5], [G4, 1], [F4, 1], [E4, 1], [F4, 1], [G4, 2]]);
  // "my fair lady"
  s.melody(24, [[D4, 2], [G4, 2], [E4, 1], [C4, 3]]);
  s.bass(0, [[C3, 4], [G3, 4], [G3, 4], [C3, 4], [C3, 4], [G3, 4], [G3, 2], [C3, 4]]);
  return s.build('london', 'London Bridge', 0.42, 31);
}

function happyBirthday(): Song {
  const s = new SongBuilder();
  s.melody(0, [[C4, 0.75], [C4, 0.25], [D4, 1], [C4, 1], [F4, 1], [E4, 2]]);
  s.melody(6, [[C4, 0.75], [C4, 0.25], [D4, 1], [C4, 1], [G4, 1], [F4, 2]]);
  s.melody(12, [[C4, 0.75], [C4, 0.25], [C5, 1], [A4, 1], [F4, 1], [E4, 1], [D4, 2]]);
  s.melody(19, [[Bb4, 0.75], [Bb4, 0.25], [A4, 1], [F4, 1], [G4, 1], [F4, 2]]);
  s.bass(0, [[F3, 3], [C3, 3], [C3, 3], [F3, 3], [F3, 3], [F3, 1], [Bb3, 3], [F3, 1], [C3, 1], [F3, 2]]);
  return s.build('birthday', 'Happy Birthday', 0.45, 27);
}

const SONGS: Record<string, Song> = {};
for (const song of [
  wheelsOnTheBus(),
  twinkleTwinkle(),
  maryHadALittleLamb(),
  rowYourBoat(),
  oldMacdonald(),
  bingo(),
  ifYoureHappy(),
  popGoesTheWeasel(),
  frereJacques(),
  londonBridge(),
  happyBirthday(),
]) {
  SONGS[song.id] = song;
}

export { SONGS };

const CHARACTER_SONGS: Record<string, string> = {
  'builtin:bus': 'wheels',
  'builtin:bunny': 'twinkle',
  'builtin:chick': 'mary',
  'builtin:frog': 'row',
  'builtin:cow': 'macdonald',
  'builtin:dog': 'bingo',
  'builtin:pig': 'happy',
  'builtin:cat': 'weasel',
  'builtin:bear': 'frere',
  'builtin:fox': 'london',
  'builtin:duck': 'row',
};

/** Every character sings while it hides; uploaded photos get Happy Birthday. */
export function songForCharacter(characterId: string): Song {
  if (characterId.startsWith('photo:')) return SONGS.birthday;
  return SONGS[CHARACTER_SONGS[characterId] ?? 'wheels'];
}
