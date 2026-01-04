# 🔍 How to Check Render Logs

## Step-by-Step:

1. **Go to**: https://render.com
2. **Click** on your service: `workout-buddy-api`
3. **Click** on the **"Logs"** tab (at the top)
4. **Scroll to the bottom** - most recent logs are at the bottom
5. **Look for errors** (they'll be in red or have "Error" in them)

---

## What to Look For:

### ✅ Good Signs:
- `Server running on port 10000`
- `npm install` completed successfully
- `Build successful`

### ❌ Bad Signs:
- `Error: Cannot find module`
- `npm ERR!`
- `Build failed`
- `Health check failed`
- `EADDRINUSE` (port in use)

---

## Common Issues:

### Issue 1: Dependencies Not Installing
**Error:** `Cannot find module 'express'`
**Fix:** Check that `server/package.json` has all dependencies

### Issue 2: Build Command Wrong
**Error:** `npm: command not found` or `cd: no such file or directory`
**Fix:** Check Build Command in Render settings

### Issue 3: Start Command Wrong
**Error:** `Cannot find module` or `file not found`
**Fix:** Check Start Command in Render settings

### Issue 4: Health Check Failing
**Error:** `Health check failed` or timeout
**Fix:** Make sure `/api/health` route exists

---

## What to Share:

**Copy the last 30-50 lines of logs** and share them. That will show exactly what's wrong!

---

## Quick Actions:

1. **Cancel stuck deployment:**
   - Go to "Events" tab
   - Find the stuck deployment
   - Click "Cancel" (if available)

2. **Manual redeploy:**
   - Go to "Manual Deploy" section
   - Click "Deploy latest commit"

3. **Check service settings:**
   - Settings tab
   - Verify Build Command and Start Command

