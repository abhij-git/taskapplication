# 🛡️ E-Commerce Fraud Monitoring Dashboard

This repository contains a complete, runnable demo for monitoring e‑commerce transactions **in real time**, assigning an **AI/heuristic fraud risk score**, storing history in MongoDB, and visualizing everything in a React dashboard.

### What this project includes

- **Mock transaction generator** (backend) producing a live stream
- **WebSocket stream** to the browser via **Socket.io**
- **AI-based anomaly scoring** via **OpenAI** (optional) + **heuristic fallback**
- **MongoDB persistence** for history + trend aggregation
- **JWT authentication** + role checks for REST and WebSockets
- **React dashboard**: live table, risk chart, high‑risk alerts
- **Docker Compose**: one command to run **MongoDB + API + frontend**

### Tech stack

- **Frontend**: React (Vite), Redux Toolkit, Socket.io client, Chart.js
- **Backend**: Node.js, Express.js, Socket.io, Mongoose
- **Database**: MongoDB (local Docker by default; MongoDB Atlas supported)
- **Auth**: JWT (roles: `admin`, `analyst`)
- **AI**: OpenAI Chat Completions API (optional)
- **Infra**: Docker + Docker Compose

### Repository layout

- `api/` — Express API + Socket.io namespace `/transactions`
- `frontend/` — React dashboard UI
- `docker-compose.yml` — runs `mongo`, `api`, `frontend`
- `.env` — root environment file (used by Docker Compose)

---

## Quick start (Docker) — recommended

You have two options:

### Option A — Local MongoDB (no Atlas needed)

This starts a local MongoDB container + the API + the frontend:

```bash
docker compose --profile local up --build
```

### Option B — MongoDB Atlas

1) Put your Atlas connection string in root `.env` as `MONGODB_URI="mongodb+srv://..."`  
2) Run:

```bash
docker compose up --build
```

Open:

- **Dashboard**: `http://localhost:5173`
- **API health**: `http://localhost:4000/health`

Login (demo users):

- **Admin**: `admin@example.com` / `Admin123!`
- **Analyst**: `analyst@example.com` / `Analyst123!`

Stop everything:

```bash
docker compose down
```

---
## Configuration (Environment Variables)

Docker Compose reads the **root** `.env`. Defaults are provided in `docker-compose.yml`.

### Required (recommended)

- **`JWT_SECRET`**: secret used to sign JWTs (change from the default for real usage)

### Database

- **Local (default for Docker)**: MongoDB runs in the `mongo` container
  - Default: `mongodb://mongo:27017/ecommerce_fraud_dashboard`
- **MongoDBAtlas**: set `MONGODB_URI` to your Atlas connection string

### AI scoring (OpenAI)

- set `OPENAI_API_KEY` to enable OpenAI scoring
- If `OPENAI_API_KEY` is empty, the backend uses a heuristic scorer (project still works)

### Useful tuning

- `OPENAI_MODEL` (default `gpt-4o-mini`)
- `MOCK_TX_INTERVAL_MS` (default `3000`)
- `HIGH_RISK_THRESHOLD` (default `75`)
- `FRONTEND_ORIGIN` (default `http://localhost:5173`)
- `PORT` (default `4000`)

---

## How it works (data flow)

1) **Backend generates a mock transaction** every `MOCK_TX_INTERVAL_MS`  
2) It computes:
   - `riskScore` \(0–100\)
   - `riskReason`
   - `isHighRisk` (risk ≥ `HIGH_RISK_THRESHOLD`)
3) It **stores** the transaction + score in **MongoDB**  
4) It emits Socket.io events on namespace **`/transactions`**:
   - **`transaction`**: every transaction
   - **`highRisk`**: only high‑risk transactions
5) The frontend connects via Socket.io using **JWT auth** and updates:
   - live table
   - alerts panel
   - chart (from REST trend aggregation)

---

## API & WebSocket security (JWT + roles)

### REST

REST endpoints require `Authorization: Bearer <token>` (except health).

### WebSockets (Socket.io)

The browser connects to `/transactions` with:

- `auth: { token: "<jwt>" }`

Connections without a valid token are rejected.

---

## Endpoints (summary)

### Auth

- `POST /auth/login` — returns `{ token, user }`

### Transactions (JWT required; roles: admin/analyst)

- `GET /transactions?limit=100` — recent transactions
- `GET /transactions/risk-trend?sinceMinutes=60` — aggregation buckets for the chart

### Health

- `GET /health` — `{ status: "ok" }`

---

## Run locally (without Docker)

This is optional. Docker is the easiest path.

### 1) Start MongoDB locally

Either run MongoDB locally, or start only MongoDB with Docker:

```bash
docker compose up -d mongo
```

### 2) Run the backend

```bash
cd api
npm install
npm run dev
```

### 3) Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Troubleshooting

- **Login fails**
  - Check API health: `http://localhost:4000/health`
  - Rebuild/restart: `docker compose down && docker compose up --build`
- **No live transactions**
  - Wait ~3–6 seconds (default interval is 3s)
  - View API logs: `docker compose logs -f api`
- **Port already in use**
  - Stop old containers: `docker compose down`

---

## Demo video checklist

- Run: `docker compose up --build`
- Open: `http://localhost:5173`
- Login as admin
- Show:
  - live table updating
  - high‑risk alerts appearing
  - risk trend chart changing over time

