# 🍃 MongoDB Setup Guide - VJK Mahal Booking System

## Overview
Your VJK Mahal booking system now uses **MongoDB** as the database with an Express.js backend API.

---

## 📦 Project Structure

```
vjs/
├── src/                    # React Frontend
│   ├── App.jsx            # Updated to use MongoDB API
│   ├── main.jsx
│   └── index.css
├── server/                 # Express.js Backend (NEW!)
│   ├── server.js          # Main server file
│   ├── db.js              # MongoDB connection
│   ├── routes/
│   │   └── bookings.js    # Booking API routes
│   ├── package.json       # Backend dependencies
│   └── .env               # Backend configuration
├── package.json           # Frontend dependencies
└── README.md
```

---

## 🚀 Installation & Setup

### Step 1: Install MongoDB

**Option A: Install MongoDB Locally**

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and run as a service

**Option B: Use MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create a cluster
- Get connection string
- Update `server/.env` with your connection string

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Configure Environment Variables

The `.env` file is already created in `server/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=vjk_mahal
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas:**
Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Step 4: Start MongoDB (if using local installation)

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically as a service

### Step 5: Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
=================================
🚀 VJK Mahal API Server Started
=================================
📍 Server URL: http://localhost:5000
📍 Health Check: http://localhost:5000/health
📍 API Endpoint: http://localhost:5000/api/bookings
🌐 Frontend URL: http://localhost:3000
=================================
✅ Connected to MongoDB: vjk_mahal
✅ Collection "bookings" created with validation schema
```

### Step 6: Start the Frontend

**In a new terminal:**
```bash
cd /Users/ezhumalai/Public/vjs
npm run dev
```

Your app will be at: **http://localhost:3000/**

---

## 📊 MongoDB Database Structure

### Database: `vjk_mahal`

### Collection: `bookings`

**Document Structure:**
```javascript
{
  _id: ObjectId("..."),
  date: "2026-01-15",           // Unique date in YYYY-MM-DD format
  bookings: [
    {
      id: "1736512345678",       // Unique booking ID
      name: "Wedding Ceremony",  // Event name
      customerName: "Rajesh Kumar",
      phone: "9876543210",
      slot: "All Day",           // "Morning" | "Afternoon" | "Evening" | "All Day"
      price: 75000,
      advance: 15000,
      pending: 60000,            // Auto-calculated: price - advance
      notes: "Stage decoration needed",
      createdAt: "2026-01-10T10:30:00.000Z",
      updatedAt: "2026-01-10T15:45:00.000Z"
    },
    {
      // Second booking if exists (max 2 per day)
    }
  ],
  updatedAt: "2026-01-10T15:45:00.000Z"
}
```

### Indexes:
- `date`: Unique index for fast queries by date

### Validation Schema:
- ✅ Date format: YYYY-MM-DD
- ✅ Bookings must be an array
- ✅ Required fields: id, name, customerName, slot, price, advance, pending
- ✅ Slot must be one of: Morning, Afternoon, Evening, All Day
- ✅ Price, advance, pending must be non-negative numbers

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running",
  "timestamp": "2026-01-10T10:30:00.000Z"
}
```

### 2. Get All Bookings
```http
GET /api/bookings
```
**Response:**
```json
{
  "2026-01-15": [
    {
      "id": "1736512345678",
      "name": "Wedding Ceremony",
      "customerName": "Rajesh Kumar",
      "phone": "9876543210",
      "slot": "All Day",
      "price": 75000,
      "advance": 15000,
      "pending": 60000,
      "notes": "Stage decoration",
      "createdAt": "2026-01-10T10:30:00.000Z"
    }
  ],
  "2026-01-20": [...]
}
```

### 3. Get Bookings for Specific Date
```http
GET /api/bookings/:date
```
**Example:** `GET /api/bookings/2026-01-15`

**Response:**
```json
[
  {
    "id": "1736512345678",
    "name": "Wedding Ceremony",
    "customerName": "Rajesh Kumar",
    ...
  }
]
```

### 4. Create/Update Bookings for a Date
```http
POST /api/bookings/:date
Content-Type: application/json

