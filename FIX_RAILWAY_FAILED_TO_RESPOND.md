# 🚨 Fix: Railway "Application failed to respond"

## ❌ Error

Railway shows: **"Application failed to respond"**

This means the backend service is not starting or crashing on startup.

---

## ✅ Step-by-Step Fix

### Step 1: Check Railway Logs (MOST IMPORTANT)

1. Go to https://railway.app/
2. Click your project
3. Click your service
4. Go to **Logs** tab
5. **Look for error messages**

**Common errors you might see:**

#### Error 1: "Cannot find module"
```
Error: Cannot find module 'express'
```
**Fix:** Dependencies not installed
- Check **Settings** → **Build** → **Build Command** should be `npm install` (or Railway auto-installs)

#### Error 2: "Port already in use"
```
Error: listen EADDRINUSE: address already in use
```
**Fix:** Remove `PORT` environment variable (Railway assigns it automatically)

#### Error 3: "Cannot find file"
```
Error: Cannot find module './fileDB.js'
```
**Fix:** Root Directory is wrong - should be `server`

#### Error 4: Syntax errors
```
SyntaxError: Unexpected token
```
**Fix:** Check the error line number, might be a code issue

---

### Step 2: Verify Railway Configuration

#### Check Build Settings:

1. **Settings** → **Build**
2. **Root Directory:** Must be `server` (exactly)
3. **Build Command:** Leave empty or `npm install`
4. **Start Command:** Must be `npm start`

#### Check Environment Variables:

Go to **Variables** tab:

**Required:**
```
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=true
```

**DO NOT SET:**
- `PORT` - Railway assigns this automatically
- If you have `PORT=5000`, **DELETE IT**

---

### Step 3: Check File Structure

Make sure in your GitHub repo you have:

```
server/
  ├── server.js
  ├── package.json
  ├── fileDB.js
  └── bookings.json (optional, will be created)
```

**Verify:**
- `server/package.json` exists
- `server/server.js` exists
- `server/fileDB.js` exists

---

### Step 4: Test Locally First

Before deploying to Railway, test locally:

```bash
cd server
npm install
npm start
```

**Should see:**
```
🚀 VJK Mahal API Server Started
📍 Server listening on 0.0.0.0:5000
```

**If local test fails:**
- Fix the error locally first
- Then push to GitHub
- Railway will redeploy

---

### Step 5: Redeploy on Railway

After fixing configuration:

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Watch the **Logs** tab for errors

---

## 🔍 Common Issues & Fixes

### Issue 1: Wrong Root Directory

**Symptom:** "Cannot find module" errors

**Fix:**
- **Settings** → **Build** → **Root Directory:** `server`
- Save and redeploy

---

### Issue 2: PORT Environment Variable

**Symptom:** "Port already in use" or service won't start

**Fix:**
- Go to **Variables** tab
- **DELETE** `PORT` variable if it exists
- Railway assigns PORT automatically
- Redeploy

---

### Issue 3: Missing Dependencies

**Symptom:** "Cannot find module 'express'"

**Fix:**
- Check `server/package.json` has all dependencies
- Railway should auto-install, but verify in logs
- If needed, set **Build Command:** `npm install`

---

### Issue 4: File Permissions

**Symptom:** "EACCES: permission denied" when writing bookings.json

**Fix:**
- Railway should handle this automatically
- If persists, check logs for specific file path errors

---

### Issue 5: Node Version Mismatch

**Symptom:** Syntax errors or module issues

**Fix:**
- Railway uses Node 18+ by default
- If needed, add `.nvmrc` file in `server/` folder with: `18` or `20`

---

## ✅ Success Indicators

After fixing, Railway logs should show:

```
✅ Loaded bookings from file database
🚀 VJK Mahal API Server Started
📍 Server listening on 0.0.0.0:XXXX
```

(XXXX will be Railway's assigned port)

Then test:
```
https://vjs-production.up.railway.app/health
```

Should return JSON (not HTML, not error).

---

## 🆘 Still Not Working?

### Get Detailed Error:

1. **Check Railway Logs** - Most important!
2. **Copy the full error message**
3. **Check which step it fails at:**
   - Build phase? (npm install)
   - Start phase? (npm start)
   - Runtime? (after starting)

### Quick Checklist:

- [ ] Root Directory = `server`
- [ ] Start Command = `npm start`
- [ ] No `PORT` variable set
- [ ] `NODE_ENV=production` set
- [ ] `USE_FILE_DB=true` set
- [ ] `FRONTEND_URL` matches Vercel URL
- [ ] Logs show server started
- [ ] `/health` endpoint works

---

## 📝 Most Common Fix

**90% of the time, the issue is:**

1. **Root Directory is wrong** → Set to `server`
2. **PORT variable is set** → Delete it
3. **Start Command is wrong** → Set to `npm start`

**Fix these three things and redeploy!**

---

**Need more help?** Share the error message from Railway logs.
