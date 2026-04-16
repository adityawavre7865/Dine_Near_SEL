# 🍽️ DineNear – Discover Today's Food Around You

A full-stack web application for discovering nearby restaurants and browsing menus.

**Stack:** React + Vite + Tailwind CSS · Node.js + Express · MongoDB

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure environment:**
```bash
# Edit backend/.env
MONGO_URI=mongodb://localhost:27017/dinenear   # or your Atlas URI
JWT_SECRET=dinenear_super_secret_jwt_key_2024
PORT=5000
```

**Seed the database:**
```bash
npm run seed
```

**Start the server:**
```bash
npm run dev      # development (with nodemon)
# or
npm start        # production
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@dinenear.com | Admin@123 |
| Owner | owner1@dinenear.com | Owner@123 |
| Owner | owner2@dinenear.com | Owner@123 |
| User  | user@dinenear.com | User@123 |

> These are also shown on the Login page for convenience.

---

## 🗂️ Project Structure

```
DineNear_SEL/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Business logic
│   ├── middleware/             # JWT auth + role check
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── seeders/seed.js         # Sample data seeder
│   └── server.js               # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/axios.js        # Axios + JWT interceptor
    │   ├── components/         # Reusable UI components
    │   ├── context/            # Auth + Theme contexts
    │   └── pages/              # All page components
    └── index.html
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/hotels | No | List approved hotels |
| GET | /api/hotels/:id | No | Hotel details |
| POST | /api/hotels | Owner | Create hotel |
| PUT | /api/hotels/:id | Owner | Update hotel |
| DELETE | /api/hotels/:id | Owner | Delete hotel |
| GET | /api/menu/:hotelId | No | Menu for hotel |
| GET | /api/menu/search | No | Search menu items |
| POST | /api/menu/:hotelId | Owner | Add menu item |
| PUT | /api/menu/item/:id | Owner | Update item |
| PATCH | /api/menu/item/:id/availability | Owner | Toggle availability |
| DELETE | /api/menu/item/:id | Owner | Delete item |
| GET | /api/users/preferences | User | Get favorites |
| POST | /api/users/preferences/hotel/:id | User | Toggle fav hotel |
| POST | /api/users/preferences/item/:id | User | Toggle fav item |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |
| PATCH | /api/admin/users/:id/toggle | Admin | Activate/deactivate |
| GET | /api/admin/hotels | Admin | All hotels |
| PATCH | /api/admin/hotels/:id/status | Admin | Approve/reject |

---

## 🎨 Features

- **Home:** Animated hero carousel, hotel grid, search & filter
- **Login/Signup:** Split layout, role selection (User/Owner), demo credentials
- **User Dashboard:** Stats, favorite hotels & dishes, preferences
- **Owner Dashboard:** Hotel management, menu CRUD, availability toggle
- **Admin Panel:** Stats overview, user table with activate/deactivate, hotel approval workflow
- **Hotel Detail:** Full menu grouped by category, live search
- **Dark Mode:** System-preference aware, persisted in localStorage
- **Responsive:** Desktop-first, fully works on mobile

---

## ☁️ MongoDB Atlas (Optional)

1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string
3. Replace `MONGO_URI` in `backend/.env`

---

## 🚢 Deployment

| Service | Command |
|---------|---------|
| Frontend → Vercel | `npm run build` → deploy `dist/` |
| Backend → Render | Set env vars + `npm start` |
| DB → MongoDB Atlas | Update `MONGO_URI` |
