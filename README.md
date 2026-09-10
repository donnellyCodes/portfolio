# Portfolio OS — Linux Mint Edition

A personal portfolio styled as a Linux Mint (Cinnamon) desktop: draggable
windows, a bottom panel with a Start menu, desktop icons, and a working
mini terminal. Falls back to a simple home-screen layout on mobile.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

This outputs static files to `dist/`, which you can deploy anywhere that
serves static sites (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Making it yours

Almost everything lives in `src/App.jsx`. At the top of the file:

- **`PROFILE`** — your name, title, bio, location, email
- **`PROJECTS`** — an array of your projects (name, file extension shown in
  the UI, description, tags)
- **`SKILLS`** — a flat list of skills shown in About and Resume

Also worth editing:

- **Resume window** (`AppContent`, `app === "resume"`) — replace with your
  real experience, or link out to an actual PDF
- **Contact window** — update email/GitHub/LinkedIn links
- **Terminal commands** (`Terminal` component's `run` function) — add or
  change commands as you like
- **Favicon** — `public/favicon.svg`
- **Page title / meta description** — `index.html`

## Notes

- Icons are from [lucide-react](https://lucide.dev/)
- Font is [Ubuntu](https://fonts.google.com/specimen/Ubuntu) via Google Fonts,
  loaded in `src/index.css`
- Window dragging is implemented with plain mouse events (no external drag
  library), so there are no extra runtime dependencies beyond React and
  lucide-react
- On screens narrower than 720px, the desktop UI is replaced by
  `MobileHome`, a simplified tap-to-open home screen — dragging windows
  doesn't translate well to touch

## Deploying

**Vercel / Netlify:** connect the repo, build command `npm run build`,
output directory `dist`.

**GitHub Pages:** run `npm run build`, then push the contents of `dist/`
to a `gh-pages` branch (or use an action like
`peaceiris/actions-gh-pages`). You may need to set `base` in
`vite.config.js` to your repo name if deploying to a project page.
