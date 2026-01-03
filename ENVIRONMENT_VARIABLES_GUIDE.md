# 🔐 Environment Variables Setup Guide

This guide shows you exactly where and how to add environment variables in Render and Vercel.

---

## 📍 Part 1: Render (Backend) Environment Variables

### Step 1: Navigate to Environment Variables

1. **Log into Render**: Go to https://render.com and sign in
2. **Find your service**: Click on your service name (e.g., `workout-buddy-api`)
3. **Click "Environment" tab**: 
   - Look at the top navigation bar in your service dashboard
   - You'll see tabs like: `Overview`, `Logs`, `Events`, **`Environment`**, `Settings`
   - Click on **`Environment`**

### Step 2: Add Each Variable One by One

You'll see a section that looks like this:

```
┌─────────────────────────────────────────────┐
│ Environment Variables                       │
├─────────────────────────────────────────────┤
│                                             │
│ [Add Environment Variable]  ← Click this    │
│                                             │
└─────────────────────────────────────────────┘
```

**For each variable, follow these steps:**

#### Variable 1: NODE_ENV

1. Click **"Add Environment Variable"** button
2. A form will appear:
   ```
   ┌─────────────────────────────────────┐
   │ Key:   [________________]          │
   │ Value: [________________]          │
   │        [Save Changes]              │
   └─────────────────────────────────────┘
   ```
3. Fill in:
   - **Key**: Type `NODE_ENV` (exactly as shown, all caps)
   - **Value**: Type `production` (lowercase)
4. Click **"Save Changes"**
5. You'll see it appear in the list below

#### Variable 2: PORT

1. Click **"Add Environment Variable"** button again
2. Fill in:
   - **Key**: `PORT` (all caps)
   - **Value**: `10000` (just the number, no quotes)
3. Click **"Save Changes"**

#### Variable 3: JWT_SECRET

1. **First, generate a secret key:**
   
   **Option A - Using Terminal (Mac/Linux):**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output (it will look like: `luSF7jB7I/4ig9CwH7EmqtaXeMf4sbeKGqLju7hp9V0=`)

   **Option B - Using Online Generator:**
   - Go to https://randomkeygen.com/
   - Scroll down to "CodeIgniter Encryption Keys"
   - Copy any of the keys shown

   **Option C - Manual:**
   - Create a long random string like: `my-super-secret-jwt-key-2024-workout-buddy-app-xyz123abc456`

2. Click **"Add Environment Variable"** button
3. Fill in:
   - **Key**: `JWT_SECRET` (all caps)
   - **Value**: Paste the generated secret key
4. Click **"Save Changes"**

#### Variable 4: FRONTEND_URL (Temporary)

1. Click **"Add Environment Variable"** button
2. Fill in:
   - **Key**: `FRONTEND_URL` (all caps)
   - **Value**: Type `*` (just an asterisk, or leave blank)
3. Click **"Save Changes"**
4. **Note:** We'll update this later after deploying the frontend

### Step 3: Verify All Variables

After adding all 4 variables, your list should look like this:

```
┌─────────────────────────────────────────────┐
│ Environment Variables                       │
├─────────────────────────────────────────────┤
│ NODE_ENV        = production                │
│ PORT            = 10000                      │
│ JWT_SECRET      = luSF7jB7I/4ig9CwH7E...   │
│ FRONTEND_URL    = *                         │
│                                             │
│ [Add Environment Variable]                  │
└─────────────────────────────────────────────┘
```

### Step 4: Update FRONTEND_URL Later

**First, get your Vercel URL:**

1. **Go to Vercel dashboard**: https://vercel.com
2. **Click on your project** (Workout-Buddy)
3. **Find the URL** - It's displayed at the top of the project page:
   - Look for: `🌐 https://workout-buddy.vercel.app` (or similar)
   - It's usually a clickable link
   - **Copy this URL** (see [HOW_TO_FIND_VERCEL_URL.md](./HOW_TO_FIND_VERCEL_URL.md) for detailed instructions)

**Then update in Render:**

1. Go back to Render → Your Service → Environment tab
2. Find `FRONTEND_URL` in the list
3. Click on it (or click edit/pencil icon)
4. Change the value from `*` to your Vercel URL:
   - Example: `https://workout-buddy.vercel.app`
   - **Important:** 
     - No trailing slash `/`
     - No `/api` at the end
     - Must start with `https://`
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## 📍 Part 2: Vercel (Frontend) Environment Variables

### Step 1: Navigate to Environment Variables

1. **Log into Vercel**: Go to https://vercel.com and sign in
2. **Find your project**: Click on your project name (e.g., `Workout-Buddy`)
3. **Go to Settings**:
   - Look at the top navigation bar
   - Click on **"Settings"** tab (usually the rightmost tab)
4. **Click "Environment Variables"**:
   - In the left sidebar under Settings, you'll see:
     - General
     - Domains
     - **Environment Variables** ← Click this
     - Git
     - etc.

### Step 2: Add the Variable

You'll see a form like this:

```
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│ Key:   [________________________]               │
│ Value: [________________________]               │
│ Environment: [Production ▼]                    │
│ [Add]                                           │
└─────────────────────────────────────────────────┘
```

**Fill in the form:**

1. **Key**: Type `REACT_APP_API_URL`
   - **Important:** Must start with `REACT_APP_` for React to read it
   - Case sensitive, use exact capitalization

2. **Value**: Your Render backend URL + `/api`
   - Example: If your Render URL is `https://workout-buddy-api.onrender.com`
   - Then value should be: `https://workout-buddy-api.onrender.com/api`
   - **Important:** 
     - Include `/api` at the end
     - Use `https://` (not `http://`)
     - No trailing slash after `/api`

3. **Environment**: Select **"Production"** from the dropdown
   - Or select **"All"** if you want it for all environments

4. Click **"Add"** or **"Save"** button

### Step 3: Redeploy (Important!)

After adding the variable:

1. Go to the **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Or Vercel might show a notification to redeploy - click it

**Why?** Environment variables are only loaded when the app builds, so you need to redeploy for the new variable to take effect.

---

## ✅ Quick Checklist

### Render (Backend):
- [ ] Added `NODE_ENV` = `production`
- [ ] Added `PORT` = `10000`
- [ ] Added `JWT_SECRET` = (generated random string)
- [ ] Added `FRONTEND_URL` = `*` (temporary)
- [ ] Later: Updated `FRONTEND_URL` to Vercel URL

### Vercel (Frontend):
- [ ] Added `REACT_APP_API_URL` = `https://your-api.onrender.com/api`
- [ ] Redeployed the project

---

## 🆘 Troubleshooting

### Variable not working in Render?
- Make sure you clicked "Save Changes" after adding each variable
- Check that there are no extra spaces in the Key or Value
- Render will automatically redeploy when you save - check the Events tab

### Variable not working in Vercel?
- Make sure the variable name starts with `REACT_APP_`
- Make sure you redeployed after adding the variable
- Check the build logs to see if the variable is being read

### CORS errors?
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- No trailing slashes
- Use `https://` not `http://`

---

## 📝 Example Values

Here's what your variables should look like:

**Render:**
```
NODE_ENV = production
PORT = 10000
JWT_SECRET = luSF7jB7I/4ig9CwH7EmqtaXeMf4sbeKGqLju7hp9V0=
FRONTEND_URL = https://workout-buddy.vercel.app
```

**Vercel:**
```
REACT_APP_API_URL = https://workout-buddy-api.onrender.com/api
```

---

Need help? Check the main DEPLOYMENT.md file or the Render/Vercel documentation!

