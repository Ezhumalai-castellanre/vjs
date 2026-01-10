# 🔥 Firebase Setup Guide for VJK Mahal

Follow these steps to connect your VJK Mahal booking system to Firebase.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `VJK-Mahal` (or your preferred name)
4. Disable Google Analytics (optional) or leave it enabled
5. Click **"Create project"**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter app nickname: `VJK Mahal Web`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration object that appears (you'll need this soon)

## Step 3: Enable Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Anonymous"**
5. Toggle the **"Enable"** switch
6. Click **"Save"**

## Step 4: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set rules next)
4. Select your preferred location (closest to your users)
5. Click **"Enable"**

## Step 5: Set Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access, authenticated write access
    match /artifacts/{appId}/public/data/hall_events/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Configure Your App

1. Open `src/App.jsx` in your code editor
2. Find the `firebaseConfig` object (around line 44-51)
3. Replace it with your Firebase config from Step 2:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 7: Test Your Connection

1. Save the file (the dev server will auto-reload)
2. Open your browser to http://localhost:3000
3. You should see the landing page load successfully
4. Try adding a booking in Admin mode (PIN: 1234)
5. Check Firebase Console → Firestore Database to see the data

## 📊 Data Structure

Your bookings will be stored in Firestore with this structure:

```
artifacts/
  └── vjk-mahal-system/
      └── public/
          └── data/
              └── hall_events/
                  └── 2026-01-15/ (document for each date)
                      └── items: [
                            {
                              id: "1736512345678",
                              name: "Wedding Ceremony",
                              ownerName: "John Doe",
                              phone: "9876543210",
                              slot: "All Day",
                              price: 50000,
                              advance: 10000,
                              paid: 25000,
                              notes: "Special decoration required",
                              createdAt: "2026-01-10T10:30:00.000Z"
                            }
                          ]
```

## 🔐 Security Notes

- Anonymous authentication is enabled for ease of use
- Only authenticated users can write data
- All users can read booking data
- Consider upgrading to email/password auth for production

## 🚀 Optional: Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
   - Select "Hosting"
   - Choose your existing project
   - Set public directory to: `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. Build your app:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## 📞 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Double-check your API key in `firebaseConfig`
- Make sure you copied the complete config object

### "Missing or insufficient permissions"
- Verify Firestore rules are published correctly
- Check that Anonymous auth is enabled

### "Network Error"
- Check your internet connection
- Verify Firebase project is active
- Check browser console for detailed errors

### Data not showing up
- Open browser DevTools → Console
- Look for any error messages
- Verify the `appId` matches your setup

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Anonymous authentication enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Firebase config copied to App.jsx
- [ ] App loads without errors
- [ ] Can add bookings in admin mode
- [ ] Data appears in Firebase Console
- [ ] Can edit and delete bookings

---

Need help? Check the Firebase documentation: https://firebase.google.com/docs/web/setup

