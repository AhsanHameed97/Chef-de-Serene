# Chef de Serene — Web Platform & Client Portal

Marketing site, 60-second inquiry engine, client ordering portal, and concierge admin for Chef de Serene. The build follows the *Master Figma Wireframe & Visual Specification* (Obsidian Editorial Luxury).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 + PostgreSQL · Resend (email) · React Hook Form + Zod · Motion

---

## What's included

| Area | Routes | Notes |
| --- | --- | --- |
| Marketing site | `/`, `/private-dining`, `/meal-prep`, `/current-menu`, `/philosophy` | Sticky glass nav, serif wordmark + CdS crest footer. `/current-menu` reads live dishes from the database, with filter pills. |
| Inquiry engine | Homepage section `#inquiry`, plus an overlay from any "Confidential Inquiry" button | 2-fork wizard (Weekly Meal Prep vs. Private Estate Dining) → `POST /api/inquiry` → saved to DB and emailed to Dwayne. Optional Twilio SMS. |
| Client portal | `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/orders`, `/portal/account` | Passcode **or** email magic link. Weekly quota bar, dish cards with +/−, sticky confirm drawer, a note to the chef, and order history. |
| Concierge admin | `/portal/admin` (+ `/orders`, `/clients`, `/menu`, `/inquiries`) | Kitchen prep totals per delivery date, order status, client approvals and quotas, menu management, inquiry inbox. |
| APIs | `POST /api/inquiry`, `POST /api/portal/orders`, `GET /api/menu`, `POST /api/webhooks/resend` | `GET /api/menu` returns JSON for the future mobile app. |

### How the portal works
- **Signup** creates a household in `PENDING` status and emails Dwayne. An admin activates it under *Admin → Clients*, and the client is emailed automatically. To let new signups order straight away, set `AUTO_APPROVE_SIGNUPS=true`.
- **Delivery window:** the next Monday or Thursday (the client's delivery day) that is at least 3 days away, in Los Angeles time. For example, Monday delivery closes the Friday before.
- **Ordering:** a client must select exactly their weekly quota (10 or 14 by default). The server checks the quota again (`Quota Exceeded` → 400). Each week can be confirmed once, and confirming locks it. Dwayne and the client both receive an HTML email.
- **Security:** `proxy.ts` blocks every `/portal/*` route without a valid signed session cookie, and admin pages re-check the user's role in the database. Magic links are single-use and expire after 20 minutes. They are confirmed with a click, so email link scanners can't use them up.

---

## Local development

```bash
npm install                       # also runs `prisma generate`
cp .env.example .env              # then fill in DATABASE_URL and AUTH_SECRET
npx prisma migrate deploy         # create tables
npm run db:seed                   # 12 dishes + admin + demo client
npm run dev                       # http://localhost:3000
```

No Postgres installed? Run `npx prisma dev` for a local Prisma Postgres, and paste the `postgres://…` TCP URL it prints into `DATABASE_URL`.

Without `RESEND_API_KEY`, every email (magic links, alerts, confirmations) is printed to the terminal. The login page also shows a "development shortcut" link for magic-link sign-in.

**Seeded accounts (change them before going live):**

| Role | Email | Passcode |
| --- | --- | --- |
| Admin | `admin@chefdeserene.net` | `serene-admin-2026` |
| Demo client (14 meals, Monday) | `client@chefdeserene.net` | `serene-client-2026` |

---

## Deploying to Vercel

1. **Create a Postgres database.** Neon (Vercel → Storage → Neon), Supabase, or Prisma Postgres all work.
2. **Import the GitHub repo in Vercel.** The framework preset is detected automatically. Vercel runs `npm run vercel-build`, which is `prisma generate && prisma migrate deploy && next build`, so the tables are created and updated on every deploy.
3. **Add these environment variables** (Project → Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Pooled connection string |
   | `DIRECT_URL` | *(optional)* Direct connection string, used for migrations when `DATABASE_URL` is pooled |
   | `AUTH_SECRET` | `openssl rand -base64 48` |
   | `APP_URL` | `https://your-domain.com` (no trailing slash) |
   | `RESEND_API_KEY` | From resend.com, with your sending domain verified |
   | `EMAIL_FROM` | e.g. `Chef de Serene <concierge@chefdeserene.net>` |
   | `NOTIFY_EMAIL` | `Dwayne@chefdeserene.net` |

4. **Deploy.** Then seed the production database once from your machine:

   ```bash
   DATABASE_URL="<production url>" SEED_ADMIN_EMAIL="dwayne@chefdeserene.net" \
   SEED_ADMIN_PASSWORD="<strong passcode>" SEED_DEMO=false npm run db:seed
   ```

---

## Day-to-day admin

- **Menu:** *Admin → Menu* lets you add, edit, hide, or archive dishes. Active dishes appear on `/current-menu` and in every client's weekly selection.
- **Real photography:** put the client's photos in `public/assets/menu/` (for example `salmon-crudo.jpg`), commit them, and enter `/assets/menu/salmon-crudo.jpg` as the dish photo. The current dish images are Unsplash placeholders.
- **Add an existing client directly:** use *Admin → Clients → Add Client* (it can email them a sign-in link), or run
  `npm run client:create -- --email jane@office.com --name "Jane Doe" --quota 14`.
- **Raw data access:** `npm run db:studio`.

## Project map

```
app/(site)/          marketing pages (homepage ported from legacy-static/)
app/portal/(auth)/   login, signup, magic-link verify
app/portal/(app)/    client dashboard, orders, account, admin/*
app/api/             inquiry, portal orders, menu JSON, Resend webhook
components/          site/, portal/, admin/, home/
lib/                 auth + sessions, validation (zod), email templates, delivery calendar
prisma/              schema, migrations, seed
proxy.ts             portal route protection
legacy-static/       the original static homepage (reference only; not served)
```
