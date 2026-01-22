# 🔍 Check Railway Backend Status

## Current Problem

Your app is trying to connect to:
```
https://vjs-production.up.railway.app/api
```

But it's receiving HTML instead of JSON, which means the backend might not be running correctly.

---

## ✅ Step 1: Check if Backend is Running

### Test the Health Endpoint

Open in your browser:
```
https://vjs-production.up.railway.app/health
```

**✅ Should see:**
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running",
  "database": "File-based (JSON)",
  "timestamp": "2026-01-22T..."
}
```

**❌ If you see HTML or error:**
- Backend is not running
- Backend is not deployed correctly
- Need to check Railway logs

---

## ✅ Step 2: Check Railway Deployment

1. **Go to Railway Dashboard:**
   - https://railway.app/
   - Click your project

2. **Check Deployment Status:**
   - Go to **Deployments** tab
   - Should see: **✅ Deployed** (green)
   - If red, click on it to see error logs

3. **Check Logs:**
   - Click on your service
   - Go to **Logs** tab
   - Should see: `🚀 VJK Mahal API Server Started`
   - Should see: `📍 Server listening on 0.0.0.0:5000`

---

## ✅ Step 3: Verify Environment Variables

In Railway, go to **Variables** tab and check:

**Required Variables:**
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=true
```

**Important:**
- `PORT` should be `5000` (or Railway's assigned port)
- `FRONTEND_URL` should match your Vercel URL exactly

---

## ✅ Step 4: Verify Build Settings

In Railway, go to **Settings** → **Build**:

**Should be:**
- **Root Directory:** `server`
- **Build Command:** `npm install` (or leave default)
- **Start Command:** `npm start`

---

## ✅ Step 5: Test API Endpoints

### Test Root Endpoint:
```
https://vjs-production.up.railway.app/
```

Should return JSON with API info.

### Test Bookings Endpoint:
```
https://vjs-production.up.railway.app/api/bookings
```

Should return JSON (empty object `{}` if no bookings).

---

## 🆘 Common Issues

### Issue 1: Backend Returns HTML

**Cause:** Backend not running or wrong port

**Fix:**
1. Check Railway logs for errors
2. Verify `PORT` environment variable
3. Make sure `npm start` command works
4. Redeploy if needed

### Issue 2: 404 Not Found

**Cause:** Routes not configured correctly

**Fix:**
- Make sure server code is in `server/` folder
- Verify `Root Directory` is set to `server` in Railway

### Issue 3: CORS Errors

**Cause:** Frontend URL not in allowed origins

**Fix:**
- Set `FRONTEND_URL=https://vjs-gamma.vercel.app` in Railway
- Redeploy backend

---

## 🔧 Quick Fix: Redeploy Backend

If backend is not working:

1. **In Railway:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete

2. **Check Logs:**
   - Should see server startup messages
   - Should see: `🚀 VJK Mahal API Server Started`

3. **Test Again:**
   - Visit `/health` endpoint
   - Should return JSON

---

## 📝 After Backend is Working

Once `/health` returns JSON:

1. **Test Frontend:**
   - Open https://vjs-gamma.vercel.app/
   - Should connect to backend
   - Should load bookings

2. **If Still Not Working:**
   - Check browser console for errors
   - Verify `VITE_API_URL` in Vercel is correct
   - Make sure Vercel is redeployed

---

## ✅ Success Checklist

- [ ] Railway backend shows "Deployed" (green)
- [ ] `/health` endpoint returns JSON
- [ ] `/api/bookings` endpoint returns JSON
- [ ] Railway logs show server started
- [ ] Frontend connects without errors

---

**Need more help?** Check Railway logs for specific error messages.
