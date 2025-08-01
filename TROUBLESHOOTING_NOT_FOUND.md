# 🔧 Troubleshooting "Not Found" Errors

## Common "Not Found" Issues and Solutions

### 1. Frontend Routes Not Found (404 on Refresh)

**Problem**: React Router routes work when navigating within the app, but show "Not Found" when you refresh the page or visit URLs directly.

**Solution**: ✅ **FIXED** - Added `_redirects` file and updated `render.yaml`

- Created `frontend/public/_redirects` with `/*    /index.html   200`
- Updated `render.yaml` to use `type: static` for frontend
- Added rewrite rules in `render.yaml`

### 2. Backend API Not Found (500/404 on API calls)

**Problem**: Frontend can't connect to backend API, shows connection errors.

**Solutions**:

#### Check Environment Variables:

```bash
# Frontend should have:
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
VITE_SOCKET_URL=https://your-backend-app.onrender.com

# Backend should have:
NODE_ENV=production
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

#### Check Backend Health:

Visit: `https://your-backend-app.onrender.com/api/health`
Should return: `{"status":"OK","message":"UniConnect Backend is running"}`

### 3. CORS Errors

**Problem**: Browser blocks requests due to CORS policy.

**Solution**: ✅ **FIXED** - Updated backend CORS configuration

- Backend now accepts requests from `uniconnect-frontend.onrender.com`
- Update the domain in `backend/server.js` if your frontend URL is different

### 4. MongoDB Connection Issues

**Problem**: Backend starts but can't connect to database.

**Solutions**:

1. **Check MongoDB URI**: Ensure it's properly formatted
2. **Whitelist IPs**: In MongoDB Atlas, whitelist `0.0.0.0/0` for Render
3. **Check Network Access**: Ensure your MongoDB cluster allows external connections

### 5. Build Failures

**Problem**: Deployment fails during build process.

**Solutions**:

#### Frontend Build Issues:

```bash
# Make sure package.json has correct scripts:
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

#### Backend Build Issues:

```bash
# Make sure package.json has:
"scripts": {
  "start": "node server.js"
}
```

### 6. Environment Variable Issues

**Problem**: Environment variables not loading properly.

**Solutions**:

1. **Check Render Dashboard**: Ensure all env vars are set in service settings
2. **Check Build Logs**: Look for environment variable loading messages
3. **Test Locally**: Use `.env` files to test environment variable setup

### 7. Port Issues

**Problem**: Backend not starting on correct port.

**Solution**: Ensure backend uses `process.env.PORT || 5000`

```javascript
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🚀 Deployment Checklist

### Before Deployment:

- [ ] MongoDB Atlas cluster created and configured
- [ ] MongoDB connection string ready
- [ ] JWT secret generated (minimum 32 characters)
- [ ] Repository pushed to GitHub

### Render Configuration:

- [ ] Backend service created with correct environment variables
- [ ] Frontend static site created
- [ ] Environment variables set in Render dashboard
- [ ] CORS origins match your frontend URL

### After Deployment:

- [ ] Backend health endpoint responds: `/api/health`
- [ ] Frontend loads without errors
- [ ] API calls work from frontend to backend
- [ ] Authentication flow works
- [ ] Socket.IO connection establishes

## 🔍 Debugging Commands

### Check Backend Status:

```bash
# Health check
curl https://your-backend-app.onrender.com/api/health

# Test API endpoint
curl https://your-backend-app.onrender.com/api/auth/verify
```

### Check Frontend Environment:

Open browser console and run:

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
console.log(import.meta.env.VITE_SOCKET_URL);
```

### Check Network Tab:

1. Open browser DevTools
2. Go to Network tab
3. Try to login or make API calls
4. Check if requests are going to correct URLs

## 📞 Still Having Issues?

1. **Check Render Logs**: Go to your service in Render dashboard and check the logs
2. **Browser Console**: Check for JavaScript errors in browser console
3. **Network Tab**: Check if API requests are failing and why
4. **Environment Variables**: Double-check all environment variables are set correctly

## 🎯 Quick Fixes

### If you get CORS errors:

Update `allowedOrigins` in `backend/server.js` with your actual frontend URL.

### If API calls fail:

Check that `VITE_API_BASE_URL` in frontend matches your backend URL.

### If pages show 404:

Ensure `_redirects` file exists in `frontend/public/` directory.

### If backend won't start:

Check that all required environment variables (`MONGO_URI`, `JWT_SECRET`) are set in Render.
