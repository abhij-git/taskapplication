## E‑commerce Fraud Monitoring Dashboard (Frontend)

This is the React + Vite frontend for a real‑time e‑commerce transaction monitoring dashboard.  
It connects to a secured Node.js/Express API and WebSocket stream to display live transactions, AI‑based fraud risk scores, and high‑risk alerts.

### Features

- **JWT authentication**: Login as an admin or analyst to access the dashboard.
- **Live transactions table**: Real‑time updates via WebSockets (Socket.io client).
- **Risk trend chart**: Chart.js visualization of average risk over time.
- **High‑risk alerts**: Highlight and surface suspicious transactions above a risk threshold.

### Prerequisites

- **Node.js** (v18+ recommended)
- The backend API from this project running locally (default: `http://localhost:4000`)

### Environment Variables

Create a `.env` file in the `frontend` folder if you want to override defaults:

- **`VITE_API_BASE_URL`** – Base URL of the API (default: `http://localhost:4000`)
- **`VITE_WS_URL`** – WebSocket URL for transactions namespace (default: `ws://localhost:4000/transactions`)

Example:

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000/transactions
```

### Getting Started (Development)

```bash
# from project root
cd frontend
npm install
npm run dev
```

Then open the URL printed in the terminal (by default `http://localhost:5173`).

Make sure the backend API is running (usually from the `api` folder with `npm run dev`).

### Login Credentials (Demo)

For local development, the backend exposes two demo users:

- **Admin**: `admin@example.com` / `Admin123!`
- **Analyst**: `analyst@example.com` / `Analyst123!`

Use these credentials on the login screen to access the dashboard.

### Available NPM Scripts

- **`npm run dev`** – Start Vite dev server with hot reload.
- **`npm run build`** – Create a production build.
- **`npm run preview`** – Preview the built app locally.

### Tech Stack

- **React** (Vite)
- **Redux Toolkit + React Redux**
- **Socket.io Client** for live data
- **Chart.js + react-chartjs-2** for charts



