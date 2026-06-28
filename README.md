# 📚 PlanIQ – AI Integrated Study Planner

> An AI-powered study planner that generates personalized, exam-oriented study schedules using **Google Gemini AI**. Built with the **MERN Stack**, featuring secure JWT authentication, cloud deployment, PDF export, and study plan management.

<p align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)

</p>

---

## 🌐 Live Demo

**Frontend:** https://ai-study-planner-silk.vercel.app

**Backend API:** https://ai-study-planner-v6oh.onrender.com

---

# 🚀 Project Overview

Preparing for competitive exams often involves creating and managing complex study schedules. PlanIQ simplifies this process by using **Google Gemini AI** to generate personalized study plans based on:

- Subjects
- Weak topics
- Target exam date
- Daily study hours

The application intelligently distributes study time, inserts periodic revision days, and generates a structured roadmap to help students prepare efficiently.

---

# ✨ Features

✅ AI-generated personalized study schedules

✅ Google Gemini AI integration

✅ JWT Authentication & Authorization

✅ Secure Login & Signup

✅ Save multiple study plans

✅ View previously generated plans

✅ Delete saved plans

✅ Automatic revision day scheduling

✅ PDF Export using jsPDF

✅ Responsive UI

✅ Retry mechanism for Gemini API failures

✅ MongoDB Atlas cloud database

---

# 🏗️ System Architecture

```
             React + Vite
                  │
                  ▼
          Express REST API
                  │
         JWT Authentication
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
 Google Gemini AI      MongoDB Atlas
        │                    │
        └─────────┬──────────┘
                  ▼
      Personalized Study Plans
```

---

# 🛠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT, bcrypt.js |
| AI | Google Gemini API |
| PDF Generation | jsPDF |
| Deployment | Vercel, Render |
| Version Control | Git & GitHub |

---

# 📂 Folder Structure

```
Ai-Study-Planner
│
├── backend
│   ├── ai
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── index.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Nikhil-Soni-code/Ai-Study-Planner.git
```

## Backend

```bash
cd backend

npm install

npm start
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GEMINI_API_KEY=YOUR_API_KEY
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://ai-study-planner-v6oh.onrender.com
```

---

# 🧠 How It Works

1. User creates an account or logs in.
2. User enters:
   - Subjects
   - Weak subjects
   - Exam date
   - Study hours
3. Backend calculates study distribution.
4. Gemini AI generates a structured study plan.
5. Plan is displayed on the dashboard.
6. User can:
   - Save the plan
   - View saved plans
   - Delete plans
   - Export to PDF

---

# 🔐 Authentication

- Password hashing using bcrypt.js
- JWT-based authentication
- Protected REST APIs
- User-specific saved plans

---

# 📄 API Endpoints

## Authentication

```
POST /api/auth/signup

POST /api/auth/login
```

## AI Planner

```
POST /api/plan
```

## Saved Plans

```
GET /api/plans

POST /api/plans

DELETE /api/plans/:id
```

---

# 🚀 Deployment

Frontend deployed on **Vercel**

Backend deployed on **Render**

Database hosted on **MongoDB Atlas**

---

# 💡 Future Improvements

- Email reminders
- Google Calendar integration
- AI-powered progress tracking
- Pomodoro timer
- Performance analytics dashboard
- Mobile application
- Collaborative study planning

---

# 👨‍💻 Author

**Nikhil Soni**

GitHub: https://github.com/Nikhil-Soni-code

LinkedIn: *(Add your LinkedIn profile here)*

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
