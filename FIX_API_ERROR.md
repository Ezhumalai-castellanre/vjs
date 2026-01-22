# 🔧 Fix: ERR_CONNECTION_REFUSED Error

## Problem
Your app is trying to connect to `localhost:5000` in production, which doesn't work. The error shows:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:5000/api/bookings
```

## Root Cause
The `VITE_API_URL` environment variable is not set in your Vercel deployment.

## ✅ Solution (5 minutes)

### Step 1: Get Your Backend URL

If you've deployed your backend to Railway:
1. Go to https://railway.app/
2. Click your project
3. Go to **Settings** → **Networking**
4. Copy your domain (e.g., `https://vjs-production-xxxx.up.railway.app`)

**If you haven't deployed the backend yet:**
- Follow the instructions in `RAILWAY_DEPLOY_NOW.md` or `DEPLOYMENT_GUIDE.md`

### Step 2: Set Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Click your **vjs** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.railway.app/api`
     - ⚠️ **Important:** Replace `your-backend.railway.app` with your actual Railway URL
     - ⚠️ **Important:** Make sure to include `/api` at the end
6. Select **Production**, **Preview**, and **Development** (or at least **Production**)
7. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes for deployment to complete

### Step 4: Test

1. Open your Vercel URL: https://vjs-gamma.vercel.app/
2. The app should now connect to your backend
3. Try logging in (PIN: 1234) and adding a booking

## ✅ Expected Result

After redeploying, you should see:
- ✅ No more `ERR_CONNECTION_REFUSED` errors
- ✅ Bookings load successfully
- ✅ You can save new bookings

## 🆘 Still Having Issues?

### Check 1: Backend is Running
Visit your Railway backend health endpoint:
```
https://your-backend.railway.app/health
```

You should see:
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running"
}
```

### Check 2: CORS Configuration
In Railway, make sure `FRONTEND_URL` is set to:
```
https://vjs-gamma.vercel.app
```

### Check 3: Environment Variable Format
- ✅ Correct: `https://vjs-production-xxxx.up.railway.app/api`
- ❌ Wrong: `https://vjs-production-xxxx.up.railway.app` (missing `/api`)
- ❌ Wrong: `http://vjs-production-xxxx.up.railway.app/api` (should be `https://`)

## 📝 Quick Reference

**Vercel Environment Variable:**
```
VITE_API_URL = https://your-backend.railway.app/api
```

**Railway Environment Variable:**
```
FRONTEND_URL = https://vjs-gamma.vercel.app
```

---

**Need more help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
