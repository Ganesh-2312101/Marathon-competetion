# 🏃 TAMIL NADU MARATHON 2026 - Registration & Management System

A full-stack web-based State-Level Marathon Registration System built with **React.js**, **Node.js**, **Express.js**, and **MySQL**.

---

## 🌟 Key Features

- **Participant Registration**: Clean, responsive, multi-step validation form.
- **Automatic Age Group Categorization**:
  - `18–25`
  - `26–35`
  - `36–45`
  - `Above 45`
- **Automatic Under-35 Status Calculation**: Automatically computed (`YES` / `NO`) based on participant age.
- **Unique Registration ID Generator**: Formatted as `MAR2026-00001`, `MAR2026-00002`... and stored in MySQL database.
- **Marathon Event Date Selection**: Participants choose their preferred event date (`October 17`, `October 18`, `October 19`, `October 20, 2026`).
- **Official Registration Ticket Confirmation**: Instant confirmation ticket display post-registration.
- **Admin Analytics Dashboard**:
  - Stat cards: Total Participants, Under 35, 35 & Above.
  - Interactive Visual Categorization Graphs: Age-wise, Event Date-wise, Under-35 status, Marathon distance category (5 KM, 10 KM, 21 KM, 42 KM), and District-wise counts across all 38 Tamil Nadu districts.
  - Real-time Participant Table with live search by Name/ID and multi-filtering options.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router v6, Axios, Lucide React Icons, HTML5, Vanilla CSS, Vite
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **Database**: MySQL (`mysql2` connection pool with automatic schema initialization & memory fallback support)

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js                       # MySQL database pool connection & setup
│   ├── controllers/
│   │   └── participantController.js    # Registration logic & analytics endpoints
│   ├── routes/
│   │   ├── participantRoutes.js        # /api/participants routes
│   │   └── dashboardRoutes.js          # /api/dashboard routes
│   ├── utils/
│   │   └── registrationId.js           # ID generator (MAR2026-XXXXX) & age logic
│   ├── .env.example                    # Template environment file
│   ├── package.json                    # Backend dependencies
│   ├── schema.sql                      # MySQL database setup SQL
│   └── server.js                       # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Header navigation bar
    │   │   ├── ParticipantTable.jsx    # Table with search & multi-filter
    │   │   └── StatCard.jsx            # Summary metric card component
    │   ├── pages/
    │   │   ├── Home.jsx                # Landing page with live statistics
    │   │   ├── Register.jsx            # Registration form page
    │   │   ├── Success.jsx             # Confirmation ticket page
    │   │   └── Dashboard.jsx           # Admin analytics dashboard page
    │   ├── services/
    │   │   └── api.js                  # Axios HTTP client service
    │   ├── App.css                     # Modern white theme visual CSS
    │   ├── App.jsx                     # Application router layout
    │   └── main.jsx                    # React entry point
    ├── index.html                      # HTML template
    ├── package.json                    # Frontend dependencies
    └── vite.config.js                  # Vite configuration
```

---

## 🛢️ Database Setup (MySQL)

Create the MySQL database and table using the provided SQL script (`backend/schema.sql`):

```sql
CREATE DATABASE IF NOT EXISTS marathon_registration;

USE marathon_registration;

CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    district VARCHAR(100) NOT NULL,
    medium VARCHAR(20) DEFAULT NULL,
    marathon_category VARCHAR(20) NOT NULL,
    marathon_date VARCHAR(50) NOT NULL,
    age_category VARCHAR(20) NOT NULL,
    under_35 VARCHAR(10) NOT NULL,
    tshirt_size VARCHAR(10) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Setup & Execution Instructions

### 1. Backend Server Setup
```bash
cd backend
npm install
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Application Routes

- `/` : Landing Page
- `/register` : Registration Form
- `/success` : Registration Ticket
- `/admin` : Admin Analytics Dashboard
