# 🔧 Fix: Wrong VITE_API_URL Value

## ❌ Current Problem

You have set:
```
VITE_API_URL = https://vjs-gamma.vercel.app/api
```

**This is WRONG!** This is your Vercel frontend URL, not your backend URL.

The code correctly blocks this and shows the error screen because:
- Vercel only hosts your frontend (React app)
- Vercel does NOT have your backend API
- You need to point to Railway backend instead

---

## ✅ Solution

You need to change `VITE_API_URL` to your **Railway backend URL**.

### Step 1: Get Your Railway Backend URL

**If you already deployed to Railway:**
1. Go to https://railway.app/
2. Click your project
3. Go to **Settings** → **Networking**
4. Copy your domain (e.g., `https://vjs-production-xxxx.up.railway.app`)

**If you haven't deployed to Railway yet:**
👉 **You MUST deploy the backend first!** See: [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)

---

### Step 2: Update VITE_API_URL in Vercel

1. Go to https://vercel.com/dashboard
2. Click your **`vjs`** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. Click **Edit** (or delete and recreate)
6. Change the **Value** from:
   ```
   https://vjs-gamma.vercel.app/api  ❌ WRONG
   ```
   to:
   ```
   https://your-railway-url.up.railway.app/api  ✅ CORRECT
   ```
   - Replace `your-railway-url` with your actual Railway URL
   - **Must include `/api` at the end**
   - **Must start with `https://`**

7. Click **Save**

---

### Step 3: Redeploy Vercel

1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes

---

## ✅ Expected Result

After fixing:
- ✅ Error screen disappears
- ✅ App connects to Railway backend
- ✅ Bookings load and save successfully

---

## 🆘 Don't Have Railway Backend Yet?

You **MUST** deploy the backend to Railway first. The frontend cannot work without a backend.

### Quick Railway Deployment (5 minutes)

1. **Go to Railway:**
   - https://railway.app/
   - Login with GitHub

2. **Deploy:**
   - New Project → Deploy from GitHub
   - Select `vjs` repository
   - Set Root Directory: `server`
   - Add environment variables (see DEPLOYMENT_STEPS.md)
   - Generate domain → Copy URL

3. **Then come back and set VITE_API_URL** to that Railway URL

See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) for detailed instructions.

---

## 📝 Quick Reference

**❌ Wrong Values:**
```
https://vjs-gamma.vercel.app/api     ← Vercel domain (frontend only)
/api                                  ← Relative path
http://localhost:5000/api            ← Localhost
```

**✅ Correct Value:**
```
https://vjs-production-xxxx.up.railway.app/api  ← Railway backend
```

---

## 🔍 How to Verify

After updating and redeploying:

1. Open https://vjs-gamma.vercel.app/
2. Open browser console (F12)
3. Look for: `✅ API URL configured: https://your-railway-url...`
4. Should NOT see: `❌ VITE_API_URL is pointing to Vercel domain!`

---

**Need help deploying Railway?** See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
