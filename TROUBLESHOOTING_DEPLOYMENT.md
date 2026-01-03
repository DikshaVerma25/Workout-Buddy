# 🔧 Troubleshooting Deployment Issues

## Error: "Cannot connect to server. Make sure the server is running on http://localhost:5001"

This error means your frontend is still trying to connect to localhost instead of your deployed backend.

### ✅ Solution Steps:

#### Step 1: Verify Environment Variable in Vercel

1. **Go to Vercel**: https://vercel.com
2. **Click on your project** (Workout-Buddy)
3. **Go to Settings** → **Environment Variables**
4. **Check if `REACT_APP_API_URL` exists:**
   - If it doesn't exist → Add it (see Step 2)
   - If it exists → Check the value (see Step 3)

#### Step 2: Add/Update the Environment Variable

1. In Vercel Settings → Environment Variables
2. **Key**: `REACT_APP_API_URL`
3. **Value**: Your Render backend URL + `/api`
   - Example: `https://workout-buddy-api.onrender.com/api`
   - **Important:** 
     - Must include `/api` at the end
     - Use `https://` (not `http://`)
     - No trailing slash after `/api`
4. **Environment**: Select **"Production"** (or "All")
5. Click **"Save"** or **"Add"**

#### Step 3: Get Your Render Backend URL

1. **Go to Render**: https://render.com
2. **Click on your service** (workout-buddy-api)
3. **Look at the top of the page** - you'll see your service URL:
   - Example: `https://workout-buddy-api.onrender.com`
4. **Copy this URL**
5. **Add `/api` to it**: `https://workout-buddy-api.onrender.com/api`
6. This is what you need to put in Vercel's `REACT_APP_API_URL`

#### Step 4: Redeploy in Vercel (CRITICAL!)

After adding/updating the environment variable, you **MUST redeploy**:

**Method 1: Automatic Redeploy**
- Vercel might show a notification: "Redeploy to apply environment variables"
- Click **"Redeploy"**

**Method 2: Manual Redeploy**
1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Wait for deployment to complete (1-2 minutes)

#### Step 5: Verify It's Working

1. After redeploy completes, visit your Vercel URL
2. Open browser **Developer Tools** (F12)
3. Go to **Console** tab
4. Try to register/login
5. Check for any errors

### 🔍 How to Check if Variable is Set Correctly

**In Browser Console:**
1. Open your deployed Vercel app
2. Open Developer Tools (F12)
3. Go to Console tab
4. Type: `console.log(process.env.REACT_APP_API_URL)`
5. You should see your Render URL, NOT `undefined` or `localhost`

**Note:** If you see `undefined`, the environment variable isn't being read. This means:
- Variable wasn't set correctly
- Project wasn't redeployed after setting variable
- Variable name is wrong (must be `REACT_APP_API_URL`)

### 📋 Checklist

- [ ] Render backend is deployed and running (check Render dashboard)
- [ ] Render URL is accessible (try opening it in browser)
- [ ] `REACT_APP_API_URL` is set in Vercel
- [ ] Value is: `https://your-render-url.onrender.com/api`
- [ ] Project was redeployed in Vercel after setting variable
- [ ] Browser cache is cleared (try incognito/private window)

### 🆘 Still Not Working?

1. **Check Render Backend:**
   - Go to Render → Your Service → Logs
   - Make sure backend is running
   - Check for any errors

2. **Check CORS Settings:**
   - In Render → Environment tab
   - Make sure `FRONTEND_URL` is set to your Vercel URL
   - Example: `https://workout-buddy.vercel.app`
   - No trailing slash

3. **Test Backend Directly:**
   - Open: `https://your-render-url.onrender.com/api/health`
   - Should return: `{ "status": "ok" }`
   - If this doesn't work, backend isn't running

4. **Check Network Tab:**
   - Open Developer Tools → Network tab
   - Try to register
   - See what URL it's trying to connect to
   - Should be your Render URL, not localhost

### 💡 Common Mistakes

❌ **Wrong:** `REACT_APP_API_URL = https://workout-buddy-api.onrender.com`
✅ **Correct:** `REACT_APP_API_URL = https://workout-buddy-api.onrender.com/api`

❌ **Wrong:** `REACT_APP_API_URL = https://workout-buddy-api.onrender.com/api/`
✅ **Correct:** `REACT_APP_API_URL = https://workout-buddy-api.onrender.com/api`

❌ **Wrong:** Variable name is `API_URL` or `REACT_API_URL`
✅ **Correct:** Variable name is `REACT_APP_API_URL` (exact spelling)

❌ **Wrong:** Forgot to redeploy after setting variable
✅ **Correct:** Always redeploy after adding/updating environment variables

---

## Quick Fix Summary

1. Get your Render backend URL (e.g., `https://workout-buddy-api.onrender.com`)
2. Add `/api` to it: `https://workout-buddy-api.onrender.com/api`
3. In Vercel → Settings → Environment Variables
4. Set `REACT_APP_API_URL` = `https://workout-buddy-api.onrender.com/api`
5. **Redeploy** your Vercel project
6. Test again!

