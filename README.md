# Green Corner Marketing

Apple-calm portfolio site for Green Corner Marketing (Edmonton, AB).

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- shadcn/ui
- Resend (contact form)
- Geist font

## Develop

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Contact form works in development without Resend — submissions are logged to the server console.

Run the project checks before shipping:

```bash
npm test
npm run lint
npm run build
```

## Configure

Copy `.env.example` → `.env.local` and fill:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Send contact emails |
| `CONTACT_TO_EMAIL` | Inbox for inquiries |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO |

## Contact-form protection

The contact endpoint validates request size and shape, rejects cross-origin browser posts,
uses a honeypot field, and throttles each application instance. For distributed rate limits
or managed bot challenges across serverless instances, add an external provider such as
Cloudflare Turnstile before a high-traffic launch.

## Edit content

Brand, nav, and hero: `src/lib/site.ts`.  
Clients, work, reviews, services: `content/tijo-site.json` (optional gist overlay via `CONTENT_GIST_URL`).

## Design

See `../design/DESIGN.md` for the approved v2 direction.
