# AcmeCorp Dynamic Form System

A full-stack demo that renders country-specific address forms. The frontend
shows different fields depending on the selected country (USA, Australia,
Indonesia), supports Google Maps address autocomplete, and saves submissions to
a SQLite-backed Express API that validates against the same per-country schema.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Hook Form
- **Backend:** Express 5, better-sqlite3 (SQLite)
- **Autocomplete:** Google Maps JavaScript API

## Prerequisites

- Node.js 18+ and npm
- A Google Maps API key with the **Places** and **Maps JavaScript** APIs enabled

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root with your Google Maps API key:

   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Run the app (client + server together)**

   ```bash
   npm run dev
   ```

   This starts:
   - the Vite dev server (frontend) — http://localhost:5173
   - the Express API (backend) — http://localhost:3001

   The Vite dev server proxies `/api` requests to the backend, so just open the
   frontend URL in your browser.

   The SQLite database file (`addresses.db`) is created automatically on first
   server startup.

## Available Scripts

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Run frontend and backend together (recommended)  |
| `npm run dev:client` | Run only the Vite frontend                       |
| `npm run dev:server` | Run only the Express API (with watch/reload)     |
| `npm run build`      | Type-check and build the frontend for production |
| `npm run preview`    | Preview the production build locally             |
| `npm run lint`       | Run ESLint                                        |

## API Endpoints

| Method | Endpoint                | Description                                   |
| ------ | ----------------------- | --------------------------------------------- |
| `GET`  | `/api/countries`        | List supported countries                      |
| `GET`  | `/api/countries/:code`  | Get the field schema for one country          |
| `POST` | `/api/addresses`        | Validate and save an address                  |
| `GET`  | `/api/addresses`        | List saved addresses                          |

## Project Structure

```
server/                Express API + SQLite
  index.ts             API routes
  db.ts                Database setup
  countries.ts         Per-country field schemas (single source of truth)
src/
  App.tsx              Main form, country switching
  component/           Inputs, Select, AddressAutocomplete
    FormContent/       Country-specific field sets (USA / AUS / IDN)
  utils/               Google autocomplete helpers
```
