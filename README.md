# Hostel Management System

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) for managing student complaints in a hostel.

## Project Structure

```
d:/Hostel_Management/
├── server/               # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers (auth, complaints)
│   ├── middleware/       # JWT auth & role protection
│   ├── models/           # Mongoose schemas (User, Complaint)
│   ├── routes/           # API routes
│   ├── index.js          # Express entry point
│   └── package.json
└── client/               # React frontend (Vite)
    ├── src/
    │   ├── api/          # Axios instance with interceptors
    │   ├── components/   # Protected routes & UI components
    │   ├── context/      # AuthContext for state management
    │   └── pages/        # Login, Register, Dashboards
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Features
- **JWT Authentication**: Secure login/registration.
- **Role-based Access**: Two roles (`student` and `admin`).
- **Student Dashboard**: Submit complaints and view their statuses.
- **Admin Dashboard**: View all complaints, filter by status, change status, or delete issues.
- **Premium UI**: Modern, glassmorphism-inspired design powered by Tailwind CSS v4 and `lucide-react` icons.

## How to Run Locally

### Prerequisites
- Node.js installed on your machine
- MongoDB instance running locally (default: `mongodb://127.0.0.1:27017/hostel_management`)

### 1. Setup Backend
Open a terminal and run the following commands:
```bash
cd server
npm install
npm start
```
*(The backend runs on port 5000 by default)*

### 2. Setup Frontend
Open a new terminal and run:
```bash
cd client
npm install
npm run dev
```
*(The frontend will usually start at `http://localhost:5173/`)*

### Testing the Roles
1. **Student**: Register a new account via the `/register` page. It assigns the `student` role by default.
2. **Admin**: You'll need to manually change a user's role to `admin` in your MongoDB compass/database, or change the default role assignment in `server/controllers/authController.js` temporarily.
