# 🐛 TrackFlow — Issue Tracking System

> A production-ready, full-stack MERN application for managing projects, tracking issues, and collaborating in real-time — built like Jira and Linear.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 **Auth & RBAC** | JWT-based authentication, role-based access (user / admin) |
| 📋 **Kanban Board** | Drag-and-drop ticket management across status columns |
| 🎫 **Ticket Management** | Create, edit, delete tickets with priority, status & assignee |
| 💬 **Comments** | Per-ticket collaboration thread with real-time updates |
| ⚡ **Real-Time (Socket.io)** | Live board updates, comment sync, notifications |
| 📎 **File Uploads** | Attach screenshots to tickets via Multer |
| 📊 **Activity Logs** | Full audit trail of project & ticket actions |
| 🛡️ **Admin Dashboard** | Analytics, user management, system-wide charts (Recharts) |
| 🔔 **Notifications** | Real-time bell with unread count badges & Accept/Decline invites |
| 🔍 **Command Palette** | Global search via `Ctrl+K` / `Cmd+K` with keyboard navigation |
| 📱 **Fully Responsive** | Mobile-first layout with slide-in sidebar drawer |

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TailwindCSS** — utility-first styling with glassmorphism design
- **React Router v6** — full-page navigation (no modals)
- **Socket.io Client** — real-time events
- **Recharts** — analytics charts
- **Framer Motion** — page animations
- **@hello-pangea/dnd** — drag-and-drop Kanban
- **Lucide React** — icon library
- **Axios** — HTTP client

### Backend
- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — database & ODM
- **Socket.io** — WebSocket server
- **JWT** — authentication tokens
- **Multer** — file upload middleware
- **Bcrypt** — password hashing
- **Helmet, CORS, Rate Limiting** — security hardening

---

## 📦 Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/trackflow.git
cd trackflow
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/trackflow
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

---

## 🗄️ Database Collections

| Collection | Purpose |
|---|---|
| `users` | Auth credentials + role |
| `projects` | Workspace containers |
| `tickets` | Issues / tasks per project |
| `comments` | Per-ticket discussion threads |
| `activities` | Audit log of all actions |
| `notifications` | Real-time user alerts |

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Server health root |
| `GET` | `/api/health` | Uptime + memory metrics |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/projects` | List user projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects/:id/tickets` | Get tickets for project |
| `GET` | `/api/tickets/:id` | Get single ticket |
| `DELETE` | `/api/tickets/:id` | Delete ticket |
| `GET` | `/api/search?q=` | Global search |
| `GET` | `/api/notifications` | User notifications |
| `GET` | `/api/admin/analytics` | Admin-only analytics |

---

## 👑 Admin Setup

Admin users must be created **directly in MongoDB** (not via signup):

```js
db.users.updateOne(
  { email: "admin@trackflow.com" },
  { $set: { role: "admin" } }
)
```

---

## 📁 Project Structure

```
trackflow/
├── backend/
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth, admin, upload, error
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── uploads/        # Multer file storage (gitignored)
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Sidebar, Kanban, NotificationBell…
    │   ├── context/     # AuthContext
    │   ├── pages/       # Dashboard, Projects, TicketDetails…
    │   └── App.jsx      # Router setup
    └── vite.config.js
```

---

## 🔮 Roadmap

- [ ] Email notifications via SendGrid / Nodemailer
- [ ] Password reset with expiring token
- [ ] Role promotion UI (member → manager)
- [ ] GitHub / Slack integration
- [ ] Mobile native app (React Native)

---

## 📄 License

MIT © TrackFlow
