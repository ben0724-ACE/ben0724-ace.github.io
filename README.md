# Qi Haoran Personal Homepage

Personal website for showcasing education, research, engineering projects, internships, and awards.

Live site: `https://ben0724-ace.github.io/`

## Overview

This repository contains a single-page personal homepage built for GitHub Pages. The site focuses on:

- clear project storytelling
- responsive layouts across desktop, tablet, and mobile
- subtle motion with reduced-motion support
- bilingual content switching
- lightweight static deployment

## Current Highlights

- Hero section with layered background, metric cards, and dual CTA
- Desktop quick navigation plus sticky mobile/tablet section chips
- Expandable sections for education, research, projects, internships, and awards
- Theme toggle and language toggle
- Lazy-loaded non-critical media to protect first-screen performance
- GSAP-based intro and reveal animations tuned for smoother performance

## Tech Stack

- `HTML5`
- `CSS3`
- `JavaScript`
- `GSAP`
- `Feather Icons`
- `GitHub Pages`

## Project Structure

```text
.
|-- index.html
|-- README.md
|-- GIT_GUIDE.md
|-- CV.pdf
|-- 简历.pdf
`-- assets
    |-- css
    |   `-- style.css
    |-- js
    |   `-- main.js
    `-- img
```

## Local Development

1. Clone the repository.
2. Open the project with a static server such as Live Server.
3. Preview the page in a browser.

Example:

```powershell
git clone https://github.com/ben0724-ACE/ben0724-ace.github.io.git
cd ben0724-ace.github.io
```

## Editing Notes

- Main content and structure live in `index.html`
- Visual system and responsive behavior live in `assets/css/style.css`
- Interaction logic and motion live in `assets/js/main.js`
- Chinese and English CV links are controlled by the `data-cv-en` and `data-cv-zh` attributes

## Performance Notes

- First-screen assets use higher fetch priority where needed
- Heavy GIF media is deferred until near viewport
- Motion is reduced automatically when the system prefers reduced motion
- Background slider pauses when the page is hidden

## Recent Updates

### 2026 responsive and motion polish

- Added hero metric cards for faster self-introduction
- Added sticky mobile section navigation
- Reworked motion to be more subtle and device-aware
- Removed heavy pointer-driven effects from the main experience
- Improved media loading strategy for large images and GIFs
- Added semantic controls and stronger keyboard focus states

## Deployment

The site is deployed from the `main` branch to GitHub Pages through the repository:

`https://github.com/ben0724-ACE/ben0724-ace.github.io`

## Git Workflow Help

See [GIT_GUIDE.md](./GIT_GUIDE.md) for a practical maintenance guide, including:

- daily commit and push flow
- adding the resume PDF
- checking history
- reverting or rewriting history safely

## Contact

- Email: `haoran.qi0724@gmail.com`
- GitHub: `https://github.com/ben0724-ACE`
