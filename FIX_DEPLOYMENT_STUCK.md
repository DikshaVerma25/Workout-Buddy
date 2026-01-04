# 🔧 Fix Render Deployment Stuck on "Deploying"

If Render is stuck on "Deploying" and won't go to "Live", follow these steps:

---

## ✅ Step 1: Check the Logs (MOST IMPORTANT)

1. **Go to Render Dashboard**: https://render.com
2. **Click on your service** (workout-buddy-api)
3. **Click on "Logs" tab**
4. **Scroll to the bottom** - look for errors

**Common errors you might see:**

### Error 1: "Cannot find module"
```
Error: Cannot find module 'express'
```
**Fix:** Dependencies aren't installing. Check Step 2.

### Error 2: "Port already in use"
```
Error: listen EADDRINUSE: address already in use :::10000
```
**Fix:** This shouldn't happen on Render, but check PORT env var.

### Error 3: "Build failed"
```
npm ERR! code ELIFECYCLE
```
**Fix:** Check package.json and dependencies.

### Error 4: "Health check failed"
```
Health check failed
```
**Fix:** Check health check path and server startup.

---

## ✅ Step 2: Verify Render Service Configuration

Go to Render → Your Service → **Settings** tab:

### Build Command:
```
cd server && npm install
```

### Start Command:
```
cd server && node index.js
```

### Root Directory:
- Should be **empty** (not `server`)
- OR set to root of repo if you have a monorepo

### Environment Variables:
Check these are set:
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `JWT_SECRET` = (any random string)
- `FRONTEND_URL` = (can be `*` for now)

---

## ✅ Step 3: Check if render.yaml is Being Used

If you're using `render.yaml`, make sure:
1. It's in the **root** of your repo
2. Render is configured to use it (Auto-Deploy → Source: GitHub)

**If render.yaml exists but Render isn't using it:**
- Go to Render → Your Service → Settings
- Check "Source" - should point to your GitHub repo
- Make sure "Auto-Deploy" is enabled

---

## ✅ Step 4: Manual Deploy

If it's stuck, try:

1. **Cancel the current deployment:**
   - Go to Render → Your Service
   - Click "Events" tab
   - Find the stuck deployment
   - Click "Cancel" if available

2. **Manual Deploy:**
   - Go to "Manual Deploy" section
   - Click "Deploy latest commit"
   - Wait and watch the logs

---

## ✅ Step 5: Check for Common Issues

### Issue 1: Missing package.json
- Make sure `server/package.json` exists
- Make sure it has all dependencies listed

### Issue 2: Wrong Build/Start Commands
- Build command should install dependencies
- Start command should run the server

### Issue 3: Health Check Failing
- Health check path: `/api/health`
- Make sure this route exists in your server

### Issue 4: Port Configuration
- Render uses port from `PORT` env var
- Make sure server listens on `process.env.PORT`

---

## ✅ Step 6: Simplify Configuration

If still stuck, try this:

1. **Remove render.yaml temporarily:**
   - Delete or rename `render.yaml`
   - Configure service manually in Render dashboard

2. **Manual Configuration:**
   - Go to Render → Your Service → Settings
   - Set:
     - **Build Command:** `cd server && npm install`
     - **Start Command:** `cd server && node index.js`
     - **Root Directory:** (leave empty)
   - Save and redeploy

---

## 🆘 What to Share

If still stuck, share:

1. **Last 20-30 lines of Render logs** (from Logs tab)
2. **Your Render service settings:**
   - Build Command
   - Start Command
   - Root Directory
   - Environment Variables (mask sensitive values)
3. **Any error messages** you see

---

## 💡 Quick Fixes to Try

### Fix 1: Update Build Command
Try:
```
npm install --prefix server
```

### Fix 2: Update Start Command
Try:
```
npm start --prefix server
```

### Fix 3: Check Node Version
- Render → Settings → Node Version
- Should be compatible (try 18.x or 20.x)

---

## 🔍 Debug Checklist

- [ ] Checked Render logs for errors
- [ ] Verified build command is correct
- [ ] Verified start command is correct
- [ ] Checked environment variables are set
- [ ] Verified `server/package.json` exists
- [ ] Verified `server/index.js` exists
- [ ] Tried canceling and redeploying
- [ ] Checked health check path is correct

---

**Most likely cause:** Check the **Logs tab** - that will tell you exactly what's wrong!

