# 🧪 Test MongoDB Storage - Quick Checklist

Use this checklist to verify your data is being stored in MongoDB Atlas.

---

## ✅ Step 1: Check MongoDB Connection

**Go to**: Render → Your Service → **Logs** tab

**Look for**:
```
✅ MongoDB connected successfully
Database: workout-buddy
Server running on port 10000
```

✅ **If you see this**: MongoDB is connected!

---

## ✅ Step 2: Test Stats Endpoint

**Open in browser**: `https://your-render-url.onrender.com/api/stats`

**Expected response**:
```json
{
  "totalUsers": 0,
  "totalWorkouts": 0,
  "totalFriendships": 0,
  "users": []
}
```

✅ **If you see JSON (even with zeros)**: MongoDB is working!

❌ **If you see an error**: Check Render logs for connection issues.

---

## ✅ Step 3: Register a Test User

1. **Go to**: Your Vercel app (e.g., `https://workout-buddy-ashen.vercel.app`)
2. **Register** a new test user:
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `test123`
3. **After registration**, check stats again:
   - `https://your-render-url.onrender.com/api/stats`
   - `totalUsers` should be `1`
   - `users` array should contain your test user

✅ **If user count increased**: Data is being stored!

---

## ✅ Step 4: Add a Workout

1. **Log in** to your app with the test user
2. **Add a workout**:
   - Select workout type (e.g., "Yoga")
   - Select today's date
   - Click "Add Workout"
3. **Check stats again**:
   - `https://your-render-url.onrender.com/api/stats`
   - `totalWorkouts` should be `1`

✅ **If workout count increased**: Workouts are being stored!

---

## ✅ Step 5: Verify Data Persistence

1. **Note current counts** from stats endpoint:
   - Users: `?`
   - Workouts: `?`
   - Friendships: `?`

2. **Trigger a redeploy** in Render:
   - Go to Render → Your Service
   - Click "Manual Deploy" → "Deploy latest commit"
   - OR wait for an auto-redeploy

3. **Wait for redeploy** (2-3 minutes)

4. **Check stats again**:
   - `https://your-render-url.onrender.com/api/stats`
   - Counts should be **the same** as before

✅ **If counts match**: Data persisted through redeploy!

---

## ✅ Step 6: Check MongoDB Atlas Dashboard (Optional)

1. **Go to**: MongoDB Atlas → Your Cluster
2. **Click**: "Browse Collections"
3. **You should see**:
   - Database: `workout-buddy`
   - Collections: `users`, `workouts`, `friendships`
   - Documents in each collection

✅ **If you see collections with data**: Confirmed in MongoDB!

---

## 🎯 Quick Test Summary

| Test | What to Check | Expected Result |
|------|---------------|-----------------|
| Connection | Render logs | `✅ MongoDB connected successfully` |
| Stats Endpoint | Browser: `/api/stats` | JSON response (even if zeros) |
| Register User | Stats after registration | `totalUsers` increases |
| Add Workout | Stats after adding workout | `totalWorkouts` increases |
| Persistence | Stats after redeploy | Counts remain the same |

---

## 🆘 Troubleshooting

### Stats endpoint shows error
- **Check**: Render logs for MongoDB connection errors
- **Check**: `MONGODB_URI` environment variable in Render
- **Check**: Network Access in MongoDB Atlas (should allow `0.0.0.0/0`)

### User count not increasing
- **Check**: Render logs for registration errors
- **Check**: Browser console for frontend errors
- **Check**: `REACT_APP_API_URL` in Vercel points to Render URL

### Data lost after redeploy
- **Check**: MongoDB connection string includes database name (`/workout-buddy`)
- **Check**: Render logs show successful MongoDB connection
- **Check**: Data is actually in MongoDB Atlas (Browse Collections)

---

## ✅ Success Criteria

Your MongoDB storage is working correctly if:
- ✅ Render logs show "MongoDB connected successfully"
- ✅ Stats endpoint returns JSON
- ✅ User registration increases user count
- ✅ Adding workouts increases workout count
- ✅ Data persists after redeploy

🎉 **If all checks pass**: Your data is being stored permanently in MongoDB Atlas!

