# 🔗 How to Get MongoDB Connection String - Quick Guide

Follow these steps to get your MongoDB Atlas connection string:

---

## ✅ Step 1: Log into MongoDB Atlas

1. **Go to**: https://cloud.mongodb.com
2. **Log in** with your MongoDB Atlas account
   - If you don't have an account, sign up (it's free!)

---

## ✅ Step 2: Select Your Cluster

1. **In the MongoDB Atlas dashboard**, you'll see your cluster
2. **Click on your cluster** (e.g., "Cluster0" or "workout-buddy-cluster")

---

## ✅ Step 3: Click "Connect"

1. **Click the "Connect" button** on your cluster
2. You'll see several connection options

---

## ✅ Step 4: Choose "Connect your application"

1. **Click "Connect your application"**
2. (Not "Connect with MongoDB Compass" or "Connect from anywhere")

---

## ✅ Step 5: Copy the Connection String

1. **You'll see a connection string** that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Click "Copy"** to copy it to your clipboard

---

## ✅ Step 6: Replace Placeholders

The connection string has placeholders you need to replace:

### Replace `<username>`
- Replace `<username>` with your **database username**
- You created this when setting up MongoDB Atlas
- Example: `workout-buddy-user`

### Replace `<password>`
- Replace `<password>` with your **database password**
- This is the password you set when creating the database user
- **Important:** If your password has special characters, URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - `%` becomes `%25`
  - `&` becomes `%26`
  - `+` becomes `%2B`
  - `=` becomes `%3D`

### Add Database Name
- Add `/workout-buddy` before the `?` (or any database name you want)
- Final format should be:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workout-buddy?retryWrites=true&w=majority
  ```

---

## 📝 Example

**Before (with placeholders):**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After (with real values):**
```
mongodb+srv://workout-buddy-user:MyPassword123@cluster0.abc123.mongodb.net/workout-buddy?retryWrites=true&w=majority
```

**If password has special characters:**
```
# Password: "My@Pass#123"
# Becomes: "My%40Pass%23123"

mongodb+srv://workout-buddy-user:My%40Pass%23123@cluster0.abc123.mongodb.net/workout-buddy?retryWrites=true&w=majority
```

---

## ✅ Step 7: Use in Render

1. **Go to Render** → Your Service → **Environment** tab
2. **Add environment variable:**
   - **Key**: `MONGODB_URI`
   - **Value**: Paste your complete connection string (with username, password, and database name)
3. **Click "Save Changes"**
4. **Render will auto-redeploy**

---

## 🔍 Can't Find Your Username/Password?

### Find Your Username:
1. **MongoDB Atlas** → **Database Access** (left sidebar)
2. **See list of database users**
3. **Your username** is listed there

### Reset Your Password:
1. **MongoDB Atlas** → **Database Access**
2. **Click on your user** → **Edit**
3. **Click "Edit Password"**
4. **Set a new password** (save it!)
5. **Update your connection string** with the new password

---

## ⚠️ Important Notes

- **Keep your connection string secret!** Don't share it publicly
- **The connection string includes your password** - treat it like a password
- **If you forget your password**, you can reset it in Database Access
- **Special characters in passwords** must be URL-encoded

---

## 🆘 Troubleshooting

### "Authentication failed"
- **Check:** Username and password are correct
- **Check:** Special characters are URL-encoded
- **Fix:** Reset password in Database Access if needed

### "IP not whitelisted"
- **Check:** Network Access allows `0.0.0.0/0`
- **Fix:** Add `0.0.0.0/0` to Network Access list

### "Connection timeout"
- **Check:** Cluster is running (not paused)
- **Check:** Network Access is configured
- **Wait:** Sometimes takes a few minutes for changes to take effect

---

## 📋 Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Clicked "Connect" on your cluster
- [ ] Selected "Connect your application"
- [ ] Copied the connection string
- [ ] Replaced `<username>` with your database username
- [ ] Replaced `<password>` with your database password (URL-encoded if needed)
- [ ] Added `/workout-buddy` before the `?`
- [ ] Added `MONGODB_URI` to Render with the complete string
- [ ] Saved changes in Render
- [ ] Waited for redeployment

---

## 🎉 You're Done!

Once you add the connection string to Render, your server will connect to MongoDB and your data will be stored permanently!

