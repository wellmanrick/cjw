# Toddler Time

A growing collection of toddler-friendly activities. Built with React + Vite,
runs entirely in the browser — no backend, no accounts.

## Activities

### ⏰ Timer

A Hatch-style visual countdown for little ones who can't read clocks yet:

- A big ring drains and shifts green → red as time runs out
- The surprise: each character hides in its home during the countdown —
  chick in an egg, frog in a pond, cow behind the barn, bunny in a magic
  hat, puppy in a doghouse, piggy in a mud puddle, kitty in a cardboard
  box, bear in a cave, fox in a bush, monster in a toy chest, digger
  behind a dirt pile, baby shark under the ocean waves — peeking out now
  and then, and popping out when time is up
- Photos you upload hide in a gift box that bursts open
- A "?" tile picks a surprise character at random each round
- Every character sings its own classic tune while it hides: the school
  bus does The Wheels on the Bus, the cow Old MacDonald, the puppy BINGO,
  the kitty Pop Goes the Weasel, the bunny Twinkle Twinkle, the bear
  Frère Jacques, the chick Mary Had a Little Lamb, the frog and duck Row
  Row Row Your Boat, the piggy If You're Happy and You Know It, the fox
  London Bridge, the monster Ring Around the Rosie, the digger Ode to
  Joy, the baby shark Baby Shark (the traditional campfire chant) — and
  photos in the gift box get Happy Birthday
- Storybook cartoon art with outlines, blinking eyes, wagging tails,
  spinning bus wheels, pond ripples, and a happy dance at the reveal
- Confetti + a pop-and-chime celebration when time is up (mute toggle on
  both the setup and running screens)
- Parent-friendly: preset buttons (1/2/5/10/15 min) or custom minutes/seconds
- Toddler-proof: while running, the only control is a 2-second hold-to-stop
- Keeps the phone screen awake during a countdown, and stays accurate even
  if the phone is locked mid-timer

Uploaded photos are stored on-device (IndexedDB); settings like mute and the
chosen character persist across visits (localStorage).

### 🚽 Potty Time

A potty-training cheer button:

- A friendly cartoon potty waits with you while an upbeat jingle loops
- Tap the big **I went potty!** button and the party erupts: confetti,
  a big "Yeaaah!", the potty does a happy flush (swirling water), and a
  synthesized cheer + toilet-flush sound play
- Mute toggle and screen-wake-lock, same as the timer

## Development

```sh
npm install
npm run dev        # local dev server
npm run dev -- --host   # test from a phone on the same network
npm run build      # type-check + production build
npm run preview    # serve the production build
```

## Adding a new activity

Create a folder under `src/activities/<name>/` with a component that accepts
`{ onExit: () => void }`, then register it in `src/activities/registry.ts`.
It will show up as a tile on the home screen automatically.
