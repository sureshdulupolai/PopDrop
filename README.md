# 🚀 PopDrop — Open-Source UI Template & Creator Platform

**PopDrop** is an open-source, developer-focused platform built with **Django REST Framework** and **React** that allows creators to publish reusable UI templates and code snippets while enabling users to explore, preview, rate, like, and copy them.

It is designed for **frontend developers** who want ready-to-use components and **creators** who want visibility, followers, and feedback — all in a clean, scalable system.

---

## ✨ Core Highlights

- 🔓 Open-source & developer-friendly
- 🧩 Reusable UI templates (Frontend + Backend supported)
- 👨‍💻 Creator subscription system
- ⭐ Ratings, likes, views & copy tracking
- 🖥️ Desktop & 📱 Mobile UI previews
- 🔐 Secure authentication with JWT + OTP

---

## 👤 User System & Authentication

### 🔐 Custom User Model
- Login using **email**
- Fully custom `User` and `UserProfile` models
- User categories:
  - Normal User
  - Developer
  - Designer

### 🔑 Authentication Flow
- Signup with **email + OTP verification**
- JWT-based authentication (access & refresh tokens)
- OTP expires after **5 minutes**
- Blocked users cannot log in

### 🛡️ Developer Privileges
- Developers are:
  - Automatically verified
  - Granted admin panel access
  - Allowed to upload templates

---

## 🧑‍💼 Profile Management

- Editable profile fields:
  - Full name, mobile number, category
  - Profile image upload
- ⏳ **Profile update cooldown**
  - Updates allowed once every **2 hours**
- Profile images served as absolute URLs

---

## 📦 Template (Post) System

### 🧩 Upload Templates
Developers can upload templates with:
- Title & description
- Category
- Complete code content
- Desktop UI preview image
- Mobile UI preview image
- Visibility & approval control

### 📊 Template Metrics
Each template tracks:
- 👀 View count
- 📋 Copy count
- ❤️ Like count
- ⭐ Average rating

---

## 🗂️ Categories

- Category-wise template listing
- Slug-based filtering
- Each category displays total template count

---

## 🔍 Browse & Search

- Public access (no login required)
- Search by title or description
- Filter templates by category

---

## ⭐ Rating & Review System

- Authenticated users can:
  - Rate templates (1–5 stars)
  - Update their rating
- One rating per user per template
- Average rating calculated dynamically

---

## ❤️ Like System

- Like / Unlike templates
- Like count updates in real time
- Duplicate likes prevented

---

## 📋 Copy Tracking

- Copy button triggers backend counter
- Helps track template popularity

---

## 👥 Creator Subscription System

- Users can:
  - Subscribe / Unsubscribe to creators
- Creator data includes:
  - Followers count
  - Verification status
  - Profile image

---

## 💬 Platform Reviews (Customer Reviews)

- Users can submit **one review** for PopDrop
- Review includes:
  - Short text (max 150 characters)
  - Star rating
- Users can delete their own review
- Reviews ordered by latest first

---

## 🧠 Backend Design Highlights

- Optimized queries using:
  - `select_related`
  - `annotate`
  - Database indexes
- SEO-friendly slug generation
- Clean separation of concerns:
  - Authentication
  - Templates
  - Reviews
  - Subscriptions

---

## 🛠️ Tech Stack

### Backend
- Django
- Django REST Framework
- SimpleJWT
- SQLite (Development)

### Frontend
- React
- Bootstrap
- Axios

### Features Used
- OTP-based email verification
- Multipart file uploads
- Custom permissions
- Serializer method fields
- Slug-based routing

---

## 🚧 Project Status

**Active Development** 🛠️

Planned Enhancements:
- Public creator profiles
- Paid subscriptions
- Template collections
- Downloadable template bundles
- Admin moderation dashboard

---

## 📂 Repository

👉 https://github.com/sureshdulupolai/PopDrop
