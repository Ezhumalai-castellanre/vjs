# 🚨 URGENT: Fix Railway Backend Configuration

## ❌ Current Problem

Railway at `https://vjs-production.up.railway.app` is returning **HTML** (frontend) instead of **JSON** (backend API).

**This means:** Railway is serving your frontend code instead of running your backend server.

---

## ✅ SOLUTION: Configure Railway Service

### Step 1: Go to Railway Dashboard

1. Open: https://railway.app/
2. Login
3. Click your project
4. **You should see a service** (might be named "vjs" or similar)

### Step 2: Check Service Configuration

Click on your service, then go to **Settings** → **Build**

**Check these settings:**

#### ❌ WRONG Configuration:
- Root Directory: (empty) or `.` or `./`
- This serves the frontend!

#### ✅ CORRECT Configuration:
- **Root Directory:** `server`
- **Start Command:** `npm start`

### Step 3: Fix the Configuration

1. In **Settings** → **Build**:
   - **Root Directory:** Type `server` (exactly this, no quotes)
   - **Start Command:** Type `npm start`
   - Click **Save** or it auto-saves

2. Railway will **automatically redeploy** when you change settings

3. Wait 1-2 minutes for deployment

### Step 4: Set Environment Variables

Go to **Variables** tab and add/verify:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=true
```

**Important:**
- `FRONTEND_URL` must match your Vercel URL exactly
- No spaces around `=`
- Click "Add" after each variable

### Step 5: Check Logs

After redeploying:

1. Click on your service
2. Go to **Logs** tab
3. **Should see:**
   ```
   🚀 VJK Mahal API Server Started
   📍 Server listening on 0.0.0.0:5000
   ✅ Loaded bookings from file database
   ```

**If you see errors:**
- Check the error message
- Common: "Cannot find module" = dependencies issue
- Common: "Port already in use" = PORT variable issue

### Step 6: Test Backend

After deployment completes, test:

**Open in browser:**
```
https://vjs-production.up.railway.app/health
```

**✅ Should see JSON:**
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running",
  "database": "File-based (JSON)"
}
```

**❌ If still HTML:**
- Root Directory is still wrong
- Check Step 2 again
- Make sure it's exactly `server` (not `./server` or `/server`)

---

## 🆘 If You Don't Have a Backend Service

If you only see a frontend service or no service:

### Create New Backend Service

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select your `vjs` repository
4. **IMPORTANT:** Before deploying, go to **Settings** → **Build**
5. Set:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
6. Add environment variables (Step 4 above)
7. Go to **Settings** → **Networking** → **Generate Domain**
8. Copy the domain URL

---

## ✅ Verification Checklist

After fixing:

- [ ] Root Directory = `server` (exactly)
- [ ] Start Command = `npm start`
- [ ] Environment variables set
- [ ] Logs show: `🚀 VJK Mahal API Server Started`
- [ ] `/health` endpoint returns JSON (not HTML)
- [ ] `/api/bookings` endpoint returns JSON (not HTML)

---

## 🎯 Quick Summary

**The Problem:** Railway Root Directory is wrong (serving frontend)

**The Fix:** 
1. Set Root Directory to `server`
2. Set Start Command to `npm start`
3. Wait for redeploy
4. Test `/health` endpoint

**After Fix:** Backend will return JSON, frontend will work!

---

## 📝 Still Not Working?

1. **Check Railway Logs:**
   - Look for error messages
   - Share the error if you need help

2. **Verify File Structure:**
   - Make sure `server/server.js` exists in your repo
   - Make sure `server/package.json` exists

3. **Try Manual Redeploy:**
   - Deployments tab → Click "..." → Redeploy

---

**This is a Railway configuration issue, not a code issue. The code is correct - Railway just needs to be told to run the backend!**
