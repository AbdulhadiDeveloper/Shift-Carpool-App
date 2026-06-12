# Shift Carpool 🚗✨

Shift is a minimalist, full-stack mobile ridesharing application built with a focus on "Quiet Luxury." It allows users to seamlessly switch between **Driver** and **Rider** modes, offering a high-end, monochromatic experience for daily commutes.

## 🌟 Key Features

-   **Dual Mode Experience:** Toggle instantly between Driver (Route Publisher) and Rider (Route Finder) modes.
-   **Quiet Luxury UI:** High-fidelity "Bento Box" design system with glassmorphism overlays and tonal dark themes.
-   **Secure Authentication:** JWT-based auth with encrypted local session persistence.
-   **Atomic Reservations:** Real-time seat booking with race-condition protection.
-   **Journey Management:** Complete control over upcoming trips—drivers can edit route details/capacity, and riders can relinquish seats.
-   **WhatsApp Coordinator:** One-tap deep linking to coordinate pickups directly with drivers via WhatsApp.

---

## 🛠 Tech Stack & Versions

### Frontend (Mobile)
-   **Framework:** Expo SDK 54.0.0 (React Native 0.76.x)
-   **Navigation:** Expo Router v4 (File-based routing)
-   **State Management:** Redux Toolkit v2.5.1
-   **Styling:** NativeWind v4 (Tailwind CSS for React Native)
-   **Security:** expo-secure-store (AES-256 encryption)
-   **Icons:** @expo/vector-icons (Ionicons)

### Backend (API)
-   **Runtime:** Node.js v22.x
-   **Framework:** Express.js v5.2.1
-   **Database:** MongoDB Atlas (Mongoose ODM v9.6.3)
-   **Security:** JWT (jsonwebtoken v9.0.3) & bcryptjs v3.0.3
-   **Environment:** Vercel Serverless Functions

---

## 🚀 Getting Started

### 1. Backend Setup (Node.js)

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

### 2. Frontend Setup (Expo)

1.  Navigate to the mobile directory:
    ```bash
    cd mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Update the `API_URL` in `mobile/src/store/store.ts`:
    ```typescript
    const API_URL = 'http://YOUR_LOCAL_IP:3000/api'; // Or your Vercel URL
    ```
4.  Start the app:
    ```bash
    npx expo start
    ```
5.  Open the **Expo Go** app on your iOS/Android device and scan the QR code.

---

## 🧪 Testing

Both environments include Jest for automated testing.

-   **Backend:** `cd backend && npm test` (Includes MongoDB Memory Server tests)
-   **Frontend:** `cd mobile && npm test`

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
The backend uses a **Serverless Connection Guard** middleware to prevent race conditions during MongoDB connection cycles on Vercel. All routes (except Login/Register) are protected by a JWT Bearer token validation layer.
