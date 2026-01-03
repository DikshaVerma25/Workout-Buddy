# 🔗 How to Find Your Vercel URL

After deploying your frontend to Vercel, here's exactly where to find your URL:

## Method 1: From the Project Dashboard (Easiest)

1. **Log into Vercel**: Go to https://vercel.com and sign in
2. **Go to your Dashboard**: You'll see a list of all your projects
3. **Find your project**: Look for "Workout-Buddy" (or whatever you named it)
4. **Click on the project name** - This opens your project dashboard
5. **Look at the top of the page** - You'll see your deployment URL displayed prominently:

```
┌─────────────────────────────────────────────┐
│  Workout-Buddy                                │
│                                               │
│  🌐 https://workout-buddy.vercel.app         │ ← This is your URL!
│                                               │
│  [Deployments] [Analytics] [Settings]        │
└─────────────────────────────────────────────┘
```

6. **Click on the URL** or **copy it** - It's usually a clickable link

## Method 2: From the Deployments Tab

1. **Go to your project** in Vercel
2. **Click on "Deployments"** tab (top navigation)
3. **Find your latest deployment** (usually at the top)
4. **Click on the deployment** (the row with your commit message)
5. **Look for the URL** - It will be displayed at the top:

```
┌─────────────────────────────────────────────┐
│  Deployment Details                          │
│                                               │
│  🌐 https://workout-buddy.vercel.app         │ ← Your URL
│                                               │
│  Status: Ready                               │
│  Branch: main                                │
└─────────────────────────────────────────────┘
```

## Method 3: From the Deployment Card

On the Deployments page, each deployment card shows:
- A preview image
- The commit message
- **A clickable URL** at the bottom or top of the card

Just click on the URL shown on the deployment card.

## What Your URL Will Look Like

Vercel URLs typically follow this format:
- `https://workout-buddy.vercel.app`
- `https://workout-buddy-[random-chars].vercel.app`
- Or if you have a custom domain: `https://yourdomain.com`

## Quick Copy Method

1. **Hover over the URL** in Vercel
2. **Right-click** → **Copy link address**
3. Or **click on it** and copy from the browser address bar

## After You Get the URL

Once you have your Vercel URL (e.g., `https://workout-buddy.vercel.app`):

1. **Go back to Render** (your backend)
2. **Navigate to**: Your Service → Environment tab
3. **Find** `FRONTEND_URL` variable
4. **Update the value** to your Vercel URL:
   - Example: `https://workout-buddy.vercel.app`
   - **Important:** 
     - No trailing slash `/`
     - No `/api` at the end
     - Must use `https://`
5. **Save Changes** - Render will auto-redeploy

## Visual Guide

```
Vercel Dashboard
┌─────────────────────────────────────────────┐
│  [Your Projects]                            │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Workout-Buddy                        │  │
│  │                                      │  │
│  │ 🌐 https://workout-buddy.vercel.app │  │ ← Copy this!
│  │                                      │  │
│  │ [View] [Settings] [Deployments]     │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

That's it! The URL is usually very visible in the Vercel dashboard.

