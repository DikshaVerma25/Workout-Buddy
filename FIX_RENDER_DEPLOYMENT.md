# 🔧 Fix Render Deployment Failure

If your Render deployment failed after migrating to MongoDB, here's how to fix it:

---

## ✅ Step 1: Check Render Logs

1. **Go to Render**: https://render.com
2. **Your Service** → **Logs** tab
3. **Scroll to the bottom** - look for errors

**Common errors you might see:**

### Error 1: "Cannot find module 'mongoose'"
```
Error: Cannot find module 'mongoose'
```
**Fix:** Dependencies aren't installing. Check Step 2.

### Error 2: "MongoServerError: Authentication failed"
```
MongoServerError: Authentication failed
```
**Fix:** MongoDB connection string is wrong. Check Step 3.

### Error 3: "MongooseError: Operation `users.findOne()` buffering timed out"
```
MongooseError: Operation buffering timed out
```
**Fix:** MongoDB connection isn't working. Check Step 3.

### Error 4: "MongoNetworkError: failed to connect"
```
MongoNetworkError: failed to connect to server
```
**Fix:** Network access not configured. Check Step 4.

---

## ✅ Step 2: Verify Dependencies

The `package.json` should include `mongoose`. Check:

1. **Go to Render** → Your Service → **Settings**
2. **Check "Build Command"**:
   ```
   cd server && npm install
   ```
3. **Check logs** during build - should see:
   ```
   + mongoose@8.0.3
   ```

**If mongoose isn't installing:**
- Check that `server/package.json` includes `mongoose`
- Check build logs for npm errors

---

## ✅ Step 3: Set MongoDB Connection String

**This is the most common issue!**

1. **Go to Render** → Your Service → **Environment** tab
2. **Check if `MONGODB_URI` exists:**
   - If **missing**: Add it (see below)
   - If **exists**: Verify it's correct

3. **Add/Update `MONGODB_URI`:**
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string
   - **Format**:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workout-buddy?retryWrites=true&w=majority
     ```
   - **Replace:**
     - `username` with your MongoDB username
     - `password` with your MongoDB password
     - `cluster0.xxxxx` with your cluster address

4. **Click "Save Changes"**
5. **Render will auto-redeploy**

---

## ✅ Step 4: Verify MongoDB Atlas Network Access

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Network Access** → **IP Access List**
3. **Make sure `0.0.0.0/0` is added** (allows from anywhere)
   - If missing, click "Add IP Address"
   - Enter: `0.0.0.0/0`
   - Comment: "Allow from Render"
   - Click "Confirm"

---

## ✅ Step 5: Test MongoDB Connection

After setting `MONGODB_URI` and redeploying:

1. **Wait 2-3 minutes** for deployment
2. **Check Render logs** - should see:
   ```
   ✅ MongoDB connected successfully
   Database: workout-buddy
   Server running on port 10000
   ```

3. **Test the health endpoint:**
   ```
   https://your-render-url.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running","database":"MongoDB"}`

---

## 🆘 Common Issues and Fixes

### Issue 1: "MongooseError: Operation buffering timed out"

**Cause:** MongoDB connection string is missing or wrong

**Fix:**
1. Check `MONGODB_URI` is set in Render
2. Verify connection string format is correct
3. Check MongoDB Atlas Network Access allows `0.0.0.0/0`

### Issue 2: "MongoServerError: Authentication failed"

**Cause:** Wrong username or password in connection string

**Fix:**
1. Go to MongoDB Atlas → Database Access
2. Verify your username and password
3. Update `MONGODB_URI` in Render with correct credentials
4. **Note:** Special characters in password need URL encoding:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - etc.

### Issue 3: "Cannot find module 'mongoose'"

**Cause:** Dependencies didn't install

**Fix:**
1. Check `server/package.json` includes `"mongoose": "^8.0.3"`
2. Check build logs for npm errors
3. Try manual redeploy: Render → Manual Deploy → Deploy latest commit

### Issue 4: Server starts but crashes immediately

**Cause:** MongoDB connection fails on startup

**Fix:**
1. Check Render logs for MongoDB connection errors
2. Verify `MONGODB_URI` is set correctly
3. Check MongoDB Atlas is accessible

---

## 📋 Deployment Checklist

Before deploying, make sure:

- [ ] `server/package.json` includes `mongoose` dependency
- [ ] `MONGODB_URI` is set in Render environment variables
- [ ] MongoDB connection string is correct (username, password, cluster)
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Build command is: `cd server && npm install`
- [ ] Start command is: `cd server && node index.js`

---

## 🔍 Debug Steps

1. **Check Render Build Logs:**
   - Look for `npm install` output
   - Should see `mongoose` being installed
   - Check for any errors

2. **Check Render Runtime Logs:**
   - Look for `Server running on port 10000`
   - Look for `✅ MongoDB connected successfully`
   - Check for any MongoDB errors

3. **Test Connection Locally (Optional):**
   ```bash
   # Set environment variable
   export MONGODB_URI="your-connection-string"
   
   # Run server
   cd server
   npm install
   node index.js
   ```

---

## 💡 Quick Fix Summary

**Most likely issue:** `MONGODB_URI` is not set in Render.

**Quick fix:**
1. Go to Render → Environment
2. Add `MONGODB_URI` = your MongoDB connection string
3. Save (auto-redeploys)
4. Wait 2-3 minutes
5. Check logs for "MongoDB connected successfully"

---

## 🆘 Still Not Working?

**Share these details:**
1. **Last 20-30 lines of Render logs** (from Logs tab)
2. **Your Render environment variables** (mask sensitive values)
3. **Any error messages** you see

This will help diagnose the exact issue!

