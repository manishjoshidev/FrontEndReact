# 🛡️ student Management System - Frontend

A React-based frontend project for a School Management System. It includes role-based authentication (Admin, Trainer, Student) using JWT and Context API.

---

## 🚀 Features

- 🔐 JWT Authentication
- 👤 Role-based login (admin, trainer, student)
- 🔄 Persistent login via `localStorage`
- 🧠 React Context for global auth state
- 🔍 Login UI (connects to backend or uses mock login)
- 📦 Fully typed with TypeScript

---

## 📁 Project Structure

project-root/ │ ├── src/ │ ├── components/ # Reusable UI components │ ├── pages/ # Login and protected routes │ ├── context/ │ │ └── AuthContext.tsx # Auth state and logic │ ├── App.tsx # Routing │ └── index.tsx # Entry point │ ├── public/ ├── package.json └── README.md



---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/school-management-frontend.git
cd school-management-frontend
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Start Development Server
bash
Copy
Edit
npm run dev
# or
yarn dev
The app runs at http://localhost:5173 by default (if using Vite).

🔗 Backend Integration
The login API is expected at:


POST http://localhost:8080/user/login
Request Payload:

{
  "emailId": "admin@dummy.com",
  "password": "admin123"
}
Response Format:


{
  "token": "JWT_TOKEN",
  "emailId": "admin@example.com"
}
⚠️ If the backend isn't available, enable mock login in AuthContext.tsx to simulate login behavior.

🧪 Mocking API for Testing (Optional)
If you don't have a backend yet, you can use:



🔧 Mock Service Worker (MSW) for intercepting API calls

🧪 Manual mocking via fetch override

📦 Tech Stack
React (with Vite)

TypeScript

Context API

JWT (via jwt-decode)

Tailwind CSS (optional)

✅ TODOs
 Integrate protected routes

 Create Admin/Trainer/Student dashboards

 Role-based routing and navigation

 Form validations and error UI

 API integration for dashboard features

👨‍💻 Author
Manish Joshi
Full Stack Developer | Java | React | Spring Boot
