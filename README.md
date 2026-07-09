# T Puzzle (puzzle_g1)

A browser-based version of the classic **T Puzzle** built with Next.js.

Arrange four polygons — one triangle, two trapezoids, and a notched pentagon — to form a symmetric capital **T**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to play

1. Drag pieces from the tray onto the faded T outline.
2. Click a piece to select it, then use **Rotate selected**, **Flip selected**, or double-click to rotate 90°.
3. When the pieces exactly fill the T shape, you win.

## Tech stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Live preview (GitHub Pages)

After the deploy workflow runs, the game is available at:

**https://garylam09632.github.io/puzzle_g1/**

Pushes to `main` trigger an automatic deploy. You can also run the **Deploy to GitHub Pages** workflow manually from the Actions tab.

> **One-time setup:** In the repo **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run build:pages` — production static export for GitHub Pages
- `npm run start` — run the production server
- `npm run lint` — run ESLint
