# Forsch

SEO-friendly Next.js marketing website for Forsch, based on the provided JSX homepage reference.

## Run locally

```bash
npm install
npm run dev
```

## Admin CMS

This project now includes a lightweight file-backed CMS at `/admin`.

Create a `.env.local` file with:

```bash
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

Content is stored in:

```bash
data/content-library.json
```
