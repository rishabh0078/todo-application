# TaskFlow — Secure Todo Application

A full-stack todo application with JWT authentication and role-based access control.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Project Structure

```
todo application/
├── frontend/    ← React app
└── backend/     ← Express API
    ├── server.js
    └── src/
        ├── app.js
        ├── models/        (User, Todo)
        ├── routes/        (auth, todos, admin)
        ├── controllers/   (auth, todo, admin)
        ├── middleware/    (auth, role)
        └── validators/    (auth, todo)
```

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies all `/api` requests to `http://localhost:5000`.

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Todos (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get todos (own for user, all for admin) |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

### Admin (Admin role only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| GET | `/api/admin/todos` | Get all todos |

## Notes

- Passwords are hashed using **bcrypt** (10 rounds)
- JWT includes `id`, `username`, `email`, and `role`
- Users can only modify their **own** todos; admins can modify **any** todo
- To create the first admin: register normally, then update the `role` field to `admin` directly in MongoDB