{
  "bookings": [
    {
      "id": "1736512345678",
      "name": "Wedding Ceremony",
      "customerName": "Rajesh Kumar",
      "phone": "9876543210",
      "slot": "All Day",
      "price": 75000,
      "advance": 15000,
      "pending": 60000,
      "notes": "Stage decoration",
      "createdAt": "2026-01-10T10:30:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Bookings updated",
  "date": "2026-01-15",
  "bookings": [...]
}
```

### 5. Delete All Bookings for a Date
```http
DELETE /api/bookings/:date
```

**Response:**
```json
{
  "message": "Bookings deleted",
  "date": "2026-01-15"
}
```

---

## 🧪 Testing the Setup

### Test 1: Check MongoDB Connection
```bash
mongosh

# In MongoDB shell:
use vjk_mahal
show collections
# Should show: bookings

db.bookings.find().pretty()
# Should show any existing bookings
```

### Test 2: Test API Health
```bash
curl http://localhost:5000/health
```

### Test 3: Test API - Get All Bookings
```bash
curl http://localhost:5000/api/bookings
```

### Test 4: Test API - Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings/2026-01-15 \
  -H "Content-Type: application/json" \
  -d '{
    "bookings": [{
      "id": "1736512345678",
      "name": "Test Wedding",
      "customerName": "John Doe",
      "phone": "9876543210",
      "slot": "All Day",
      "price": 50000,
      "advance": 10000,
      "pending": 40000,
      "notes": "Test booking",
      "createdAt": "2026-01-10T10:30:00.000Z"
    }]
  }'
```

### Test 5: Verify in MongoDB
```bash
mongosh
use vjk_mahal
db.bookings.find().pretty()
```

---

## 🔧 Development Scripts

### Backend (in `server/` directory):
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
```

### Frontend (in root directory):
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 📱 Frontend Changes

The React app now uses the MongoDB API instead of Firebase:

**Before (Firebase):**
```javascript
const db = getFirestore(app);
onSnapshot(collection(db, 'hall_events'), ...)
```

**After (MongoDB API):**
```javascript
const API_URL = 'http://localhost:5000/api';
fetch(`${API_URL}/bookings`)
```

**Polling for Updates:**
The app now polls the API every 5 seconds to get updated data (simulating real-time).

---

## 🔐 Security Considerations

### Current Setup (Development):
- ✅ CORS enabled for local frontend
- ✅ Input validation via MongoDB schema
- ⚠️ No authentication (add JWT/sessions for production)
- ⚠️ MongoDB running without authentication (okay for local dev)

### For Production:
1. **Enable MongoDB Authentication:**
```bash
mongod --auth
```

2. **Create Admin User:**
```bash
mongosh
use admin
db.createUser({
  user: "vjkadmin",
  pwd: "secure_password",
  roles: ["readWriteAnyDatabase"]
})
```

3. **Update Connection String:**
```env
MONGODB_URI=mongodb://vjkadmin:secure_password@localhost:27017/
```

4. **Add API Authentication:**
- Implement JWT tokens
- Add authentication middleware
- Secure admin routes

5. **Use Environment Variables:**
- Never commit `.env` files
- Use different configs for dev/production

---

## 🚨 Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Start MongoDB if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### Error: "Port 5000 already in use"
**Solution:**
```bash
# Change PORT in server/.env
PORT=5001

# Or kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Error: "CORS policy blocking requests"
**Solution:**
Check that `FRONTEND_URL` in `server/.env` matches your frontend URL.

### Error: "Collection validation failed"
**Solution:**
Your booking data doesn't match the schema. Check that all required fields are present and correctly formatted.

---

## 📊 MongoDB GUI Tools

**Recommended Tools:**
1. **MongoDB Compass** (Official GUI)
   - Download: https://www.mongodb.com/products/compass
   - Connect to: `mongodb://localhost:27017`

2. **Studio 3T** (Advanced features)
   - Download: https://studio3t.com/

3. **VS Code Extension**
   - Install: "MongoDB for VS Code"
   - Connect to your local/Atlas database

---

## 🎯 Next Steps

1. ✅ Start MongoDB
2. ✅ Start backend server (`cd server && npm run dev`)
3. ✅ Start frontend (`npm run dev`)
4. ✅ Test the application
5. ✅ Check MongoDB Compass to see data
6. 🔜 Add authentication for production
7. 🔜 Deploy to production (MongoDB Atlas + Vercel/Heroku)

---

## 📞 Support

If you encounter issues:
1. Check MongoDB is running: `mongosh`
2. Check backend logs in terminal
3. Check browser console for frontend errors
4. Verify `.env` configuration
5. Test API endpoints with `curl` or Postman

---

## ✅ Migration Complete!

Your VJK Mahal booking system is now running on:
- **Frontend:** React + Vite (http://localhost:3000)
- **Backend:** Express.js + MongoDB (http://localhost:5000)
- **Database:** MongoDB (localhost:27017/vjk_mahal)

All features working:
- ✅ Add bookings
- ✅ Edit bookings
- ✅ Delete bookings
- ✅ View past bookings
- ✅ Customer name, Price, Advance, Pending
- ✅ Auto-calculated pending amount
- ✅ Yellow partial bookings
- ✅ Responsive design

🎉 **Enjoy your MongoDB-powered booking system!**

