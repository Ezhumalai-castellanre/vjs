# 🚨 URGENT: Fix VITE_API_URL Now

## ❌ Current Problem

You have set:
```
VITE_API_URL = vjs-k2xcc1rwy-ezhumalai-castellanres-projects.vercel.app/api
```

**This is STILL WRONG!** This is a Vercel preview URL, not a Railway backend.

---

## ✅ What You Need to Do

### Step 1: Deploy Backend to Railway (REQUIRED)

**You MUST deploy your backend to Railway first!** Vercel only hosts your frontend.

1. **Go to Railway:**
   - https://railway.app/
   - Login with GitHub

2. **Create New Project:**
   - Click **"New Project"**
   - Click **"Deploy from GitHub repo"**
   - Select your **`vjs`** repository

3. **Configure:**
   - Click on the deployed service
   - Go to **Settings** → **Build**
   - Set **Root Directory:** `server`
   - Set **Start Command:** `npm start`

4. **Add Environment Variables:**
   Go to **Variables** tab, add:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://vjs-gamma.vercel.app
   USE_FILE_DB=true
   ```

5. **Get Your Railway URL:**
   - Go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://vjs-production-xxxx.up.railway.app`)
   - **SAVE THIS URL!**

---

### Step 2: Update VITE_API_URL in Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click your **`vjs`** project

2. **Update Environment Variable:**
   - Go to **Settings** → **Environment Variables**
   - Find `VITE_API_URL`
   - Click **Edit**
   - Change the value to:
     ```
     https://your-railway-url.up.railway.app/api
     ```
     - Replace `your-railway-url` with the Railway URL from Step 1
     - **MUST start with `https://`**
     - **MUST end with `/api`**

3. **Example of Correct Value:**
   ```
   https://vjs-production-abc123.up.railway.app/api
   ```

4. **Click Save**

---

### Step 3: Redeploy Vercel

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## ✅ Correct vs Wrong

**❌ WRONG (What you have now):**
```
vjs-k2xcc1rwy-ezhumalai-castellanres-projects.vercel.app/api
https://vjs-gamma.vercel.app/api
vjs-gamma.vercel.app/api
```

**✅ CORRECT (What you need):**
```
https://vjs-production-xxxx.up.railway.app/api
```

**Key differences:**
- ✅ Must be Railway domain (`.railway.app`)
- ✅ Must start with `https://`
- ✅ Must end with `/api`
- ❌ Cannot be Vercel domain (`.vercel.app`)

---

## 🎯 Quick Checklist

- [ ] Backend deployed to Railway
- [ ] Railway domain generated and copied
- [ ] `VITE_API_URL` set to Railway URL (with `https://` and `/api`)
- [ ] Vercel redeployed
- [ ] App works without error screen

---

## 🆘 Still Confused?

**The key point:** 
- **Vercel** = Frontend only (your React app)
- **Railway** = Backend API (your Express server)
- Frontend must call Backend, so `VITE_API_URL` must point to Railway

**You cannot use Vercel URL for the backend because Vercel doesn't run your backend!**

---

**Need detailed Railway setup?** See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
