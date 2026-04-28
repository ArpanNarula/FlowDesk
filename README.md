# FlowDesk

FlowDesk is a full-stack task and project management app that I built to practice a proper MERN-style product workflow. The idea is simple: users can create projects, add tasks, track progress, and see a quick dashboard of what is pending, completed, urgent, or due soon.

I tried to keep the app close to something people could actually use, instead of making only a basic CRUD demo. It has authentication, protected routes, task filters, project cards, charts, profile settings, and a responsive dashboard.

Live frontend: https://frontend-phi-seven-91.vercel.app

## What It Does

- Register and login flow with JWT auth
- Dashboard with task stats and charts
- Create, edit, delete, and filter tasks
- Create and manage projects
- Track task status, priority, due date, tags, and time estimate
- Profile and password update pages
- Responsive UI for desktop and mobile screens
- Demo/local fallback on the frontend if the backend API is not connected

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- Framer Motion
- Recharts
- Lucide icons

Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- express-validator
- helmet and rate limiting

Deployment:
- Frontend on Vercel
- Backend is ready for Render or any Node hosting service
- MongoDB Atlas can be used for the database

## Project Structure

```txt
flowdesk/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── vercel.json
    └── package.json
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/ArpanNarula/FlowDesk.git
cd FlowDesk
```

Install and run the backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Install and run the frontend:

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

Backend runs on:

```txt
http://localhost:5000
```

For local frontend + backend connection, set this inside `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Environment Variables

Backend `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Overview

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tasks:
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Projects:
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/:id/tasks`

Analytics:
- `GET /api/analytics/overview`
- `GET /api/analytics/weekly`
- `GET /api/analytics/by-status`
- `GET /api/analytics/by-priority`
- `GET /api/analytics/recent`
- `GET /api/analytics/upcoming`

User:
- `PUT /api/users/profile`
- `PUT /api/users/password`

## Deployment Notes

The frontend is deployed on Vercel. Since the frontend and backend are separate, the production frontend needs `VITE_API_URL` if it has to talk to a hosted backend.

Example:

```env
VITE_API_URL=https://your-backend-url.com/api
```

Right now the frontend also has a local demo fallback, so the UI can still be tested even when the backend URL is not connected.

## Demo Account

```txt
Email: demo@flowdesk.app
Password: demo1234
```

## Why I Made This

I made FlowDesk to understand how a real dashboard-based web app is structured end to end. The main focus was not just the UI, but also how authentication, API routes, database models, protected pages, and deployment fit together in one project.

Some parts I focused on while building:
- Clean page structure
- Reusable task/project components
- Protected frontend routes
- Separate backend controllers and routes
- Dashboard analytics from task data
- Deployment-ready frontend setup
