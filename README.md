# Bharat Samachar v3.1 Final Production Build

Hindi news portal with live Google News RSS, continuous breaking ticker, BBC-style responsive homepage, unique category images, full Panchang hub, daily/monthly/yearly Rashifal, Vrat-Festival lists, bookmarks, Contact page, policy pages and Editorial/Admin CMS.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production test

```bash
npm run build
npm start
```

Open `http://localhost:3001`.

## Admin

URL: `/#/admin`

Local default login:
- Email: `editor@bharatsamachar.in`
- Password: `Bharat@2026`

For Render, set environment variables:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PUBLIC_URL` (your final site URL)

## Render deployment

1. Push the project to GitHub.
2. In Render choose **New > Blueprint** and select the repository.
3. Render reads `render.yaml`, installs packages, builds the frontend and starts the Express server.
4. Add the environment variables above before public launch.

Persistent note: the current JSON datastore is suitable for a single-instance starter deployment. For multi-instance scaling, move editorial data to PostgreSQL or MongoDB.
