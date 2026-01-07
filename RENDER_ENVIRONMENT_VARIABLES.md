# 🔧 Render Environment Variables - Complete Guide

Here's what environment variables you need in Render and what each one does:

---

## ✅ Required Environment Variables

### 1. **NODE_ENV** ✅ KEEP
- **Value**: `production`
- **Purpose**: Tells Node.js this is a production environment
- **Required**: Yes
- **Action**: Keep it!

### 2. **PORT** ✅ KEEP
- **Value**: `10000`
- **Purpose**: Port Render uses for your service
- **Required**: Yes
- **Action**: Keep it!

### 3. **JWT_SECRET** ✅ KEEP
- **Value**: A long random string (e.g., `openssl rand -base64 32`)
- **Purpose**: Used to sign and verify authentication tokens
- **Required**: Yes
- **Action**: Keep it! (If exposed, rotate it)

### 4. **FRONTEND_URL** ✅ KEEP
- **Value**: Your Vercel frontend URL (e.g., `https://workout-buddy-ashen.vercel.app`)
- **Purpose**: Allows CORS requests from your frontend
- **Required**: Yes (for CORS to work)
- **Action**: Keep it!

### 5. **MONGODB_URI** ⭐ ADD THIS (NEW)
- **Value**: Your MongoDB Atlas connection string
- **Purpose**: Connects your server to MongoDB database
- **Required**: Yes (for MongoDB)
- **Action**: **ADD THIS** - it's the new one you need!

---

## 📋 Complete List for Render

Your Render environment variables should look like this:

```
NODE_ENV = production
PORT = 10000
JWT_SECRET = (your-random-secret-string)
FRONTEND_URL = https://your-vercel-app.vercel.app
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workout-buddy?retryWrites=true&w=majority
```

---

## 🎯 What to Do

### ✅ Keep These (Already Set):
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `JWT_SECRET` = (your existing secret)
- `FRONTEND_URL` = (your Vercel URL)

### ⭐ Add This (New):
- `MONGODB_URI` = (your MongoDB connection string)

### ❌ Don't Remove:
- **Don't remove** any of the existing variables
- **Don't remove** `NODE_ENV`, `PORT`, `JWT_SECRET`, or `FRONTEND_URL`
- They're all still needed!

---

## 🔍 Why Each Variable is Needed

### NODE_ENV
- Tells your app it's in production mode
- Affects error messages and logging
- **Keep it!**

### PORT
- Render uses port 10000 for free tier services
- Your server listens on this port
- **Keep it!**

### JWT_SECRET
- Used to create and verify authentication tokens
- Without it, users can't log in
- **Keep it!** (If it was exposed, generate a new one)

### FRONTEND_URL
- Allows your Vercel frontend to make API requests
- Without it, you'll get CORS errors
- **Keep it!**

### MONGODB_URI
- Connects your server to MongoDB database
- Without it, the server can't store data
- **Add this!**

---

## 📝 Step-by-Step: Adding MONGODB_URI

1. **Go to Render** → Your Service → **Environment** tab
2. **Click "Add Environment Variable"**
3. **Enter:**
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
4. **Click "Save Changes"**
5. **Render will auto-redeploy**

**Don't remove or change the other variables!**

---

## ⚠️ Important Notes

- **All 5 variables are required** for your app to work
- **Only add `MONGODB_URI`** - don't remove anything else
- **If you remove `JWT_SECRET`**, users won't be able to log in
- **If you remove `FRONTEND_URL`**, you'll get CORS errors
- **If you remove `PORT`**, the server won't start

---

## 🎉 Summary

**What to do:**
- ✅ Keep: `NODE_ENV`, `PORT`, `JWT_SECRET`, `FRONTEND_URL`
- ⭐ Add: `MONGODB_URI`

**That's it!** Just add the MongoDB connection string, keep everything else.

