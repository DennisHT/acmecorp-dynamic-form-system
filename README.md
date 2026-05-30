# AcmeCorp Dynamic Form System

A full-stack demo that renders country-specific address forms. The frontend
shows different fields depending on the selected country (USA, Australia,
Indonesia), supports Google Maps address autocomplete, and saves submissions to
a SQLite-backed Express API that validates against the same per-country schema.

> **Note on branches:** This was a 2-hour exercise. The `master` branch holds
> the original first-2-hour submission; this **`after-2-hours`** branch is the
> continued work, where the form became fully schema-driven — the frontend now
> renders directly from the server schema instead of hardcoded per-country
> components. See [Design Decisions & Tradeoffs](#design-decisions--tradeoffs).

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
| `npm run lint`       | Run ESLint                                       |

## API Endpoints

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| `GET`  | `/api/countries`       | List supported countries             |
| `GET`  | `/api/countries/:code` | Get the field schema for one country |
| `POST` | `/api/addresses`       | Validate and save an address         |
| `GET`  | `/api/addresses`       | List saved addresses                 |

## Project Structure

```
server/                Express API + SQLite
  index.ts             API routes
  db.ts                Database setup
  countries.ts         Per-country field schemas (single source of truth)
src/
  App.tsx              Main form, country switching, schema-driven rendering
  component/           Inputs, Select, AddressAutocomplete
    FormContent/       Legacy static field sets (unused; superseded by schema rendering)
  utils/               Google autocomplete helpers
```

## Design Decisions & Tradeoffs

This was a 2-hour exercise, so choices favored a working end-to-end slice over
completeness. The guiding decision was to make **one schema the single source of
truth** and grow everything else around it.

**One schema as the source of truth (`server/countries.ts`).** Each country's
fields, options, and validation patterns live in a single server object. The API
exposes it (`/api/countries`, `/api/countries/:code`); the frontend renders its
inputs directly from that schema, and the backend validates submissions against
the _same_ definition.

- _Why:_ Adding or changing a country is a one-file edit, the field definitions
  exist in exactly one place, and client rendering can never drift from server
  validation.
- _Tradeoff:_ The UI is coupled to the schema's shape, and the form can't render
  until the schema request resolves. (The first-pass `master` branch instead
  hardcoded static per-country components — this branch removed that
  duplication.)

**Schema served over HTTP rather than a shared import.** The client fetches the
country list and field schema at runtime.

- _Why:_ The backend can add countries without a frontend rebuild.
- _Tradeoff:_ Every country switch costs a round trip; no instant/offline
  render. For three known countries a shared bundled module would be simpler —
  the HTTP approach is a bet on the schema being managed independently later.

**Addresses stored as a JSON blob (`fields TEXT`).** Submissions persist as a
JSON string keyed by country.

- _Why:_ Storage adapts to any country schema with zero migrations.
- _Tradeoff:_ Individual fields aren't queryable or constrained at the DB
  level — fine for capture, not for reporting.

**SQLite via better-sqlite3.** Zero-config, file-based, synchronous.

- _Why:_ No external dependency to run the demo.
- _Tradeoff:_ Single-writer; not for concurrent production load.

**Validation runs on the server** (required fields, regex patterns, and
rejection of unknown fields) rather than trusting the client.

- _Why:_ The API must stay safe against direct or malformed requests.
- _Tradeoff:_ Some redundancy once the client also validates.

**Deferred due to the time box:** surfacing validation errors back into the form
UI (currently only logged), client-side pattern validation, tests, and removing
the now-unused static `FormUSA/AUS/IDN` components left over from the `master`
version.
