# ☁️ Quick MongoDB Atlas Setup (5 Minutes)

MongoDB Atlas is a FREE cloud database - no installation needed!

## Step 1: Create Account (2 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email (FREE - no credit card!)
3. Click **"Create"** button

## Step 2: Create FREE Cluster (1 minute)

1. Choose **M0 FREE** tier
2. Select closest region (e.g., AWS / us-east-1)
3. Cluster Name: `VJKMahal` or keep default
4. Click **"Create Deployment"**

## Step 3: Set Up Security (1 minute)

**Database User:**
- Username: `vjkadmin`
- Password: Create a strong password (save it!)
- Click **"Create User"**

**Network Access:**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (for development)
- Click **"Confirm"**

## Step 4: Get Connection String (1 minute)

1. Click **"Connect"** button
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
```
mongodb+srv://vjkadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. Replace `<password>` with your actual password

## Step 5: Update Your App

Paste this into your terminal:

```bash
cat > /Users/ezhumalai/Public/vjs/server/.env << 'EOF'
MONGODB_URI=mongodb+srv://vjkadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vjk_mahal
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
```

**⚠️ Replace:**
- `YOUR_PASSWORD` with your database password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

## Step 6: Start Server

```bash
cd /Users/ezhumalai/Public/vjs/server
npm start
```

## ✅ Done!

You should see:
```
✅ Connected to MongoDB: vjk_mahal
🚀 VJK Mahal API Server Started
```

---

## 🎯 Alternative: I Can Create Test Credentials

If you want, I can set up a temporary test database for you to try immediately!

Just say "use test database" and I'll configure it for you.

