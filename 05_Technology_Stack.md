# Technology Stack
## GlowUp – Beauty & Skincare Website

---

## 1. Stack at a Glance

```mermaid
flowchart LR
    subgraph Frontend
        A[React.js + Vite]
        B[Bootstrap 5]
        C[HTML5 + CSS3]
        D[React Router]
        E[Axios]
    end
    subgraph Backend
        F[Node.js]
        G[Express.js]
        H[JWT + bcrypt]
        I[express-validator]
    end
    subgraph Data
        J[Prisma ORM]
        K[(PostgreSQL)]
    end
    A --> G --> J --> K
```

| Layer | Technology | Purpose |
|---|---|---|
| Frontend library | React.js 18 | Component-based UI |
| Build tool | Vite | Fast dev server and build |
| Styling | HTML5, CSS3, Bootstrap 5 | Layout, responsive grid, custom pink theme |
| Routing | React Router v6 | Page navigation |
| HTTP client | Axios | API calls with token interceptor |
| Backend runtime | Node.js 18+ | JavaScript on the server |
| Backend framework | Express.js 4 | REST API |
| Database | PostgreSQL 14+ | Relational storage |
| ORM | Prisma | Schema, migrations, type-safe queries |
| Auth | jsonwebtoken, bcryptjs | Token login and password hashing |
| Validation | express-validator | Request validation |
| Security | helmet, cors, express-rate-limit | HTTP hardening |
| Dev tools | nodemon, dotenv, morgan | Auto restart, env config, logging |
| API testing | Postman / Thunder Client | Test endpoints |
| Version control | Git + GitHub | Source management |
| Editor | VS Code | Development |

---

## 2. Frontend Technologies

### 2.1 React.js
- Reusable components (`ProductCard`, `Navbar`, ...).
- Hooks: `useState`, `useEffect`, `useContext`, `useNavigate`.
- Context API for authentication and cart state (no Redux needed).

### 2.2 Bootstrap 5
- Grid system and utilities for responsiveness.
- Ready components: navbar, cards, modal, forms, tabs, toasts, badges.
- Customised through `theme.css`.

### 2.3 Custom CSS Theme
```css
:root {
  --pink: #E91E63;
  --pink-soft: #F8BBD0;
  --pink-light: #FDE7EF;
  --beige: #F5EBE0;
  --white: #FFFFFF;
  --text: #3A3A3A;
}
body { background: var(--white); color: var(--text); font-family: 'Poppins', sans-serif; }
h1, h2, h3 { font-family: 'Playfair Display', serif; }
.btn-glow { background: var(--pink); color: #fff; border-radius: 50px; padding: .6rem 1.6rem; border: none; }
.btn-glow:hover { background: #C2185B; }
.product-card { border: none; border-radius: 18px; box-shadow: 0 6px 18px rgba(233,30,99,.12); transition: transform .25s; }
.product-card:hover { transform: translateY(-6px); }
.section-beige { background: var(--beige); }
```

### 2.4 Fonts and Icons
- Google Fonts: Playfair Display, Poppins.
- Bootstrap Icons or React Icons.

### 2.5 Images
- Free high-quality images from **Unsplash** or **Pexels** (use URLs or download into `client/public/images`).

### 2.6 Frontend Packages
```bash
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios bootstrap bootstrap-icons react-toastify
```

---

## 3. Backend Technologies

### 3.1 Node.js and Express.js
- Event-driven, non-blocking server.
- Express provides routing and middleware.

### 3.2 Backend Packages
```bash
mkdir server && cd server
npm init -y
npm install express cors dotenv helmet morgan bcryptjs jsonwebtoken \
            express-validator express-rate-limit @prisma/client
npm install -D nodemon prisma
npx prisma init
```

