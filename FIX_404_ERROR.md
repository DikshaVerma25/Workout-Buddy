# 🔧 Fix 404 Error - Step by Step

A 404 error means the server can't find the endpoint. Let's troubleshoot:

---

## ✅ Step 1: Test if Backend is Running

### Test the Health Endpoint

1. **Get your Render backend URL** (e.g., `https://workout-buddy-api.onrender.com`)
2. **Open in browser**: `https://your-render-url.onrender.com/api/health`
3. **Expected result**: Should show `{"status":"ok","message":"Server is running"}`

**If this doesn't work:**
- Backend isn't running
- Go to Step 2

**If this works:**
- Backend is running
- The issue is with the API path
- Go to Step 3

---

## ✅ Step 2: Check if Backend is Running on Render

1. **Go to Render**: https://render.com
2. **Click on your service** (workout-buddy-api)
3. **Check the status**:
   - Should show **"Live"** (green)
   - If it shows **"Stopped"** or **"Building"**, wait for it to finish

4. **Check the Logs**:
   - Click on **"Logs"** tab
   - Look for: `Server running on port 10000`
   - If you see errors, share them

5. **If backend is stopped**:
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait for it to deploy

---

## ✅ Step 3: Verify Your Vercel Environment Variable

The 404 might be because the URL path is wrong.

1. **Go to Vercel**: https://vercel.com
2. **Your project** → **Settings** → **Environment Variables**
3. **Check `REACT_APP_API_URL`**:
   - Should be: `https://your-render-url.onrender.com/api`
   - **Important:** Must end with `/api`
   - No trailing slash after `/api`

4. **If it's wrong, fix it and redeploy**

---

## ✅ Step 4: Test Different Endpoints

Try these URLs in your browser to see which ones work:

### Health Check (should work):
```
https://your-render-url.onrender.com/api/health
```

### Register Endpoint (POST - test with curl or Postman):
```bash
curl -X POST https://your-render-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

---

## ✅ Step 5: Check Render Service Configuration

1. **Go to Render** → Your Service → **Settings**
2. **Check "Start Command"**:
   - Should be: `cd server && node index.js`
   - Or: `node server/index.js`

3. **Check "Build Command"**:
   - Should be: `cd server && npm install`
   - Or: `npm install`

4. **Check "Root Directory"**:
   - Should be: (empty/root) or `/`
   - NOT: `server` (this would break paths)

---

## ✅ Step 6: Check Browser Network Tab

1. **Open your Vercel app**
2. **Open Developer Tools** (F12)
3. **Go to Network tab**
4. **Try to register/login**
5. **Look at the failed request**:
   - What URL is it trying to hit?
   - What's the status code? (404, 500, etc.)
   - What's the error message?

**Share this information** - it will help diagnose the issue.

---

## 🔍 Common 404 Causes

### 1. Wrong URL Path
❌ **Wrong:** `https://your-render-url.onrender.com/auth/register`
✅ **Correct:** `https://your-render-url.onrender.com/api/auth/register`

### 2. Missing /api in Environment Variable
❌ **Wrong:** `REACT_APP_API_URL = https://your-render-url.onrender.com`
✅ **Correct:** `REACT_APP_API_URL = https://your-render-url.onrender.com/api`

### 3. Backend Not Running
- Check Render dashboard
- Service should be "Live"
- Check logs for errors

### 4. Root Directory Issue in Render
- If Root Directory is set to `server`, paths break
- Should be empty or `/`

---

## 🆘 Still Getting 404?

### Debug Steps:

1. **Test health endpoint directly:**
   - Open: `https://your-render-url.onrender.com/api/health`
   - If this doesn't work → Backend isn't running or URL is wrong

2. **Check Render logs:**
   - Render → Your Service → Logs
   - Look for errors or startup messages
   - Share any errors you see

3. **Verify the exact URL being called:**
   - Browser Console → Network tab
   - See what URL the frontend is trying to hit
   - Compare with your Render URL

4. **Check if Render added a path prefix:**
   - Some Render plans add a service path
   - Check Render service settings
   - Your URL might need to include a service path

---

## 📋 Quick Checklist

- [ ] Backend is "Live" in Render dashboard
- [ ] Health endpoint works: `/api/health`
- [ ] `REACT_APP_API_URL` ends with `/api`
- [ ] Vercel project was redeployed after setting variable
- [ ] Browser cache cleared
- [ ] Checked Network tab for exact URL being called

---

## 💡 Quick Test

**Test this in your browser:**
```
https://YOUR-ACTUAL-RENDER-URL.onrender.com/api/health
```

**If you see:**
```json
{"status":"ok","message":"Server is running"}
```

✅ Backend is working! The issue is with the frontend URL configuration.

**If you see:**
- 404 Not Found → Backend routes aren't set up correctly
- Connection refused → Backend isn't running
- Timeout → Backend is sleeping (Render free tier)

---

Share what you see when you test the health endpoint, and I can help you fix it!

