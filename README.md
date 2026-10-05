# Scroll-Driven Hero Section

A hero section where a car drives forward as you scroll. Built with **Next.js 16 (React 19)**, **Tailwind CSS** and **GSAP (ScrollTrigger)**.

## Run it

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build a static site

```bash
npm run build      # output goes to the /out folder
```

## Host on GitHub Pages

1. Create a GitHub repo and push this project to the `main` branch.
2. In the repo go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Push again (or run the workflow manually). The site goes live at
   `https://<your-username>.github.io/<repo-name>/`.

The workflow in `.github/workflows/deploy.yml` sets the base path for you.

## How it works

- **Intro (page load):** one GSAP timeline. Car rises in, headline letters reveal with a stagger, then the four stats appear one by one.
- **Scroll:** a second timeline is tied to the scrollbar with `scrub: 1` (about 1 second of smoothing). The hero is pinned for 300% of the screen height while the car moves, sways and scales, and the road lines rush past.
- **Performance:** only `transform` and `opacity` are animated. Nothing reads layout on scroll. GSAP batches updates in one animation frame.
- **Accessibility:** if the user prefers reduced motion, the animations are skipped and the content shows right away.

## Files

```
app/layout.jsx        page shell and metadata
app/page.jsx          hero + a short section below it
app/globals.css       Tailwind setup
components/Hero.jsx   all markup and animation logic
public/car.svg        the car illustration (top view)
```

## Windows / OneDrive tips

- Keep the project **outside OneDrive** (for example `C:\projects\scroll-hero`). OneDrive locks files inside `node_modules` and causes `EPERM` errors.
- Do **not** run `npm audit fix --force`. This project already has 0 known vulnerabilities.
- If an install ever breaks, delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.
