# 🚂 Deploy Backend to Railway RIGHT NOW

## ✅ Your code is already on GitHub!

Let's deploy your backend in 5 minutes.

---

## 🚀 Step-by-Step Railway Deployment

### Step 1: Open Railway (1 minute)

👉 **Go to**: https://railway.app/

Click: **"Login"** or **"Start a New Project"**

**Login with GitHub** (recommended)
- Click "Login with GitHub"
- Authorize Railway
- You're in!

---

### Step 2: Create New Project (1 minute)

Click: **"New Project"** button (top right)

You'll see options:
- Deploy from GitHub repo ⭐ **← Choose this**
- Provision MySQL
- Provision PostgreSQL
- Deploy a Template

Click: **"Deploy from GitHub repo"**

---

### Step 3: Select Your Repository (1 minute)

You'll see your GitHub repositories.

Find and click: **`vjs`** (your VJK Mahal project)

**⚠️ IMPORTANT - Configure Source:**

Railway will ask: "Where is your code?"

Since your backend is in the `server` folder, you need to configure:

1. Click on the deployed service
2. Click "Settings" tab
3. Scroll to "Build" section
4. **Root Directory**: Enter `server`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`

Click "Deploy" if it hasn't started yet.

---

### Step 4: Add Environment Variables (2 minutes)

While it's deploying, set up environment variables:

1. Click on your service (in Railway dashboard)
2. Click **"Variables"** tab
3. Click **"+ New Variable"**

Add these variables ONE BY ONE:

#### Variable 1: MONGODB_URI
```
mongodb+srv://vjkadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
**⚠️ Replace with your actual MongoDB Atlas connection string!**

#### Variable 2: DATABASE_NAME
```
vjk_mahal
```

#### Variable 3: PORT
```
5000
```

#### Variable 4: NODE_ENV
```
production
```

#### Variable 5: FRONTEND_URL
```
https://vjs-pht12h1fw-ezhumalai-castellanres-projects.vercel.app
```

#### Variable 6: USE_FILE_DB
```
false
```

Click "Add" after each variable.

---

### Step 5: Generate Public Domain (1 minute)

Your backend needs a public URL:

1. Click "Settings" tab
2. Scroll to "Networking" section
3. Click "Generate Domain"

Railway will create a URL like:
```
https://vjs-production-xxxx.up.railway.app
```

**📝 COPY THIS URL! You need it for Vercel!**

---

### Step 6: Wait for Deployment

Check the "Deployments" tab.

You should see:
```
✅ Build successful
✅ Deployed
```

Check the logs:
```
✅ Connected to MongoDB: vjk_mahal
🚀 VJK Mahal API Server Started
📍 Server URL: http://localhost:5000
```

---

### Step 7: Test Your Backend

Open in browser:
```
https://your-app.up.railway.app/health
```

You should see:
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running",
  "database": "File-based (JSON)",
  "timestamp": "2026-01-10..."
}
```

---

## 🎯 Now Update Vercel

### Go to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click your `vjs` project
3. Click "Settings"
4. Click "Environment Variables"

### Update VITE_API_URL

Find `VITE_API_URL` or add it:

**Variable name:**
```
VITE_API_URL
```

**Value:**
```
https://your-app.up.railway.app/api
```
**⚠️ Don't forget `/api` at the end!**

### Redeploy

1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait 1-2 minutes

---

## ✅ Done! Test Your App

Open your Vercel URL:
```
https://vjs-pht12h1fw-ezhumalai-castellanres-projects.vercel.app
```

Should work without CORS errors! 🎊

---

## 🆘 Troubleshooting

### Railway deployment failed?

**Check Build Logs:**
- Click "Deployments" tab
- Click on failed deployment
- Read error messages

**Common fixes:**
- Make sure "Root Directory" is set to `server`
- Check all environment variables are set
- MongoDB connection string has no spaces

### Still getting CORS errors?

**Check:**
- `FRONTEND_URL` in Railway matches your Vercel URL exactly
- `VITE_API_URL` in Vercel has `/api` at the end
- Both are using `https://` not `http://`

### Backend shows "File-based" instead of MongoDB?

**Fix:**
- Make sure `USE_FILE_DB` is set to `false`
- Check `MONGODB_URI` is correct
- Redeploy in Railway

---

## 📋 Quick Checklist

- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] Root directory set to `server`
- [ ] All 6 environment variables added
- [ ] Public domain generated
- [ ] Deployment successful
- [ ] Backend health check works
- [ ] Vercel env variable updated
- [ ] Vercel redeployed
- [ ] App works without errors!

---

## 🎊 Success!

Your VJK Mahal booking system is now LIVE!

**Frontend**: https://vjs-pht12h1fw-ezhumalai-castellanres-projects.vercel.app
**Backend**: https://your-app.up.railway.app
**Database**: MongoDB Atlas

**Test it:**
- Login with PIN: 1234
- Add a booking
- Check MongoDB Atlas to see the data!

🎉 Congratulations! You've deployed a full-stack app!

