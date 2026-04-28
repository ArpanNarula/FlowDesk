# FlowDesk

FlowDesk is a task and project management web app I built using React, Node.js, Express and MongoDB. It is made like a small productivity dashboard where a user can manage projects, add tasks, update their status, and see basic analytics.

Live link: https://frontend-phi-seven-91.vercel.app

## Features

- User register and login
- Dashboard with task overview
- Create, edit and delete tasks
- Filter tasks by status, priority and project
- Create and manage projects
- Simple analytics for tasks and priorities
- Profile/settings page
- Responsive UI

## Tech Used

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios

Backend:
- Node.js
- Express.js
- MongoDB
- JWT authentication
- bcryptjs

## Folder Structure

```txt
flowdesk/
├── backend/
│   ├── src/
│   └── package.json
│
└── frontend/
    ├── src/
    └── package.json
```

## Run Locally

Clone the repo:

```bash
git clone https://github.com/ArpanNarula/FlowDesk.git
cd FlowDesk
```

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Add this in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend `.env` needs:

```env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

## Demo Login

```txt
Email: demo@flowdesk.app
Password: demo1234
```

## Note

The frontend is deployed on Vercel. I also added a small demo fallback in the frontend so the app can be tested even if the backend URL is not connected yet.

I made this project mainly to understand how frontend pages, backend APIs, authentication, database models and deployment work together in one full-stack app.
