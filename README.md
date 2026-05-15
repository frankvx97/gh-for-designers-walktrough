# gh-for-designers-walktrough

An interactive scrollytelling walkthrough that teaches Git and GitHub fundamentals to designers — built as a companion to Section 5 of the "Design Systems from Figma to Code" workshop. Dark, monospaced, retro-futuristic, with WebGL + halftone dither visuals and `motion`-driven scenes.

## Run locally

```sh
pnpm install
pnpm dev          # http://localhost:5173/
```

Production build:

```sh
pnpm build        # outputs to dist/
pnpm preview      # serves the built bundle locally
```

## Stack

- Vite 5 + React 18 + TypeScript
- `react-router-dom` v6 — per-chapter routes
- `motion` (Framer Motion) — scroll-triggered + staggered reveals
- Raw WebGL — Bayer-dither fragment shader for chapter dividers
- Canvas 2D — delicate ASCII-dot background on the landing page
- Pure SVG — the isometric Git ⇄ GitHub illustration with traveling push/pull arrows
- Vanilla CSS modules — no Tailwind, no CSS-in-JS

## Chapters

The journey walks through eight scenes built from the workshop's facilitator guide:

1. Git is not GitHub
2. The four states of a file
3. Ten commands you actually need
4. Branches — parallel universes
5. Pull requests — the design review of code
6. Commits that trigger releases
7. Habits that pay off
8. Ship the Button

## Deploy

Hosted on Netlify. `netlify.toml` defines the build command (`pnpm install --frozen-lockfile && pnpm build`), SPA redirect to `index.html`, and immutable cache headers for `/assets/*`. Connect the GitHub repo to a Netlify site — no further configuration needed.

## License

Workshop content and source material © design-systems team. The Git mark is by Jason Long (CC0); the GitHub Octocat is by GitHub Inc. (Octicons, MIT).
