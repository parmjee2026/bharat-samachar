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

Set ADMIN_EMAIL and ADMIN_PASSWORD before starting the server to enable login.

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

Advertisement edits use the editorial JSON store. On Render, configure EDITORIAL_DATA_FILE on a persistent disk to retain edits across deploys and restarts. When moving an existing deployment, copy the existing editorial JSON to the new location first.

Live Delhi Panchang and daily horoscope use Prokerala. Set PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET on Render. Daily horoscope is fetched per selected sign and cached for the Delhi calendar date. Confirm provider credit allowance before enabling.

Hindi daily Rashifal requires GOOGLE_TRANSLATION_API_KEY on Render. Enable Cloud Translation API (Basic v2) and use a key restricted to that API. Without a key or if translation fails, the daily card shows its Hindi unavailable message. The translated prediction is cached per sign and IST date.
