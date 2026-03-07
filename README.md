# PopDrop 🚀

PopDrop is a premium community-driven platform designed for developers and designers to share, discover, and reuse high-quality web templates and UI components.

## 🌟 Project Purpose
PopDrop was built to bridge the gap between inspiration and implementation. It provides a curated space where creators can showcase their code and users can find vetted, modular templates for their projects. Whether you are a Designer looking for inspiration or a Developer looking for ready-to-use snippets, PopDrop serves as a central hub for web innovation.

## 🛠️ Technologies Used

### Backend
*   **Django (DRF):** The primary framework used to handle server-side logic, API management, and database operations.
*   **SimpleJWT:** Implemented for secure, token-based authentication and session management.
*   **Cloudinary:** Used for high-performance cloud storage of template previews and profile images.
*   **WhiteNoise:** Manages static file serving for optimized production performance.

### Frontend
*   **React (Vite):** A modern JavaScript library used to build a fast, reactive, and professional user interface.
*   **Tailwind CSS:** A utility-first CSS framework used for crafting the premium "Glassmorphism" UI and responsive layouts.
*   **React Router:** Handles seamless navigation across the single-page application.

### Database
*   **SQLite:** Used as the primary relational database to store user information, template metadata, and social interactions.

---

## ✨ Project Features

### 1. Template Gallery & Discovery
Users can browse a wide range of web templates categorized by style (e.g., Frontend, Backend). Each template features high-quality desktop and mobile previews, making it easy to see the design before using it.

### 2. Multi-Role User Profiles
PopDrop supports three distinct user roles: **Normal User**, **Developer**, and **Designer**. Each role comes with a unique public ID (e.g., `popdrop-dev-1001`) and specific profile customization options.

### 3. OTP-Based Authentication
To ensure security, PopDrop uses an email-based One-Time Password (OTP) system for user registration and verification, preventing bot accounts and ensuring authentic interactions.

### 4. Direct Code Interaction
Users can view the source code of any template and copy it with a single click. This streamlines the development process for users looking to integrate components quickly into their own projects.

### 5. Social & Feedback System
The platform encourages community engagement through:
*   **Likes & Ratings:** Users can like templates and rate them on a 5-star scale.
*   **Reviews:** Detailed feedback can be left on templates to help creators improve their work.
*   **Subscriptions:** Users can follow their favorite creators to receive updates on new uploads.

### 6. Team Application System
A dedicated module allows passionate community members to apply for the PopDrop core team directly through the platform by submitting their tech stack and professional resume.

---

## 📂 Project Structure

### Backend (`/backend`)
*   `api/`: Contains core business logic including User models, Profile management, Team applications, and Contact requests.
*   `post/`: Manages the Template (Post) ecosystem, including categories, likes, reviews, and subscription logic.
*   `backend/`: Root configuration folder containing `settings.py`, `urls.py`, and WSGI/ASGI setups.

### Frontend (`/frontend`)
*   `src/components/`: Reusable UI components such as Navbars, Modals, and Template Cards.
*   `src/pages/`: Main application views like the Home Page, Profile Dashboard, and Template Detail view.
*   `src/form/`: Specialized components for handling complex user inputs (Login, Signup, OTP).

---

## 📊 Database Models

*   **User:** Custom AUTH model using email as the unique identifier instead of a username.
*   **UserProfile:** Stores extended user data, verification status, category (Developer/Designer), and generated public IDs.
*   **Post (Template):** The central entity containing title, description, raw code, and Cloudinary image URLs.
*   **UserSubscription:** Manages the "Follower" relationship between users.
*   **PostLike / PostReview:** Records user interactions and feedback for specific templates.

---

## 🌊 How It Works (Flow)

1.  **Request:** A user performs an action in the React UI (e.g., clicking "Like" on a template).
2.  **API Call:** The Frontend sends an asynchronous HTTP request to the Django Backend, including a **JWT Bearer Token** for authentication.
3.  **Processing:** Django's REST framework validates the token and processes the logic (e.g., updating the like count in the database).
4.  **Database:** The SQLite database is updated with the new state.
5.  **Response:** The Backend sends a JSON response back to the UI.
6.  **Update:** The Frontend state is updated instantly, providing visual feedback to the user without a page reload.

---

## 🚀 Installation Guide

### Prerequisites
*   Python 3.10+
*   Node.js & npm

### Backend Setup
1.  Clone the repository: `git clone <repo-url>`
2.  Navigate to backend: `cd PopDrop/backend`
3.  Create virtual environment: `python -m venv env`
4.  Activate environment: `env\Scripts\activate` (Windows) or `source env/bin/activate` (Mac/Linux)
5.  Install dependencies: `pip install -r requirements.txt`
6.  Apply migrations: `python manage.py migrate`
7.  Run server: `python manage.py runserver`

### Frontend Setup
1.  Navigate to frontend: `cd PopDrop/frontend`
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`
4.  Access the app at: `http://localhost:5173`

---

## 🛡️ Security Implementation

*   **JWT Authentication:** Uses short-lived access tokens and long-lived refresh tokens with rotation for maximum security.
*   **OTP Verification:** Safeguards user accounts during sensitive actions like signup.
*   **CORS Protection:** Configured to allow requests only from verified frontend origins.
*   **Input Validation:** Strict validation at the serializer level ensures no malicious data enters the database.

---

## 🔮 Future Improvements
*   **Real-time Notifications:** Implementing WebSockets for instant alerts when a user gets a new follower or like.
*   **Pro Subscription:** Introducing a premium tier for exclusive, high-end templates.
*   **Live Preview:** Adding a sandboxed environment to interact with template code directly in the browser.
