# 🚨 "Cannot GET" Error Troubleshooting Guide

## Problem: Cannot GET /api/health and Cannot GET /

This error means your backend server is either:

1. Not running at all
2. Crashed during startup
3. Not responding to requests

## 🔍 Diagnostic Steps

### Step 1: Check Render Service Status

1. **Go to your Render Dashboard**: https://dashboard.render.com
2. **Find your backend service**
3. **Check the service status**:
   - ✅ **"Live"** = Service is supposed to be running
   - ❌ **"Build failed"** = Deployment failed
   - ❌ **"Deploy failed"** = Startup failed
   - ⚠️ **"Suspended"** = Service is sleeping (free tier)

### Step 2: Check Service Logs

In your Render backend service:

1. Click on **"Logs"** tab
2. Look for recent error messages
3. Common errors to look for:

```
❌ MongooseError: Operation `users.findOne()` buffering timed out
❌ Error: connect ECONNREFUSED
❌ ReferenceError: JWT_SECRET is not defined
❌ Error: listen EADDRINUSE
```

### Step 3: Verify Environment Variables

Make sure these are set in your Render backend service:

**Required Environment Variables:**

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**How to check:**

1. Go to your backend service in Render
2. Click on **"Environment"** tab
3. Verify all required variables are present

### Step 4: Test MongoDB Connection

Your MongoDB connection might be failing:

**Check MongoDB Atlas:**

1. Go to https://cloud.mongodb.com
2. Check if your cluster is running
3. Verify Network Access allows `0.0.0.0/0` (for Render)
4. Test connection string format

**Common MongoDB Issues:**

- Wrong username/password
- Network restrictions
- Cluster paused/stopped
- Wrong database name

### Step 5: Manual Backend Restart

Try manually redeploying:

1. In Render dashboard, go to your backend service
2. Click **"Manual Deploy"**
3. Select **"Clear build cache & deploy"**
4. Wait for deployment to complete
5. Check logs for startup messages

## 🛠️ Common Fixes

### Fix 1: Missing Environment Variables

If JWT_SECRET or MONGO_URI are missing:

1. **In Render Dashboard:**
   - Go to your backend service
   - Click "Environment" tab
   - Add missing variables:

```
JWT_SECRET=your-secure-random-string-32-chars-minimum
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect?retryWrites=true&w=majority
NODE_ENV=production
```

2. **Redeploy the service**

### Fix 2: MongoDB Connection Issues

1. **Check MongoDB Atlas Network Access:**

   - Go to MongoDB Atlas dashboard
   - Click "Network Access"
   - Ensure `0.0.0.0/0` is whitelisted

2. **Verify Connection String:**

   - Should include username, password, cluster URL
   - Must end with `?retryWrites=true&w=majority`

3. **Test Connection String:**
   ```bash
   # Replace with your actual connection string
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/uniconnect"
   ```

### Fix 3: Package.json Issues

Check your `backend/package.json` start script:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### Fix 4: Port Configuration

Ensure your server.js uses the correct port:

```javascript
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🧪 Test Local Backend

To test if the issue is with your code or deployment:

### 1. Create Local Environment File

Create `backend/.env`:

```
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

### 2. Test Locally

```bash
cd backend
npm install
npm start
```

### 3. Test Local Health Endpoint

Open browser: http://localhost:5000/api/health

**Expected Response:**

```json
{
  "status": "OK",
  "message": "UniConnect Backend is running",
  "timestamp": "2025-08-01T12:00:00.000Z"
}
```

## 🔄 Quick Fix Checklist

- [ ] Environment variables set in Render (MONGO_URI, JWT_SECRET, NODE_ENV)
- [ ] MongoDB Atlas allows 0.0.0.0/0 network access
- [ ] Backend service shows "Live" status in Render
- [ ] Service logs don't show connection errors
- [ ] Manual redeploy completed successfully
- [ ] Local testing works with same environment variables

## 🆘 Still Not Working?

### Check Render Logs for These Patterns:

**1. MongoDB Connection Error:**

```
❌ MongoDB connection error: MongoNetworkError
```

**Fix:** Check MongoDB Atlas network access and connection string

**2. Missing Environment Variable:**

```
❌ JWT_SECRET is not defined
```

**Fix:** Add JWT_SECRET in Render environment variables

**3. Port Already in Use:**

```
❌ Error: listen EADDRINUSE :::5000
```

**Fix:** Usually auto-resolved by Render, but check PORT configuration

**4. Package Installation Error:**

```
❌ npm ERR! peer dep missing
```

**Fix:** Clear build cache and redeploy

### Emergency Deployment Reset:

If nothing works, try this complete reset:

1. **Delete and recreate the backend service in Render**
2. **Use these exact settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
3. **Set environment variables again**
4. **Deploy from scratch**

This usually resolves persistent deployment issues.
