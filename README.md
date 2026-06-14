# PAMS — Placement Automated Management System 🎓

A full-stack **Placement Automated Management System** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). Designed to streamline and automate placement processes in educational institutions with role-based access for Admins, Coordinators, and Students.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | _(Netlify — add URL after deploy)_ |
| **Backend API** | _(Render — add URL after deploy)_ |

---

## 🚀 Features

- **Admin Dashboard** — Real-time statistics: total students, companies, coordinators, alumni, announcements, and notifications
- **Student Management** — Add, edit, delete students with CSV export and multi-filter (name, year, department)
- **Company Management** — Manage visiting companies and HR contact details
- **Coordinator Panel** — Department-scoped student view, CGPA updates, year-wise filtering
- **Student Portal** — Profile management, skills update, alumni directory, placement announcements
- **Role-Based Authentication** — Secure JWT login for Admin, Coordinator, and Student roles
- **Notification System** — Targeted messaging by audience (all / students / coordinators), department, and year
- **Alumni Network** — Browse alumni profiles with LinkedIn integration
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme UI** — Professional dark theme with gold (#FFD700) accents

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|-----------|---------|
| React | 19.x |
| Material-UI (MUI) | 7.x |
| React Router DOM | 7.x |
| Axios | 1.x |
| Day.js | 1.x |

### Backend
| Technology | Version |
|-----------|---------|
| Node.js | 18+ |
| Express.js | 5.x |
| MongoDB + Mongoose | 8.x |
| JSON Web Token (JWT) | 9.x |
| bcryptjs | 3.x |
| Helmet + express-rate-limit | — |

---

## 📁 Project Structure

```
pams-placement-management-system/
├── client/                  # React frontend (Create React App)
│   ├── src/
│   │   ├── components/      # Admin, Coordinator, Student, Common components
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── pages/           # Dashboard pages per role
│   │   └── services/        # Axios API service layers
│   └── package.json
├── server/                  # Express.js backend
│   ├── controllers/         # Business logic (admin, auth, coordinator, student)
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas (User, Alumni, Company, etc.)
│   ├── routes/              # API route definitions
│   └── server.js
├── scripts/
│   └── seed-test-data.js    # Bulk seed script (10 coordinators, 50 students, …)
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Sarvesh2905/pams-placement-management-system.git
cd pams-placement-management-system
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=pamsadmin@college.edu
ADMIN_PASSWORD=pamsadmin123
```

```bash
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start          # starts on http://localhost:3000
```

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | pamsadmin@college.edu | pamsadmin123 |
| **Coordinator** | _(add via Admin panel)_ | Coordinator@123 |
| **Student** | _(add via Admin panel)_ | _(their Roll Number)_ |

---

## ☁️ Deployment

### Backend → Render
1. Create a **Web Service** on [render.com](https://render.com)
2. Connect this GitHub repository
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add all environment variables from `server/.env` in the Render dashboard

### Frontend → Netlify
1. Create a **New Site** on [netlify.com](https://netlify.com)
2. Connect this GitHub repository
3. Set **Base Directory** to `client`
4. **Build Command:** `npm run build`
5. **Publish Directory:** `client/build`
6. Add environment variable `REACT_APP_API_URL` pointing to your Render backend URL
7. The `client/netlify.toml` redirect rule ensures React Router works correctly

---

## 📌 Academic Project Details

| Field | Details |
|-------|---------|
| **Course** | Information Technology |
| **Year** | 2nd Year |
| **Project Type** | Mini Project 2 |
| **Academic Session** | 2024–25 |

---

## 📝 Note

> This project is made for **educational purposes** as part of college coursework to demonstrate MERN stack development skills and placement management system concepts.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
