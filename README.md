# 🌸 GlowUp – Beauty & Skincare Web Application
> Full-Stack Web Application

GlowUp is a beauty and skincare platform designed with an elegant blush pink, white, and light beige aesthetic. It features an intelligent **Skin Analysis Quiz**, a curated **Skincare Catalogue** (in Indian Rupees ₹), **Daily Skincare Ritual Guides** (Morning & Night), **Beauty Tips & Tutorials**, a database-backed **Shopping Bag**, and a complete **Admin Management Portal**.

---

## 📸 Core Features

1. **Home Experience**:
   - Hero banner with skincare imagery and call-to-action
   - Clean beauty values (Cruelty-Free, Dermatologist Verified, Clean Actives)
   - Featured products carousel & popular beauty editorials
2. **AI Skin Diagnostic Quiz**:
   - 7 clinical questions analyzing sebum, tightness, pores, and sensitivity
   - Diagnostic mapping to: `Normal`, `Dry`, `Oily`, `Combination`, or `Sensitive` skin
   - Tailored barrier advice (Do's, Don'ts, Active Ingredients like Niacinamide, BHA, Ceramides)
   - Dynamic product filtering matching the diagnosed skin type
   - Automatic profile persistence for logged-in users
3. **Products Catalogue**:
   - 5 Skincare Categories: *Face Wash, Moisturizer, Sunscreen, Serum, Lip Care*
   - Real-time debounced search by name or description
   - Multi-skin type filter pills & sorting (Featured, Price: Low to High, High to Low, Name)
   - Product cards with pricing in ₹ INR and "Add to Cart"
4. **Daily Skincare Routine**:
   - Interactive Morning (Defense) vs. Night (Recovery) step-by-step guides
   - Step sequencing from thinnest molecular weight to thickest
   - Direct category links to assemble the routine
5. **Beauty Tips & Tutorials**:
   - Categorized by *Makeup, Haircare, Natural Skincare, Articles*
   - Detailed reader view with estimated reading times and related articles
6. **Shopping Bag & Checkout**:
   - Quantity adjustments (+/- stepper), line totals, and remove item
   - Free shipping progress bar (Free shipping above ₹999)
   - Demonstration checkout modal with simulated confirmation
7. **Authentication & Profile**:
   - JWT authentication with secure bcrypt password hashing
   - Forgot Password with simulated dev token preview & token-based password reset
   - Profile management with saved skin diagnosis history
8. **Administrator Portal**:
   - Dashboard analytics (Users, Active Products, Publications, Health status)
   - Product inventory manager (Create, Edit, Delete modals with image preview)
   - Beauty tips publisher (Create, Edit, Delete modals)
   - Registered customer directory (Read-only view with diagnosed skin types)

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | Component architecture, responsive design |
| **Styling** | Bootstrap 5, Bootstrap Icons, Custom CSS | Custom Pink & Beige theme (`theme.css`), Google Fonts (`Playfair Display` + `Poppins`) |
| **Routing & State** | React Router v7, Context API | AuthContext, CartContext |
| **HTTP Client** | Axios | Automatic JWT Authorization interceptor |
| **Backend** | Node.js, Express.js | REST API, Helmet, CORS, Rate-Limiting |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) via Prisma | Schema, seed data, relations |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | Role-Based Access Control (`USER`, `ADMIN`) |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+ and npm installed

### 1. Backend Server
```bash
cd server
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Demo Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@glowup.com` | `Admin@123` | Full access + Admin Portal CRUD |
| **Customer** | `pooja@glowup.com` | `User@123` | Cart, Profile, Saved Skin Diagnosis |

*(Both accounts are pre-seeded and accessible via one-click demo buttons on the Sign In page!)*

---

## 📂 Project Structure

```
nextglow1/
├── client/                     # React Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with JWT interceptor
│   │   ├── components/         # Navbar, Footer, ProductCard, TipCard, SearchBar, ProtectedRoute
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Home, SkinAnalysis, Products, Routine, Tips, TipDetail, Cart, Profile, Auth
│   │   │   └── admin/          # Dashboard, AdminProducts, AdminTips, AdminUsers
│   │   ├── styles/theme.css    # GlowUp custom pink & beige design system
│   │   ├── App.jsx             # Routes and layout
│   │   └── main.jsx
├── server/                     # Express Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Active Prisma database schema
│   │   ├── schema.postgresql.prisma # PostgreSQL schema for final submission
│   │   └── seed.js             # Seed data (Admin, Users, 15 Products, 8 Tips)
│   ├── src/
│   │   ├── config/db.js        # Prisma client
│   │   ├── controllers/        # auth, user, product, category, skin, tip, cart controllers
│   │   ├── middleware/         # auth (verifyToken), isAdmin, validate, errorHandler
│   │   ├── routes/             # REST routes
│   │   ├── utils/skinScoring.js# Skin analysis diagnosis algorithm
│   │   └── app.js              # Express app setup
│   └── server.js               # Entrypoint (Port 5000)
└── README.md
```
