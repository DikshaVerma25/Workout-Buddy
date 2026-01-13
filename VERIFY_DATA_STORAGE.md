# ✅ Verify Your Data is Stored in MongoDB

This guide helps you verify that your registration and workout data is being stored correctly in MongoDB Atlas.

---

## 🧪 Method 1: Check Stats Endpoint (Easiest)

### Step 1: Open Stats Endpoint
**Go to**: `https://your-render-url.onrender.com/api/stats`

**Example**: `https://workout-buddy-92eg.onrender.com/api/stats`

### Step 2: Check the Response
You should see JSON like this:
```json
{
  "totalUsers": 1,
  "totalWorkouts": 0,
  "totalFriendships": 0,
  "users": [
    {
      "id": "...",
      "username": "your-username",
      "email": "your-email@example.com",
      "createdAt": "2024-01-17T..."
    }
  ]
}
```

✅ **If you see your username and email**: Your registration data is stored!

---

## 🧪 Method 2: Test Workout Logging

### Step 1: Log a Workout
1. **Go to**: Your Vercel app (e.g., `https://workout-buddy-ashen.vercel.app`)
2. **Log in** with your account
3. **Go to Dashboard**
4. **Add a workout**:
   - Select workout type (e.g., "Strength Training", "Yoga", "Cardio")
   - Select date (or use today)
   - Add optional details (duration, weight, notes)
   - Click "Add Workout"

### Step 2: Verify Workout Appears
- The workout should appear in your dashboard
- Check the calendar - the date should be highlighted

### Step 3: Check Stats Again
**Go to**: `https://your-render-url.onrender.com/api/stats`

**Expected**:
```json
{
  "totalUsers": 1,
  "totalWorkouts": 1,  // ← Should increase!
  "totalFriendships": 0,
  "users": [...]
}
```

✅ **If `totalWorkouts` increased**: Your workout data is stored!

---

## 🧪 Method 3: Check MongoDB Atlas UI (Most Detailed)

### Step 1: Log into MongoDB Atlas
1. **Go to**: https://cloud.mongodb.com
2. **Log in** to your account
3. **Click**: Your project (e.g., "Workout Buddy")

### Step 2: Browse Collections
1. **Click**: "Browse Collections" button
2. **Select**: Your database (usually `test` or `workout-buddy`)
3. **You should see collections**:
   - `users` - Contains your registration data
   - `workouts` - Contains your workout logs
   - `friendships` - Contains friend relationships

### Step 3: View Your Data

#### View Users Collection
1. **Click**: `users` collection
2. **You should see**:
   - Your username
   - Your email (hashed password won't be visible)
   - `_id` (MongoDB ObjectId)
   - `createdAt` timestamp

#### View Workouts Collection
1. **Click**: `workouts` collection
2. **You should see**:
   - Each workout you've logged
   - `userId` (links to your user)
   - `exercise`, `type`, `date`, `duration`, etc.
   - `createdAt` timestamp

✅ **If you see your data**: Everything is working perfectly!

---

## 🧪 Method 4: Test Data Persistence

### Step 1: Add Multiple Workouts
1. **Add 3-5 different workouts** on different dates
2. **Check your dashboard** - all should appear

### Step 2: Trigger a Redeploy (Optional)
1. **Go to**: Render dashboard
2. **Click**: "Manual Deploy" → "Deploy latest commit"
3. **Wait**: For deployment to complete (~2-3 minutes)

### Step 3: Verify Data Still Exists
1. **Refresh** your Vercel app
2. **Log in** again
3. **Check dashboard** - all your workouts should still be there!

✅ **If data persists after redeploy**: MongoDB storage is working correctly!

---

## 🧪 Method 5: Test from Browser Console

### Step 1: Open Browser Console
1. **Go to**: Your Vercel app
2. **Press**: `F12` or `Right-click` → "Inspect" → "Console" tab

### Step 2: Check Local Storage
**Type in console**:
```javascript
// Check if you're logged in
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

**Expected output**:
- `Token`: A long JWT string
- `User`: Your user object with `id`, `username`, `email`

### Step 3: Test API Call
**Type in console**:
```javascript
// Get your workouts
fetch('https://your-render-url.onrender.com/api/workouts', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Your workouts:', data));
```

**Expected output**:
- Array of your workout objects
- Each workout has `id`, `exercise`, `type`, `date`, etc.

✅ **If you see your workouts**: API and storage are working!

---

## ✅ Quick Checklist

Use this checklist to verify everything:

- [ ] **Registration**: Can see my username/email in `/api/stats`
- [ ] **Login**: Can log in successfully
- [ ] **Add Workout**: Can add a workout successfully
- [ ] **View Workout**: Workout appears in dashboard
- [ ] **Calendar**: Date is highlighted on calendar
- [ ] **Stats**: `totalWorkouts` increases in `/api/stats`
- [ ] **MongoDB Atlas**: Can see data in `users` and `workouts` collections
- [ ] **Persistence**: Data still exists after page refresh
- [ ] **Multiple Workouts**: Can add and view multiple workouts

---

## 🐛 Troubleshooting

### Problem: Stats shows 0 users but I registered
**Solution**: 
1. Check Render logs for errors
2. Verify MongoDB connection string is set in Render
3. Check MongoDB Atlas Network Access (should allow `0.0.0.0/0`)

### Problem: Workouts not saving
**Solution**:
1. Check browser console for errors
2. Verify you're logged in (check localStorage)
3. Check Render logs for API errors
4. Verify `REACT_APP_API_URL` is set in Vercel

### Problem: Can't see data in MongoDB Atlas
**Solution**:
1. Make sure you're looking at the correct database
2. Check if collections exist (they're created automatically)
3. Refresh the MongoDB Atlas page

---

## 📊 Expected Data Structure

### User Document (in `users` collection)
```json
{
  "_id": ObjectId("..."),
  "username": "your-username",
  "email": "your-email@example.com",
  "password": "$2a$10$...", // Hashed, not visible
  "createdAt": ISODate("2024-01-17T..."),
  "updatedAt": ISODate("2024-01-17T...")
}
```

### Workout Document (in `workouts` collection)
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."), // Links to user
  "exercise": "Push-ups",
  "type": "strength training",
  "weight": 0,
  "duration": 30,
  "durationUnit": "minutes",
  "date": ISODate("2024-01-17T..."),
  "notes": "Great workout!",
  "createdAt": ISODate("2024-01-17T..."),
  "updatedAt": ISODate("2024-01-17T...")
}
```

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ You can register and log in
2. ✅ You can add workouts and they appear immediately
3. ✅ Stats endpoint shows correct counts
4. ✅ Data is visible in MongoDB Atlas
5. ✅ Data persists after page refresh and redeploy

---

**Need help?** Check Render logs or MongoDB Atlas logs for any errors.

