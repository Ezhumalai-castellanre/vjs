# ⚡ Quick Fix - Get Your App Working NOW

You're seeing the error screen because `VITE_API_URL` is not set. Follow these steps:

## 🎯 Two Options

### Option A: You Already Have Railway Backend (2 minutes)

If you've already deployed your backend to Railway:

1. **Get Your Railway URL:**
   - Go to https://railway.app/
   - Click your project
   - Go to **Settings** → **Networking**
   - Copy your domain (e.g., `https://vjs-production-xxxx.up.railway.app`)

2. **Set VITE_API_URL in Vercel:**
   - Go to https://vercel.com/dashboard
   - Click your **vjs** project
   - Go to **Settings** → **Environment Variables**
   - Click **Add New** (or edit existing)
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
     - Replace with your actual Railway URL
     - **Must include `/api` at the end**
   - Enable for **Production**
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **Redeploy**
   - Wait 1-2 minutes

**✅ Done!** Your app should work now.

---

### Option B: Deploy Backend First (10 minutes)

If you don't have a Railway backend yet:

#### Step 1: Deploy Backend to Railway (5 min)

1. **Go to Railway:**
   - https://railway.app/
   - Login with GitHub

2. **Create New Project:**
   - Click **"New Project"**
   - Click **"Deploy from GitHub repo"**
   - Select your **vjs** repository

3. **Configure:**
   - Click on the service
   - Go to **Settings** → **Build**
   - **Root Directory:** `server`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   Go to **Variables** tab and add:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://vjs-gamma.vercel.app
   USE_FILE_DB=true
   ```
   (You can add MongoDB later - for now, use file DB)

5. **Get Your Domain:**
   - Go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://vjs-production-xxxx.up.railway.app`)

#### Step 2: Set VITE_API_URL in Vercel (2 min)

1. Go to https://vercel.com/dashboard
2. Click your **vjs** project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
     - Replace with your Railway URL from Step 1
     - **Must include `/api` at the end**
5. Enable for **Production**
6. Click **Save**

#### Step 3: Redeploy Vercel (1 min)

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes

#### Step 4: Test (1 min)

1. Open https://vjs-gamma.vercel.app/
2. The error screen should be gone
3. Try logging in (PIN: 1234)
4. Try adding a booking

**✅ Done!** Your app is working!

---

## 🆘 Still Not Working?

### Check 1: Verify Railway Backend is Running

Visit: `https://your-railway-url.up.railway.app/health`

Should see:
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running"
}
```

### Check 2: Verify VITE_API_URL Format

In Vercel, make sure:
- ✅ Value starts with `https://`
- ✅ Value ends with `/api`
- ✅ Value is your Railway URL (not Vercel URL)
- ✅ Enabled for Production

**Correct:**
```
https://vjs-production-abc123.up.railway.app/api
```

**Wrong:**
```
/api                                    ← Missing domain
https://vjs-gamma.vercel.app/api        ← Wrong domain
https://vjs-production-abc123.up.railway.app  ← Missing /api
```

### Check 3: Check Browser Console

After redeploying:
1. Open https://vjs-gamma.vercel.app/
2. Press F12 (open console)
3. Look for:
   - ✅ `✅ API URL configured: https://your-railway-url...`
   - ❌ `❌ VITE_API_URL is not set...`

---

## 📝 Quick Checklist

- [ ] Railway backend deployed
- [ ] Railway domain copied
- [ ] `VITE_API_URL` set in Vercel = `https://your-railway-url.up.railway.app/api`
- [ ] Environment variable enabled for Production
- [ ] Vercel project redeployed
- [ ] Backend health check works
- [ ] App loads without error screen

---

**Need more help?** See:
- `RAILWAY_DEPLOY_NOW.md` - Detailed Railway setup
- `FIX_CORS_AND_API_URL.md` - CORS troubleshooting
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
