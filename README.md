## E‑commerce Fraud Monitoring Dashboard

This project is a full‑stack demo for monitoring e‑commerce transactions in real time and flagging suspicious activity using AI‑based anomaly detection.

### Tech Stack

- **Frontend**: React + Vite, Redux Toolkit, Socket.io client, Chart.js
- **Backend**: Node.js, Express, Socket.io, MongoDB (Atlas), JWT auth
- **AI**: OpenAI Chat Completions API (with heuristic fallback when no key)
- **Infra**: Docker + Docker Compose

### Project Structure

- `api/` – Node.js/Express API with Socket.io streaming and MongoDB persistence
- `frontend/` – React SPA dashboard (login, live table, chart, alerts)
- `docker-compose.yml` – Orchestrates API + frontend for local demo

### Environment Configuration

Create a `.env` file in the **project root** based on `.env.example`:

- `MONGODB_URI` – MongoDB Atlas connection string (**required**)
- `JWT_SECRET` – Secret used to sign JWTs
- `JWT_EXPIRES_IN` – Token lifetime (for example, `8h`)
- `OPENAI_API_KEY` – Optional; when unset, a rule‑based heuristic is used
- `OPENAI_MODEL` – OpenAI model name (`gpt-4o-mini` by default)
- `MOCK_TX_INTERVAL_MS` – Interval (ms) for generating mock transactions
- `HIGH_RISK_THRESHOLD` – Risk score (0–100) above which alerts trigger

See `frontend/README.md` for frontend‑specific details and npm commands.

