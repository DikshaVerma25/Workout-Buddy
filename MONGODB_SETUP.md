# 🗄️ MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas (free tier) to store your data permanently.

---

## ✅ Step 1: Create MongoDB Atlas Account

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account (or log in if you have one)

---

## ✅ Step 2: Create a Cluster

1. **After logging in**, you'll see "Create a Deployment"
2. **Choose**: "M0 FREE" (Free tier)
3. **Cloud Provider**: Choose any (AWS, Google Cloud, or Azure)
4. **Region**: Choose closest to your Render server region
5. **Cluster Name**: `workout-buddy-cluster` (or any name)
6. **Click**: "Create Deployment"

⏳ **Wait 3-5 minutes** for the cluster to be created.

---

## ✅ Step 3: Create Database User

1. **In the setup wizard**, you'll be asked to create a database user
2. **Username**: `workout-buddy-user` (or any username)
3. **Password**: Generate a strong password (or create your own)
   - **IMPORTANT**: Save this password! You'll need it.
4. **Click**: "Create Database User"

---

## ✅ Step 4: Configure Network Access

1. **In the setup wizard**, you'll see "Where would you like to connect from?"
2. **Click**: "Add My Current IP Address"
3. **Also add**: `0.0.0.0/0` (allows connections from anywhere - needed for Render)
   - Click "Add IP Address"
   - Enter: `0.0.0.0/0`
   - Comment: "Allow from Render"
   - Click "Confirm"
4. **Click**: "Finish and Close"

---

## ✅ Step 5: Get Connection String

1. **In MongoDB Atlas dashboard**, click **"Connect"** button on your cluster
2. **Choose**: "Connect your application"
3. **Driver**: Node.js
4. **Version**: 5.5 or later
5. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<username>` with your database username
7. **Replace** `<password>` with your database password
8. **Add database name** at the end: `/workout-buddy?retryWrites=true&w=majority`
   - Final string should look like:
   ```
   mongodb+srv://workout-buddy-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/workout-buddy?retryWrites=true&w=majority
   ```

---

## ✅ Step 6: Add Connection String to Render

1. **Go to Render**: https://render.com
2. **Your Service** → **Environment** tab
3. **Add new environment variable**:
   - **Key**: `MONGODB_URI`
   - **Value**: Paste your connection string from Step 5
   - **Example**:
     ```
     mongodb+srv://workout-buddy-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/workout-buddy?retryWrites=true&w=majority
     ```
4. **Click**: "Save Changes"
5. **Render will auto-redeploy** your service

---

## ✅ Step 7: Verify Connection

1. **Wait for Render to redeploy** (2-3 minutes)
2. **Check Render logs**:
   - Go to Render → Your Service → **Logs**
   - Look for: `✅ MongoDB connected successfully`
3. **Test the stats endpoint**:
   - Open: `https://your-render-url.onrender.com/api/stats`
   - Should show user count (might be 0 if no users yet)

---

## 🔒 Security Notes

- **Never commit** your MongoDB connection string to GitHub
- **Always use** environment variables
- The connection string includes your password - keep it secret!

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- **Check**: Username and password in connection string are correct
- **Check**: Special characters in password are URL-encoded (e.g., `@` becomes `%40`)

### Error: "IP not whitelisted"
- **Check**: You added `0.0.0.0/0` to Network Access in MongoDB Atlas
- **Wait**: It can take a few minutes for changes to take effect

### Error: "Connection timeout"
- **Check**: Your Render service is running
- **Check**: Network Access allows `0.0.0.0/0`

### Still having issues?
- Check Render logs for specific error messages
- Verify connection string format is correct
- Make sure database user has read/write permissions

---

## 📋 Quick Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created M0 FREE cluster
- [ ] Created database user (saved password)
- [ ] Added `0.0.0.0/0` to Network Access
- [ ] Got connection string
- [ ] Added `MONGODB_URI` to Render environment variables
- [ ] Render service redeployed
- [ ] Checked logs for "MongoDB connected successfully"
- [ ] Tested `/api/stats` endpoint

---

## 🎉 You're Done!

Once MongoDB is connected, your data will be stored permanently and won't be lost on redeployments!

