# FinClosure — GenAI Financial Closure & Settlement Platform

> **Tagline:** "Closing Finances. Securing Futures."

FinClosure is an end-to-end full-stack GenAI platform designed to guide nominees and legal heirs through discovering unconfirmed financial assets, organizing document vaults, generating personalized claim checklists, tracking multi-step claim progress, and reaching financial closure after losing a loved one.

---

## 🌟 Key Features

1. **Deceased Person Profile Management**: Create and manage records specifying claimant roles (Nominee, Legal Heir, Both) and deceased details.
2. **Financial Asset Portfolio**: Categorize bank accounts, term deposits, insurance policies, investments, pensions, and digital assets.
3. **AI Asset Discovery Engine**: Scans text notes, emails, and document references to identify potential unconfirmed financial assets with evidence, confidence ratings, and recommended next actions.
4. **Document Vault & AI Analysis**: Upload death certificates, PAN/Aadhaar identity proofs, and policy bonds. AI parses dates, policy numbers, extracted names, and flags missing data.
5. **Personalized Claim Checklists**: Dynamically generates required document submission checklists based on asset category, institution, and claimant relationship.
6. **Visual Step-by-Step Claim Journey**: Track claim milestones (Review -> Collect Docs -> Fill Forms -> Submit -> Verification -> Settlement).
7. **FinClosure AI Assistant**: Contextual chat assistant answering questions based on the user's real deceased profile, assets, documents, and active claims.
8. **Real-Time Financial Closure Metric**: Dynamic score calculating total settlement progress.
9. **Audit Logging & Security**: Private document storage abstraction, JWT authentication, bcrypt password hashing, and audit trails.
10. **Hackathon One-Click Demo Mode**: Built-in sample scenario generator ("Rajesh Sharma & Ankit Sharma") for instant end-to-end demonstration.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS + Custom Glassmorphism System
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Bearer Interceptor

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT & bcryptjs
- **Validation**: Zod
- **File Uploads**: Multer + Storage Abstraction Layer (Cloudinary / Local Disk)
- **AI Service Abstraction**: Google Gemini (`@google/generative-ai`) with intelligent rule-based fallback provider.

---

## 📁 Project Architecture

```
FinClosure/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & MongoDB Atlas connection
│   │   ├── models/          # Mongoose models (User, Deceased, Asset, Document, Claim, etc.)
│   │   ├── services/        # AI abstraction (Gemini + Fallback), Storage, Audit
│   │   ├── controllers/     # REST API controllers
│   │   ├── routes/          # Express domain routes
│   │   ├── middleware/      # JWT auth, Multer upload, Error handler
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Layouts, Navbar, Footer, Sidebar, ProgressRing
│   │   ├── pages/           # Landing, Onboarding, Dashboard, Profile, Assets, Docs, Claims, AI
│   │   ├── context/         # AuthContext state manager
│   │   ├── services/        # Axios API clients
│   │   ├── types/           # TypeScript domain definitions
│   │   ├── App.tsx          # Router configuration
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

---

## ⚙️ Environment Variables Setup

Create `.env` inside `backend/` using the following format:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finclosure?retryWrites=true&w=majority
JWT_SECRET=finclosure_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d

# AI Service Configuration (gemini | fallback)
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here

# File Storage Configuration (local | cloudinary)
STORAGE_PROVIDER=local

# Frontend CORS
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=603616857504-gu4pobb6inbdhat3f5c7i22d9vv112hu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## 🔑 GOOGLE SIGN-IN SETUP

FinClosure supports secure server-side Google OAuth 2.0 / OpenID Connect authentication.

### 1. Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services** > **Credentials**.
3. Create a **Web Application** OAuth 2.0 Client ID (or use existing).
4. In **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   ```
5. In **Authorized redirect URIs**, add:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Under **OAuth consent screen**, set the Audience/User type appropriately (e.g. *External*).
   > **Note for Testing Mode**: If your Google Cloud OAuth app status is *Testing*, navigate to **OAuth consent screen > Test users** and add the specific Google email addresses intended to test FinClosure.

### 2. Local Environment Configuration

Add your Google Client Secret to `backend/.env`:

```env
GOOGLE_CLIENT_ID=603616857504-gu4pobb6inbdhat3f5c7i22d9vv112hu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

> ⚠️ **CRITICAL SECURITY REQUIREMENT**: `GOOGLE_CLIENT_SECRET` must **NEVER** be committed to Git repositories or included in frontend client code/Vite environment variables. It resides strictly in backend `.env`.

### 3. Testing Google Sign-In Flow

1. Start Backend: `cd backend && npm run dev`
2. Start Frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173/login` or `http://localhost:5173/register`
4. Click **"Continue with Google"**


---

## 🚀 Local Development Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend server runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application runs on `http://localhost:5173`.

---

## 🧪 Hackathon Demo Flow (End-to-End Test Scenario)

1. **Register/Login**: Register a new user account.
2. **Onboarding**: Complete the 4-step guided wizard for claimant role and deceased person info.
3. **Load Hackathon Demo**: Click **"Load Sample Scenario"** in the top right header to instantly populate "Rajesh Sharma" (Deceased), 4 assets, sample documents, and an active LIC claim.
4. **AI Asset Discovery**: Open the **Assets** tab, click **"Discover Assets with AI"**, and confirm potential assets.
5. **AI Document Understanding**: Open the **Documents** tab and click the **Sparkles icon** to run AI document parsing.
6. **Claim Visual Journey & Checklist**: Open **Claims Tracker** -> Open LIC Claim detail -> Toggle checklist items and steps.
7. **AI Assistant**: Ask questions in **FinClosure AI Assistant** chat ("What should I focus on today?").
8. **Financial Closure Progress**: Verify that the overall progress meter updates dynamically based on MongoDB data.

---

## 🔒 Security & Safety Principles

- User data is isolated; protected routes verify ownership for every resource.
- Passwords hashed with bcryptjs salt rounds.
- AI engine adheres to strict anti-fabrication rules and includes clear legal disclaimers.

---

## 📄 License
ISC License
