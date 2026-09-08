# DailyHire - Local Development Setup Guide

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **pnpm**
- **MongoDB** (Optional - if offline, the backend automatically uses an In-Memory fallback store).

---

### 2. Environment Configuration (`.env`)
Ensure your `.env` file in the project root contains:

```env
# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/dailyhire

# Server Configuration
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=dailyhire_jwt_secret_key_2026
```

---

### 3. Running the Backend Express Server (Port 5000)
Open Terminal 1:

```bash
npm run server
```

You will see:
```text
================================================
 DailyHire Backend running on http://localhost:5000
================================================
```

---

### 4. Running the Frontend Next.js App (Port 3000)
Open Terminal 2:

```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### Key Features Summary
* **Dual Role Support**: Employers (Customers) and Daily Wage Workers (Helpers).
* **Helper Discovery**: Location distance calculation, rating filters, trade profession cards, and Leaflet interactive map.
* **Worker KYC & Payouts**: Aadhaar/PAN ID verification and UPI/Bank account details.
* **Booking & Messaging**: Live status lifecycle (`pending` ➔ `confirmed` ➔ `completed`) and in-app chat.
* **Dual Database Mode**: Seamless MongoDB connection with automatic in-memory fallback if MongoDB is not running locally.
