# 🚀 Deployment Steps - Quick Reference

## Current Status
- ✅ Frontend deployed on Vercel: https://vjs-gamma.vercel.app/
- ❌ Backend not deployed (needs Railway)
- ❌ Environment variable not set (needs VITE_API_URL)

---

## ⚡ Quick Fix (5 Minutes)

### 1. Deploy Backend to Railway

**Go to:** https://railway.app/

1. Login with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select **`vjs`** repository
4. Configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
5. Add Variables:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://vjs-gamma.vercel.app
   USE_FILE_DB=true
   ```
6. **Settings** → **Networking** → **Generate Domain**
7. **Copy the Railway URL** (e.g., `https://vjs-production-xxxx.up.railway.app`)

### 2. Set VITE_API_URL in Vercel

**Go to:** https://vercel.com/dashboard

1. Click **`vjs`** project
2. **Settings** → **Environment Variables**
3. **Add New:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
     - Replace with your Railway URL from step 1
     - **Must include `/api` at the end**
4. Enable for **Production**
5. **Save**

### 3. Redeploy Vercel

1. **Deployments** tab
2. Click **...** on latest deployment
3. **Redeploy**
4. Wait 1-2 minutes

### 4. Test

1. Open https://vjs-gamma.vercel.app/
2. Error screen should be gone
3. Login (PIN: 1234)
4. Add a booking

---

## ✅ Done!

Your app is now fully working!

---

## 📚 Detailed Guides

- **Complete Setup:** See `SETUP_COMPLETE.md`
- **Railway Deployment:** See `RAILWAY_DEPLOY_NOW.md`
- **Troubleshooting:** See `QUICK_FIX_NOW.md`
