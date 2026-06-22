# Soro Falibeta — Portfolio

Personal portfolio website built with React, TypeScript, and Tailwind CSS. Features bilingual support (EN/FR), dark/light mode, animated stats, GitHub contribution graph, and a project showcase.

## Live Demo

[donsfak.github.io/Portofolio](https://donsfak.github.io/Portofolio) *(deploy to activate)*

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Build | Vite 5 |
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
├── App.tsx                  # Main page layout & all sections
├── index.css                # Global styles & utility classes
├── i18n.ts                  # i18next setup
├── main.tsx                 # React entry point
└── components/
    ├── DigitalClock.tsx     # Live clock in the navbar
    ├── GithubStats.tsx      # GitHub calendar + stats cards
    └── ProjectModal.tsx     # Screenshot gallery modal
public/
├── assets/                  # Images, PDF resume
└── locales/
    ├── en/translation.json  # English strings
    └── fr/translation.json  # French strings
```

## Adding a Project

In `src/App.tsx`, add an entry to the `projects` array:

```ts
{
  title: "My Project",
  description: "Short description...",
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

- **Colors** — edit CSS variables in `src/index.css` under `:root`
- **Translations** — edit `public/locales/en/translation.json` and `fr/translation.json`
- **Skills** — update the `skillCategories` array in `App.tsx`
- **Resume** — replace `public/assets/data analyste junior.pdf`

## License

MIT © 2025 Soro Falibeta
