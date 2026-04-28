# FlowDesk - Production Task Management SaaS

A full-stack productivity platform with real-time analytics, task management, and project tracking. Built with Node.js, Express, MongoDB, React, and Tailwind CSS.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, express-validator, helmet, express-rate-limit  
**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Query, Recharts, React Router v6  
**Database:** MongoDB Atlas  
**Deployment:** Vercel (frontend) + Render (backend)

---

## Folder Structure

```
flowdesk/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Register, login, getMe
│   │   │   ├── task.controller.js     # Full task CRUD
│   │   │   ├── project.controller.js  # Project CRUD + tasks
│   │   │   ├── analytics.controller.js# Dashboard data
│   │   │   └── user.controller.js     # Profile, password
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT protect guard
│   │   │   └── validate.middleware.js # express-validator handler
│   │   ├── models/
│   │   │   ├── User.js                # User schema + bcrypt
│   │   │   ├── Task.js                # Task schema
│   │   │   └── Project.js             # Project schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/
│   │   │   ├── jwt.js                 # Token helpers
│   │   │   └── seed.js                # Demo data seeder
│   │   └── server.js                  # Express app entry
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── ActivityChart.jsx  # Weekly bar chart
    │   │   │   ├── PriorityDonut.jsx  # Priority pie chart
    │   │   │   ├── ProjectCard.jsx    # Project card w/ progress
    │   │   │   ├── ProjectModal.jsx   # Create/edit project
    │   │   │   ├── StatCard.jsx       # Animated stat widget
    │   │   │   ├── TaskCard.jsx       # Task row w/ actions
    │   │   │   ├── TaskModal.jsx      # Create/edit task
    │   │   │   └── UpcomingTasks.jsx  # Due-soon list
    │   │   ├── layout/
    │   │   │   ├── AppLayout.jsx      # Shell: sidebar + topbar
    │   │   │   ├── Sidebar.jsx        # Nav + user info
    │   │   │   └── TopBar.jsx         # Header + mobile menu
    │   │   └── ui/
    │   │       └── LoadingScreen.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx        # Auth state + JWT storage
    │   ├── pages/
    │   │   ├── DashboardPage.jsx      # Analytics overview
    │   │   ├── TasksPage.jsx          # Task list + filters
    │   │   ├── ProjectsPage.jsx       # Project grid
    │   │   ├── SettingsPage.jsx       # Profile + password
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── styles/
    │   │   └── globals.css
    │   ├── utils/
    │   │   ├── api.js                 # Axios + interceptors
    │   │   └── helpers.js             # Date, priority, status helpers
    │   ├── App.jsx                    # Routes + guards
    │   └── main.jsx                   # React entry + providers
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vercel.json
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## API Routes

### Auth - `/api/auth`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login, returns JWT |
| GET | `/me` | Yes | Get current user |

### Tasks - `/api/tasks`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Yes | List tasks (filter: status, priority, project, search) |
| POST | `/` | Yes | Create task |
| GET | `/:id` | Yes | Get single task |
| PUT | `/:id` | Yes | Update task |
| DELETE | `/:id` | Yes | Delete task |

### Projects - `/api/projects`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Yes | List projects |
| POST | `/` | Yes | Create project |
| PUT | `/:id` | Yes | Update project |
| DELETE | `/:id` | Yes | Delete project |
| GET | `/:id/tasks` | Yes | Get project's tasks |

### Analytics - `/api/analytics`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/overview` | Yes | Dashboard stats |
| GET | `/weekly` | Yes | 7-day activity chart data |
| GET | `/by-status` | Yes | Task count by status |
| GET | `/by-priority` | Yes | Open tasks by priority |
| GET | `/recent` | Yes | Recently completed tasks |
| GET | `/upcoming` | Yes | Tasks due in next 7 days |

### Users - `/api/users`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| PUT | `/profile` | Yes | Update name/preferences |
| PUT | `/password` | Yes | Change password |

---

## Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/arpannarula/flowdesk.git
cd flowdesk
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm run dev
```

### 3. Seed demo data (optional)
```bash
npm run seed
# Demo login: demo@flowdesk.app / demo1234
```

### 4. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

---

## Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/flowdesk
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

### Backend - Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and click **New > Web Service**.
3. Connect your GitHub repo and select the `backend/` folder as root directory (set **Root Directory** to `backend`).
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add all environment variables from `.env.example` under **Environment > Add Environment Variable**:
   - `MONGODB_URI` - your MongoDB Atlas connection string
   - `JWT_SECRET` - a long random string
   - `JWT_EXPIRES_IN` - `7d`
   - `CLIENT_URL` - your Vercel frontend URL (add after deploying frontend)
   - `NODE_ENV` - `production`
6. Deploy. Render gives you a public URL like `https://flowdesk-api.onrender.com`.

### Frontend - Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repo.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://flowdesk-api.onrender.com/api`
5. Click **Deploy**.
6. Vercel gives you a URL like `https://flowdesk.vercel.app`.
7. Go back to Render and update `CLIENT_URL` to this Vercel URL, then redeploy.

### MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free cluster.
2. Under **Database Access**, create a user with read/write permissions.
3. Under **Network Access**, allow `0.0.0.0/0` (all IPs, needed for Render).
4. Click **Connect > Drivers** and copy the connection string. Replace `<password>` with your DB user's password.
5. Paste as `MONGODB_URI` in Render.

---

## Features

- JWT authentication with bcrypt password hashing
- Protected routes (frontend + backend middleware)
- Task CRUD with status, priority, tags, due dates, subtasks, time tracking
- Project management with color coding and progress tracking
- Analytics dashboard: completion rate, weekly activity chart, priority breakdown, upcoming deadlines
- Fully responsive - mobile sidebar with overlay
- Framer Motion animations throughout
- React Query for efficient data fetching and cache invalidation
- Rate limiting, helmet security headers, input validation
- Demo seeder script for quick testing
