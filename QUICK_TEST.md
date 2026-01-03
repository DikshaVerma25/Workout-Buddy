# 🚀 Quick Backend Test

## Test 1: Health Endpoint (MOST IMPORTANT)

Open this URL in your browser:
```
https://workout-buddy-92eg.onrender.com/api/health
```

**Expected result:**
```json
{"status":"ok","message":"Server is running"}
```

**If you see this:** ✅ Backend is working!

**If you see 404:** ❌ Backend routes aren't set up correctly
**If you see connection error:** ❌ Backend isn't running

---

## Test 2: Check Your Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `REACT_APP_API_URL`
3. **It should be exactly:**
   ```
   https://workout-buddy-92eg.onrender.com/api
   ```
   - Must end with `/api`
   - No trailing slash
   - Must match your Render URL

4. **If it's wrong:**
   - Update it
   - **Redeploy** your Vercel project (Settings → Deployments → Redeploy)

---

## Test 3: Check Render Service Status

1. Go to **Render Dashboard**: https://render.com
2. Click on your service: `workout-buddy-api` or similar
3. Check status:
   - ✅ **"Live"** = Good
   - ⏳ **"Building"** = Wait for it to finish
   - ❌ **"Stopped"** = Click "Manual Deploy"

4. Check **Logs** tab:
   - Should see: `Server running on port 10000`
   - Share any errors you see

---

## What to Share

1. What do you see when you open: `https://workout-buddy-92eg.onrender.com/api/health`?
2. What's your `REACT_APP_API_URL` value in Vercel?
3. What's the status in Render? (Live/Stopped/Building)

---

## Note About "Cannot GET /"

The "Cannot GET /" message is **NORMAL** for an API server. 
- The backend only has routes under `/api/*`
- The root `/` path doesn't have a route (that's fine!)
- **What matters is if `/api/health` works!**

