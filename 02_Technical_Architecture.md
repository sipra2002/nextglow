# Technical Architecture
## GlowUp – Beauty & Skincare Website

---

## 1. Architecture Overview
The project uses a **3-tier client–server architecture** with a REST API.

```mermaid
flowchart LR
    A[Browser<br/>React + Bootstrap] -- HTTP / JSON --> B[Express.js REST API<br/>Node.js]
    B -- Prisma ORM --> C[(PostgreSQL)]
    B -. JWT verify .-> B
```

| Tier | Technology | Responsibility |
|---|---|---|
| Presentation | React, Bootstrap, CSS | UI, routing, forms, API calls |
| Application | Node.js, Express | Business logic, validation, auth |
| Data | PostgreSQL + Prisma | Storage and queries |

---

## 2. Folder Structure

```
glowup/
├── client/                         # React frontend
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── api/axios.js            # Axios instance + token interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── TipCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loader.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SkinAnalysis.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Routine.jsx
│   │   │   ├── Tips.jsx
│   │   │   ├── TipDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminTips.jsx
│   │   ├── styles/theme.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                         # Express backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/db.js            # Prisma client
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── skin.controller.js
│   │   │   ├── tip.controller.js
│   │   │   └── cart.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js             # verifyToken
│   │   │   ├── isAdmin.js
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── routes/                 # one file per module
│   │   ├── utils/skinScoring.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── docs/                           # these 5 md files
```

---

## 3. Database Design (Prisma Schema)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum SkinType {
  NORMAL
  DRY
  OILY
  COMBINATION
  SENSITIVE
}

model User {
  id                 Int          @id @default(autoincrement())
  name               String
  email              String       @unique
  password           String
  phone              String?
  role               Role         @default(USER)
  resetToken         String?
  resetTokenExpiry   DateTime?
  createdAt          DateTime     @default(now())
  skinProfile        SkinProfile?
  cart               Cart?
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
}

model Product {
  id          Int        @id @default(autoincrement())
  name        String
  description String
  price       Decimal    @db.Decimal(10, 2)
  imageUrl    String
  skinTypes   SkinType[]            // suitable skin types
  stock       Int        @default(100)
  featured    Boolean    @default(false)
  categoryId  Int
  category    Category   @relation(fields: [categoryId], references: [id])
  cartItems   CartItem[]
  createdAt   DateTime   @default(now())
}

model SkinProfile {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skinType  SkinType
  answers   Json
  updatedAt DateTime @updatedAt
}

