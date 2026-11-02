# NASH: GRID WARS

A local two-player strategy game combining Shikaku rectangle puzzles, territorial scoring, and quick-reaction SNAP challenges.

**Live game:** https://nash-grid-wars-aditya.roanbuddy4.chatgpt.site

The existing ChatGPT-hosted deployment is owner-private. Deploy your own copy below to choose its audience.

## Run locally

Requires Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Build and test

```sh
npm run build
node tests/engine.test.ts
```

The production build is generated in `dist/`. Tests cover puzzle solvability, captures, overlap rejection, scoring, SNAP, round completion, timeout, sudden death, rematches, and invalid-selection penalties.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faditya162006%2FNash-gridwars)

Use the button to deploy a copy to your Vercel account.

1. Import this GitHub repository into Vercel.
2. Select the Vite framework preset.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy. No environment variables or backend services are required.

`vercel.json` supplies the build and output settings. Vercel will provide an HTTPS URL and can redeploy when commits are pushed.

You can also deploy on Netlify using the same build command and output folder, or upload the contents of `dist/` to a static web host.

## How to play

- Two human players share one screen. Blue goes first; starting players alternate each round.
- Drag a rectangle containing exactly one numbered clue. Its area must match that clue, and it cannot overlap claimed cells or make the remaining puzzle impossible.
- Each captured cell earns one point; a valid capture passes the turn.
- An invalid selection costs **2 points**, captures nothing, and keeps the same player's turn. The timer does not reset; scores can become negative.
- Consecutive successful captures with equal areas trigger a **2-second SNAP window**. Shapes may differ.
- Blue presses **Q** and Red presses **P**, or either player taps their on-screen SNAP button.
- The first valid call earns **3 bonus points**. Calls outside the active window cost **2 points**, including a call after the other player already won it.
- First to win two rounds wins the match. Tied rounds continue on 4×4 sudden-death boards with scores carried forward.

The illustrated in-game rulebook includes matching and non-matching examples.

## Features

- Easy 6×6, medium 8×8, and hard 10×10 grids
- Solver-verified puzzle generation, preferring unique solutions
- SVG drag selection, capture effects, sound, and mobile touch controls
- Turn timers, score previews, round statistics, and rematches
- Settings and completed-match statistics stored locally on the device

## Stack

React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Zustand.

## Project layout

- `src/engine.ts`: board generation, solver, and move validation
- `src/store.ts`: game state, scoring, timers, and round progression
- `src/main.tsx`: interactive board and screens
- `src/Rules.tsx`: illustrated rulebook
- `src/style.css`: responsive arcade styling
- `tests/engine.test.ts`: engine and state regression tests

## Current scope

Local two-player multiplayer only. No bots, single-player mode, or online room synchronization is implemented. Reloading the page resets an in-progress match.
