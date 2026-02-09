# Taskify Backend API

Backend service for authentication, role-based access control (RBAC), work management, and task tracking.  
Built with **Node.js, Express, MongoDB**, and **JWT**, with structured logging and Swagger documentation.

---

## 🚀 Features

- User authentication (Register / Login)
- Role-based access control (`admin`, `user`)
- Work management (create, assign members, track status)
- Task management (assign, update status, auto work status sync)
- JWT authentication with access & refresh tokens
- Redis integration
- Centralized logging using Winston
- Request validation with `express-validator`
- Swagger API documentation

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- JWT (Access & Refresh Tokens)
- Winston (Logging)
- Swagger (API Docs)

---

## 📂 Project Structure

```
src/
├── app.js
├── server.js
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── docs/
└── logs/
```

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Tokens stored in HTTP-only cookies
- Role-based access enforced at controller level

### Roles
- **Admin**: create works, manage members, create tasks
- **User**: view assigned works and tasks, update task status

---

## 📌 API Endpoints

### Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`

### Works
- POST `/api/v1/works/create-work`
- GET `/api/v1/works/get-all-works`
- GET `/api/v1/works/get-work-by-userid/:userId`
- GET `/api/v1/works/:workId`
- PATCH `/api/v1/works/:workId/members`

### Tasks
- POST `/api/v1/tasks/create-task`
- GET `/api/v1/tasks/:workId`
- GET `/api/v1/tasks/get-user-task-by-work/:workId`
- PATCH `/api/v1/tasks/status/:taskId`

---

## 📘 Swagger Docs

Available in development mode:

```
http://localhost:4000/api-docs
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
PORT=4000
NODE_ENV=development
MONGO_URI=
REDIS_URL=
JWT_SECRET=
REFRESH_SECRET=
```

---

## ▶️ Run Project

```
npm install
npm run dev
```

Server runs on `http://localhost:4000`

---

## ✅ Health Check

```
GET /
```

Response:
```json
{
  "message": "Backend Auth & RBAC API is running 🚀",
  "status": "OK"
}
```
