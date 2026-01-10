# ⚡ Quick Deploy Guide (15 Minutes)

## 🎯 Three Simple Steps

### Step 1: MongoDB Atlas (5 min)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up FREE
3. Create M0 FREE cluster
4. Create user: `vjkadmin` with password
5. Network Access: Allow 0.0.0.0/0
6. Get connection string

### Step 2: Deploy Backend (5 min)
1. Go to https://railway.app/
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Add environment variables:
   ```
   MONGODB_URI=your_connection_string
   DATABASE_NAME=vjk_mahal
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Deploy!
6. Get your backend URL

### Step 3: Deploy Frontend (5 min)
1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Import your repository
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy!

## ✅ Done!

Your app is now live at: `https://your-app.vercel.app`

---

## 🔐 Important: Update CORS

Go back to Railway and update `FRONTEND_URL` with your Vercel URL.

---

## 🎊 You're Live!

Test your app:
- Login with PIN: 1234
- Add a booking
- Check MongoDB Atlas to see data

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md`

