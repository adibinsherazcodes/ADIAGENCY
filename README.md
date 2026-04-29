# ADI Agency — Official Website

Premium marketing site for **ADI Agency**: landing experience, service highlights, pricing, and contact paths (email, phone, WhatsApp, Instagram).

## Owner

**ADI BIN SHERAZ** — see [OWNERSHIP.md](OWNERSHIP.md) for ownership and contact details.

## License

Proprietary. All rights reserved. See [LICENSE](LICENSE).

## Tech stack

- [React](https://react.dev/) 19  
- [Vite](https://vitejs.dev/) 6  
- [TypeScript](https://www.typescriptlang.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [React Router](https://reactrouter.com/)  

## Prerequisites

- **Node.js** 18+ (20+ recommended)  
- **npm**  

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Preview production build locally |

## Project structure

```
├── public/          # Static assets (favicon, host-specific headers)
├── src/
│   ├── App.tsx      # Routes, pages, sections
│   ├── main.tsx     # Entry
│   └── assets/      # Bundled images where used
├── index.html
├── vite.config.ts
├── vercel.json      # Security headers on Vercel
└── public/_headers  # Security headers on Netlify
```

## Deployment

Build output is in **`dist/`**. Deploy that folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

- **Vercel:** `vercel.json` applies security headers.  
- **Netlify:** `public/_headers` is copied into `dist/_headers` on build.  

Always enable **HTTPS** in production.

## Security

See [SECURITY.md](SECURITY.md) for reporting issues and hardening notes.

## Brand assets

Logo file: `Logo.jpg` (project root), referenced from `src/App.tsx`. Replace only with permission from the owner.

---

© 2026 ADI BIN SHERAZ / ADI Agency. See [LICENSE](LICENSE).
