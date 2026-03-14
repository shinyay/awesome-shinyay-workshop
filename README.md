# Shinyay Workshop Hub

> **A curated catalog of 60+ workshops, tutorials & hands-on labs — organized, searchable, and beautifully presented.**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://shinyay.github.io/awesome-shinyay-workshop/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://gist.githubusercontent.com/shinyay/56e54ee4c0e22db8211e05e70a63247e/raw/f3ac65a05ed8c8ea70b653875ccac0c6dbc10ba1/LICENSE)

A GitHub Pages site that catalogs and showcases workshop repositories by [@shinyay](https://github.com/shinyay). Built with GitHub's Primer CSS design system for an authentic GitHub-branded experience.

---

## 🌐 Live Site

**👉 [https://shinyay.github.io/awesome-shinyay-workshop/](https://shinyay.github.io/awesome-shinyay-workshop/)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🔍 Real-time Search** | Filter workshops by name, technology, or topic as you type |
| **📂 Category Filters** | 7 categories: Copilot & AI, Legacy Modernization, GitHub Platform, AI & ML, Cloud, Spring/Java, DevOps |
| **🌓 Dark/Light Mode** | Theme toggle with system preference detection and localStorage persistence |
| **📊 Tech Breakdown** | Visual bar chart showing language distribution across workshops |
| **📱 Responsive Design** | 3-column (desktop) → 2-column (tablet) → 1-column (mobile) |
| **⚡ Zero Dependencies** | Vanilla HTML/CSS/JS + Primer CSS from CDN — no build step required |
| **🚀 Auto-deploy** | GitHub Actions workflow deploys on every push to `main` |

---

## 🏗️ Project Structure

```
awesome-shinyay-workshop/
├── index.html                      # Single-page application
├── css/
│   └── style.css                   # GitHub-branded styles (dark/light mode)
├── js/
│   └── app.js                      # Search, filter, sort, theme toggle
├── data/
│   └── workshops.json              # Workshop catalog (60+ entries)
├── assets/
│   └── favicon.svg                 # Custom favicon
├── .github/
│   └── workflows/
│       └── deploy-pages.yml        # GitHub Pages deployment
├── .nojekyll                       # Bypass Jekyll processing
└── README.md
```

---

## 📖 Adding a Workshop

To add a new workshop, edit `data/workshops.json` and append an entry:

```json
{
  "name": "my-new-workshop",
  "full_name": "shinyay/my-new-workshop",
  "description": "A short description of the workshop.",
  "html_url": "https://github.com/shinyay/my-new-workshop",
  "language": "Python",
  "stargazers_count": 0,
  "forks_count": 0,
  "updated_at": "2026-03-14",
  "category": "copilot-ai",
  "topics": ["copilot", "python"]
}
```

**Available categories:** `copilot-ai`, `legacy-modernization`, `github-platform`, `ai-ml`, `cloud-infra`, `spring-java`, `devops-containers`

Push to `main` and the site auto-deploys via GitHub Actions.

---

## 🛠️ Local Development

No build tools needed — just open `index.html` in a browser:

```bash
git clone https://github.com/shinyay/awesome-shinyay-workshop.git
cd awesome-shinyay-workshop

# Option 1: Python HTTP server
python3 -m http.server 8000

# Option 2: Node.js
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) to view the site.

---

## 🎨 Tech Stack

- **[Primer CSS](https://primer.style/)** v22.1.0 — GitHub's official design system
- **Vanilla JavaScript** — Zero runtime dependencies
- **GitHub Actions** — Automatic deployment to GitHub Pages
- **GitHub Brand Colors** — Green (#0FBF3E), Purple (#8534F3), official grays

---

## 🤝 Contributing

Found a bug? Have an idea? [Open an issue](https://github.com/shinyay/awesome-shinyay-workshop/issues/new) — contributions and suggestions are welcome.

---

## Licence

Released under the [MIT license](https://gist.githubusercontent.com/shinyay/56e54ee4c0e22db8211e05e70a63247e/raw/f3ac65a05ed8c8ea70b653875ccac0c6dbc10ba1/LICENSE)

## Author

- github: <https://github.com/shinyay>
- bluesky: <https://bsky.app/profile/yanashin.bsky.social>
- twitter: <https://twitter.com/yanashin18618>
- mastodon: <https://mastodon.social/@yanashin>
- linkedin: <https://www.linkedin.com/in/yanashin/>
