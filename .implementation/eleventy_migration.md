# Eleventy Migration — Implementation Plan

Migrate the portfolio from hand-written HTML (with duplicated header/sidebar) to **Eleventy (11ty)** so that shared UI lives in one place and new pages/repos can be added by editing a single data file.

## How It Works (High-Level)

```
src/                         ← You edit files HERE
├── _data/site.json          ← Personal info (name, links, summaries)
├── _includes/
│   ├── base.njk             ← Full HTML shell (head, body, fonts, scripts)
│   ├── header.njk           ← Hero + social links
│   ├── topbar.njk           ← Repo-selector bar
│   └── footer.njk           ← Footer
├── css/style.css            ← Your existing CSS (unchanged)
├── js/app.js                ← Your existing JS  (unchanged)
├── js/repo-viewer.js        ← Existing repo-viewer logic
├── assets/
│   ├── pdf_viewer/          ← CV PDF
│   └── repo_academico/      ← Academic PDFs
├── index.njk                ← Landing page
├── repo_academico/index.njk ← Academic repo page
├── repo_codigo/index.njk    ← Code repo page
└── repo-viewer.html         ← Standalone (passthrough)

_site/                       ← 11ty generates this (deployed to GitHub Pages)
```

> [!NOTE]
> You never touch `_site/`. Eleventy builds it from `src/` automatically.
> To add a new project, you edit `src/_data/site.json` and add one button in the relevant `.njk` page — the header, sidebar, footer, CSS, and JS stay untouched.

---

## Proposed Changes

### 1. Project Init

#### [NEW] [package.json](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/package.json)
- `npm init -y`, then `npm install --save-dev @11ty/eleventy`
- Scripts: `"dev": "npx @11ty/eleventy --serve"`, `"build": "npx @11ty/eleventy"`

#### [NEW] [.eleventy.js](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/.eleventy.js)
- Input dir: `src`, Output dir: `_site`
- Passthrough copy for [css/](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/style.css), [js/](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/app.js), `assets/`, [repo-viewer.html](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/repo-viewer.html)
- Template formats: `njk, html, md`

#### [NEW] [.gitignore](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/.gitignore)
- `node_modules/`, `_site/`

---

### 2. Shared Data

#### [NEW] [src/_data/site.json](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/src/_data/site.json)
All personal info in one place — pages reference `{{ site.name }}`, `{{ site.links }}`, etc.

```json
{
  "name": "Ian Gross Sánchez",
  "titles": [
    "Egresado de Ingeniería Mecánica",
    "Mayor en Ingeniería Física",
    "Minor en Matemática Aplicada"
  ],
  "lead": "Portafolio de proyectos en simulación computacional, modelado matemático y desarrollo de software.",
  "links": {
    "cv": "assets/pdf_viewer/CV_Ian_Gross_Sánchez.pdf",
    "github": "https://github.com/iangrosssan",
    "linkedin": "https://www.linkedin.com/in/ian-gross-sanchez",
    "youtube": "https://www.youtube.com/@iangrosan",
    "instagram": "https://www.instagram.com/iangrosan"
  }
}
```

---

### 3. Shared Includes (the `from ui import sidebar`)

#### [NEW] src/_includes/base.njk
Full HTML skeleton: `<!doctype>`, `<head>` with fonts/CSS, `<body>`, footer script tags. Every page just extends this.

#### [NEW] src/_includes/header.njk
Hero section with name, titles, lead text, social links — all reading from `site.json`.

#### [NEW] src/_includes/topbar.njk
The repo-selector bar. Receives `activeRepo` variable from the page to highlight the current tab.

#### [NEW] src/_includes/footer.njk
Footer with copyright and last-update span.

---

### 4. Page Templates

#### [NEW] src/index.njk
Landing page. Extends `base.njk`, includes `header.njk`, renders two large call-to-action links.

#### [NEW] src/repo_academico/index.njk
Academic repo page. Extends `base.njk`, includes `header.njk`, `topbar.njk` (with `activeRepo: "academico"`), sidebar with PDF project buttons, and the iframe viewer.

#### [NEW] src/repo_codigo/index.njk
Code repo page. Same pattern, `activeRepo: "codigo"`, sidebar with code project buttons, iframe pointing to [repo-viewer.html](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/repo-viewer.html).

---

### 5. Static Assets (Passthrough)

These files are copied as-is to `_site/` with no processing:

| Source | Output |
|---|---|
| `src/css/style.css` | `_site/css/style.css` |
| `src/js/app.js` | `_site/js/app.js` |
| `src/assets/pdf_viewer/` | `_site/assets/pdf_viewer/` |
| `src/assets/repo_academico/` | `_site/assets/repo_academico/` |
| `src/repo-viewer.html` | `_site/repo-viewer.html` |

> [!IMPORTANT]
> The PDFs move from `repo_academico/*.pdf` to `src/assets/repo_academico/*.pdf`. The [app.js](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/app.js) references will be updated to point to `/assets/repo_academico/filename.pdf` (absolute paths, since all pages now load CSS/JS from the site root).

---

### 6. CSS/JS Path Changes

Currently each sub-page uses relative paths (`../style.css`, `../app.js`). With 11ty we switch to **root-relative paths** (`/css/style.css`, `/js/app.js`) inside the base layout — this means every page, regardless of depth, references the same paths. No more `../` calculations.

#### [MODIFY] app.js
- PDF paths change to `/assets/repo_academico/filename.pdf`  
- Repo-viewer iframe src changes to `/repo-viewer.html#...`
- No structural logic changes

#### style.css
- **No changes**. Copied as-is.

---

### 7. GitHub Actions Deploy

#### [NEW] [.github/workflows/deploy.yml](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/.github/workflows/deploy.yml)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: _site }
      - uses: actions/deploy-pages@v4
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
```

> [!WARNING]
> After the first push, you need to go to **repo Settings → Pages → Source** and select **"GitHub Actions"** instead of "Deploy from branch".

---

## User Review Required

> [!IMPORTANT]
> 1. The old files ([index.html](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/index.html), [repo_academico/index.html](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/repo_academico/index.html), [repo_codigo/index.html](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/repo_codigo/index.html), [app.js](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/app.js), [style.css](file:///home/iangrosan/Desktop/Proyectos/git/Portafolio/style.css)) all move into `src/`. The root of the repo will only contain config files (`package.json`, `.eleventy.js`, `.gitignore`). Is this restructure OK?
> 2. The deploy switches from "push raw HTML" to "GitHub Action builds then deploys". This adds ~30s to deploy time but is the standard approach. OK?
> 3. Future external webapp repos (e.g. `simulacion_cubesat`) remain completely separate repos with their own GitHub Pages — they'll just link back to the main site. No changes needed here, just confirming you understand the pattern.

## Verification Plan

### Local Testing
1. `npm run dev` — starts 11ty dev server at `localhost:8080`
2. Navigate to `/`, `/repo_academico/`, `/repo_codigo/`
3. Verify PDF viewing works, repo-viewer iframe loads READMEs
4. Verify hash-based project selection (`/repo_academico/#Montaje_PLD`)
5. Verify responsive layout on narrow viewport

### Deployment Testing
1. Push to GitHub, verify Action runs successfully
2. Visit `iangrosssan.github.io`, verify all pages load correctly
