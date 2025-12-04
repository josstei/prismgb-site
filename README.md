# PrismGB Site

<p align="center">
  <img src="public/logo.png" alt="PrismGB Logo" width="400">
</p>

<p align="center">
  <strong>The official website for PrismGB — a desktop companion app for the Mod Retro Chromatic</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/built%20with-Astro%205-ff5d01" alt="Built with Astro">
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#development">Development</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

---

> **DISCLAIMER**
>
> This is an **unofficial**, community-developed project.
>
> PrismGB is not affiliated with, endorsed by, or sponsored by [Mod Retro](https://modretro.com).
> The Chromatic is a product of Mod Retro.
>
> For official Chromatic support and information, please visit [modretro.com](https://modretro.com).

---

## About

This repository contains the website for PrismGB, a desktop streaming and capture application for the [Mod Retro Chromatic](https://modretro.com) handheld gaming device.

The site features an interactive demo that gives visitors a preview of the app experience.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v22 LTS or higher
- npm (included with Node.js)

### Commands

```bash
# Install dependencies
npm install

# Start dev server at localhost:4321
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Stack

| Technology | Purpose |
|------------|---------|
| [Astro 5](https://astro.build) | Static site generator |
| Vanilla JS/TS | Interactivity and animations |
| Custom CSS | Styling with CSS custom properties |

## Project Structure

```
src/
├── components/
│   ├── common/       # Shared UI primitives (Section, Card, Badge, Icon)
│   └── sections/     # Page sections (DemoGameboy, DemoAppWindow, DemoCable)
├── content/
│   └── site.json     # Site copy and content
├── scripts/
│   ├── demo-canvas.js    # Pixel scene renderer with cached static layers
│   └── demo-animator.js  # Shared RAF loop with visibility handling
├── styles/           # Global styles and utilities
└── pages/            # Astro pages
public/               # Icons, images, and app logo
```

### Interactive Demo

- A single shared animator drives both canvases and pauses automatically on `prefers-reduced-motion` and `visibilitychange`
- Static layers (sky/ground/grass) are cached per canvas size; each frame only draws moving elements
- Initial frames are rendered once so reduced-motion users still see the scene

## Deployment

Update `astro.config.mjs` with your production URL and optional base path for static hosting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>
    <strong>This is an unofficial community project.</strong><br>
    The Chromatic and Mod Retro are trademarks of Mod Retro LLC.<br>
    PrismGB is not affiliated with or endorsed by Mod Retro.
  </sub>
</p>
