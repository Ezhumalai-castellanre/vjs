# 📊 Firebase Data Flow Guide - VJK Mahal Booking System

## Overview
This document explains how booking data is stored, retrieved, and displayed in the VJK Mahal booking system.

---

## 🔥 Firebase Data Structure

### Database Path:
```
Firestore Database
└── artifacts/
    └── vjk-mahal-system/
        └── public/
            └── data/
                └── hall_events/
                    ├── 2026-01-15/          (Document for each date)
                    │   └── items: [...]     (Array of bookings)
                    ├── 2026-01-20/
                    │   └── items: [...]
                    └── 2026-02-05/
                        └── items: [...]
```

### Document Structure (Example: 2026-01-15):
```javascript
{
  items: [
    {
      id: "1736512345678",                    // Unique booking ID (timestamp)
      name: "Wedding Ceremony",               // Event name
      ownerName: "John Doe",                  // Owner/customer name
      phone: "9876543210",                    // Contact number
      slot: "All Day",                        // Time slot
      price: 50000,                           // Total price (number)
      advance: 10000,                         // Advance payment (number)
      paid: 25000,                            // Total amount paid (number)
      notes: "Special decoration required",   // Optional notes
      createdAt: "2026-01-10T10:30:00.000Z"  // When booking was created
    },
    {
      id: "1736512456789",
      name: "Birthday Party",
      ownerName: "Jane Smith",
      phone: "9998887776",
      slot: "Evening",
      price: 30000,
      advance: 5000,
      paid: 30000,
      notes: "",
      createdAt: "2026-01-11T14:20:00.000Z"
    }
  ]
}
```

---

## 🔄 Data Flow Lifecycle

### 1️⃣ **Application Startup**

```
User Opens App
    ↓
Firebase Authentication (Anonymous)
    ↓
Firestore Listener Attached
    ↓
Real-time Data Sync Begins
    ↓
Calendar Displays All Bookings
```

**Code Location:** `App.jsx` - Lines 77-110

```javascript
// Authentication
useEffect(() => {
  await signInAnonymously(auth);
}, []);

// Real-time data listener
useEffect(() => {
  if (!user) return;
  const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'hall_events'));
  onSnapshot(q, (snapshot) => {
    const newEvents = {};
    snapshot.forEach((doc) => {
      newEvents[doc.id] = doc.data().items || [];  // doc.id = "2026-01-15"
    });
    setEvents(newEvents);  // Store in React state
  });
}, [user]);
```

**Result:** 
- `events` state object contains all bookings:
```javascript
{
  "2026-01-15": [...bookings],
  "2026-01-20": [...bookings],
  "2026-02-05": [...bookings]
}
```

---

### 2️⃣ **Viewing Bookings (Click on Date)**

```
User Clicks Date (e.g., Jan 15)
    ↓
selectedDate = Jan 15, 2026
    ↓
DayModal Opens
    ↓
events["2026-01-15"] → Array of bookings
    ↓
Display All Booking Details
```

**Code Location:** `DayModal` component

```javascript
function DayModal({ date, events, mode, onClose, onSave }) {
  // events = array of bookings for this specific date
  const [localEvents, setLocalEvents] = useState([...events]);
  
  // Display each booking
  {localEvents.map(e => (
    <div key={e.id}>
      <p>{e.name}</p>
      <p>{e.ownerName} • {e.phone}</p>
      <p>Price: ₹{e.price}</p>
      <p>Advance: ₹{e.advance}</p>
      <p>Paid: ₹{e.paid}</p>
      <p>Balance: ₹{e.price - e.paid}</p>
      <p>Notes: {e.notes}</p>
    </div>
  ))}
}
```

**What User Sees:**
- Event name and time slot
- Owner name and phone number
- Financial details (Price, Advance, Paid, Balance)
- Special notes
- Edit/Delete buttons (if admin and not past date)

---

### 3️⃣ **Adding New Booking**

```
Admin Opens Date Modal
    ↓
Fills Form:
  - Event Name: "Wedding"
  - Owner Name: "John Doe"
  - Phone: "9876543210"
  - Slot: "All Day"
  - Price: 50000
  - Advance: 10000
  - Paid: 25000
  - Notes: "Red carpet needed"
    ↓
Clicks "Add Booking"
    ↓
New Booking Object Created:
  {
    id: Date.now().toString(),
    name: "Wedding",
    ownerName: "John Doe",
    phone: "9876543210",
    slot: "All Day",
    price: 50000,
    advance: 10000,
    paid: 25000,
    notes: "Red carpet needed",
    createdAt: new Date().toISOString()
  }
    ↓
Added to localEvents array
    ↓
Clicks "Save Bookings"
    ↓
Firebase: setDoc(dateStr, { items: localEvents })
    ↓
Data Saved to Firestore
    ↓
Real-time Listener Detects Change
    ↓
Calendar Auto-Updates
    ↓
Modal Closes
```

