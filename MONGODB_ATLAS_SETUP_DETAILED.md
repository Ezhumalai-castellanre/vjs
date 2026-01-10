# 🍃 MongoDB Atlas Setup - Step-by-Step Guide

## ⏱️ Time Required: 5-7 minutes

---

## Step 1: Create MongoDB Atlas Account (2 minutes)

### 1.1 Go to Registration Page
👉 **URL**: https://www.mongodb.com/cloud/atlas/register

### 1.2 Sign Up Options
Choose ONE of these:
- ✅ **Sign up with Google** (Recommended - fastest)
- ✅ Sign up with GitHub
- ✅ Sign up with Email

**No credit card required!** ✅

### 1.3 Complete Registration
- Accept Terms of Service
- Click "Create your Atlas account"
- You'll be redirected to MongoDB Atlas dashboard

---

## Step 2: Create Your First Database Cluster (2 minutes)

### 2.1 Welcome Screen
You'll see: **"Welcome to Atlas - Let's get started"**

Click: **"Create"** or **"Build a Database"** button

### 2.2 Choose Deployment Type
You'll see three options:
1. **Serverless** (Pay as you go)
2. **Dedicated** (High performance)
3. **Shared** ⭐ **← Choose This (FREE)**

Click: **"Create"** under **Shared** (M0 Free tier)

### 2.3 Configure Your Cluster

**Cloud Provider & Region:**
- Provider: **AWS** (recommended) or Google Cloud or Azure
- Region: Choose **closest to your location**
  - For India: `Mumbai (ap-south-1)`
  - For USA: `N. Virginia (us-east-1)`
  - For Europe: `Ireland (eu-west-1)`

**Cluster Tier:**
- Should already be selected: **M0 Sandbox (Free)**
- Storage: 512 MB (sufficient for your app)

**Cluster Name:**
- Default: `Cluster0`
- Or change to: `vjk-mahal` (optional)

**Additional Settings:**
- Leave everything else as default
- MongoDB Version: Latest (already selected)

Click: **"Create Cluster"** button (bottom right)

⏳ **Wait 3-5 minutes** - Your cluster is being created!

You'll see: "Your cluster is being created..."

---

## Step 3: Setup Security (Username & Password) (1 minute)

### 3.1 Security Quickstart

A popup will appear: **"Security Quickstart"**

**Step 1: How would you like to authenticate your connection?**

Choose: **Username and Password**

Fill in:
- **Username**: `vjkadmin`
- **Password**: Click "Autogenerate Secure Password" 
  - **⚠️ IMPORTANT**: Copy and save this password!
  - Or create your own strong password

**Save your credentials:**
```
Username: vjkadmin
Password: [YOUR_PASSWORD_HERE]
```

Click: **"Create User"**

---

## Step 4: Setup Network Access (IP Whitelist) (1 minute)

### 4.1 Where would you like to connect from?

You'll see: **"Add entries to your IP Access List"**

**Option 1: For Development/Testing** (Recommended for now)
- Choose: **"My Local Environment"**
- Click: **"Add My Current IP Address"**
- Then click: **"Add Entry"**

**Option 2: For Production** (Do this when deploying)
- Click: **"Add a Different IP Address"**
- IP Address: `0.0.0.0/0`
- Description: `Allow from anywhere`
- Click: **"Add Entry"**

**⚠️ Note**: `0.0.0.0/0` allows connections from anywhere - needed for cloud hosting (Railway, Vercel, etc.)

Click: **"Finish and Close"**

You'll see: "Congratulations on setting up access rules!"

Click: **"Go to Database"**

---

## Step 5: Get Your Connection String (2 minutes)

### 5.1 Navigate to Connect

On the Database page:
1. Find your cluster (Cluster0 or vjk-mahal)
2. Click the **"Connect"** button

### 5.2 Choose Connection Method

You'll see: **"Connect to Cluster"**

Click: **"Drivers"** (Connect your application)

### 5.3 Select Your Driver

- **Driver**: Node.js
- **Version**: 6.7 or later (latest)

### 5.4 Copy Connection String

You'll see a connection string like:

```
mongodb+srv://vjkadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ IMPORTANT STEPS:**

1. **Copy the entire string**
2. **Replace `<password>` with your actual password** (from Step 3)
3. **Remove any `<>` brackets**

**Example:**
```
Before:
mongodb+srv://vjkadmin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority

After:
mongodb+srv://vjkadmin:MySecurePass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**Save this connection string!** You'll need it for deployment.

---

## Step 6: Test Your Connection (Optional but Recommended)

### 6.1 Update Local Backend Configuration

Open: `server/.env`

Replace the existing `MONGODB_URI` with your Atlas connection string:

```env
MONGODB_URI=mongodb+srv://vjkadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=vjk_mahal
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
USE_FILE_DB=false
```

**⚠️ Make sure to**:
- Replace `YOUR_PASSWORD` with actual password
- Set `USE_FILE_DB=false` to use MongoDB instead of file database

### 6.2 Restart Your Backend

```bash
# Stop the current server (Ctrl+C in the terminal)
cd /Users/ezhumalai/Public/vjs/server
npm start
```

