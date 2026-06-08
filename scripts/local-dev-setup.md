# Local development (v2 copy)

This folder is a **separate copy** of the live trendkaari.com storefront. It is not wired to the production Vercel project or domain.

## Quick start

1. Copy `.env.example` → `.env`
2. Install: `npm install`
3. Run: `npm run dev`
4. Storefront: http://localhost:5173
5. Admin: http://localhost:5173/admin (default login from `.env`)

Product data is read/written to `server/data/store.json` on your machine. Admin saves work locally without any cloud credentials.

## When you deploy the new version

Create a **new** Vercel project (or other host), new domain, and new storage credentials. Do not reuse the live site's Blob, Redis, Turso, or GitHub repo settings.
