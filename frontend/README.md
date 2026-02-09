# Taskify Frontend

Frontend application for **Taskify**, providing role-based dashboards for Admin and User with secure authentication and task/work management.

Built using **React**, **Redux Toolkit**, **React Router**, and **Tailwind CSS**.

---

## 🚀 Features

- User authentication (Login / Register)
- Role-based routing (Admin / User)
- Admin dashboard for managing works, members, and tasks
- User dashboard for viewing assigned works and tasks
- Task status updates with real-time UI sync
- Protected routes
- Global state management with Redux Toolkit
- Clean UI using Tailwind CSS
- Toast notifications for user feedback

---

## 🛠 Tech Stack

- **React**
- **Redux Toolkit**
- **React Router DOM**
- **Tailwind CSS**
- **Axios (API Connector)**
- **Sonner (Toasts)**

---

## 📂 Project Structure

```
src/
├── assets/
│   └── loaders/
├── components/
│   ├── auth/
│   ├── layout/
│   └── work/
│       ├── admin/
│       └── user/
├── pages/
│   ├── admin/
│   ├── user/
│   └── Home.jsx
├── redux/
│   └── slices/
├── services/
│   ├── apiConnector.js
│   ├── endpoints/
│   └── operations/
├── routes/
└── App.jsx
```

---

## 🔐 Authentication Flow

- Users authenticate using email, password, and role
- JWT tokens are handled via HTTP-only cookies (backend)
- User session is persisted in `localStorage`
- Protected routes prevent unauthorized access
- Role-based redirection after login

---

## 📌 Pages & Routes

### Public
- `/` – Home
- Login / Register Modal

### Admin
- `/admin-dashboard`
  - Create works
  - Manage members
  - Create and manage tasks
  - Track work and task status

### User
- `/user-dashboard`
  - View assigned works
  - View and update task status

---

## 🧠 State Management

- Redux Toolkit for global state
- `authSlice` manages authentication state
- Async operations handled using Redux Thunks
- Backend responses directly drive UI state

---

## ▶️ Running the Project

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

App runs on:
```
http://localhost:3000
```

---

## 🔧 Environment Variables

Create a `.env` file:

```
VITE_BACKEND_URL=http://localhost:4000
```

---

## 🎨 UI & UX

- Responsive layout
- Loading states using custom loaders
- Modal-based interactions
- Status-based color indicators
- Minimal and clean design

---

## 📎 Notes

- Designed to work seamlessly with Taskify Backend
- Easily extendable for permissions, notifications, or analytics
- Clean separation of concerns for scalability


---

Thank You 🚀
