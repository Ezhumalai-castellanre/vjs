# ✅ Complete Setup Guide - VJK Mahal

This guide will help you set up everything from scratch.

## 🎯 Quick Overview

Your app needs:
1. **Frontend** → Deployed on Vercel ✅ (Already done)
2. **Backend** → Deploy to Railway (5 minutes)
3. **Database** → MongoDB Atlas (optional, can use file DB)

---

## 📋 Step-by-Step Setup

### Step 1: Deploy Backend to Railway (5 minutes)

#### 1.1 Create Railway Account
1. Go to https://railway.app/
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

#### 1.2 Deploy Your Backend
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select your **`vjs`** repository
4. Railway will start deploying

#### 1.3 Configure Build Settings
1. Click on your deployed service
2. Go to **Settings** tab
3. Scroll to **"Build"** section
4. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install` (or leave default)
   - **Start Command:** `npm start`

#### 1.4 Add Environment Variables
Go to **Variables** tab and add:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=true
```

**Note:** You can add MongoDB later. For now, file-based DB works fine.

#### 1.5 Get Your Backend URL
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://vjs-production-xxxx.up.railway.app`)
4. **Save this URL!** You'll need it for Vercel.

#### 1.6 Test Your Backend
Open in browser: `https://your-railway-url.up.railway.app/health`

Should see:
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running"
}
```

✅ **Backend is ready!**

---

### Step 2: Configure Vercel Frontend (2 minutes)

#### 2.1 Set Environment Variable
1. Go to https://vercel.com/dashboard
2. Click your **`vjs`** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Enter:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
     - Replace `your-railway-url` with your actual Railway URL from Step 1.5
     - **Must include `/api` at the end**
   - **Environment:** Select **Production** (and Preview/Development if you want)
6. Click **Save**

#### 2.2 Redeploy
1. Go to **Deployments** tab
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes for deployment to complete

✅ **Frontend is configured!**

---

### Step 3: Test Your App (1 minute)

1. Open https://vjs-gamma.vercel.app/
2. The error screen should be gone
3. Try logging in with PIN: `1234`
4. Try adding a booking
5. Check if it saves successfully

✅ **Your app is working!**

---

## 🔧 Optional: Setup MongoDB (5 minutes)

If you want to use MongoDB instead of file-based storage:

### 3.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (FREE)
3. Create **M0 FREE** cluster
4. Wait 3-5 minutes for cluster to be ready

### 3.2 Configure Database Access
1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Username: `vjkadmin`
4. Password: Create a strong password (save it!)
5. Privileges: **"Read and write to any database"**
6. Click **"Add User"**

### 3.3 Configure Network Access
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 3.4 Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://vjkadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

### 3.5 Update Railway Variables
1. Go back to Railway
2. Go to **Variables** tab
3. Update:
   - `USE_FILE_DB` = `false`
   - Add `MONGODB_URI` = `mongodb+srv://vjkadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Add `DATABASE_NAME` = `vjk_mahal`
4. Railway will auto-redeploy

✅ **MongoDB is configured!**

---

## 🆘 Troubleshooting

### Error: "API endpoint is not configured"
**Fix:** Set `VITE_API_URL` in Vercel environment variables (Step 2.1)

### Error: "CORS policy blocked"
**Fix:** Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly

### Error: "Cannot connect to backend"
**Fix:** 
1. Check Railway backend is running (visit `/health` endpoint)
2. Verify `VITE_API_URL` has correct Railway URL
3. Make sure URL ends with `/api`

### Backend shows "File-based" instead of MongoDB
**Fix:** Set `USE_FILE_DB=false` and add `MONGODB_URI` in Railway variables

---

## 📝 Environment Variables Summary

### Vercel (Frontend)
```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

### Railway (Backend)
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=true
```

### Railway (Backend with MongoDB)
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://vjs-gamma.vercel.app
USE_FILE_DB=false
MONGODB_URI=mongodb+srv://vjkadmin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vjk_mahal
```

---

## ✅ Checklist

- [ ] Railway backend deployed
- [ ] Railway domain generated and copied
- [ ] Railway environment variables set
- [ ] Backend health check works (`/health` endpoint)
- [ ] `VITE_API_URL` set in Vercel
- [ ] Vercel project redeployed
- [ ] App loads without error screen
- [ ] Can login (PIN: 1234)
- [ ] Can add bookings
- [ ] Bookings save successfully

---

## 🎊 You're Done!

Your VJK Mahal booking system is now live and working!

**Frontend:** https://vjs-gamma.vercel.app/
**Backend:** https://your-railway-url.up.railway.app

Need help? Check:
- `QUICK_FIX_NOW.md` - Quick troubleshooting
- `RAILWAY_DEPLOY_NOW.md` - Detailed Railway setup
- `FIX_CORS_AND_API_URL.md` - CORS issues
