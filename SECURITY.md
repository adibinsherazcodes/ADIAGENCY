# Security

## Reporting a vulnerability

If you believe you have found a security issue related to this website or its deployment, please email **adi.binsheraz@gmail.com** with a clear description and steps to reproduce. Do not open a public issue for undisclosed vulnerabilities.

## What we configure

- **HTTP headers** (where the host supports them): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy` (see `vercel.json`, `public/_headers`, and `vite.config.ts`).
- **External links** that open in a new tab should use `rel="noopener noreferrer"` where applicable.

## Your responsibilities when hosting

- Serve the site over **HTTPS** only.
- Keep **Node.js** and **npm dependencies** updated; run `npm audit` regularly.
- Review **Content-Security-Policy** for your environment if you add new third-party scripts or domains.

## Dependency audit

```bash
npm audit
```

Address high-severity issues before production releases when practical.
