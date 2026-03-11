# 🚔 Online Crime Reporting System

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application that enables citizens to report crimes online and allows administrators to manage and track those reports efficiently.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Endpoints](#-api-endpoints)
- [Application Roles](#-application-roles)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 👤 User Features
- **Register & Login** with secure JWT-based authentication
- **Report a Crime** with title, description, category, location, date of incident, and optional evidence upload
- **Anonymous Reporting** – submit complaints without revealing identity
- **My Complaints** – view and track the status of all submitted complaints
- **Complaint Details** – see full information and admin remarks per complaint

### 🛡️ Admin Features
- **Admin Dashboard** – overview with complaint statistics
- **View All Complaints** – paginated list of all submitted complaints
- **Complaint Management** – update complaint status (`Pending` → `Under Investigation` → `Resolved`)
- **Add Admin Remarks** – attach notes or feedback to each complaint

### 🔒 Security
- Password hashing with **bcryptjs**
- Role-based route protection (user vs. admin)
- JWT token authentication with middleware guards
- Protected & Admin-only routes on the frontend

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, React Router DOM v7, Axios      |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB, Mongoose                               |
| Auth       | JSON Web Tokens (JWT), bcryptjs                 |
| File Upload| Multer (evidence files, max 10 MB)              |
| Styling    | Vanilla CSS (custom design system)              |

---

## 📁 Project Structure

```
OnlineCrimeReportingSystem/
├── client/                     # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── AdminRoute.jsx       # Admin-only route guard
│       │   ├── ComplaintCard.jsx    # Reusable complaint card
│       │   ├── Loader.jsx           # Loading spinner
│       │   ├── Navbar.jsx           # Navigation bar
│       │   └── ProtectedRoute.jsx   # Auth-protected route guard
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ReportCrime.jsx
│       │   ├── MyComplaints.jsx
│       │   ├── ComplaintDetails.jsx
│       │   ├── UserDashboard.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminComplaints.jsx
│       │       └── AdminComplaintDetails.jsx
│       ├── services/               # Axios API service modules
│       ├── App.jsx
│       └── main.jsx
│
└── server/                     # Express backend
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   └── complaintController.js
    ├── middleware/
    │   ├── auth.js                  # JWT verification
    │   ├── admin.js                 # Admin role check
    │   └── upload.js                # Multer file upload config
    ├── models/
    │   ├── User.js
    │   └── Complaint.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── complaintRoutes.js
    ├── uploads/                     # Stored evidence files
    ├── .env
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm (comes with Node.js)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/OnlineCrimeReportingSystem.git
cd OnlineCrimeReportingSystem
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Install client dependencies**

```bash
cd ../client
npm install
```

---

### Environment Variables

Create a `.env` file inside the `server/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/crime_reporting_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

> ⚠️ **Never commit your `.env` file to version control.** Make sure it is listed in `.gitignore`.

---

### Running the App

**Start the backend server** (from the `server/` directory):

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

**Start the frontend** (from the `client/` directory):

```bash
npm run dev
```

The React app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint    | Description              | Auth Required |
|--------|-------------|--------------------------|---------------|
| POST   | `/register` | Register a new user      | No            |
| POST   | `/login`    | Login and receive JWT    | No            |

### Complaint Routes — `/api/complaints`

| Method | Endpoint          | Description                          | Auth Required |
|--------|-------------------|--------------------------------------|---------------|
| POST   | `/`               | Submit a new complaint               | User          |
| GET    | `/my`             | Get current user's complaints        | User          |
| GET    | `/:id`            | Get a single complaint by ID         | User          |
| GET    | `/admin/all`      | Get all complaints (admin only)      | Admin         |
| PUT    | `/admin/:id`      | Update status & remarks (admin only) | Admin         |

---

## 👥 Application Roles

### Regular User
- Can register and log in
- Can submit crime reports (with or without evidence)
- Can choose to report anonymously
- Can view and track their own complaints

### Admin
- Has all user capabilities
- Can view all complaints from all users
- Can update complaint status and add remarks
- Access to the admin dashboard with stats

> **To create an admin account**, manually set `"role": "admin"` in the MongoDB `users` collection for the desired user document.

---

## 📌 Complaint Categories

| Category    | Description                           |
|-------------|---------------------------------------|
| Theft       | Robbery, burglary, pickpocketing      |
| Assault     | Physical violence or threats          |
| Cybercrime  | Hacking, fraud, identity theft        |
| Harassment  | Stalking, bullying, workplace issues  |
| Other       | Any crime not in the above categories |

---

## 📊 Complaint Statuses

| Status               | Meaning                                      |
|----------------------|----------------------------------------------|
| `Pending`            | Complaint submitted, awaiting review         |
| `Under Investigation`| Authorities are actively investigating       |
| `Resolved`           | Case has been closed or resolved             |

---


<div align="center">
  <p>Designed and developed as a full-stack MERN application demonstrating authentication, role-based access control, and RESTful API architecture.</p>
</div>
```
