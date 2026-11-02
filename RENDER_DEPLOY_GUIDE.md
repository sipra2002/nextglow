# 🚀 Deploying NextGlow to Render

NextGlow is configured to be deployed on Render using two straightforward approaches.

---

## ⚡ Option 1: Automatic 1-Click Deployment (Recommended via Blueprint)

We have included a [`render.yaml`](./render.yaml) blueprint file in this repository.

### Steps:
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/sipra2002/nextglow.git`.
4. Render will read [`render.yaml`](./render.yaml) and automatically create:
   - **`nextglow-backend`** (Web Service on Node.js)
   - **`nextglow-frontend`** (Static Site on React + Vite)
5. Under Environment Variables for `nextglow-backend`, enter:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_0VhPLuTvdys8@ep-rapid-snow-ao22j9jl-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `DIRECT_URL`: `postgresql://neondb_owner:npg_0VhPLuTvdys8@ep-rapid-snow-ao22j9jl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
6. Click **Apply**. Render will build and deploy both services!

---

## 🛠 Option 2: Manual Deployment (Step-by-Step)

If you prefer to configure the services manually on Render:

### Step 1: Deploy the Backend API (Web Service)
1. Go to Render Dashboard -> **New +** -> **Web Service**.
2. Select your repository `sipra2002/nextglow`.
3. Configure the following fields:
   - **Name**: `nextglow-backend` (or your choice)
   - **Region**: Singapore or Oregon (any preferred)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = `postgresql://neondb_owner:npg_0VhPLuTvdys8@ep-rapid-snow-ao22j9jl-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `DIRECT_URL` = `postgresql://neondb_owner:npg_0VhPLuTvdys8@ep-rapid-snow-ao22j9jl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET` = `glowup_super_secret_jwt_key_2026_mca_project_token_very_secure`
   - `JWT_EXPIRES_IN` = `7d`
5. Click **Deploy Web Service**.
6. Once deployed, copy your backend URL (e.g. `https://nextglow-backend.onrender.com`).

---

### Step 2: Deploy the Frontend (Static Site)
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Select your repository `sipra2002/nextglow`.
3. Configure the following fields:
   - **Name**: `nextglow-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://<YOUR-BACKEND-NAME>.onrender.com/api`  
     *(Replace `<YOUR-BACKEND-NAME>` with your backend URL from Step 1)*
5. Under **Redirects/Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures client-side routing like `/products`, `/login`, etc. work without 404s)*
6. Click **Create Static Site**.

---

### Step 3: Link Client URL in Backend (Final Touch)
1. Go back to your Backend Web Service -> **Environment**.
2. Add / Update `CLIENT_URL` with your frontend URL (e.g. `https://nextglow-frontend.onrender.com`).
3. Click **Save Changes** (Render will automatically redeploy).

🎉 **Your NextGlow application is now live on Render!**
