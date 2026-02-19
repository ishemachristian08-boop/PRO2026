# Development Guide - NYABIHU CHRISTIAN ACADEMY

## Prerequisites

Before starting, make sure you have installed:
1. **Node.js** (v14 or higher) - https://nodejs.org/
2. **MongoDB** (v4.4 or higher) - https://www.mongodb.com/try/download/community
3. **Git** (optional) - https://git-scm.com/

---

## Quick Start

### Step 1: Install Dependencies

**Backend:**
```bash
cd nca-website/backend
npm install
```

**Frontend:**
```bash
cd nca-website/frontend
npm install
```

### Step 2: Start MongoDB

**Windows (if MongoDB is installed as a service):**
```bash
net start MongoDB
```

**Windows (manually):**
```bash
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 3: Seed the Database

This creates test users with data:

```bash
cd nca-website/backend
node seeds/seed.js
```

**Test Accounts Created:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nca.rw | password123 |
| Teacher | teacher@nca.rw | password123 |
| Parent | parent@nca.rw | password123 |

### Step 4: Start the Backend Server

```bash
cd nca-website/backend
node server.js
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

### Step 5: Start the Frontend (in a new terminal)

```bash
cd nca-website/frontend
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 6: Open the Application

Go to: **http://localhost:3000/staff-portal**

---

## Project Structure

```
nca-website/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation
│   ├── seeds/              # Database seeding
│   └── server.js           # Entry point
│
├── frontend/               # Next.js application
│   ├── app/               # Pages & routes
│   ├── components/        # Reusable UI components
│   ├── lib/               # API client & auth
│   ├── public/            # Static assets
│   └── styles/            # Global CSS
│
└── public/                # Firebase hosting static files
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nca
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Common Issues

### "MongoDB connection refused"
- Make sure MongoDB is running: `net start MongoDB` (Windows)
- Or start it manually from the MongoDB bin directory

### "Cannot find module 'X'"
- Run `npm install` in the respective directory

### "Port 3000 already in use"
- Frontend: Change port in `frontend/package.json` or kill the process
- Backend: Change port in `.env` or `backend/server.js`

### "Network error" in browser
- Make sure both backend (port 5000) and frontend (port 3000) are running
- Check if any firewall is blocking the connections

---

## Setting Security Codes

1. Log in as admin (admin@nca.rw / password123)
2. Go to **Admin Dashboard** → **Settings** → **Security Codes**
3. Search for a user and click "Set Code"
4. Enter a 4-6 digit security code

---

## Building for Production

### Frontend:
```bash
cd nca-website/frontend
npm run build
npm start
```

### Backend:
```bash
cd nca-website/backend
npm run start
```

---

## Deployment

The project can be deployed to:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Render, Railway, Heroku, or VPS
- **Database**: MongoDB Atlas (cloud) or self-hosted

See `DEPLOYMENT.md` for detailed deployment instructions.