**Code Location:** `DayModal` - Add function

```javascript
const add = () => {
  if (!form.name.trim() || !form.ownerName.trim() || localEvents.length >= MAX_EVENTS) return;
  
  const newEvent = { 
    ...form, 
    id: Date.now().toString(),
    price: parseFloat(form.price) || 0,
    advance: parseFloat(form.advance) || 0,
    paid: parseFloat(form.paid) || 0,
    createdAt: new Date().toISOString()
  };
  
  setLocalEvents([...localEvents, newEvent]);
  resetForm();
};
```

---

### 4️⃣ **Editing Existing Booking**

```
Admin Clicks Edit Button (✏️)
    ↓
Form Populated with Existing Data
    ↓
Admin Modifies Fields (e.g., Paid: 25000 → 40000)
    ↓
Clicks "Update Booking"
    ↓
Booking Object Updated in localEvents
    ↓
Clicks "Save Bookings"
    ↓
Firebase: setDoc(dateStr, { items: updatedEvents })
    ↓
Data Updated in Firestore
    ↓
Real-time Listener Detects Change
    ↓
Calendar & Modal Auto-Update
```

**Code Location:** `DayModal` - Edit functions

```javascript
const editEvent = (event) => {
  setForm({ ...event });  // Load existing data into form
  setEditingId(event.id);
};

const updateEvent = () => {
  const updatedEvent = {
    ...form,
    price: parseFloat(form.price) || 0,
    advance: parseFloat(form.advance) || 0,
    paid: parseFloat(form.paid) || 0,
    updatedAt: new Date().toISOString()
  };
  
  setLocalEvents(localEvents.map(e => 
    e.id === editingId ? updatedEvent : e
  ));
  resetForm();
  setEditingId(null);
};
```

---

### 5️⃣ **Deleting Booking**

```
Admin Clicks Delete Button (🗑️)
    ↓
Booking Removed from localEvents
    ↓
Clicks "Save Bookings"
    ↓
If localEvents.length === 0:
  Firebase: deleteDoc(dateStr)  // Remove entire date document
Else:
  Firebase: setDoc(dateStr, { items: localEvents })
    ↓
Data Updated in Firestore
    ↓
Calendar Auto-Updates
```

**Code Location:** `DayModal` & `handleSaveEvent`

```javascript
const remove = (id) => {
  setLocalEvents(localEvents.filter(e => e.id !== id));
};

const handleSaveEvent = async (dateStr, updatedEvents) => {
  if (updatedEvents.length === 0) {
    await deleteDoc(docRef);  // Remove date completely
  } else {
    await setDoc(docRef, { items: updatedEvents });
  }
};
```

---

## 🔍 Debugging & Verification

### Check Browser Console
Open DevTools (F12) and look for these messages:

**On App Load:**
```
📅 Loaded bookings from Firebase: 5 dates
```

**When Saving:**
```
💾 Saved bookings to Firebase: 2026-01-15 [{...}, {...}]
```

**When Deleting All:**
```
🗑️ Deleted all bookings for: 2026-01-15
```

**On Errors:**
```
❌ Database Error: [error details]
❌ Save failed: [error details]
```

### Verify in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Navigate to: `artifacts` → `vjk-mahal-system` → `public` → `data` → `hall_events`
3. You should see documents named by date (e.g., `2026-01-15`)
4. Click on a date document to see the `items` array
5. Each item in the array should have all these fields:
   - ✅ id
   - ✅ name
   - ✅ ownerName
   - ✅ phone
   - ✅ slot
   - ✅ price
   - ✅ advance
   - ✅ paid
   - ✅ notes
   - ✅ createdAt

---

## 🎯 Complete Example: Adding a Wedding Booking

### Step 1: User Input
```
Date: January 15, 2026
Event Name: "Wedding Ceremony"
Owner Name: "Rajesh Kumar"
Phone: "9876543210"
Slot: "All Day"
Price: ₹75,000
Advance: ₹15,000
Paid: ₹40,000
Notes: "Need stage decoration and DJ setup"
```

### Step 2: Data Saved to Firebase
```javascript
// Path: artifacts/vjk-mahal-system/public/data/hall_events/2026-01-15
{
  items: [
    {
      id: "1736595123456",
      name: "Wedding Ceremony",
      ownerName: "Rajesh Kumar",
      phone: "9876543210",
      slot: "All Day",
      price: 75000,
      advance: 15000,
      paid: 40000,
      notes: "Need stage decoration and DJ setup",
      createdAt: "2026-01-10T15:30:00.000Z"
    }
  ]
}
```

