# 💼 Appointment Booking System

A powerful and modern full-stack appointment booking platform designed for seamless scheduling between clients and service providers. Built with the **MERN stack**, the system offers robust authentication, real-time communication, intuitive UI, smart search, and integrated analytics — everything needed to run a professional service-based platform.

---

## ✨ Features

🔐 JWT and OAuth2.0 based authentication system for secure and flexible access control across clients and service providers  
💳 Stripe integration for secure and reliable online payments  
🖼️ Multer-powered file upload functionality for handling profile pictures, service documents, and other media files  
🎨 Tailwind CSS used for responsive and modern styling with a sleek, mobile-friendly interface  
🗺️ Interactive map-based address selection using Leaflet and OpenStreetMap for accurate location picking  
💬 Real-time chat functionality between service providers and clients using Socket.io  
🔍 Fuzzy search implemented with Fuse.js to quickly find services or professionals with smart relevance  
📊 Business analytics dashboard for service providers to track appointments, earnings, and user engagement  
📧 Email notifications for appointment confirmations, reminders, and updates using Nodemailer and BullMQ queue management  
🧱 Scalable and modular backend architecture built with Node.js and Express.js, connected to MongoDB for robust data handling

---

## 🛠️ Tech Stack

### 🖥️ Frontend  
⚛️ React.js with Hooks and Context API  
🎨 Tailwind CSS for styling  
🗺️ Leaflet.js for map rendering  
🔍 Fuse.js for fuzzy search  
📡 Socket.io client for real-time communication

### 🗄️ Backend  
🟢 Node.js and Express.js  
🍃 MongoDB with Mongoose  
🔐 JWT and OAuth2.0 for authentication  
💳 Stripe API for payment processing  
📁 Multer for file handling  
📡 Socket.io server for chat  
📬 BullMQ for job queues and background tasks  
📨 Nodemailer for transactional emails

---

## 📦 Modules

### 🔐 Authentication  
Secure login and registration using JWT tokens  
OAuth2.0 login with Google for both clients and providers  
Role-based access control to separate client and provider workflows

### 📅 Booking System  
Clients can browse services, select a provider, and schedule appointments  
Providers can manage availability, confirm bookings, and track upcoming schedules

### 💬 Chat System  
Instant messaging between clients and providers  
Helps coordinate appointments and resolve queries in real-time

### 💳 Payment Gateway  
Stripe integration for smooth and secure transactions  
Invoices generated automatically for completed bookings

### 📍 Location Picker  
Leaflet and OpenStreetMap integration to let users select addresses from a live map  
Improves accuracy in service delivery and route planning

### 📊 Dashboard and Analytics  
Providers get visual insights into booking trends, earnings, and customer activity  
Helps optimize service delivery and business strategy

### 📬 Notifications and Background Jobs  
Email notifications sent for booking confirmations, cancellations, and reminders  
Handled asynchronously using BullMQ queues for reliability and performance

### 🔍 Search and Discovery  
Fuzzy search using Fuse.js to help users find services and professionals even with typos or partial matches

---

## 🚀 Getting Started

🔁 Clone the repository

```bash
git clone https://github.com/Hymanshu-jha/Appointment-Booking-System.git
cd Appointment-Booking-System
