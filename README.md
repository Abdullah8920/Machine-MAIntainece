# Machine Maintenance App (Next.js)

Mobile-first Next.js (App Router) app for logging machine repairs per client and viewing service history.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the layout is capped at 480px and centered, so it reads like a phone screen on desktop too.

## Flow

`/` (Get Started) → `/home` → `/add-machine` (saves) → `/client/[id]` (current status + full history)
`/home` → `/search` → results → `/client/[id]`

## Data — Firestore

This app is wired to **Firebase Firestore**. To connect your project:

1. Create a project at https://console.firebase.google.com
2. Build → Firestore Database → Create database → Start in test mode → pick a region.
3. Project Settings → Your apps → click the web icon (`</>`) → register an app → copy the `firebaseConfig` object it gives you.
4. Paste that object into `src/firebase/firebase.js`, replacing the `YOUR_...` placeholders.
5. `npm install` (firebase is already in package.json) → `npm run dev`.

That's it — `addMachineEntry`, `searchClients`, `getClientById`, and `getClientHistory` in `src/services/machineService.js` all read/write to a `clients` collection in Firestore.

**Note on images:** photos are stored as base64 directly on the document for simplicity. Firestore caps a document at ~1MB, so a few photos are fine, but for a real deployment switch to Firebase Storage (upload the file, save the download URL instead of the base64 string).

**Note on security rules:** test mode allows open read/write for 30 days. Before going live, lock down Firestore rules (e.g. require auth) in the Firebase console.

## Structure

```
src/
├── app/
│   ├── page.js                Get Started (/)
│   ├── home/page.js           Home
│   ├── add-machine/page.js    Add Machine Detail form
│   ├── search/page.js         Search Client
│   ├── client/[id]/page.js    Client Detail Sheet
│   ├── not-found.js           404
│   ├── layout.js              Root layout (mobile shell)
│   └── globals.css            Design tokens + base styles
├── components/    Button, Input, Card, MachineCard, HistoryTable, Header, EmptyState, StatusBadge
├── firebase/       firebase.js (config placeholder)
└── services/       machineService.js (data layer)
```
## LIVE LINK
...
https://machine-ma-intainece.vercel.app/
