# TaskTracker

A production-ready full-stack task management application built with the MERN stack.

![TaskTracker Dashboard](https://github.com/muskan-am/task-tracker/blob/main/Screenshot%202026-07-02%20031705.png)

---

## Features

- **Full CRUD** — Create, read, update, and delete tasks
- **Search** — Debounced live search by task title
- **Filtering** — Filter by status (Pending / In Progress / Completed) and priority (Low / Medium / High)
- **Sorting** — Sort by date created, due date, priority, or title
- **Pagination** — Server-side pagination with smart page number controls
- **Statistics** — Live summary cards with progress bars
- **Validation** — Client-side (React Hook Form) and server-side (express-validator) validation
- **Error handling** — Global error handler, normalised API error messages, toast notifications
- **Security** — Helmet, CORS, rate limiting, input sanitization
- **Responsive** — Mobile, tablet, and desktop layouts
- **Accessible** — ARIA labels, keyboard navigation, focus management, semantic HTML

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4     |
| Routing    | React Router DOM v7                 |
| Forms      | React Hook Form                     |
| HTTP       | Axios                               |
| Icons      | Lucide React                        |
| Toasts     | React Toastify                      |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas, Mongoose             |
| Validation | express-validator                   |
| Security   | Helmet, express-rate-limit, CORS    |

---

## Folder Structure

```
task-tracker/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Button, Input, Modal, Spinner, SkeletonCard, EmptyState
│   │   │   ├── layout/       # Navbar, Sidebar, PageWrapper
│   │   │   └── task/         # TaskCard, TaskList, TaskForm, TaskFilter, TaskStats
│   │   ├── pages/            # Dashboard, NotFound
│   │   ├── context/          # TaskContext (global state + API calls)
│   │   ├── hooks/            # useTasks, useDebounce
│   │   ├── services/         # api.js (Axios instance), taskService.js
│   │   ├── utils/            # formatDate, priorityHelpers, validators
│   │   └── constants/        # taskConstants (enums, dropdown options)
│   ├── vercel.json
│   └── .env
│
├── server/                   # Express backend
│   ├── config/               # db.js (MongoDB connection)
│   ├── controllers/          # taskController.js
│   ├── middleware/            # errorHandler.js, validateRequest.js
│   ├── models/               # Task.js (Mongoose schema)
│   ├── routes/               # taskRoutes.js
│   ├── utils/                # ApiResponse.js
│   ├── render.yaml
│   └── .env
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI in .env
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
# .env already has VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables

### Backend (`server/.env`)

| Variable      | Description                              | Example                                      |
|---------------|------------------------------------------|----------------------------------------------|
| `PORT`        | Server port                              | `5000`                                       |
| `NODE_ENV`    | Environment (`development`/`production`) | `development`                                |
| `MONGO_URI`   | MongoDB Atlas connection string          | `mongodb+srv://user:pass@cluster.mongodb.net/tasktracker` |
| `CORS_ORIGIN` | Allowed frontend origin(s)               | `http://localhost:5173`                      |

### Frontend (`client/.env`)

| Variable              | Description               | Example                        |
|-----------------------|---------------------------|--------------------------------|
| `VITE_API_BASE_URL`   | Backend API base URL      | `http://localhost:5000/api`    |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | `/health`       | Health check                         |
| GET    | `/tasks`        | Get all tasks (filter/sort/paginate) |
| GET    | `/tasks/:id`    | Get single task                      |
| POST   | `/tasks`        | Create task                          |
| PUT    | `/tasks/:id`    | Update task                          |
| DELETE | `/tasks/:id`    | Delete task                          |

### GET /tasks query parameters

| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| `search`   | string | Title substring search               |
| `status`   | string | `Pending` / `In Progress` / `Completed` |
| `priority` | string | `Low` / `Medium` / `High`            |
| `sortBy`   | string | `createdAt` / `dueDate` / `priority` / `title` |
| `order`    | string | `asc` / `desc`                       |
| `page`     | number | Page number (default: 1)             |
| `limit`    | number | Items per page (default: 9, max: 50) |

### Response envelope

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [...],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 9,
      "totalPages": 5
    }
  }
}
```

---

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub
2. Import the project in [vercel.com](https://vercel.com) — set **Root Directory** to `client`
3. Add environment variable: `VITE_API_BASE_URL=https://your-api.onrender.com/api`
4. Deploy — Vercel auto-detects Vite

### Backend → Render

1. Create a new **Web Service** in [render.com](https://render.com)
2. Connect your GitHub repo — set **Root Directory** to `server`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your Atlas connection string>`
   - `CORS_ORIGIN=https://your-app.vercel.app`

### Database → MongoDB Atlas

1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add a database user and allowlist `0.0.0.0/0` (or Render's IP range)
3. Copy the connection string into `MONGO_URI`

---

## Screenshots

| Dashboard | Create Task | Mobile View |
|-----------|-------------|-------------|
| ![Dashboard](https://github.com/muskan-am/task-tracker/blob/main/Screenshot%202026-07-02%20031705.png) | ![Create](https://placehold.co/400x250/f8fafc/64748b?text=Create+Task) | ![Mobile](https://placehold.co/200x400/f8fafc/64748b?text=Mobile) |

---

## Future Improvements

- [ ] User authentication (JWT + refresh tokens)
- [ ] Task categories / labels
- [ ] Drag-and-drop Kanban board view
- [ ] Email reminders for due dates
- [ ] Dark mode
- [ ] Export tasks to CSV / PDF
- [ ] Team collaboration (assign tasks to users)
- [ ] Unit and integration tests (Vitest + Supertest)

---

## License

MIT
