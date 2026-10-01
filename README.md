# Student Management System

Full-stack mini application to manage student records, with authentication.

## Features
- User registration and login (JWT authentication, bcrypt password hashing)
- Add, edit, view and delete student records
- Student details: Name, Email, Phone, Course, Year
- Search (name/email/phone) and filter (course/year)
- Form validation on frontend and backend
- Error handling with proper HTTP status codes
- Responsive UI

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)

## Setup

### Backend
```bash
cd backend
npm install
```
Create a `.env` file (see `.env.example`), then:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/students?search=&course=&year= | List/search/filter students |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Add student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

## Screenshots
![Dashboard](screenshots/dashboard.png)
