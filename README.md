# Toddler Time

A growing collection of toddler-friendly activities. Built with React + Vite,
runs entirely in the browser — no backend, no accounts.

## Activities

### ⏰ Timer

A Hatch-style visual countdown for little ones who can't read clocks yet:

- A big ring drains and shifts green → red as time runs out
- A friendly animal (bunny, bear, frog, fox, or duck) — or a photo you
  upload — sits in the middle and gets more excited as the end nears
- Confetti + a cheerful chime when time is up (mute toggle included)
- Parent-friendly: preset buttons (1/2/5/10/15 min) or custom minutes/seconds
- Toddler-proof: while running, the only control is a 2-second hold-to-stop
- Keeps the phone screen awake during a countdown, and stays accurate even
  if the phone is locked mid-timer

Uploaded photos are stored on-device (IndexedDB); settings like mute and the
chosen character persist across visits (localStorage).

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
