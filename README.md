# Forsch

SEO-friendly Next.js marketing website for Forsch, based on the provided JSX homepage reference.

## Production domain

The canonical website origin is `https://forsch.ai`, configured in `lib/site-config.js`.
Use this origin for web links and weekly content packs; absolute content URLs are
validated against `forsch.ai` and `www.forsch.ai`. The contact inbox remains
`hello@forsch.io`.

Cloudflare Workers Builds deploys Worker `forsch-next-site` from `main`. Domains are
managed in Cloudflare, with no routes declared in `wrangler.jsonc`. Keep the existing
`forsch.io`, `forsch.ai`, and `www.forsch.ai` Worker attachments. The old zone's redirect
rule sends `forsch.io` and `www.forsch.io` traffic to `https://forsch.ai` while preserving
paths. Changing the canonical origin requires no runtime
environment variable renames or changes to the host-only admin session cookie.

## Run locally

```bash
npm install
npm run dev
```

## Admin CMS

This project now includes a lightweight file-backed CMS at `/admin`.

Create a `.env.local` file with:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=change-this-session-secret
```

Then open:

```bash
http://localhost:3000/admin/login
```

The CMS manages:
- use cases
- blog posts
- articles

Local seed content is stored in:

```bash
data/content-library.json
```

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in:

```bash
supabase/schema.sql
```

3. Add your credentials to `.env.local`.
4. Seed the existing content into Supabase:

```bash
npm run seed:supabase
```

Once Supabase is configured, the site and admin portal will read/write content from the database instead of the local JSON file.
