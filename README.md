# 🎟️ Event Booking Platform

A modern full-stack **Event Booking Platform** where users can explore events, check seat availability, book events, manage their profiles, and securely authenticate with the application.

🔗 **Live Demo:** https://event-booking-1opb.vercel.app/

---

## ✨ Features

* 🔐 User Registration & Login
* 🎟️ Event Browsing
* 🪑 Real-time Seat Availability
* 📅 Event Date & Location Filtering
* 🎫 One-Click Event Booking
* 👤 User Profile Management
* ✏️ Update Profile Name
* 🖼️ Profile Image Upload
* 🔑 JWT Authentication
* 🛡️ Protected Routes
* 📧 Email-based Password Reset
* 📱 Responsive UI
* 🔔 Toast Notifications
* ⚡ REST API Integration

---

## 🛠️ Technologies Used

### Frontend

<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" />
</p>

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios
* React Toastify
* Lucide Icons

### Backend

<p align="left">
  <img src="https://skillicons.dev/icons?i=nestjs,nodejs,ts" />
</p>

* NestJS
* Node.js
* TypeScript
* REST API
* JWT Authentication
* TypeORM

### Database

<p align="left">
  <img src="https://skillicons.dev/icons?i=postgres" />
</p>

* PostgreSQL

### Other Tools & Services

<p align="left">
  <img src="https://skillicons.dev/icons?i=git,github,vercel,render" />
</p>

* Cloudinary - Profile image storage
* Mailtrap - Email testing
* Git & GitHub
* Vercel - Frontend deployment
* Render - Backend deployment
* Postman - API testing

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      Next.js         │
                    │      Frontend        │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       NestJS         │
                    │       Backend        │
                    │       Render         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │      Database        │
                    └──────────────────────┘
```

---

## 📂 Project Structure

```text
event-booking/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── utils/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── events/
│   │   ├── bookings/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🔑 Authentication

The application uses **JWT-based authentication**.

Authentication flow:

```text
User
 │
 ▼
Login / Register
 │
 ▼
NestJS Authentication API
 │
 ▼
JWT Access Token
 │
 ▼
Frontend localStorage
 │
 ▼
Protected API Requests
```

Protected requests automatically include the JWT token using an Axios interceptor.

---

## 🎫 Booking Flow

```text
Browse Events
      ↓
Select Event
      ↓
Check Seat Availability
      ↓
Book Event
      ↓
Booking Confirmation
      ↓
View Booking
```

---

## 👤 Profile Management

Users can:

* View their profile
* Update their name
* Upload a profile image
* Keep profile information synchronized with the database

Profile images are uploaded using **Cloudinary**.

---

## 📧 Password Reset

The project includes a password reset flow using:

```text
User requests password reset
          ↓
Backend generates reset token
          ↓
Reset email
          ↓
Mailtrap
          ↓
User opens reset link
          ↓
New password
```

---

## 🚀 Deployment

### Frontend

Deployed with **Vercel**

```text
https://event-booking-1opb.vercel.app/
```

### Backend

Deployed with **Render**

```text
https://event-booking-backend-8eg9.onrender.com
```

---

## ⚙️ Environment Variables

### Frontend

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### Backend

```env
DB_HOST=your_database_host
DB_PORT=5432
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret

MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password
```


---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/raihankabir1952/event-booking.git
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

### 3. Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on:

```text
http://localhost:4000
```

---

## 📸 Application Highlights

### 🏠 Home Page

Modern event discovery interface with responsive design.

### 🎟️ Event Booking

Users can browse events, check availability and book available seats.

### 👤 User Profile

Users can update their name and profile image.

### 🔐 Authentication

Secure registration and login using JWT authentication.

---

## 📌 Future Improvements

* 💳 Online Payment Integration
* 📩 Production Email Service
* ⭐ Event Reviews & Ratings
* ❤️ Favorite Events
* 🔔 Push Notifications
* 📊 Admin Dashboard
* 📈 Booking Analytics
* 🎫 Digital Ticket / QR Code

---

## 👨‍💻 Developer

**Raihan Kabir**

Computer Science & Engineering

### Connect With Me

* GitHub: https://github.com/raihankabir1952

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
