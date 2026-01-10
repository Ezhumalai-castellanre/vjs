# 🚀 Deployment Guide - VJK Mahal Booking System

## Overview

Deploy your booking system for **FREE** using:
- **Frontend**: Vercel (React app)
- **Backend**: Railway or Render (Express API)
- **Database**: MongoDB Atlas (Cloud database)

**Total Cost**: $0 (Free tier)

---

## 🎯 Quick Deployment (Recommended)

### Option 1: Vercel + Railway + MongoDB Atlas
- ✅ Fastest setup
- ✅ Auto-deployments from Git
- ✅ Free SSL certificates
- ✅ Global CDN

### Option 2: Netlify + Render + MongoDB Atlas
- ✅ Alternative option
- ✅ Similar features
- ✅ Also free

---

## 📦 Step-by-Step Deployment

# Part 1: Setup MongoDB Atlas (5 minutes)

## 1. Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (FREE - no credit card required)
3. Click "Build a Database"
4. Choose **M0 FREE** tier
5. Select closest region (e.g., AWS / us-east-1)
6. Cluster Name: `vjk-mahal`
7. Click "Create"

## 2. Create Database User

1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `vjkadmin`
4. Password: Create strong password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

## 3. Setup Network Access

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## 4. Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" button
3. Choose "Connect your application"
4. Copy connection string:
```
mongodb+srv://vjkadmin:<password>@vjk-mahal.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password
6. Save this for later!

---

# Part 2: Deploy Backend to Railway (10 minutes)

## 1. Prepare Backend for Deployment

Update `server/package.json` to add start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

## 2. Create Railway Account

1. Go to: https://railway.app/
2. Sign up with GitHub (FREE)
3. Click "New Project"
4. Click "Deploy from GitHub repo"

## 3. Connect GitHub Repository

1. Push your code to GitHub first:
```bash
cd /Users/ezhumalai/Public/vjs
git init
git add .
git commit -m "Initial commit - VJK Mahal"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Select your repository in Railway
3. Choose "server" as root directory

## 4. Set Environment Variables in Railway

1. Click your project
2. Click "Variables" tab
3. Add these variables:

```
MONGODB_URI=mongodb+srv://vjkadmin:YOUR_PASSWORD@vjk-mahal.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vjk_mahal
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

4. Click "Deploy"

## 5. Get Backend URL

After deployment completes:
1. Click "Settings"
2. Click "Generate Domain"
3. Copy your backend URL (e.g., `https://your-app.railway.app`)
4. Save this for frontend configuration!

---

# Part 3: Deploy Frontend to Vercel (5 minutes)

## 1. Update Frontend Configuration

Create `vercel.json` in project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 2. Create Vercel Account

1. Go to: https://vercel.com/signup
2. Sign up with GitHub (FREE)
3. Click "Add New" → "Project"
4. Import your GitHub repository

## 3. Configure Build Settings

1. **Root Directory**: Leave empty (or set to root)
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

## 4. Set Environment Variables

Add this environment variable:
```
VITE_API_URL=https://your-backend.railway.app/api
```
(Replace with your Railway backend URL)

## 5. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Get your live URL (e.g., `https://vjk-mahal.vercel.app`)

---

# Part 4: Update CORS Settings

## Update Backend CORS

Go back to Railway and update `FRONTEND_URL` variable:
```
FRONTEND_URL=https://vjk-mahal.vercel.app
```
(Replace with your actual Vercel URL)

Redeploy backend if needed.

---

## ✅ Final Checklist

- [ ] MongoDB Atlas database created
- [ ] Database user and network access configured
- [ ] Backend deployed to Railway
- [ ] Backend environment variables set
- [ ] Backend URL obtained
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] CORS updated with frontend URL
- [ ] Test the live app!

---

## 🧪 Test Your Deployment

1. Open your Vercel URL: `https://vjk-mahal.vercel.app`
2. Click "Management Login" (PIN: 1234)
3. Add a test booking
4. Check MongoDB Atlas to see the data
5. Open in another device to verify

---

## 🔧 Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. Go to: https://render.com/
2. Sign up (FREE)
3. Click "New" → "Web Service"
4. Connect GitHub repository
5. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)
7. Deploy!

---

## 📊 Monitoring & Maintenance

### Railway Dashboard
- View logs
- Monitor CPU/memory usage
- Restart service if needed

### Vercel Dashboard
- View deployment logs
- Monitor performance
- Automatic deployments on Git push

### MongoDB Atlas
- Monitor database usage
- View collections
- Backup data

---

## 🔐 Security for Production

### 1. Change Admin PIN

Update `src/App.jsx`:
```javascript
const ADMIN_PIN = "YOUR_SECURE_PIN"; // Change from 1234
```

### 2. Add Rate Limiting

Install in backend:
```bash
npm install express-rate-limit
```

Add to `server/server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Enable HTTPS Only

Both Vercel and Railway provide free SSL certificates automatically!

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **MongoDB Atlas** | 512 MB storage | $0.08/hr ($57/mo) |
| **Railway** | $5 credit/month | $0.000463/GB-hour |
| **Vercel** | 100 GB bandwidth | $20/month |

**Total FREE tier is sufficient for:**
- Up to 1000 bookings
- 10,000+ visitors per month
- 99.9% uptime

---

## 🚨 Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string has correct password
- Check Railway logs for errors

### Frontend can't reach backend
- Verify VITE_API_URL is correct
- Check CORS settings on backend
- Look at browser console for errors

### Deployment failed
- Check build logs in Vercel/Railway
- Verify all dependencies in package.json
- Ensure Node.js version compatibility

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `vjkmahal.com`)
4. Update DNS records as shown
5. Wait for SSL certificate (automatic)

### Add Custom Domain to Railway

1. Go to Railway project settings
2. Click "Custom Domain"
3. Add domain
4. Update DNS CNAME record

---

## 📈 Scaling Tips

### If you outgrow free tier:

**MongoDB Atlas:**
- Upgrade to M10 ($57/month) for 10GB storage
- Enable backups
- Add read replicas

**Railway/Render:**
- Upgrade to paid plan for more resources
- Add multiple instances for load balancing

**Vercel:**
- Upgrade to Pro ($20/month) for more bandwidth
- Add custom domain
- Enable analytics

---

## ✅ You're Live!

Your VJK Mahal booking system is now:
- ✅ Accessible from anywhere in the world
- ✅ Running on professional infrastructure
- ✅ Using cloud database
- ✅ Auto-deploying from Git
- ✅ SSL secured (HTTPS)
- ✅ Backed up automatically

**Share your URL with customers!** 🎊

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/

Good luck with your deployment! 🚀