| Package | Use |
|---|---|
| express | Web framework |
| cors | Allow React origin |
| dotenv | Load `.env` |
| helmet | Secure headers |
| morgan | Request logger |
| bcryptjs | Hash passwords |
| jsonwebtoken | Create and verify JWT |
| express-validator | Validate input |
| express-rate-limit | Limit login attempts |
| @prisma/client, prisma | ORM |
| nodemon | Auto-restart in development |

---

## 4. Database Technologies

### 4.1 PostgreSQL
- Open-source relational database with strong integrity and relations.
- Used for users, products, carts, tips and skin profiles.
- GUI tools: **pgAdmin 4** or **DBeaver**.

### 4.2 Prisma ORM
| Feature | Benefit |
|---|---|
| `schema.prisma` | Single readable definition of all 7 tables |
| `prisma migrate dev` | Creates and versions tables |
| `prisma db seed` | Loads sample products, tips, admin |
| `prisma studio` | Browser view of data (`npx prisma studio`) |
| Parameterised queries | Prevents SQL injection |

Example query:
```js
const products = await prisma.product.findMany({
  where: {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ],
    ...(category && { category: { name: category } }),
  },
  include: { category: true },
  orderBy: { createdAt: 'desc' },
});
```

---

## 5. Why These Technologies?

| Choice | Reason | Alternative |
|---|---|---|
| React | Popular, component reuse, large community | Angular, Vue |
| Bootstrap | Quick responsive layout, ideal for college timeline | Tailwind CSS |
| Express | Minimal, easy to learn REST APIs | NestJS, Fastify |
| PostgreSQL | Reliable relational DB, good for carts and relations | MySQL, MongoDB |
| Prisma | Simple schema, migrations, readable queries | Sequelize, TypeORM |
| JWT | Stateless auth, easy with SPA | Sessions with cookies |

---

## 6. System Requirements

| Requirement | Version |
|---|---|
| Node.js | 18 LTS or higher |
| npm | 9+ |
| PostgreSQL | 14 or higher |
| Browser | Latest Chrome / Edge / Firefox |
| RAM | 4 GB minimum |
| OS | Windows 10/11, macOS or Linux |

---

## 7. Step-by-Step Setup

### Step 1: Install tools
1. Install Node.js LTS from nodejs.org.
2. Install PostgreSQL and pgAdmin (remember the `postgres` password).
3. Install VS Code and Git.

Verify:
```bash
node -v
npm -v
psql --version
```

### Step 2: Create database
```bash
psql -U postgres
CREATE DATABASE glowup;
\q
```

### Step 3: Backend
```bash
cd server
npm install
```
Edit `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/glowup?schema=public"
JWT_SECRET="your_long_random_secret"
JWT_EXPIRES_IN="7d"
PORT=5000
CLIENT_URL="http://localhost:5173"
```
Create tables and sample data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
Check: open `http://localhost:5000/api/products`.

### Step 4: Frontend
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173`.

### Step 5: Demo accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@glowup.com | Admin@123 |
| User | Register a new account | — |

### Step 6: Useful commands
| Command | Purpose |
|---|---|
| `npx prisma studio` | View database in browser |
| `npx prisma migrate reset` | Reset DB and re-seed |
| `npm run build` (client) | Production build |
| `npm audit` | Check vulnerabilities |

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| `P1001 Can't reach database` | Start PostgreSQL service; check password and port 5432 in `DATABASE_URL` |
| CORS error in browser | Check `CLIENT_URL` in server `.env` matches the Vite URL |
| `401` on cart | Log in first; check token in `localStorage` |
| Images not loading | Verify image URLs or place files in `client/public/images` |
| Port already in use | Change `PORT` or stop the other process |
| `prisma generate` missing client | Run `npx prisma generate` |

---

## 9. Deployment Options (Optional)

| Part | Free Platform |
|---|---|
| React frontend | Vercel / Netlify |
| Node API | Render / Railway |
| PostgreSQL | Neon / Supabase / Railway |

Set the environment variables on each platform and update `VITE_API_URL` and `CLIENT_URL`.
