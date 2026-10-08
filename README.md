# Soro Falibeta — Portfolio

Personal portfolio website built with React, TypeScript, and Tailwind CSS. Features bilingual support (EN/FR), dark/light mode, animated stats, GitHub contribution graph, and a project showcase.

## Live Demo

[soro-falibeta-portofolio.vercel.app](https://soro-falibeta-portofolio.vercel.app) — deployed on Vercel

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Build | Vite 8 (Node ≥ 20.19, see `.nvmrc`) |
| i18n | i18next (EN / FR) |
| Animations | Framer Motion (modal), CSS animations |
| Icons | Lucide React |
| GitHub stats | react-github-calendar |

## Features

- **Dark / Light mode** — persisted in localStorage
- **Bilingual (EN / FR)** — full translation via i18next
- **Animated counters** — stats section counts up on scroll into view
- **Active nav highlighting** — IntersectionObserver tracks current section
- **Project gallery** — filterable cards with screenshot modal
- **GitHub activity** — live contribution calendar + follower stats
- **Contact form** — with inline success state
- **Scroll-to-top button** — appears after scrolling 400px
- **Responsive** — mobile menu, adaptive layouts

## Getting Started

```bash
# Node 20.19+ required (nvm users: `nvm use`)
nvm use

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                  # Global state (theme, scroll, routing) + page layout
├── index.css                # Global styles & utility classes
├── i18n.ts                  # i18next setup (translations bundled)
├── main.tsx                 # React entry point
├── data/
│   └── portfolio.ts         # All content: projects, experience, skills, contact (FR + EN)
├── sections/                # One component per page section
│   ├── Navbar.tsx  Hero.tsx  Stats.tsx  About.tsx  Experience.tsx
│   └── Projects.tsx  Skills.tsx  Services.tsx  Contact.tsx  Footer.tsx
├── components/
│   ├── CaseStudyDataTour.tsx # Data Tour 2026 case study page
│   ├── Certifications.tsx   # Certificates grid
│   ├── DigitalClock.tsx     # Live clock in the navbar
│   ├── GithubStats.tsx      # GitHub calendar + stats cards
│   └── ProjectModal.tsx     # Screenshot gallery modal
├── lib/                     # useLocalized hook, skill icon helper
└── locales/
    ├── en/translation.json  # English UI strings
    └── fr/translation.json  # French UI strings
public/
└── assets/                  # Images, PDF resume, certificates
```

## Adding a Project

In `src/data/portfolio.ts`, add an entry to the `PROJECTS` array (experiences go in `EXPERIENCES`):

```ts
{
  title: { fr: "Mon projet", en: "My Project" },
  description: { fr: "Description courte...", en: "Short description..." },
  image: "assets/my-project.png",
  screenshots: ["assets/my-project.png"],
  technologies: ["React", "TypeScript"],
  category: "web", // "web" | "mobile" | "dataScience"
  github: "https://github.com/donsfak/my-project",
  demo: "details",
}
```

Drop the image into `public/assets/` and it will appear in the Projects section.

## Customisation

- **Colors & styles** — edit `src/index.css` (Tailwind v4: no `tailwind.config.js`, configuration lives in CSS)
- **Translations** — edit `src/locales/en/translation.json` and `fr/translation.json`
- **Skills** — update the `SKILL_CATEGORIES` array in `src/data/portfolio.ts` (the stats row counts them automatically)
- **Resume** — replace `public/assets/CV_Falibeta_Soro.pdf`

## License

MIT © 2025 Soro Falibeta

## Resilience tests

`tests/resilience.mjs` runs 26 browser scenarios against the production build: third-party
APIs down, GitHub rate-limit, slow 3G, corrupted localStorage, XSS payloads in the form and
URL hash, interaction stress + memory, mobile overflow and basic accessibility.

```bash
npx playwright-core install chromium   # once
npm run build && npm run preview -- --port 4173
npm run test:resilience                # in another terminal
```
