# Machine Maintenance App (Next.js + Express + MongoDB)

Mobile-first Next.js (App Router) app for logging machine repairs per client and viewing service history.

## Run it

### 1. Backend (Express + MongoDB)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Make sure MongoDB is running locally, or set `MONGO_URI` in `backend/.env` to your MongoDB Atlas connection string.

### 2. Frontend (Next.js)

In a separate terminal:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 — the layout is capped at 480px and centered, so it reads like a phone screen on desktop too.

## Flow

`/` (Get Started) → `/home` → `/add-machine` (saves) → `/client/[id]` (current status + full history)
`/home` → `/search` → results → `/client/[id]`

## Data — MongoDB via Express API

The frontend talks to an Express REST API backed by MongoDB. All data access goes through `src/services/machineService.js`, which calls the backend at `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000/api`).

**Note on images:** photos are stored as base64 directly on the machine document for simplicity.

## Structure

```
backend/
├── config/db.js
├── controllers/clientController.js
├── middleware/
├── models/Client.js, Machine.js
├── routes/clientRoutes.js
├── services/clientService.js
├── server.js
└── package.json

src/
├── app/              Pages (App Router)
├── components/       UI components
└── services/       api.js, machineService.js (data layer)
```
