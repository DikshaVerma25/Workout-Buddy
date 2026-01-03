# 🖥️ How to Open Browser Console

This guide shows you how to open the browser console to check if your environment variables are set correctly.

---

## Method 1: Using Keyboard Shortcuts (Easiest)

### On Mac:
- Press: **`Command + Option + J`** (⌘ + ⌥ + J)
- Or: **`Command + Option + I`** (⌘ + ⌥ + I)
- Or: **`F12`** (if your Mac supports it)

### On Windows/Linux:
- Press: **`F12`**
- Or: **`Ctrl + Shift + J`**
- Or: **`Ctrl + Shift + I`**

---

## Method 2: Using Browser Menu

### Chrome:
1. Click the **three dots** (⋮) in the top-right corner
2. Go to **"More Tools"** → **"Developer Tools"**
3. Click on the **"Console"** tab

### Firefox:
1. Click the **three lines** (☰) in the top-right corner
2. Go to **"More Tools"** → **"Web Developer Tools"**
3. Click on the **"Console"** tab

### Safari:
1. First, enable Developer menu:
   - Go to **Safari** → **Preferences** → **Advanced**
   - Check **"Show Develop menu in menu bar"**
2. Then: **Develop** → **Show JavaScript Console**

### Edge:
1. Click the **three dots** (⋯) in the top-right corner
2. Go to **"More Tools"** → **"Developer Tools"**
3. Click on the **"Console"** tab

---

## What You'll See

After opening Developer Tools, you'll see a panel at the bottom or side of your browser:

```
┌─────────────────────────────────────────────┐
│ Elements | Console | Sources | Network | ...│ ← Tabs
├─────────────────────────────────────────────┤
│                                             │
│ > console.log("test")                      │ ← You can type here
│                                             │
│ (Messages and errors will appear here)      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## How to Check Your Environment Variable

### Step 1: Open Console
- Use one of the methods above to open Developer Tools
- Make sure you're on the **"Console"** tab

### Step 2: Type the Command
In the console, type this command and press **Enter**:

```javascript
console.log(process.env.REACT_APP_API_URL)
```

### Step 3: Check the Result

**✅ If it's working correctly:**
You'll see something like:
```
https://workout-buddy-api.onrender.com/api
```

**❌ If it's NOT working:**
You'll see:
```
undefined
```
or
```
http://localhost:5001/api
```

---

## Visual Guide

```
Browser Window
┌─────────────────────────────────────────────┐
│  [Your Vercel App]                          │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Console Tab                         │  │
│  ├─────────────────────────────────────┤  │
│  │ > console.log(process.env.REACT_APP_API_URL)│
│  │   https://workout-buddy-api.onrender.com/api│ ← Good!
│  │                                         │
│  │ >                                      │ ← Type here
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## What to Do Based on the Result

### If you see your Render URL (✅):
- Environment variable is set correctly!
- If you still have connection errors, check:
  - Is your Render backend running? (Check Render dashboard)
  - Is the URL correct? (should end with `/api`)

### If you see `undefined` (❌):
- Environment variable is NOT set in Vercel
- Go to Vercel → Settings → Environment Variables
- Add `REACT_APP_API_URL` with your Render URL
- **Redeploy** your project

### If you see `localhost` (❌):
- Environment variable is set but using default value
- This means the variable isn't being read
- Check:
  - Variable name is exactly `REACT_APP_API_URL`
  - Project was redeployed after setting variable
  - You're checking the deployed version (not localhost)

---

## Other Useful Console Commands

You can also check:

```javascript
// Check all environment variables
console.log(process.env)

// Check if you're in production
console.log(process.env.NODE_ENV)

// Check the full API URL being used
console.log(process.env.REACT_APP_API_URL || 'http://localhost:5001/api')
```

---

## Tips

1. **Make sure you're on the deployed Vercel site**, not localhost
   - URL should be: `https://your-app.vercel.app`
   - Not: `http://localhost:3000`

2. **Clear browser cache** if you don't see changes:
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or use incognito/private window

3. **Check Network tab** to see actual API calls:
   - In Developer Tools, go to **"Network"** tab
   - Try to register/login
   - See what URL the requests are going to

---

## Still Having Issues?

1. Make sure you **redeployed** after setting the environment variable
2. Check that the variable name is exactly `REACT_APP_API_URL` (case-sensitive)
3. Verify your Render backend is running and accessible
4. Try opening your Render URL directly: `https://your-api.onrender.com/api/health`

