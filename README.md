# AI Hostel Management System 🏨🤖
An **AI-powered hostel management system** built with **React, Node.js and MongoDB** to streamline hostel operations including room allocation, food management, payments, attendance tracking and administrative tasks. The system has separate dashboards for admin and students.

---

## 🚀 Features 🖼️
### Admin Features

### Hostel Registration
- **Room Selection:** The final step of hostel registration where students can choose or accept an AI-suggested seat.  
- The AI system recommends the best match based on profile similarity (e.g., *Room-101-Bed-3* with 91% match).  
- Students can either **Accept Suggested Seat** or manually **Select a seat** from the dropdown.  
  ![Hostel Registration](https://i.ibb.co.com/gZCY2N8n/Screenshot-2025-09-25-203220.png)


<h3>Admin Features</h3>
<ul>
  <li>
    <strong>Dashboard:</strong> Overview of hostel activities and statistics.<br/>
    <img src="https://i.ibb.co/9HZDqn2R/dashboard.png" alt="Dashboard" style="width:100%; height:auto; display:block; margin-bottom:20px;"/>
  </li>
  
  <li>
    <strong>Applications:</strong> View and manage student applications.<br/>
    <img src="https://i.ibb.co/ksPnyhVz/application.png" alt="Applications" style="width:100%; height:auto; display:block; margin-bottom:20px;"/>
  </li>

  <li>
    <strong>All Users:</strong> Manage student and staff accounts.<br/>
       <img src="https://i.ibb.co.com/SwHZb0Hq/22.png" alt="All Users" style="width:100%; height:auto; display:block; margin-bottom:20px;"/>
  </li>

<li>
  <strong>Auto Booking:</strong> Automatically assign rooms and seats.<br/>
  <img src="https://i.ibb.co.com/s9L26xTx/auto-booking1.png" alt="Auto Booking" style="width:100%; height:auto; display:block; margin-bottom:20px;"/>
</li>

  <li>
    <strong>Daily Meals:</strong> Track daily meals for students.<br/>
    <img src="https://i.ibb.co/XZsSbrHX/daily-meals.png" alt="Daily Meals" style="width:100%; height:auto; display:block; margin-bottom:20px;"/>
  </li>

<li>
  <strong>Meals History:</strong> Track all hostel payments and transactions.<br/>
  <img width="1918" height="862" alt="image" src="https://github.com/user-attachments/assets/02b20e03-abb2-4838-9b17-aefb40bcad69" />
</li>
  
  <li>
    <strong>Payment History:</strong> Track all hostel payments and transactions.<br/>
    <img src="https://i.ibb.co/mrkLNSZ1/payment.png" alt="Payment History" style="width:100%; height:auto; display:block; margin-bottom:20px;"/>
  </li>
</ul>

### Student User Features
- **Dashboard:** Personalized overview for students.  
- **My Room:** View assigned room details.  
- **Meal Booking:** Book daily meals easily.  
- **Meals History:** Track past meals.  
- **Make Payment:** Pay hostel fees online.  
- **Payment History:** View past payments.  
- **Profile:** Update personal information.  
- **Settings:** Configure account preferences.  
[Demo Link](https://ai-hostel-system.web.app/)
---

## 🛠️ Tech Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React.js, Tailwind CSS, DaisyUI, Framer Motion, React Router, Recharts, Firebase |
| Backend    | Node.js, Express.js, Firebase Admin, MongoDB, JWT |
| Authentication | JWT, Firebase |
| AI Features | Auto Room & Seat Allocation |

---

## 🗂️ Folder Structure

```plaintext
frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── Banner/
│   │       └── react.svg
│   ├── Components/
│   │   ├── HomeSection/
│   │   └── Loading/
│   ├── Firebase/
│   │   └── Firebase.jsx
│   ├── Hook/
│   │   ├── useAdmin.jsx
│   │   ├── useAuth.jsx
│   │   ├── useAxiosPublic.jsx
│   │   └── useAxiosSecure.jsx
│   ├── Layout/
│   │   ├── DashboardMain.jsx
│   │   └── Main.jsx
│   ├── Page/
│   │   ├── AdminDashboard/
│   │   ├── ApplyForm/
│   │   ├── DashboardSwitch/
│   │   ├── DashboardMenu/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── SignUp/
│   │   └── UserDashboard/
│   ├── Provider/
│   │   └── AuthProvider.jsx
│   ├── routers/
│   │   ├── AdminRoute.jsx
│   │   ├── PrivetRoute.jsx
│   │   └── router.jsx
│   ├── Shared/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── .env.local

</details> ```

### ⚙️ Installation

# Clone the repository
git clone https://github.com/mdnishanchowdhury/AI-Hostel-Management-System.git

# Navigate into the project folder
cd AI-Hostel-Management-System

# Install dependencies
npm install

# Start the development server
npm run dev

