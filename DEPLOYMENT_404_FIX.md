# 🚨 404 Error After Deployment - Troubleshooting Guide

## Problem: "Failed to load resource: 404" after deployment

This error typically occurs due to routing issues or missing resources in your deployed application.

## 🔍 Immediate Diagnostic Steps

### Step 1: Identify What's Failing

1. **Open your deployed frontend**: https://uniconnect-frontend-7idj.onrender.com
2. **Open Browser Developer Tools** (F12)
3. **Check Console tab** for 404 errors
4. **Check Network tab** for failed requests

### Step 2: Common 404 Error Types

#### A. **SPA Routing 404s** (Page Refresh Issues)

**Error**: `Cannot GET /dashboard` or similar
**Cause**: Server doesn't know how to handle React routes
**Fix**: Ensure `_redirects` file is deployed

#### B. **Static Asset 404s** (JS/CSS/Images)

**Error**: `Failed to load resource: assets/index-abc123.js`
**Cause**: Build output not correctly served
**Fix**: Check Vite build configuration

#### C. **API 404s** (Backend Calls)

**Error**: `Failed to load resource: /api/health`
**Cause**: Wrong API URL or backend not running
**Fix**: Check backend URL and health

## 🛠️ Specific Fixes

### Fix 1: SPA Routing Issues

**Check if \_redirects file exists:**

```
frontend/public/_redirects
```

**Content should be:**

```
/*    /index.html   200
```

**If missing, create it and redeploy:**

```bash
# In frontend/public/ directory
echo "/*    /index.html   200" > _redirects
```

### Fix 2: Render Static Site Configuration

**Ensure your Render frontend service is configured as:**

- **Type**: Static Site (NOT Web Service)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Root Directory**: `frontend`

### Fix 3: Environment Variables Check

**Verify these are set in your Render frontend service:**

```
VITE_API_BASE_URL=https://uniconnect-backend-b57e.onrender.com/api
VITE_SOCKET_URL=https://uniconnect-backend-b57e.onrender.com
```

### Fix 4: Backend Health Check

**Test backend endpoint:**

```
https://uniconnect-backend-b57e.onrender.com/api/health
```

**Expected response:**

```json
{
  "status": "OK",
  "message": "UniConnect Backend is running",
  "timestamp": "2025-08-01T12:00:00.000Z"
}
```

## 🧪 Diagnostic Commands

### Test in Browser Console

**1. Check Environment Variables:**

```javascript
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
console.log("Socket URL:", import.meta.env.VITE_SOCKET_URL);
```

**2. Test Backend Connection:**

```javascript
fetch("https://uniconnect-backend-b57e.onrender.com/api/health")
  .then((response) => response.json())
  .then((data) => console.log("Backend Health:", data))
  .catch((error) => console.error("Backend Error:", error));
```

**3. Check Current URL:**

```javascript
console.log("Current URL:", window.location.href);
console.log("Base URL:", window.location.origin);
```

## 🔄 Quick Resolution Steps

### Method 1: Redeploy with Fixes

1. **Ensure \_redirects file exists** in `frontend/public/`
2. **Push changes to GitHub**
3. **Trigger manual redeploy** in Render dashboard
4. **Wait for deployment to complete**
5. **Test again**

### Method 2: Check Render Service Settings

1. **Go to Render Dashboard**
2. **Find your frontend service**
3. **Check "Settings" tab:**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Root Directory: `frontend`
4. **Check "Environment" tab:**
   - Verify VITE_API_BASE_URL is set
   - Verify VITE_SOCKET_URL is set

### Method 3: Check Build Output

1. **In Render dashboard, check "Logs" tab**
2. **Look for build errors or warnings**
3. **Ensure build completed successfully**
4. **Check if `dist` folder was created**

## ⚡ Emergency Fixes

### If Nothing Works - Nuclear Option:

1. **Delete and recreate frontend service** in Render
2. **Use these exact settings:**
   - Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Environment Variables:
     ```
     VITE_API_BASE_URL=https://uniconnect-backend-b57e.onrender.com/api
     VITE_SOCKET_URL=https://uniconnect-backend-b57e.onrender.com
     ```

### If Still Issues - Blueprint Deployment:

1. **Use render.yaml** for automatic deployment
2. **Render will configure everything automatically**
3. **Just set environment variables in dashboard**

## 📱 Test Scenarios

After applying fixes, test these scenarios:

### ✅ Success Indicators:

- [ ] Homepage loads: `https://uniconnect-frontend-7idj.onrender.com`
- [ ] Direct URL works: `https://uniconnect-frontend-7idj.onrender.com/dashboard`
- [ ] Page refresh works (no 404)
- [ ] API calls succeed (check Network tab)
- [ ] Console shows no 404 errors
- [ ] Assets load properly (JS, CSS, images)

### ❌ Still Failing Indicators:

- [ ] Page refresh gives 404
- [ ] Direct URLs show "Cannot GET"
- [ ] Assets fail to load
- [ ] API calls return 404
- [ ] Console shows fetch errors

## 🆘 Need More Help?

**Share these details for specific help:**

1. **Exact error message** from browser console
2. **URL that's failing** (from Network tab)
3. **Your Render service configuration** (build command, publish directory)
4. **Whether backend health endpoint works**

Most 404 issues after deployment are SPA routing problems that the `_redirects` file should fix! 🎯