### 6.3 You Should See:

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB: vjk_mahal
✅ Collection "bookings" created with validation schema
🚀 VJK Mahal API Server Started
```

### 6.4 Test in Your App

1. Go to: http://localhost:3000
2. Login as admin (PIN: 1234)
3. Add a test booking
4. Check MongoDB Atlas to verify data was saved!

---

## Step 7: Verify Data in MongoDB Atlas

### 7.1 View Your Data

1. Go to: https://cloud.mongodb.com/
2. Click: **"Database"** (left sidebar)
3. Click: **"Browse Collections"** on your cluster
4. You should see:
   - Database: `vjk_mahal`
   - Collection: `bookings`
   - Documents: Your test booking!

**Example Document:**
```json
{
  "_id": "ObjectId(...)",
  "date": "2026-01-15",
  "bookings": [
    {
      "id": "1736512345678",
      "name": "Test Wedding",
      "customerName": "John Doe",
      "phone": "9876543210",
      "slot": "All Day",
      "price": 50000,
      "advance": 10000,
      "pending": 40000,
      "notes": "Test booking",
      "createdAt": "2026-01-10T..."
    }
  ]
}
```

---

## 🎊 Success! MongoDB Atlas is Setup!

### ✅ What You've Accomplished:

- ✅ Created free MongoDB Atlas account
- ✅ Created M0 Free cluster (512 MB)
- ✅ Created database user: `vjkadmin`
- ✅ Configured network access
- ✅ Got connection string
- ✅ Tested connection (optional)
- ✅ Verified data storage

---

## 📋 Save These Details for Deployment:

```
MongoDB Atlas Credentials:
================================
Username: vjkadmin
Password: [YOUR_PASSWORD]

Connection String:
mongodb+srv://vjkadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

Database Name: vjk_mahal
Collection: bookings
```

---

## 🚀 Next Steps:

### For Local Development:
✅ You're done! Your app now uses MongoDB Atlas

### For Deployment:
Now you can proceed to deploy your backend and frontend:

1. **Deploy Backend to Railway:**
   - Use the connection string as `MONGODB_URI` environment variable

2. **Deploy Frontend to Vercel:**
   - Point to your Railway backend URL

See `QUICK_DEPLOY.md` for deployment steps!

---

## 🔧 MongoDB Atlas Features You Can Use:

### 1. Database Dashboard
- View all databases and collections
- Monitor storage usage
- See connection activity

### 2. Browse Collections
- View all documents
- Add/edit/delete documents manually
- Run queries

### 3. Monitoring
- Track database performance
- View operation metrics
- Monitor connections

### 4. Backups (Paid feature)
- Automatic backups
- Point-in-time recovery
- Download snapshots

### 5. Atlas Search (Free tier limited)
- Full-text search
- Fuzzy matching
- Autocomplete

---

## 🔐 Security Best Practices:

### ✅ Do:
- Use strong passwords
- Rotate passwords regularly
- Use specific IP addresses when possible
- Enable 2FA on your Atlas account
- Use different users for different apps

### ❌ Don't:
- Share passwords publicly
- Commit connection strings to Git
- Use default usernames
- Leave `0.0.0.0/0` for production (if avoidable)
- Use same password for multiple apps

---

## 🆘 Troubleshooting:

### Problem: "Authentication failed"
**Solution:**
- Check username/password are correct
- Ensure `<password>` is replaced in connection string
- Password should not have special characters that need encoding

### Problem: "Network error" or "Connection timeout"
**Solution:**
- Check IP address is whitelisted
- Try `0.0.0.0/0` for testing
- Check your internet connection
- Verify firewall settings

### Problem: "Can't connect from Railway/Vercel"
**Solution:**
- Make sure `0.0.0.0/0` is in IP Access List
- Verify connection string is correct
- Check environment variables are set

### Problem: "Database/Collection not found"
**Solution:**
- MongoDB creates them automatically on first write
- Try adding a booking to create the collection
- Database name is case-sensitive

---

## 📊 Monitor Your Usage:

### Free Tier Limits (M0):
- Storage: 512 MB
- RAM: Shared
- Connections: Max 500 concurrent
- Bandwidth: Unlimited

### Check Your Usage:
1. Go to MongoDB Atlas
2. Click "Database"
3. See usage metrics on dashboard
4. Monitor storage: Used / 512 MB

**You'll get email alerts when approaching limits**

---

## 🎓 Learn More:

- **Official Docs**: https://www.mongodb.com/docs/atlas/
- **Getting Started**: https://www.mongodb.com/docs/atlas/getting-started/
- **Connection Strings**: https://www.mongodb.com/docs/manual/reference/connection-string/
- **Security**: https://www.mongodb.com/docs/atlas/security/

---

## ✅ Checklist:

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created (vjkadmin)
- [ ] IP whitelist configured
- [ ] Connection string obtained and saved
- [ ] Password saved securely
- [ ] Connection tested locally (optional)
- [ ] Data verified in Atlas dashboard
- [ ] Ready to deploy!

---

**🎊 Congratulations! You've successfully set up MongoDB Atlas!**

Your VJK Mahal booking system now has a professional cloud database! 🚀

