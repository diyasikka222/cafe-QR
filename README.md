# Cafe — Full-stack Menu & Ordering App

## Project overview

This repository contains a simple full-stack café application: a React + Vite frontend in the `client/` folder and a Node + Express backend in the `server/` folder. The app provides menu management, order placement, and image uploads stored under `uploads/`.

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (via Mongoose)

## Repository structure

- `client/` — frontend application (Vite + React)
- `server/` — backend API (Express)
  - `config/` — database and other configuration helpers
  - `controllers/` — route handlers
  - `models/` — Mongoose schemas (e.g., `MenuItem`, `Order`)
  - `routes/` — Express routes (menu, orders)
  - `middleware/` — middleware such as file upload handling
  - `uploads/` — uploaded images (should be gitignored)

## Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A running MongoDB instance (local or Atlas)

## Environment variables

Create a `.env` file in the `server/` folder with at least the following variables:

```
MONGO_URI=mongodb://localhost:27017/cafe
PORT=5000
```

Adjust values for your environment or use a hosted MongoDB connection string.

## Setup & install

Root-level commands to install dependencies for both client and server:

```bash
# from project root
cd server
npm install

cd ../client
npm install
```

## Running the app (development)

Run the backend and frontend in separate terminals.

Backend (server):

```bash
cd server
# if a dev script exists
npm run dev
# or
npm start
```

Frontend (client):

```bash
cd client
npm run dev
```

Open the frontend URL printed by Vite (typically `http://localhost:5173`) and ensure the backend `PORT` matches the API base URL used by the client.

## Building for production

Build the frontend and start a production server for the backend.

```bash
# build frontend
cd client
npm run build

# prepare backend
cd ../server
npm install --production
npm start
```

How you serve the frontend build in production depends on your deployment target (static host, CDN, or proxy through the backend). For simple setups, serve the contents of `client/dist` using any static host.

## Database

This project uses MongoDB via Mongoose. Ensure `MONGO_URI` points to a valid MongoDB database. The models are in `server/models/` (for example `MenuItem` uses a Mongoose schema).

## API (common endpoints)

The backend exposes routes under `/api` (or directly) — check `server/routes/` for exact paths. Typical endpoints include:

- `GET /api/menu` — list menu items
- `POST /api/menu` — create menu item (admin)
- `PUT /api/menu/:id` — update menu item
- `DELETE /api/menu/:id` — delete menu item
- `POST /api/orders` — create order