model BeautyTip {
  id        Int      @id @default(autoincrement())
  title     String
  category  String                // Makeup | Haircare | Natural Skincare | Article
  content   String
  imageUrl  String?
  popular   Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Cart {
  id     Int        @id @default(autoincrement())
  userId Int        @unique
  user   User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  CartItem[]
}

model CartItem {
  id        Int     @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int     @default(1)
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([cartId, productId])
}
```

### Entity Relationships
```mermaid
erDiagram
    USER ||--o| SKINPROFILE : has
    USER ||--o| CART : owns
    CART ||--o{ CARTITEM : contains
    PRODUCT ||--o{ CARTITEM : "added as"
    CATEGORY ||--o{ PRODUCT : groups
```

---

## 4. REST API Design
Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/forgot-password` | Public | Generate reset token |
| POST | `/auth/reset-password` | Public | Set new password using token |

### User
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/me` | User | Get own profile |
| PUT | `/users/me` | User | Update name, phone |
| GET | `/users` | Admin | List all users |

### Categories and Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | List categories |
| GET | `/products` | Public | List; query: `search`, `category`, `skinType`, `featured` |
| GET | `/products/:id` | Public | Single product |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

### Skin Analysis
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/skin/analyze` | Public | Returns type, suggestions (saves if token present) |
| GET | `/skin/me` | User | Get saved skin profile |

### Beauty Tips
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/tips` | Public | List; query: `category`, `popular` |
| GET | `/tips/:id` | Public | Single tip |
| POST | `/tips` | Admin | Create |
| PUT | `/tips/:id` | Admin | Update |
| DELETE | `/tips/:id` | Admin | Delete |

### Cart
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/cart` | User | Get cart with items and total |
| POST | `/cart/items` | User | Add `{productId, quantity}` |
| PUT | `/cart/items/:id` | User | Change quantity |
| DELETE | `/cart/items/:id` | User | Remove item |
| DELETE | `/cart` | User | Clear cart |

### Standard Response Format
```json
// success
{ "success": true, "data": { } }

// error
{ "success": false, "message": "Email already registered" }
```

### HTTP Status Codes
`200` OK · `201` Created · `400` Validation error · `401` Unauthenticated · `403` Forbidden · `404` Not found · `409` Duplicate · `500` Server error

---

## 5. Skin Analysis Logic

Each answer adds points to one or more skin types. The highest score wins; a tie between oily and dry zones becomes **Combination**; strong irritation answers force **Sensitive**.

| Question | Option → points |
|---|---|
| How does your skin feel by midday? | Tight → Dry +2 · Shiny all over → Oily +2 · Shiny only T-zone → Combination +2 · Comfortable → Normal +2 |
| How large are your pores? | Barely visible → Dry/Normal · Large on nose and cheeks → Oily · Large only on nose → Combination |
| Does your skin flake or feel rough? | Often → Dry +2 · Never → Normal/Oily |
| Frequency of breakouts? | Often → Oily +2 · Only T-zone → Combination +1 |
| Does skin turn red or sting with new products? | Often → Sensitive +3 |
| Sun reaction? | Burns easily → Sensitive +1 |

```js
// server/src/utils/skinScoring.js (simplified)
function calculateSkinType(answers) {
  const score = { NORMAL: 0, DRY: 0, OILY: 0, COMBINATION: 0, SENSITIVE: 0 };
  // each answer object looks like: { DRY: 2 } or { OILY: 1, COMBINATION: 1 }
  Object.values(answers).forEach(points => {
    for (const type in points) score[type] += points[type];
  });
  if (score.SENSITIVE >= 3) return 'SENSITIVE';
  return Object.keys(score).reduce((a, b) => (score[a] >= score[b] ? a : b));
}
module.exports = { calculateSkinType };
```

---

## 6. Frontend Architecture

### Routing (React Router)
| Path | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/login`, `/register` | Auth | Public |
| `/forgot-password`, `/reset-password/:token` | Password reset | Public |
| `/profile` | Profile | User |
| `/skin-analysis` | Quiz and result | Public |
| `/products` | Products with search and categories | Public |
| `/routine` | Daily routine | Public |
| `/tips`, `/tips/:id` | Beauty tips | Public |
| `/cart` | Cart | User |
| `/admin`, `/admin/users`, `/admin/products`, `/admin/tips` | Admin | Admin |

### State Management
- `AuthContext`: user, token, `login()`, `logout()`; token kept in `localStorage`.
- `CartContext`: cart items, count (shown in navbar badge), `addToCart()`, `removeFromCart()`.
- Page-level data uses `useState` + `useEffect` with Axios.

### Reusable Components
`Navbar`, `Footer`, `ProductCard`, `TipCard`, `SearchBar`, `CategoryFilter`, `ProtectedRoute`, `AdminRoute`, `Loader`, `AlertMessage`, `ConfirmModal`.

### Responsive Strategy
Bootstrap grid: `col-12 col-sm-6 col-lg-3` for product cards (1 column on phone, 2 on tablet, 4 on desktop). Navbar collapses to a hamburger on small screens.

---

## 7. Backend Architecture

```
Request → Route → Middleware (auth / role / validate) → Controller → Prisma → DB
                                                     ↓
                                              errorHandler → JSON response
```

- **Routes** define URLs.
- **Middleware** handles JWT check, admin check, validation.
- **Controllers** contain the business logic.
- **Prisma client** handles all database access.
- **Central error handler** returns consistent JSON.

---

## 8. Environment Variables

`server/.env`
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/glowup?schema=public"
JWT_SECRET="change_this_to_a_long_random_string"
JWT_EXPIRES_IN="7d"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

`client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 9. Sample Seed Data
- 1 admin: `admin@glowup.com` / `Admin@123` (password hashed in seed)
- 5 categories
- 15 products (3 per category) with image URLs, descriptions and prices
- 8 beauty tips across Makeup, Haircare, Natural Skincare and Articles

---

## 10. Installation and Run Steps (Summary)

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE glowup;"

# 2. Backend
cd server
npm install
# edit .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev            # http://localhost:5000

# 3. Frontend (new terminal)
cd client
npm install
npm run dev            # http://localhost:5173
```

Add this to `server/package.json`:
```json
"prisma": { "seed": "node prisma/seed.js" },
"scripts": { "dev": "nodemon server.js", "start": "node server.js" }
```

---

## 11. Testing Plan

| Type | Tool | Example |
|---|---|---|
| API testing | Postman / Thunder Client | Register, login, CRUD products |
| UI testing | Manual | Quiz, cart, admin forms |
| Responsive testing | Chrome DevTools | iPhone SE, iPad, 1366px laptop |
| Access control | Manual | User tries `/admin` → redirected |
