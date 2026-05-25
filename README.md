# MOOOON

The marketing site for [moooon.net](https://moooon.net) — three products: **Doooo App**, **Doooo Hub**, and **Prodect**.

## Stack

- [Astro](https://astro.build) 6 + [Tailwind CSS](https://tailwindcss.com) v4
- Deployed to [Vercel](https://vercel.com) (custom domain `moooon.net`)
- One serverless function (`/api/notify`) for email signups
- Everything else is statically prerendered

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → dist/ + .vercel/output/
npx astro check  # type-check
```

## Project layout

```
src/
├── pages/
│   ├── index.astro          # the single-page site
│   └── api/notify.ts        # email signup endpoint (Resend-compatible)
├── components/
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── HowWeWork.astro          # meta-narrative + loop diagram
│   ├── ProductCard.astro
│   ├── DoooooGlyph.astro        # inline Doooo SVG mark
│   ├── TeamWorkflowDiagram.astro    # inside the Doooo Hub card
│   ├── ProdectWorkflowDiagram.astro # inside the Prodect card
│   ├── NotifyForm.astro
│   └── Footer.astro
├── layouts/Layout.astro
└── styles/global.css        # Tailwind v4 @theme tokens
```

## Email signup

`POST /api/notify` accepts `{ email, product }` where `product ∈ { doooo-app | doooo-hub | prodect }`. When `RESEND_API_KEY` and `RESEND_AUDIENCE_*` env vars are set, signups are forwarded to Resend audiences. Without those vars, the endpoint returns 200 and logs the submission — useful for local dev.

## Deploy

This repo is private + owned by an organization, which Vercel's Hobby plan doesn't auto-deploy. Deploys are manual:

```sh
vercel deploy            # preview URL
vercel deploy --prod     # promote to moooon.net
```

The CLI is already linked (`.vercel/project.json` points at `zhuyue11s-projects/moooon`). First-time setup on a new machine: `npm i -g vercel`, then `vercel link --project moooon`.

If we upgrade to Pro later — or make the repo public — `vercel git connect git@github.com:moooon-B-V/moooon.git` will switch on push-to-deploy.