### Step 3: What User Sees

**In Calendar:**
- Jan 15 shows amber/red background (partially booked)
- Shows "All Day" tag
- Amber indicator dot

**When Clicking Jan 15:**
```
┌─────────────────────────────────────┐
│ 🔴 SATURDAY                         │
│ January 15th, 2026                  │
├─────────────────────────────────────┤
│                                     │
│ 🕐 Wedding Ceremony                 │
│    ALL DAY                          │
│                                     │
│ 👤 Rajesh Kumar • 9876543210        │
│                                     │
│ ┌──────┬──────────┬──────────┐     │
│ │Price │ Advance  │  Paid    │     │
│ │₹75K  │ ₹15,000  │ ₹40,000  │     │
│ └──────┴──────────┴──────────┘     │
│                                     │
│ 🔴 BALANCE DUE                      │
│    ₹35,000                          │
│                                     │
│ 📝 Notes:                           │
│ Need stage decoration and DJ setup  │
│                                     │
│ [Close]    [Save Bookings]          │
└─────────────────────────────────────┘
```

---

## 🔐 Security & Permissions

### Current Setup:
- **Read**: Anyone can read bookings (public view)
- **Write**: Only authenticated users can write

### Firestore Rules:
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

---

## ⚡ Real-Time Updates

The system uses Firebase's `onSnapshot` listener for **real-time updates**:

- ✅ **Multiple admins** can work simultaneously
- ✅ Changes appear **instantly** across all devices
- ✅ No need to refresh the page
- ✅ Automatic conflict resolution
- ✅ Works offline (syncs when back online)

**Example Scenario:**
```
Admin A adds booking → Firebase updates
                     ↓
Admin B's calendar updates automatically
Customer's view updates automatically
```

---

## 📱 Testing the Data Flow

### Test 1: Add Booking
1. ✅ Login as Admin (PIN: 1234)
2. ✅ Click on a future date
3. ✅ Fill in all fields
4. ✅ Click "Add Booking"
5. ✅ Click "Save Bookings"
6. ✅ Check browser console: `💾 Saved bookings...`
7. ✅ Close modal
8. ✅ Date should show booking indicator
9. ✅ Click date again → see booking details
10. ✅ Check Firebase Console → verify data

### Test 2: Edit Booking
1. ✅ Click date with existing booking
2. ✅ Click edit button (✏️)
3. ✅ Modify "Paid" amount
4. ✅ Click "Update Booking"
5. ✅ Click "Save Bookings"
6. ✅ Balance should update automatically
7. ✅ Check Firebase Console → verify updated data

### Test 3: Delete Booking
1. ✅ Click date with booking
2. ✅ Click delete button (🗑️)
3. ✅ Click "Save Bookings"
4. ✅ Date should turn green (available)
5. ✅ Check Firebase Console → document removed

### Test 4: Real-Time Sync
1. ✅ Open app in two browser windows
2. ✅ Login as admin in both
3. ✅ Add booking in Window 1
4. ✅ Window 2 should update automatically
5. ✅ No refresh needed!

---

## 🚨 Troubleshooting

### Bookings Not Saving?
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check Firestore rules are published
4. Ensure Anonymous auth is enabled

### Bookings Not Showing?
1. Check browser console: `📅 Loaded bookings...`
2. Verify data exists in Firebase Console
3. Check that date format matches (yyyy-MM-dd)
4. Clear browser cache and reload

### Balance Not Calculating?
1. Ensure Price, Advance, Paid are numbers (not strings)
2. Check form inputs use `type="number"`
3. Verify parseFloat() is used when saving

---

## 🎉 Summary

**Data Flow:**
```
User Input → React State → Firebase Firestore → Real-time Listener → UI Update
```

**All Booking Data Saved:**
- ✅ Event name
- ✅ Owner name & phone
- ✅ Time slot
- ✅ Price, Advance, Paid amounts
- ✅ Balance (calculated automatically)
- ✅ Notes
- ✅ Timestamps

**All Data Displayed When Clicking Date:**
- ✅ Complete booking details
- ✅ Financial summary
- ✅ Edit/delete options (admin)
- ✅ View-only for past dates

**Real-time Sync:**
- ✅ Instant updates across devices
- ✅ No manual refresh needed
- ✅ Offline support with sync

Your VJK Mahal booking system is fully functional with complete Firebase integration! 🎊

