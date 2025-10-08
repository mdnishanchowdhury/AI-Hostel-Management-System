AI Hostel Management System 🏨🤖

An AI-powered Hostel Management System that simplifies hostel operations including room allocation, meal booking, payments, attendance tracking, and administrative tasks. Built with React.js, Node.js, MongoDB, and Firebase, it provides separate dashboards for Admin and Students.

🚀 Features
Admin Features

Dashboard: Overview of hostel statistics and activities.

Applications: View and manage student applications.

All Users: Manage student and staff accounts.

Auto Booking: Automatically assign rooms and seats.

Daily Meals: Track meals for students daily.

Meals History: View historical meal data.

Payment History: Track all hostel payments.

Student Features

Dashboard: Personalized student overview.

My Room: View assigned room details.

Meal Booking: Book daily meals easily.

Meals History: Track past meals.

Make Payment: Pay hostel fees online.

Payment History: View past payments.

Profile: Update personal information.

Settings: Configure account preferences.

🖼️ Screenshots
Admin Dashboard

Student Dashboard

Room & Meal Booking

Payment History

(Replace images/... with your actual screenshot paths.)

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS, DaisyUI, Framer Motion, React Router, Recharts, Firebase
Backend	Node.js, Express.js, Firebase Admin, MongoDB, JWT
Authentication	JWT, Firebase
AI Features	Auto Room & Seat Allocation
📦 Project Structure
Frontend
frontend/
├─ src/               # React source code
├─ public/            # Static files
├─ package.json        # Dependencies & scripts
└─ vite.config.js      # Vite configuration


Frontend Scripts

"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}


Frontend Key Dependencies

react, react-dom, react-router-dom, react-hook-form

tailwindcss, daisyui, framer-motion

recharts, sweetalert2, lucide-react, axios

Backend
backend/
├─ server.js           # Main server file
├─ routes/             # Express routes
├─ controllers/        # Business logic
├─ models/             # MongoDB models
├─ package.json        # Dependencies & scripts
└─ .env                # Environment variables


Backend Scripts

"scripts": {
  "start": "nodemon server.js"
}


Backend Key Dependencies

express, mongodb, bcrypt, jsonwebtoken, cors

firebase-admin, nodemailer

⚡ Installation & Setup

Clone the repository

git clone https://github.com/<your-username>/ai-hostel-management-system.git
cd ai-hostel-management-system


Frontend setup

cd frontend
npm install
npm run dev


Backend setup

cd ../backend
npm install
npm start


Open http://localhost:5173
 in your browser.

🔮 Future Enhancements

Mobile app support (React Native)

Payment gateway integration

Push notifications for students & staff

Advanced AI for predictive room allocation

🤝 Contribution

Contributions are welcome! Open an issue or submit a pull request.

📄 License

MIT License © 2025
