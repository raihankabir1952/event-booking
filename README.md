<div align="center">

# 🎟️ EventFlow

### A Modern Full-Stack Event Booking Platform

Discover events, check seat availability, book your favorite events, and manage your profile through a modern, responsive web application.

<br />

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-EventFlow-blue?style=for-the-badge)](https://event-booking-1opb.vercel.app/)
[![GitHub](https://img.shields.io/badge/💻%20GitHub-Repository-black?style=for-the-badge\&logo=github)](https://github.com/raihankabir1952/event-booking)

<br />

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,nestjs,nodejs,postgres,tailwind,vercel,render,git,github" />

</div>

---

## 🌐 Live Application

### 🚀 [Visit EventFlow](https://event-booking-1opb.vercel.app/)

The application is deployed with a live frontend and backend.

| Service       | Technology       | Status        |
| ------------- | ---------------- | ------------- |
| Frontend      | Next.js + Vercel | 🟢 Live       |
| Backend       | NestJS + Render  | 🟢 Live       |
| Database      | PostgreSQL       | 🟢 Connected  |
| Image Storage | Cloudinary       | 🟢 Connected  |
| Email Testing | Mailtrap         | 🟢 Configured |

---

# ✨ Overview

**EventFlow** is a full-stack event booking platform designed to provide a smooth experience for discovering and booking events.

Users can create an account, browse available events, check seat availability, make bookings, manage their profile, upload a profile image, and securely authenticate using JWT.

The project was built to practice and demonstrate modern **frontend development, REST API integration, authentication, database management, and full-stack deployment**.

---

# 🚀 Key Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication

* User registration
* Secure login
* JWT authentication
* Protected routes
* Session handling
* Password reset flow

</td>

<td width="50%">

### 🎫 Event Booking

* Browse events
* Event details
* Seat availability
* Date filtering
* Location filtering
* One-click booking

</td>
</tr>

<tr>
<td width="50%">

### 👤 User Profile

* View profile
* Update name
* Upload profile image
* Cloudinary integration
* Persistent user information

</td>

<td width="50%">

### ⚡ User Experience

* Responsive design
* Loading states
* Toast notifications
* Form validation
* Error handling
* Clean modern UI

</td>
</tr>
</table>

---

# 🛠️ Tech Stack

## Frontend

<p>
<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" />
</p>

| Technology         | Purpose               |
| ------------------ | --------------------- |
| **Next.js**        | React framework       |
| **React**          | UI development        |
| **TypeScript**     | Type-safe development |
| **Tailwind CSS**   | Styling               |
| **Axios**          | API communication     |
| **React Toastify** | Notifications         |
| **Lucide Icons**   | UI icons              |

---

## Backend

<p>
<img src="https://skillicons.dev/icons?i=nestjs,nodejs,ts" />
</p>

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| **NestJS**     | Backend framework             |
| **Node.js**    | Runtime environment           |
| **TypeScript** | Type-safe backend development |
| **TypeORM**    | Database ORM                  |
| **JWT**        | Authentication                |
| **REST API**   | Client-server communication   |

---

## Database & Services

<p>
<img src="https://skillicons.dev/icons?i=postgres" />
</p>

| Service        | Purpose                      |
| -------------- | ---------------------------- |
| **PostgreSQL** | Application database         |
| **Cloudinary** | Profile image storage        |
| **Mailtrap**   | Email/password-reset testing |

---

## Deployment & Development

<p>
<img src="https://skillicons.dev/icons?i=vercel,render,git,github,postman" />
</p>

* **Vercel** → Frontend deployment
* **Render** → Backend deployment
* **Git & GitHub** → Version control
* **Postman** → API testing

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         │     Web Browser      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Next.js         │
                         │      Frontend        │
                         │       Vercel         │
                         └──────────┬───────────┘
                                    │
                              REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       NestJS         │
                         │       Backend        │
                         │       Render         │
                         └──────────┬───────────┘
                                    │
                              TypeORM
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     PostgreSQL       │
                         │       Database       │
                         └──────────────────────┘

                ┌─────────────────┐
                │    Cloudinary   │
                │ Profile Images  │
                └─────────────────┘

                ┌─────────────────┐
                │     Mailtrap    │
                │   Email Testing │
                └─────────────────┘
```

---

# 🔐 Authentication Flow

EventFlow uses **JWT-based authentication**.

```text
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       ▼
 Register / Login
       │
       ▼
┌──────────────┐
│ NestJS Auth  │
│   Service    │
└──────┬───────┘
       │
       ▼
 JWT Access Token
       │
       ▼
┌──────────────┐
│   Frontend   │
│  localStorage│
└──────┬───────┘
       │
       ▼
 Protected API Requests
```

An Axios interceptor automatically attaches the JWT token to authenticated API requests.

---

# 🎟️ Booking Flow

```text
       Browse Events
             │
             ▼
        Select Event
             │
             ▼
    Check Seat Availability
             │
             ▼
       Book Event
             │
             ▼
    Booking Confirmation
             │
             ▼
       View Booking
```

---

# 👤 Profile Management

Authenticated users can manage their account through the profile section.

### Available actions

* View account information
* Update full name
* Upload profile image
* Persist profile changes
* Display profile image across the application

Profile images are uploaded through **Cloudinary**, while the image URL is stored in the database.

---

# 📧 Password Reset

The project includes an email-based password reset workflow.

```text
User requests password reset
            │
            ▼
Backend generates reset token
            │
            ▼
Reset email generated
            │
            ▼
          Mailtrap
            │
            ▼
User opens reset link
            │
            ▼
     Creates new password
```

---

# 📂 Project Structure

```text
event-booking/
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── profile/
│   │   ├── events/
│   │   └── ...
│   │
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
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# ⚙️ Environment Variables

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

# 💻 Run Locally

## 1. Clone the repository

```bash
git clone https://github.com/raihankabir1952/event-booking.git

cd event-booking
```

---

## 2. Start Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 3. Start Backend

Open another terminal:

```bash
cd backend

npm install

npm run start:dev
```

Backend:

```text
http://localhost:4000
```

---

# 🚀 Deployment

## Frontend

The Next.js frontend is deployed on **Vercel**.

🔗 https://event-booking-1opb.vercel.app/

## Backend

The NestJS backend is deployed on **Render**.

🔗 https://event-booking-backend-8eg9.onrender.com

---

# 📊 Project Highlights

| Area             | Implementation     |
| ---------------- | ------------------ |
| Frontend         | Next.js App Router |
| UI               | Tailwind CSS       |
| Language         | TypeScript         |
| Backend          | NestJS             |
| Database         | PostgreSQL         |
| ORM              | TypeORM            |
| Authentication   | JWT                |
| API Client       | Axios              |
| Image Upload     | Cloudinary         |
| Email Testing    | Mailtrap           |
| Frontend Hosting | Vercel             |
| Backend Hosting  | Render             |

---

# 🔮 Future Improvements

* 💳 Online payment integration
* 📱 Mobile application
* ⭐ Event reviews and ratings
* ❤️ Favorite events
* 🔔 Push notifications
* 📊 Admin dashboard
* 📈 Booking analytics
* 🎫 QR-code based digital tickets
* 📩 Production email service
* 🧾 Downloadable booking receipts

---

# 👨‍💻 Developer

<div align="center">

### Raihan Kabir

Computer Science & Engineering

<br />

[![GitHub](https://img.shields.io/badge/GitHub-raihankabir1952-black?style=for-the-badge\&logo=github)](https://github.com/raihankabir1952)

</div>

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

**Built with ❤️ using Next.js, NestJS, TypeScript & PostgreSQL**

</div>
