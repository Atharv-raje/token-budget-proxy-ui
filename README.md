# TokenBudgetProxy — Admin Dashboard

A small Next.js admin dashboard for
[TokenBudgetProxy](../token-budget-proxy): create per-user LLM API keys, set
USD budgets, toggle keys on/off, and watch spend update **live**.

It's a thin client of the FastAPI backend — the backend is unchanged. The admin
password never reaches the browser: it lives in the Next.js **server** env, a
login sets an httpOnly session cookie, and server-side route handlers proxy to
the backend (so there's no CORS and no exposed secret).


## Architecture



```
browser ──▶ Next.js (same-origin /api/*)  ──inject X-Admin-Password──▶  FastAPI backend
            │  · login → httpOnly cookie session (iron-session)
            │  · /api/keys route handlers = BFF proxy
            └─ dashboard: TanStack Query polls every 5s → live spend
```

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · TanStack
Query · iron-session

## Setup

```bash
npm install
cp .env.local.example .env.local     # fill in the values below
npm run dev                          # http://localhost:3000
```

`.env.local`:

| Var | Meaning |
|---|---|
| `BACKEND_URL` | Where the FastAPI backend runs (e.g. `http://localhost:8000`) |
| `ADMIN_PASSWORD` | **Must match** the backend's `ADMIN_PASSWORD` |
| `SESSION_SECRET` | ≥32-char secret used to encrypt the session cookie |

## Run the full stack

1. **Backend** (in `../token-budget-proxy`): set `GROQ_API_KEY` + `ADMIN_PASSWORD`
   in its `.env`, then `uvicorn app.main:app --reload` (port 8000).
2. **Frontend** (here): set `.env.local` with the same `ADMIN_PASSWORD` and
   `BACKEND_URL=http://localhost:8000`, then `npm run dev` (port 3000).
3. Open `http://localhost:3000`, log in, and create a key.

## Features

- **Login** — password-gated; httpOnly cookie session; `proxy.ts` redirects unauthenticated users to `/login`.
- **Summary cards** — key count, total spent, total budget, remaining.
- **Keys table** — per-key spend progress bar, remaining, RPM, an active toggle, and edit.
- **Create key** — reveals the plaintext key **once** with a copy button.
- **Edit key** — change budget, rate limit, or active state.
- **Live spend** — the table polls every 5s, so spend visibly ticks up as requests flow through the proxy.

## Pages & routes

| Route | Type | Purpose |
|---|---|---|
| `/login` | page | Password login |
| `/` | page | Protected dashboard |
| `/api/login`, `/api/logout` | route handler | Session management |
| `/api/keys` (GET/POST) | route handler | BFF proxy: list / create keys |
| `/api/keys/[id]` (PATCH) | route handler | BFF proxy: update a key |

## Notes

- `.env.local` is gitignored; only `.env.local.example` is committed.
- The dashboard reads spend from `GET /admin/keys` (no separate usage call needed).
