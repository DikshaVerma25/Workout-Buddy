# 🔧 Fix CORS Error - Step by Step

You're getting a CORS error because:
1. Your Vercel environment variable has a placeholder URL
2. Your Render backend doesn't have the correct frontend URL set

---

## ✅ Step 1: Get Your Actual Render Backend URL

1. Go to https://render.com
2. Click on your service (e.g., `workout-buddy-api`)
3. **Look at the top of the page** - you'll see your service URL
4. **Copy the full URL** - it should look like:
   - `https://workout-buddy-api-xxxx.onrender.com`
   - Or: `https://workout-buddy-api.onrender.com`
5. **Add `/api` to it**:
   - Example: `https://workout-buddy-api-xxxx.onrender.com/api`

---

## ✅ Step 2: Update Vercel Environment Variable

1. Go to https://vercel.com
2. Click on your project (`workout-buddy-ashen`)
3. Go to **Settings** → **Environment Variables**
4. Find `REACT_APP_API_URL` in the list
5. **Click to edit it**
6. **Replace the value** with your actual Render URL + `/api`:
   - ❌ **Wrong:** `https://your-render-url.onrender.com/api`
   - ✅ **Correct:** `https://workout-buddy-api-xxxx.onrender.com/api`
   - (Replace `xxxx` with your actual Render service identifier)
7. Click **"Save"**
8. **IMPORTANT:** Go to **Deployments** tab and **Redeploy** your project

---

## ✅ Step 3: Update Render CORS Settings

1. Go to https://render.com
2. Click on your backend service
3. Go to **Environment** tab
4. Find `FRONTEND_URL` in the list
5. **Click to edit it**
6. **Update the value** to your Vercel frontend URL:
   - ✅ **Correct:** `https://workout-buddy-ashen.vercel.app`
   - **Important:**
     - No trailing slash `/`
     - No `/api` at the end
     - Must use `https://`
7. Click **"Save Changes"**
8. Render will automatically redeploy (wait 1-2 minutes)

---

## ✅ Step 4: Verify Both URLs

### Your URLs should be:

**Vercel Environment Variable:**
```
REACT_APP_API_URL = https://YOUR-ACTUAL-RENDER-URL.onrender.com/api
```

**Render Environment Variable:**
```
FRONTEND_URL = https://workout-buddy-ashen.vercel.app
```

---

## ✅ Step 5: Test Again

1. Wait for both deployments to complete
2. Clear your browser cache:
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or use an incognito/private window
3. Try to register/login again
4. The CORS error should be gone!

---

## 🔍 How to Find Your Actual Render URL

### Method 1: From Render Dashboard
1. Go to Render dashboard
2. Click on your service
3. Look at the top - you'll see:
   ```
   ┌─────────────────────────────────────┐
   │ workout-buddy-api                   │
   │                                     │
   │ 🌐 https://workout-buddy-api-xxxx.onrender.com│ ← This!
   └─────────────────────────────────────┘
   ```

### Method 2: Test the Health Endpoint
1. Try opening this in your browser:
   - `https://your-service-name.onrender.com/api/health`
2. If it works, that's your URL!
3. Replace `your-service-name` with whatever you named your Render service

---

## 🆘 Still Getting CORS Error?

### Check 1: Verify Render Backend is Running
1. Go to Render → Your Service → Logs
2. Make sure status is "Live"
3. Check for any errors

### Check 2: Test Backend Directly
1. Open in browser: `https://your-render-url.onrender.com/api/health`
2. Should return: `{"status":"ok"}`
3. If this doesn't work, backend isn't running

### Check 3: Verify Environment Variables
**In Vercel:**
- Variable name: `REACT_APP_API_URL` (exact spelling)
- Value: `https://your-actual-render-url.onrender.com/api`

**In Render:**
- Variable name: `FRONTEND_URL`
- Value: `https://workout-buddy-ashen.vercel.app`

### Check 4: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to register/login
4. See what URL it's trying to connect to
5. Should be your Render URL, not `your-render-url`

---

## 📋 Quick Checklist

- [ ] Got actual Render backend URL (not placeholder)
- [ ] Updated Vercel `REACT_APP_API_URL` with actual Render URL + `/api`
- [ ] Redeployed Vercel project
- [ ] Updated Render `FRONTEND_URL` with Vercel URL
- [ ] Render auto-redeployed
- [ ] Cleared browser cache
- [ ] Tested again

---

## 💡 Common Mistakes

❌ **Wrong Vercel variable value:**
```
REACT_APP_API_URL = https://your-render-url.onrender.com/api
```
✅ **Correct:**
```
REACT_APP_API_URL = https://workout-buddy-api-abc123.onrender.com/api
```

❌ **Wrong Render variable value:**
```
FRONTEND_URL = https://workout-buddy-ashen.vercel.app/
```
✅ **Correct:**
```
FRONTEND_URL = https://workout-buddy-ashen.vercel.app
```

❌ **Forgot to redeploy after changing variables**
✅ **Always redeploy after changing environment variables**

---

The main issue is that your Vercel environment variable still has the placeholder `your-render-url` instead of your actual Render service URL. Update it with your real Render URL and redeploy!

