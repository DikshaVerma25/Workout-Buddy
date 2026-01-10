# 🚀 Development Workflow Guide

This guide explains the recommended workflow for developing and deploying changes.

---

## 📋 Branch Strategy

### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Auto-deploys**: Yes (triggers Vercel + Render deployment)
- **When to push**: Only when features are tested and ready

### Dev Branch (`dev`)
- **Purpose**: Development and testing
- **Auto-deploys**: No (unless you set up a dev environment)
- **When to push**: For collaboration and backup

---

## ✅ Recommended Workflow

### Step 1: Switch to Dev Branch
```bash
git checkout dev
```
Or create it if it doesn't exist:
```bash
git checkout -b dev
```

### Step 2: Make Your Changes
- Edit files
- Test locally with `npm run dev`
- Fix any issues

### Step 3: Test Locally
```bash
# Start both frontend and backend
npm run dev

# Test in browser: http://localhost:3000
# Backend runs on: http://localhost:5001
```

### Step 4: Commit to Dev Branch
```bash
git add .
git commit -m "Your feature description"
git push origin dev
```

### Step 5: Test Everything Works
- ✅ All features working
- ✅ No errors in console
- ✅ UI looks good
- ✅ Data saves correctly
- ✅ No breaking changes

### Step 6: Merge to Main (Deploy)
```bash
# Switch to main
git checkout main

# Merge dev into main
git merge dev

# Push to main (triggers deployment)
git push origin main
```

---

## 🎯 Quick Commands Reference

### Switch to dev branch
```bash
git checkout dev
```

### Switch to main branch
```bash
git checkout main
```

### Create new dev branch (if needed)
```bash
git checkout -b dev
git push -u origin dev
```

### Merge dev into main
```bash
git checkout main
git merge dev
git push origin main
```

### Pull latest changes
```bash
git checkout dev
git pull origin dev

# Or for main
git checkout main
git pull origin main
```

---

## 💡 Benefits of This Workflow

1. **No Constant Redeploys**: Test everything locally before deploying
2. **Faster Development**: No waiting for deployment between tests
3. **Safer**: Catch issues before they reach production
4. **Cleaner History**: One commit per tested feature set
5. **Easy Rollback**: If something breaks, main stays stable

---

## 🔄 Alternative: Feature Branches

For larger features, you can create feature-specific branches:

```bash
# Create feature branch
git checkout -b feature/friend-requests

# Work on feature
# ... make changes ...

# Test locally
npm run dev

# When done, merge to dev
git checkout dev
git merge feature/friend-requests

# Test everything together
# Then merge dev to main when ready
```

---

## ⚠️ Important Notes

- **Always test locally first** before merging to main
- **Main branch** = Production (users see this)
- **Dev branch** = Development (your playground)
- **Never push broken code to main**
- If main breaks, you can rollback:
  ```bash
  git revert HEAD
  git push origin main
  ```

---

## 🐛 Current Status

Your current branches:
- `main`: Production branch (auto-deploys to Vercel + Render)
- `dev`: Development branch (created, ready to use)

**Next time you want to make changes:**
1. `git checkout dev`
2. Make changes
3. Test locally
4. Commit to dev
5. When ready: merge to main

