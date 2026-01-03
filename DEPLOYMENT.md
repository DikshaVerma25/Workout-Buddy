# 🚀 Deployment Guide - Workout Buddy

This guide will help you deploy your Workout Buddy app for free using:
- **Vercel** (Frontend - React)
- **Render** (Backend - Node.js/Express)

> 📖 **For detailed step-by-step environment variable setup with visual guides, see [ENVIRONMENT_VARIABLES_GUIDE.md](./ENVIRONMENT_VARIABLES_GUIDE.md)**

## Prerequisites

1. GitHub account (your code should be pushed to GitHub)
2. Vercel account (free) - Sign up at https://vercel.com
3. Render account (free) - Sign up at https://render.com

---

## Step 1: Deploy Backend to Render

### 1.1 Create a Render Account
- Go to https://render.com
- Sign up with your GitHub account (recommended)

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the `Workout-Buddy` repository
4. Configure the service:
   - **Name**: `workout-buddy-api` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node index.js`
   - **Plan**: Select **"Free"**

### 1.3 Set Environment Variables

**Where to find it:**
After creating the web service, you'll see your service dashboard. Look for the **"Environment"** tab in the left sidebar or at the top of the page.

**How to add variables:**
1. Click on the **"Environment"** tab
2. You'll see a section called **"Environment Variables"** with an **"Add Environment Variable"** button
3. Click **"Add Environment Variable"** for each variable below

**Variables to add (one at a time):**

1. **First Variable:**
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - Click **"Save Changes"**

2. **Second Variable:**
   - Click **"Add Environment Variable"** again
   - **Key**: `PORT`
   - **Value**: `10000`
   - Click **"Save Changes"**

3. **Third Variable:**
   - Click **"Add Environment Variable"** again
   - **Key**: `JWT_SECRET`
   - **Value**: Generate a random string using one of these methods:
     - **Option A (Terminal/Mac/Linux):** Open terminal and run:
       ```bash
       openssl rand -base64 32
       ```
       Copy the output and paste it as the value
     - **Option B (Online):** Go to https://randomkeygen.com/ and copy a "CodeIgniter Encryption Keys" value
     - **Option C (Manual):** Create a long random string like: `my-super-secret-jwt-key-2024-workout-buddy-app-xyz123`
   - Click **"Save Changes"**

4. **Fourth Variable (Optional for now):**
   - Click **"Add Environment Variable"** again
   - **Key**: `FRONTEND_URL`
   - **Value**: Leave this **blank** or use `*` for now
   - We'll update this later after deploying the frontend
   - Click **"Save Changes"**

**Visual Guide:**
```
Render Dashboard → Your Service → Environment Tab
┌─────────────────────────────────────┐
│ Environment Variables              │
├─────────────────────────────────────┤
│ [Add Environment Variable]          │
│                                     │
│ Key: NODE_ENV                       │
│ Value: production                   │
│ [Save Changes]                     │
│                                     │
│ Key: PORT                           │
│ Value: 10000                        │
│ [Save Changes]                      │
│                                     │
│ Key: JWT_SECRET                     │
│ Value: [your-generated-string]     │
│ [Save Changes]                      │
│                                     │
│ Key: FRONTEND_URL                   │
│ Value: * (or leave blank)           │
│ [Save Changes]                      │
└─────────────────────────────────────┘
```

### 1.4 Deploy
- Click **"Create Web Service"**
- Render will build and deploy your backend
- **Copy the service URL** (e.g., `https://workout-buddy-api.onrender.com`)

### 1.5 Update Frontend URL in Render
After deploying frontend (Step 2), come back and update:
- `FRONTEND_URL` = Your Vercel frontend URL (e.g., `https://workout-buddy.vercel.app`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create a Vercel Account
- Go to https://vercel.com
- Sign up with your GitHub account (recommended)

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your `Workout-Buddy` repository from GitHub
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 2.3 Set Environment Variables

**Where to find it:**
1. In your Vercel project dashboard, look at the top navigation bar
2. Click on **"Settings"** (it's usually the rightmost tab)
3. In the left sidebar under Settings, click on **"Environment Variables"**

**How to add the variable:**
1. You'll see a section with **"Key"** and **"Value"** input fields
2. There might be dropdowns for **"Environment"** - select **"Production"** (or "All" if you want it for all environments)
3. Fill in:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your Render backend URL + `/api`
     - Example: If your Render URL is `https://workout-buddy-api.onrender.com`
     - Then the value should be: `https://workout-buddy-api.onrender.com/api`
     - **Important:** Make sure to include `/api` at the end!
4. Click **"Save"** or **"Add"** button

**Visual Guide:**
```
Vercel Dashboard → Your Project → Settings → Environment Variables
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│ Key: [REACT_APP_API_URL        ]                │
│ Value: [https://your-api.onrender.com/api]       │
│ Environment: [Production ▼]                     │
│ [Save]                                           │
└─────────────────────────────────────────────────┘
```

**Note:** After adding the variable, you may need to **redeploy** your project for it to take effect. Vercel usually shows a notification or you can manually trigger a redeploy from the "Deployments" tab.

### 2.4 Deploy
- Click **"Deploy"**
- Vercel will build and deploy your frontend
- **Copy the deployment URL** (e.g., `https://workout-buddy.vercel.app`)

---

## Step 3: Update Backend CORS (Important!)

After getting your Vercel URL, go back to Render:

**Step-by-step:**
1. Go to https://render.com and log in
2. Click on your **"workout-buddy-api"** service (or whatever you named it)
3. Click on the **"Environment"** tab (same place where you added variables earlier)
4. Find the `FRONTEND_URL` variable in the list
5. Click on it to edit (or there might be an edit/pencil icon)
6. Update the **Value** field to your Vercel URL:
   - Example: `https://workout-buddy.vercel.app`
   - **Important:** 
     - Don't include `/api` at the end
     - Don't include a trailing slash `/`
     - Use `https://` (not `http://`)
7. Click **"Save Changes"**
8. Render will automatically detect the change and **redeploy** your service (this takes 1-2 minutes)

**How to verify it worked:**
- Go to the **"Events"** or **"Logs"** tab in Render
- You should see a new deployment starting
- Wait for it to complete (status will show "Live")

---

## Step 4: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try registering a new account
3. Log in and test adding a workout
4. Check if everything works correctly

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not responding
- Check Render logs: Go to your service → **Logs** tab
- Verify environment variables are set correctly
- Make sure `PORT` is set to `10000` for Render

**Problem**: CORS errors
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that the URL doesn't have a trailing slash

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `REACT_APP_API_URL` in Vercel is correct
- Make sure it includes `/api` at the end
- Check browser console for errors

**Problem**: Build fails
- Check Vercel build logs
- Make sure all dependencies are in `package.json`
- Verify `client/package.json` has correct build scripts

---

## Free Tier Limitations

### Render (Backend)
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-50 seconds
- 750 hours/month free (enough for most personal projects)

### Vercel (Frontend)
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for React apps

---

## Custom Domain (Optional)

### Vercel
1. Go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Render
1. Go to your service → **Settings** → **Custom Domain**
2. Add your custom domain
3. Update DNS records as instructed

---

## Updating Your App

Both platforms automatically deploy when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Vercel and Render will automatically rebuild and deploy

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- Check deployment logs in both platforms for error messages

---

Happy Deploying! 🎉

