# Toddler Time

A growing collection of toddler-friendly activities. Built with React + Vite,
runs entirely in the browser — no backend, no accounts.

Designed for a two-year-old who loves trash trucks, diggers, dozers, and
airplanes. Big tap targets, slow animations, no fail states, and a real
recorded voice instead of a computer one.

## Activities

### Trucks
A quiet yard. Tap a vehicle and watch it work: the trash truck backs up to
the dumpster, the digger scoops, the dozer pushes, the dump truck tips, the
airplane takes off, the school bus rolls.

### Match
Six big cards. Find two the same. No timer, no buzzers.

### Find
Hide-and-seek behind three hills, then a calm “where’s the airplane?” scene.
Big targets. Wrong taps do almost nothing.

### Book
One vehicle per page, a short line in a real voice, tap to turn.

### Timer
A Hatch-style visual countdown: a big ring drains while a character hides,
then pops out with confetti when time is up. Hold-to-stop so little fingers
can’t cancel it.

### Peekaboo
Four doors. Tap one — a friend peeks out.

### Phone
A toy phone. Dial pad bells, then call a truck. They pick up and say hi.

### Colors, Bubbles, Music
Tap a color (it says the name), pop bubbles, play xylophone bars.

### Potty Time
A potty-training cheer button. Tap **I went potty!** for confetti and a flush.

## Parent notes

- Mute toggle on every screen
- Hold ~2 seconds to leave a play activity
- Settings (mute, last timer, chosen character) persist on-device
- Uploaded photos for the timer live in IndexedDB
- Screen stays awake during the timer

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
`{ onExit: () => void }`, then register it in `src/activities/registry.tsx`.
It will show up as a tile on the home screen automatically.
