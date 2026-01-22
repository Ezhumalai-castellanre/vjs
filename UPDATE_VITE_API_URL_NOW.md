# ✅ Fix VITE_API_URL - Update Now

## Current Problem

You have:
- ✅ Railway backend: `https://vjs-production.up.railway.app/`
- ❌ VITE_API_URL set to: `vjs-k2xcc1rwy-ezhumalai-castellanres-projects.vercel.app/api` (WRONG - this is Vercel)

## ✅ Solution - Update in Vercel

### Step 1: Go to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click your **`vjs`** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`

### Step 2: Update the Value

Click **Edit** on `VITE_API_URL` and change:

**From (WRONG):**
```
vjs-k2xcc1rwy-ezhumalai-castellanres-projects.vercel.app/api
```

**To (CORRECT):**
```
https://vjs-production.up.railway.app/api
```

**Important:**
- Must start with `https://`
- Must end with `/api`
- Must be your Railway URL

### Step 3: Save and Redeploy

1. Click **Save**
2. Go to **Deployments** tab
3. Click **...** on latest deployment
4. Click **Redeploy**
5. Wait 1-2 minutes

## ✅ Done!

After redeploying, your app will:
- ✅ Connect to Railway backend
- ✅ Error screen will disappear
- ✅ Bookings will work

---

## 🔍 Verify It's Working

1. Open https://vjs-gamma.vercel.app/
2. Open browser console (F12)
3. Should see: `✅ API URL configured: https://vjs-production.up.railway.app/api`
4. Should NOT see error screen

---

## 📝 Summary

**Correct VITE_API_URL:**
```
https://vjs-production.up.railway.app/api
```

**Make sure:**
- ✅ Starts with `https://`
- ✅ Ends with `/api`
- ✅ Points to Railway (not Vercel)
