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

Auto-deploys on push to `main` via Vercel's GitHub integration. Pushes to other branches get unique preview URLs.

Manual deploy from a local machine still works:

```sh
vercel deploy            # preview URL
vercel deploy --prod     # promote to moooon.net
```

### A note on commit authors (Hobby plan gotcha)

Vercel's Hobby plan requires the **commit author email to match a verified email on the Vercel account that owns the project**. Otherwise the deploy gets stuck in `BLOCKED` state — `vercel ls` shows it `UNKNOWN`, no error in the CLI output, only visible via the API (`vercel.app/docs/deployments/troubleshoot-project-collaboration`).

For this repo, that means `git config user.email` must be `info@moooon.net` (or another email verified on the moooon Vercel account). The global git config is already set; just don't override it locally to something else.
