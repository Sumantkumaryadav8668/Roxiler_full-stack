# Roxiler Systems - Store Rating & Management Platform

A production-quality Full Stack Web Application built for the Roxiler Systems Full Stack Developer Coding Challenge.

Features complete Role-Based Access Control (RBAC) with ADMIN, USER, and STORE_OWNER roles, 5-star store rating submission & modification, MySQL relational database architecture, JWT authentication, automated integration test suite, and a modern responsive dashboard UI.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Environment Variables](#3-environment-variables)
4. [Server Installation & Local Setup](#4-server-installation--local-setup)
5. [Client Installation & Local Setup](#5-client-installation--local-setup)
6. [API Documentation](#6-api-documentation)
7. [Deployment Instructions (Vercel & Render)](#7-deployment-instructions-vercel--render)

---

## 1. Project Overview
The Roxiler Systems Store Rating & Management Platform allows normal users to discover registered stores, search by Name or Physical Address, submit 1 to 5 star ratings, and edit their submitted ratings. Store owners log in to view their store's overall average rating and inspect customer feedback. Administrators have full access to view real-time platform statistics, manage users, add new stores, and assign store ownership.

---

## 2. Folder Structure

```
roxiler-fullstack/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── vercel.json
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── validators/
│   ├── utils/
│   ├── scripts/
│   ├── .env
│   ├── .env.example
│   ├── render.yaml
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
├── AUDIT_REPORT.md
├── README.md
└── .gitignore
```

---

## 3. Environment Variables

### Client (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server (`server/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=roxiler_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=roxiler_secret_jwt_key_2026_super_secure
CLIENT_URL=http://localhost:5173
```

---

## 4. Server Installation & Local Setup

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

### Seed Database:
```bash
npm run seed
```

### Run Server:
```bash
npm run dev
```

### Run Integration Tests:
```bash
npm test
```

---

## 5. Client Installation & Local Setup

Navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

### Start Development Server:
```bash
npm run dev
```
The React client starts at `http://localhost:5173`.

---

## 6. API Documentation

### Authentication APIs:
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `POST /api/auth/logout` - Log out session
- `PUT /api/auth/change-password` - Change user password

### Admin APIs (`Authorization: Bearer <ADMIN_TOKEN>`):
- `GET /api/admin/dashboard` - Fetch dashboard metrics
- `POST /api/admin/users` - Create user (ADMIN, USER, STORE_OWNER)
- `POST /api/admin/stores` - Create store and assign owner (`owner_id`)
- `GET /api/admin/users` - Filter and sort users
- `GET /api/admin/stores` - Filter and sort stores

### Store & Rating APIs:
- `GET /api/stores` - List stores with overall rating and user submitted rating
- `POST /api/ratings` - Submit store rating (1-5)
- `PUT /api/ratings/:id` - Modify rating
- `GET /api/stores/owner/dashboard` - Store Owner dashboard metrics

---

## 7. Deployment Instructions (Vercel & Render)

### Deploying Frontend (`client`) to Vercel:

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `client`.
5. Set Build & Output Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable in Vercel settings:
   - `VITE_API_BASE_URL`: `https://your-render-backend.onrender.com/api`
7. Click **Deploy**. Vercel will use `client/vercel.json` for SPA routing.

### Deploying Backend (`server`) to Render:

1. Log into [Render](https://render.com) and click **New Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `server`.
4. Configure service settings:
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables in Render:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DB_HOST`: Your MySQL Database Host (e.g. Aiven MySQL / PlanetScale / Railway MySQL)
   - `DB_PORT`: `3306`
   - `DB_NAME`: `roxiler_db`
   - `DB_USER`: Your DB username
   - `DB_PASSWORD`: Your DB password
   - `JWT_SECRET`: `your_secure_jwt_secret_key`
   - `CLIENT_URL`: `https://your-vercel-frontend.vercel.app`
6. Click **Create Web Service**.
