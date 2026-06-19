# Hostel Management System

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) for managing student complaints in a hostel.

## Project Purpose

The purpose of this project is to make hostel complaint management faster, more transparent, and easier to track. Instead of relying on verbal complaints, paper registers, or scattered messages, students can raise issues through a centralized web platform, while hostel administrators can monitor, filter, update, and resolve complaints from a dedicated dashboard.

## Novelty of the Project

- **Centralized digital complaint workflow**: Brings student complaints, admin review, status tracking, and issue deletion into one full-stack platform.
- **Role-based experience**: Students and admins get separate dashboards with permissions designed for their responsibilities.
- **Real-time accountability through status tracking**: Students can see whether their complaint is pending, in progress, or resolved, improving transparency.
- **Secure access model**: JWT authentication and protected routes ensure that only authorized users can access role-specific features.
- **Modern user experience**: A clean React interface with Tailwind CSS and icon-based actions makes the system easier to use than traditional manual complaint registers.

## Target Consumers

This project is mainly useful for:

- **Hostel students** who need a simple way to submit complaints and track their resolution status.
- **Hostel wardens and administrators** who need to view, prioritize, update, and manage student complaints efficiently.
- **College or university management** that wants a digital system to improve hostel operations and service accountability.
- **Maintenance teams** who can use complaint data to understand recurring hostel issues and respond faster.

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

To enable student email notifications when a complaint is marked `Resolved`, add these SMTP settings to `server/.env`:
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password-or-app-password
MAIL_FROM="Hostel Management <your-email@example.com>"
```

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
