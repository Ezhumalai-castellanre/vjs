# 🔧 Fix: Wrong API URL Configuration

## Current Problem

Your app is trying to call:
```
POST https://vjs-gamma.vercel.app/api/bookings/2026-01-22
```

This is **wrong** because:
- ❌ It's pointing to **Vercel** (frontend only)
- ❌ Vercel doesn't have your backend API
- ❌ You're getting `405 Method Not Allowed` and HTML responses

## ✅ The Fix

Your `VITE_API_URL` in Vercel is likely set to:
- ❌ `/api` (relative path - wrong!)
- ❌ `https://vjs-gamma.vercel.app/api` (Vercel domain - wrong!)
- ❌ Empty or missing

It should be set to your **Railway backend URL**:
- ✅ `https://your-backend.railway.app/api`

## Step-by-Step Fix

### Step 1: Get Your Railway Backend URL

1. Go to https://railway.app/
2. Login and select your project
3. Go to **Settings** → **Networking**
4. Find your domain (e.g., `https://vjs-production-xxxx.up.railway.app`)
5. **Copy this URL**

**Don't have a Railway backend yet?**
- Follow `RAILWAY_DEPLOY_NOW.md` to deploy it first

### Step 2: Update Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Click your **vjs** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` (or add it if missing)
5. **Update the Value** to:
   ```
   https://your-backend.railway.app/api
   ```
   - Replace `your-backend.railway.app` with your actual Railway URL
   - **Must include `/api` at the end**
   - **Must start with `https://`**

### Step 3: Verify the Value

**✅ Correct Examples:**
```
https://vjs-production-abc123.up.railway.app/api
https://vjs-backend.up.railway.app/api
```

**❌ Wrong Examples:**
```
/api                                    ← Relative path (wrong!)
https://vjs-gamma.vercel.app/api        ← Vercel domain (wrong!)
http://localhost:5000/api              ← Localhost (wrong!)
https://vjs-production-abc123.up.railway.app  ← Missing /api (wrong!)
```

### Step 4: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes

### Step 5: Test

1. Open https://vjs-gamma.vercel.app/
2. Check browser console - should see requests to Railway URL
3. Try logging in (PIN: 1234)
4. Try adding a booking

## ✅ Expected Result

After fixing, you should see:
- ✅ Requests going to: `https://your-backend.railway.app/api/bookings`
- ✅ No more `405 Method Not Allowed` errors
- ✅ No more HTML/JSON parsing errors
- ✅ Bookings load and save successfully

## 🆘 Still Not Working?

### Check 1: Verify Railway Backend is Running

Visit your Railway health endpoint:
```
https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running"
}
```

### Check 2: Verify Environment Variable

In Vercel:
1. Go to **Settings** → **Environment Variables**
2. Make sure `VITE_API_URL` shows the Railway URL
3. Make sure it's enabled for **Production** environment
4. The value should be exactly: `https://your-backend.railway.app/api`

### Check 3: Check Browser Console

After redeploying, open browser console and check:
- Look for requests to Railway domain (not Vercel)
- Should see: `GET https://your-backend.railway.app/api/bookings`

## 📝 Quick Checklist

- [ ] Railway backend is deployed and running
- [ ] Railway domain is generated
- [ ] `VITE_API_URL` in Vercel = `https://your-railway-url.up.railway.app/api`
- [ ] Environment variable is enabled for Production
- [ ] Vercel project has been redeployed
- [ ] Backend health check works: `https://your-backend.railway.app/health`

---

**Need help deploying Railway backend?** See `RAILWAY_DEPLOY_NOW.md`
