# Shift Carpool 🚗✨

Shift is a minimalist, full-stack ridesharing web application built with a focus on "Quiet Luxury." It allows users to seamlessly switch between **Driver** and **Rider** modes, offering a high-end, monochromatic experience for daily commutes.

## 🌟 Key Features

-   **Dual Mode Experience:** Toggle instantly between Driver (Route Publisher) and Rider (Route Finder) modes.
-   **Quiet Luxury UI:** High-fidelity "Bento Box" design system with glassmorphism overlays and tonal dark themes.
-   **Secure Authentication:** JWT-based auth with encrypted local session persistence.
-   **Atomic Reservations:** Real-time seat booking with race-condition protection.
-   **Journey Management:** Complete control over upcoming trips—drivers can complete or cancel routes, and riders can relinquish seats.
-   **Dynamic Rating System:** Built-in passenger-to-driver rating system that calculates rolling averages dynamically.
-   **WhatsApp Coordinator:** One-tap deep linking to coordinate pickups directly with drivers via WhatsApp or Phone call.

---

## 🛠 Tech Stack & Versions

### Frontend (Website)
-   **Framework:** React v19.2 (Bootstrapped with Vite v8)
-   **Navigation:** React Router DOM v7
-   **State & Forms:** React Hook Form + Zod Schema Validation
-   **Styling:** Tailwind CSS v4
-   **UI Components:** Lucide React (Icons), Sonner (Toasts)
-   **HTTP Client:** Axios (with Interceptors for JWT auth)

### Frontend (Mobile)
-   **Framework:** Expo SDK 54.0.0 (React Native 0.76.x)
-   **Navigation:** Expo Router v4 (File-based routing)
-   **State Management:** Redux Toolkit v2.5.1
-   **Styling:** NativeWind v4 (Tailwind CSS for React Native)
-   **Security:** expo-secure-store (AES-256 encryption)
-   **Icons:** @expo/vector-icons (Ionicons)

### Backend (API)
-   **Runtime:** Node.js v22.x
-   **Framework:** Express.js v5.2
-   **Database:** MongoDB Atlas (Mongoose ODM v9.6)
-   **Security:** JWT (jsonwebtoken) & bcryptjs
-   **Validation:** Zod (Strict Payload Schemas)
-   **Environment:** Vercel Serverless Functions

---

## 🚀 Getting Started

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` root:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup (Website)

1.  Navigate to the website directory:
    ```bash
    cd Website
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Website/` root:
    ```env
    VITE_API_URL=http://localhost:3000
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).

### 3. Frontend Setup (Mobile / Expo)

1.  Navigate to the mobile directory:
    ```bash
    cd mobile
    ```
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Create a `.env` file in the `mobile/` root:
    ```env
    EXPO_PUBLIC_API_URL = 'http://YOUR_LOCAL_IP:3000/api'; // Or your Vercel URL
    ```
4.  Start the app in web:
    ```bash
    npx expo start
    ```
5.  Start the app in expo go app:
    ```bash
    npx expo start --tunnel --clear
    ```
6.  Open the **Expo Go** app on your iOS/Android device and scan the QR code.

---

## 🧪 Testing

Both environments include Jest for automated testing.

-   **Backend:** `cd backend && npx jest` (Includes MongoDB Memory Server and Supertest integration tests)
-   **Frontend:** `cd Website && npm test`

---

## 📐 Design Philosophy (Quiet Luxury)
Shift adheres to a strict monochromatic palette:
-   **Background:** `#141313` (Deep Charcoal)
-   **Primary:** `#FFFFFF` (Pure White)
-   **Surface:** `#1C1B1B` (Elevated layers)
-   **Typography:** High-contrast sans-serif with tracked-out labels.
-   **Components:** 16px-24px corner radii (Bento-style).

---

## 🔒 Security Notice
The backend relies on strict `Zod` validation schemas for every endpoint. All routes (except Login/Register) are protected by a JWT Bearer token validation layer. Atomic updates (`findOneAndUpdate`) ensure no two passengers can book the same seat at the exact same millisecond.
