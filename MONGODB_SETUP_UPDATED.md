# 🗄️ MongoDB Atlas Setup Guide (Updated UI)

This guide reflects the current MongoDB Atlas interface.

---

## ✅ Step 1: Create MongoDB Atlas Account

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account (or log in if you have one)
   - Use email or sign in with Google/GitHub
   - No credit card required for free tier

---

## ✅ Step 2: Create a Project

1. **After logging in**, you'll see "Create a Project"
2. **Project Name**: `Workout Buddy` (or any name)
3. **Click**: "Next" or "Create Project"

---

## ✅ Step 3: Create a Deployment (Cluster)

1. **After creating the project**, you'll see "Create a Deployment"
2. **Choose**: "M0 FREE" (Free tier) - it should be selected by default
3. **Cloud Provider**: Choose any (AWS, Google Cloud, or Azure)
4. **Region**: Choose closest to your Render server region (or use default)
5. **Cluster Name**: `workout-buddy-cluster` (or any name - optional, has a default)
6. **Click**: "Create Deployment" or "Create"

⏳ **Wait 3-5 minutes** for the cluster to be created.

---

## ✅ Step 4: Create Database User

1. **In the setup wizard**, you'll be asked to create a database user
2. **Username**: `workout-buddy-user` (or any username)
3. **Password**: 
   - Click "Autogenerate Secure Password" (recommended)
   - **OR** create your own strong password
   - **IMPORTANT**: Save this password! You'll need it for the connection string.
4. **Click**: "Create Database User"

---

## ✅ Step 5: Configure Network Access

1. **In the setup wizard**, you'll see "Where would you like to connect from?"
2. **Click**: "Add My Current IP Address" (for your local testing)
3. **Also add**: `0.0.0.0/0` (allows connections from anywhere - needed for Render)
   - Click "Add IP Address" or "Add Entry"
   - Enter: `0.0.0.0/0`
   - Comment: "Allow from Render"
   - Click "Confirm" or "Add Entry"
4. **Click**: "Finish and Close" or "Close"

---

## ✅ Step 6: Get Connection String

1. **In MongoDB Atlas dashboard**, click **"Connect"** button on your cluster
2. **Choose**: "Connect your application"
   - (Not "Connect with MongoDB Compass" or "Connect from anywhere")
3. **Driver**: Node.js (should be selected by default)
4. **Version**: 5.5 or later (should be selected by default)
5. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<username>` with your database username (from Step 4)
7. **Replace** `<password>` with your database password (from Step 4)
   - **Important:** If your password has special characters, URL-encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `$` becomes `%24`
     - `%` becomes `%25`
     - `&` becomes `%26`
     - `+` becomes `%2B`
     - `=` becomes `%3D`
8. **Add database name** at the end: `/workout-buddy?retryWrites=true&w=majority`
   - Final string should look like:
   ```
   mongodb+srv://workout-buddy-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/workout-buddy?retryWrites=true&w=majority
   ```

---

## ✅ Step 7: Add Connection String to Render

1. **Go to Render**: https://render.com
2. **Your Service** → **Environment** tab
3. **Add new environment variable**:
   - **Key**: `MONGODB_URI`
   - **Value**: Paste your complete connection string (with username, password, and database name from Step 6)
4. **Click**: "Save Changes"
5. **Render will auto-redeploy** your service

---

## ✅ Step 8: Verify Connection

1. **Wait for Render to redeploy** (2-3 minutes)
2. **Check Render logs**:
   - Go to Render → Your Service → **Logs**
   - Look for: `✅ MongoDB connected successfully`
   - Look for: `Database: workout-buddy`
3. **Test the stats endpoint**:
   - Open: `https://your-render-url.onrender.com/api/stats`
   - Should show user count (might be 0 if no users yet)

---

## 🔍 Alternative: If You Don't See "Create Deployment"

If you're already in a project and don't see "Create Deployment":

1. **Look for "Build a Database"** button - click it
2. **OR** look for **"Deployments"** or **"Clusters"** in the left sidebar
3. **Click "Create"** or **"New Cluster"**
4. **Follow Step 3 above** to create the M0 FREE cluster

---

## 📋 Quick Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created a project
- [ ] Created M0 FREE cluster (waited 3-5 minutes)
- [ ] Created database user (saved password)
- [ ] Added `0.0.0.0/0` to Network Access
- [ ] Got connection string
- [ ] Replaced `<username>` and `<password>` in connection string
- [ ] Added `/workout-buddy` to connection string
- [ ] Added `MONGODB_URI` to Render environment variables
- [ ] Render service redeployed
- [ ] Checked logs for "MongoDB connected successfully"
- [ ] Tested `/api/stats` endpoint

---

## 🆘 Troubleshooting

### Can't find "Create Deployment"
- **Look for**: "Build a Database" button
- **OR**: Left sidebar → "Deployments" → "Create" or "New Cluster"

### Cluster creation is taking too long
- **Normal**: Can take 3-5 minutes
- **If longer**: Check your email for any issues, or try refreshing

### Forgot your database password
- **Go to**: Database Access (left sidebar)
- **Click**: On your user → "Edit"
- **Click**: "Edit Password"
- **Set**: New password (save it!)
- **Update**: Connection string in Render

### Connection string not working
- **Check**: Username and password are correct
- **Check**: Special characters in password are URL-encoded
- **Check**: Database name `/workout-buddy` is added before the `?`
- **Check**: Network Access allows `0.0.0.0/0`

---

## 🎉 You're Done!

Once MongoDB is connected, your data will be stored permanently and won't be lost on redeployments!

