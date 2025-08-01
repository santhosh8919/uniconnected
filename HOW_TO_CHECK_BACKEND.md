# 🔍 How to Find Your Render Backend URL

## Step-by-Step Guide

### 1. Access Render Dashboard

1. Go to https://dashboard.render.com
2. Log in to your account

### 2. Find Your Backend Service

1. Look for your backend service (usually named like `uniconnect-backend`)
2. Click on the service name

### 3. Get the Service URL

In your service dashboard, you'll see:

- **Service URL**: This is your backend URL
- **Status**: Should show "Live" if running
- **Latest Deploy**: Should show recent successful deployment

### 4. Copy the Exact URL

Your backend URL will look like one of these formats:

```
https://uniconnect-backend.onrender.com
https://uniconnect-backend-abc123.onrender.com
https://your-chosen-name.onrender.com
```

### 5. Test the Health Endpoint

Add `/api/health` to your backend URL:

```
https://[your-backend-url]/api/health
```

## 🧪 Quick Test Methods

### Method 1: Browser Test

1. Copy your backend URL from Render dashboard
2. Add `/api/health` to the end
3. Paste in browser address bar
4. Press Enter

**Expected Result:**

```json
{
  "status": "OK",
  "message": "UniConnect Backend is running",
  "timestamp": "2025-08-01T12:00:00.000Z"
}
```

### Method 2: Using Scripts

Run the health check script:

- **Windows**: Double-click `check-backend-health.bat`
- **Mac/Linux**: Run `./check-backend-health.sh`

### Method 3: From Frontend Console

1. Open your deployed frontend website
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Run:

```javascript
// Replace with your actual backend URL
const backendUrl = "https://your-backend-url.onrender.com";
fetch(`${backendUrl}/api/health`)
  .then((response) => response.json())
  .then((data) => console.log("✅ Backend Health:", data))
  .catch((error) => console.error("❌ Backend Error:", error));
```

## 🚨 Common Issues & Solutions

### Issue: "Application failed to respond"

**Cause**: Backend service is down or crashed
**Solution**:

1. Check Render service logs
2. Verify environment variables are set
3. Redeploy the service

### Issue: "502 Bad Gateway"

**Cause**: Backend started but crashed during startup
**Solution**:

1. Check environment variables (MONGO_URI, JWT_SECRET)
2. Review startup logs for errors
3. Verify MongoDB connection

### Issue: "404 Not Found"

**Cause**: Wrong URL or service not deployed
**Solution**:

1. Double-check the service URL from Render dashboard
2. Ensure the service is deployed successfully
3. Check if the health route exists in your code

### Issue: Connection timeout

**Cause**: Service is sleeping (free tier) or overloaded
**Solution**:

1. Wait for service to wake up (free tier sleeps after 15 min inactivity)
2. Try again in a few seconds
3. Consider upgrading to paid tier for always-on service

## 📋 Environment Variables Checklist

Make sure these are set in your Render backend service:

### Required:

- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)
- `NODE_ENV` - Set to `production`

### Optional:

- `PORT` - Usually auto-set by Render to 10000
- `FRONTEND_URL` - Your frontend URL (for CORS if needed)

## 🔄 After Finding Your URL

Once you have your backend URL, update your frontend environment variables:

### In Render Frontend Service:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### For Local Development (.env):

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

Remember to redeploy your frontend after updating environment variables!
