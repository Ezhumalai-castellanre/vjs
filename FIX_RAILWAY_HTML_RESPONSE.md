# 🔧 Fix: Railway Returning HTML Instead of JSON

## ❌ Problem

Railway backend at `https://vjs-production.up.railway.app` is returning HTML (frontend) instead of JSON (backend API).

**Test Results:**
- `/` → Returns HTML ❌
- `/health` → Returns HTML ❌  
- `/api/bookings` → Returns HTML ❌

This means Railway is serving your frontend code instead of running your backend server.

---

## ✅ Solution: Configure Railway Correctly

### Step 1: Check Railway Service Configuration

1. **Go to Railway Dashboard:**
   - https://railway.app/
   - Click your project
   - Click on your service (should be named something like "vjs" or "server")

2. **Check Settings → Build:**

   **Root Directory MUST be:**
   ```
   server
   ```
   ⚠️ **NOT** empty or `./` or root

   **Start Command MUST be:**
   ```
   npm start
   ```

3. **If Root Directory is Wrong:**
   - Go to **Settings** → **Build**
   - Set **Root Directory:** `server`
   - Click **Save**
   - Railway will auto-redeploy

---

### Step 2: Verify You Have a Backend Service

**Check if you have TWO services in Railway:**

1. **Frontend Service** (if exists):
   - Should be disabled or removed
   - Or should have different domain

2. **Backend Service:**
   - Root Directory: `server`
   - Start Command: `npm start`
   - This is the one that should be running

**If you only have ONE service:**
- It might be serving the frontend
- You need to create a NEW service for the backend
- Or reconfigure the existing one

---

### Step 3: Create/Reconfigure Backend Service

**Option A: Reconfigure Existing Service**

1. Click on your service in Railway
2. Go to **Settings** → **Build**
3. Set:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
4. Save and wait for redeploy

**Option B: Create New Backend Service**

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select your `vjs` repository
4. Configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
5. Add environment variables (see below)
6. Generate domain

---

### Step 4: Set Environment Variables

In your **backend service** (Root Directory: `server`), go to **Variables** and add:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=true
```

**Important:**
- These variables should be in the **backend service**, not frontend
- `FRONTEND_URL` should match your Vercel URL exactly

---

### Step 5: Check Logs

After redeploying:

1. Click on your backend service
2. Go to **Logs** tab
3. Should see:
   ```
   🚀 VJK Mahal API Server Started
   📍 Server listening on 0.0.0.0:5000
   ✅ Loaded bookings from file database
   ```

**If you see errors:**
- Check the error message
- Common issues: missing dependencies, wrong Node version

---

### Step 6: Test Backend

After redeploying, test again:

1. **Health Check:**
   ```
   https://vjs-production.up.railway.app/health
   ```
   Should return JSON:
   ```json
   {
     "status": "OK",
     "message": "VJK Mahal API is running"
   }
   ```

2. **Bookings Endpoint:**
   ```
   https://vjs-production.up.railway.app/api/bookings
   ```
   Should return JSON (empty object `{}` if no bookings)

---

## 🆘 Common Issues

### Issue 1: Railway Serving Frontend

**Symptom:** All endpoints return HTML

**Cause:** Root Directory is wrong or not set

**Fix:** Set Root Directory to `server` in Railway settings

---

### Issue 2: "Cannot find module" Error

**Symptom:** Logs show module not found errors

**Cause:** Dependencies not installed

**Fix:** 
- Make sure `package.json` is in `server/` folder
- Railway should auto-install, but check Build Command

---

### Issue 3: Port Already in Use

**Symptom:** Server fails to start

**Cause:** Wrong PORT environment variable

**Fix:** 
- Remove `PORT` variable (Railway assigns it automatically)
- Or set `PORT` to Railway's assigned port (check logs)

---

### Issue 4: Service Not Starting

**Symptom:** No logs or service shows as stopped

**Fix:**
1. Check **Settings** → **Build** → **Start Command** = `npm start`
2. Check `server/package.json` has `"start": "node server.js"`
3. Redeploy service

---

## ✅ Success Checklist

After fixing:

- [ ] Root Directory = `server` in Railway
- [ ] Start Command = `npm start`
- [ ] Environment variables set
- [ ] Logs show: `🚀 VJK Mahal API Server Started`
- [ ] `/health` returns JSON
- [ ] `/api/bookings` returns JSON
- [ ] Frontend connects without errors

---

## 📝 Quick Fix Summary

**The Problem:** Railway is serving frontend (HTML) instead of backend (JSON)

**The Fix:** 
1. Set Root Directory to `server` in Railway
2. Set Start Command to `npm start`
3. Redeploy
4. Test `/health` endpoint

**After Fix:** Backend should return JSON, frontend should work!

---

**Still not working?** Check Railway logs for specific error messages.
