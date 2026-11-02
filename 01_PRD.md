# Project Requirement Document (PRD)
## GlowUp – Beauty & Skincare Website (MCA College Project)

| Item | Detail |
|---|---|
| Project name | GlowUp Beauty & Skincare |
| Type | Full-stack web application |
| Stack | React.js, Bootstrap, Node.js, Express.js, PostgreSQL, Prisma ORM |
| Audience | Teenagers and adults interested in skincare and beauty |
| Version | 1.0 |

---

## 1. Introduction

### 1.1 Purpose
Build a simple, attractive and fully functional beauty and skincare website where users can analyse their skin type, browse and buy skincare products, follow daily routines and read beauty tips. An admin can manage products, users and tips.

### 1.2 Objectives
- Help users identify their skin type through a short questionnaire.
- Recommend suitable skincare products and routines.
- Provide a working shopping flow (search, add to cart, remove, view cart).
- Give admins a dashboard to manage the catalogue and content.
- Deliver a responsive UI in a pink, white and light beige theme.

### 1.3 Scope
**In scope:** the 8 modules listed in section 3.
**Out of scope (to keep the project simple):** online payment gateway, order tracking, email delivery of real messages (password reset is simulated/logged), product reviews, multi-vendor support.

---

## 2. User Roles

| Role | Description | Permissions |
|---|---|---|
| Guest | Not logged in | View home, products, tips, routines; take skin quiz (result not saved) |
| User | Registered customer | All guest rights + save skin profile, manage cart, edit profile |
| Admin | Site manager | All user rights + manage users (view), products CRUD, beauty tips CRUD |

---

## 3. Functional Requirements

### FR-1 Home Page
- Hero banner with skincare imagery and call-to-action.
- Welcome section about the brand.
- Featured products (loaded from the API).
- Popular beauty tips (loaded from the API).
- Navigation bar and footer on every page.

### FR-2 Authentication and Profile
| ID | Requirement |
|---|---|
| FR-2.1 | Register with name, email, password (validated) |
| FR-2.2 | Login with email and password; JWT issued |
| FR-2.3 | Logout clears token on client |
| FR-2.4 | Profile page shows and updates name, phone; shows saved skin type |
| FR-2.5 | Forgot password: user enters email, receives a reset token (shown/logged in dev mode), then sets a new password |
| FR-2.6 | Admin login uses the same login form; role decides redirect |

### FR-3 Skin Analysis
- 7–8 multiple-choice questions (oiliness, tightness, shine, pores, redness, reaction to products, etc.).
- Scoring logic maps answers to: **Normal, Dry, Oily, Combination, Sensitive**.
- Result page shows skin type, description and basic suggestions.
- Logged-in users have the result saved to `SkinProfiles`.
- Recommended products are filtered by skin type.

### FR-4 Product Recommendations and Categories
Categories: Face Wash, Moisturizer, Sunscreen, Serum, Lip Care.
Each product shows image, name, description and price (INR).

### FR-5 Daily Skincare Routine
- Morning routine: cleanse → tone → serum → moisturise → sunscreen.
- Night routine: remove makeup → cleanse → serum → moisturise → lip care.
- Simple tips section. Tabs switch between morning and night.

### FR-6 Beauty Tips and Tutorials
- Categories: Makeup, Haircare, Natural Skincare, Articles.
- List page with category filter and a detail view.
- Content stored in `BeautyTips` and managed by admin.

### FR-7 Shopping
| ID | Requirement |
|---|---|
| FR-7.1 | View all products with category filter |
| FR-7.2 | Search by product name or description |
| FR-7.3 | Add to cart (login required) |
| FR-7.4 | Remove item and change quantity |
| FR-7.5 | View cart with line totals and grand total |

### FR-8 Admin Dashboard
- Dashboard summary: total users, products, tips.
- Users: list registered users (read only).
- Products: add, edit, delete.
- Beauty tips: add, edit, delete.

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Usability | Clean, simple navigation; maximum 3 clicks to any feature |
| Responsiveness | Works on mobile (≥360px), tablet and desktop |
| Performance | Pages load in under 3 seconds on a normal connection |
| Security | Hashed passwords, JWT, role-based access, validation (see Security doc) |
| Maintainability | Separate `client` and `server` folders, reusable components, comments |
| Compatibility | Latest Chrome, Edge, Firefox, Safari |
| Reliability | Friendly error messages; API returns consistent JSON errors |

---

## 5. Design Requirements

| Element | Value |
|---|---|
| Primary colour | Pink `#E91E63` / soft pink `#F8BBD0` |
| Background | White `#FFFFFF` |
| Secondary background | Light beige `#F5EBE0` |
| Text | Dark grey `#3A3A3A` |
| Headings font | Playfair Display (elegant serif) |
| Body font | Poppins or Lato |
| Components | Rounded cards, soft shadows, pill buttons, hover zoom on images |

---

## 6. Database Requirements
Tables: **Users, Products, Categories, SkinProfiles, BeautyTips, Cart, CartItems** (full schema in the Technical Architecture document).

---

## 7. Assumptions and Constraints
- Product images use free stock URLs (Unsplash) or local files in `client/public/images`.
- Prices are shown in Indian Rupees (₹).
- Project is run locally for demonstration.
- Sample data is loaded via a Prisma seed script.

---

## 8. Acceptance Criteria
- [ ] A new user can register, log in and log out.
- [ ] Skin quiz returns one of the 5 skin types and saves it for logged-in users.
- [ ] Products display in all 5 categories with image, name, description and price.
- [ ] Search returns matching products.
- [ ] Cart add, remove and view work and persist in the database.
- [ ] Admin can add, edit and delete products and tips.
- [ ] Normal users cannot open admin pages or APIs.
- [ ] Layout works on mobile, tablet and desktop.

---

## 9. Project Deliverables
1. Source code (`client/` and `server/`)
2. PostgreSQL schema via Prisma migrations and seed data
3. Documentation (these 5 `.md` files)
4. README with installation steps
5. Demo with screenshots

---

## 10. Suggested Timeline (6 weeks)

| Week | Work |
|---|---|
| 1 | Requirements, design, database schema, project setup |
| 2 | Auth APIs and pages, profile |
| 3 | Products, categories, search, admin product CRUD |
| 4 | Cart, skin analysis, routines |
| 5 | Beauty tips, admin tips and users, styling |
| 6 | Testing, bug fixing, documentation, presentation |
