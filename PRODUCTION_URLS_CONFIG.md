# 🔗 UniConnect Production URLs Configuration

## Your Deployed Services

### Backend (Node.js/Express/MongoDB)

```
https://uniconnect-backend-b57e.onrender.com
```

### Frontend (React/Vite)

```
https://uniconnect-frontend-7idj.onrender.com
```

## 🔧 Configuration Updates Applied

### 1. Frontend Environment Variables (`frontend/.env`)

```bash
VITE_API_BASE_URL=https://uniconnect-backend-b57e.onrender.com/api
VITE_SOCKET_URL=https://uniconnect-backend-b57e.onrender.com
```

### 2. Backend CORS Configuration (`backend/server.js`)

Updated to allow your frontend URL:

```javascript
allowedOrigins = [
  "https://uniconnect-frontend-7idj.onrender.com",
  // ... other allowed origins
];
```

### 3. Render Configuration (`render.yaml`)

Updated with your actual backend URLs for automatic deployment.

## 🧪 Test Your Deployed Application

### Backend Health Check

Visit: https://uniconnect-backend-b57e.onrender.com/api/health

**Expected Response:**

```json
{
  "status": "OK",
  "message": "UniConnect Backend is running",
  "timestamp": "2025-08-01T12:00:00.000Z"
}
```

### Frontend Application

Visit: https://uniconnect-frontend-7idj.onrender.com

Should load your React application and be able to connect to the backend.

## 🔄 Deployment Steps

### Option 1: Redeploy Frontend (Recommended)

1. Push these changes to GitHub
2. In Render dashboard, go to your frontend service
3. Click "Manual Deploy" to trigger redeploy with new environment variables

### Option 2: Update Environment Variables Manually

If you don't want to redeploy, update environment variables in Render:

**Frontend Service Environment Variables:**

```
VITE_API_BASE_URL=https://uniconnect-backend-b57e.onrender.com/api
VITE_SOCKET_URL=https://uniconnect-backend-b57e.onrender.com
```

**Backend Service Environment Variables:**

```
NODE_ENV=production
MONGO_URI=mongodb+srv://santhosh:santhosh@cluster0.qmt0lo2.mongodb.net/uniconnect
JWT_SECRET=Gv9sVp3F+GeBBRXAEEeWyECFzVBinjKb8NofjKD/h+4=
```

## 🐛 Troubleshooting

### If Frontend Can't Connect to Backend:

1. Check backend health endpoint is responding
2. Verify CORS configuration includes your frontend URL
3. Check browser console for CORS errors
4. Ensure environment variables are set correctly in Render

### If Backend Returns 500 Errors:

1. Check MongoDB connection is working
2. Verify JWT_SECRET is set
3. Check Render backend service logs for errors

### If Authentication Issues:

1. Verify JWT_SECRET is consistent
2. Check token expiration settings
3. Clear browser localStorage and try again

## ✅ Success Indicators

- ✅ Backend health endpoint returns status "OK"
- ✅ Frontend loads without errors
- ✅ Login/registration works
- ✅ API calls succeed (no CORS errors)
- ✅ Real-time chat connects
- ✅ Socket.IO connection established

## 📱 Feature Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads for both students and alumni
- [ ] Job posting/viewing works
- [ ] Connection requests work
- [ ] Real-time chat functions
- [ ] Profile updates save
- [ ] Logout works properly

Your application should now be fully functional with the production URLs! 🎉
