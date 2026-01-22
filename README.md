# VJK Mahal Event Booking System

A modern, responsive event booking system for VJK Mahal built with React, Firebase, and Tailwind CSS.

## Features

- 📅 **Interactive Calendar** - View availability at a glance
- 🔒 **Admin Mode** - Secure PIN-protected management interface
- 👥 **Customer Mode** - Public view for checking availability
- 💰 **Complete Booking Management**:
  - Owner name and contact details
  - Price, advance, and paid amount tracking
  - Automatic balance calculation
  - Payment status indicators (Fully Paid / Balance Due)
  - Booking notes and special requirements
- ✏️ **Edit & Update** - Modify existing bookings anytime
- 🗑️ **Delete Bookings** - Remove cancelled bookings
- 🎨 **Beautiful UI** - Modern design with maroon and gold theme
- 📱 **Fully Responsive** - Works seamlessly on mobile and desktop
- 🔥 **Real-time Updates** - Powered by Firebase Firestore
- ⚡ **Fast & Modern** - Built with Vite for optimal performance

## 🚀 Quick Start - Deploy to Production

**Your app is already deployed on Vercel!** But you need to configure the backend.

### ⚡ Quick Setup (5 minutes)

1. **Deploy Backend to Railway** → See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
2. **Set VITE_API_URL in Vercel** → See [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)

**Or follow the complete guide:** [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)

---

## 💻 Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd /Users/ezhumalai/Public/vjs
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd server
npm install
cd ..
```

4. Start backend server:

```bash
cd server
npm start
# Server runs on http://localhost:5000
```

5. Start frontend (in another terminal):

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```
PORT=5000
FRONTEND_URL=http://localhost:5173
USE_FILE_DB=true
NODE_ENV=development
```

---

## 📚 Documentation

- **Complete Setup Guide:** [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)
- **Quick Deployment:** [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
- **Railway Setup:** [RAILWAY_DEPLOY_NOW.md](./RAILWAY_DEPLOY_NOW.md)
- **Troubleshooting:** [QUICK_FIX_NOW.md](./QUICK_FIX_NOW.md)
- **MongoDB Setup:** [MONGODB_ATLAS_SETUP_DETAILED.md](./MONGODB_ATLAS_SETUP_DETAILED.md)

---

## 🔥 Legacy: Firebase Setup (Optional)

**Note:** The app now uses MongoDB/File-based storage. Firebase setup is optional.

**See the complete Firebase setup guide:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

Quick steps:
- Create a Firebase project
- Enable Anonymous Authentication
- Create Firestore Database
- Copy your config to `src/App.jsx` (lines 44-51)

4. Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Anonymous Authentication** in Firebase Authentication
3. Create a **Firestore Database** and set up the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/hall_events/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Configuration

### Admin PIN

The default admin PIN is `1234`. To change it, edit the `ADMIN_PIN` constant in `src/App.jsx`:

```javascript
const ADMIN_PIN = "1234"; // Change this to your desired PIN
```

### Max Events Per Day

By default, 2 events can be booked per day. To change this, edit the `MAX_EVENTS` constant:

```javascript
const MAX_EVENTS = 2; // Change to allow more events per day
```

### Time Slots

Time slots can be customized by editing the `TIME_SLOTS` array:

```javascript
const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "All Day"];
```

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
vjs/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # This file
```

## Usage

### Customer Mode
- Click "Check Availability" to view the calendar
- Green dates are fully available
- White dates are partially booked
- Maroon dates are fully booked
- Click any date to see booking details

### Admin Mode
- Click "Management Login" and enter PIN (default: 1234)
- View all bookings with complete details in the calendar
- Click any date to manage bookings

**Add New Booking:**
- Enter event name (e.g., Wedding)
- Owner name and phone number
- Select time slot
- Enter price, advance, and paid amounts
- Add notes (optional)
- Click "Add Booking"

**Edit Existing Booking:**
- Click the edit icon (✏️) on any booking
- Update any field
- Click "Update Booking"

**Delete Booking:**
- Click the trash icon (🗑️) on any booking

**Payment Tracking:**
- View Price, Advance, and Paid amounts
- Automatic balance calculation
- Visual indicators:
  - 🟢 Green = Fully Paid
  - 🔴 Red = Balance Due

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend and authentication
- **date-fns** - Date manipulation library
- **lucide-react** - Beautiful icon library

## License

This project is private and proprietary to VJK Mahal.

## Support

For issues or questions, please contact the development team.

