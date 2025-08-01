# 🚨 Backend Connection Troubleshooting Guide

## Problem: `net::ERR_CONNECTION_REFUSED`

This error means the frontend cannot connect to the backend server on `http://localhost:5000`.

## ✅ Quick Fix Steps:

### Step 1: Start the Backend Server

**Option A: Using Command Prompt**

```cmd
cd C:\Users\Santhosh\Pictures\uniconnect-starter\backend
node server.js
```

**Option B: Using the Batch File**

```cmd
cd C:\Users\Santhosh\Pictures\uniconnect-starter\backend
start-server.bat
```

**Option C: Using npm**

```cmd
cd C:\Users\Santhosh\Pictures\uniconnect-starter\backend
npm start
```

### Step 2: Verify Server is Running

1. **Check Terminal Output** - You should see:

   ```
   ✅ Connected to MongoDB
   🚀 Server running on port 5000
   📱 Environment: development
   ```

2. **Test in Browser** - Open: http://localhost:5000

   - Should show: "Welcome to UniConnect API"

3. **Test Health Endpoint** - Open: http://localhost:5000/api/health
   - Should show: `{"status": "OK", "message": "UniConnect Backend is running"}`

### Step 3: Common Issues & Solutions

#### Issue 1: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

- Kill process using port 5000:
  ```cmd
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  ```
- Or change port in `.env` file:
  ```
  PORT=5001
  ```

#### Issue 2: MongoDB Connection Failed

```
❌ MongoDB connection error
```

**Solution:**

- Check your MongoDB Atlas connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if MongoDB service is running (if using local MongoDB)

#### Issue 3: Missing Dependencies

```
Cannot find module 'express'
```

**Solution:**

```cmd
cd C:\Users\Santhosh\Pictures\uniconnect-starter\backend
npm install
```

#### Issue 4: Environment Variables Not Loaded

```
TypeError: Cannot read property 'MONGO_URI' of undefined
```

**Solution:**

- Ensure `.env` file exists in backend directory
- Check `.env` file format (no spaces around =)

## 🔧 Testing Backend Connectivity

### Manual API Test

Open Command Prompt and test:

```cmd
# Test health endpoint
curl http://localhost:5000/api/health

# Test root endpoint
curl http://localhost:5000/
```

### Browser Test

Visit these URLs in your browser:

- http://localhost:5000
- http://localhost:5000/api/health

## 📝 Debugging Checklist

- [ ] Backend server is running
- [ ] No port conflicts
- [ ] MongoDB is connected
- [ ] Environment variables loaded
- [ ] CORS is configured properly
- [ ] Frontend is on correct port (5173)

## 🚀 Start Both Servers (Recommended)

**Terminal 1 - Backend:**

```cmd
cd C:\Users\Santhosh\Pictures\uniconnect-starter\backend
npm start
```

**Terminal 2 - Frontend:**

```cmd
cd C:\Users\Santhosh\Pictures\uniconnect-starter\frontend
npm run dev
```

## ⚡ Development Workflow

1. **Always start backend first**
2. **Then start frontend**
3. **Keep both terminals open**
4. **Check both are running on correct ports:**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

## 🆘 Still Having Issues?

If you're still getting connection errors:

1. **Restart both servers**
2. **Clear browser cache**
3. **Check Windows Firewall/Antivirus**
4. **Try different port numbers**
5. **Check network proxy settings**

## 📞 Quick Commands

```cmd
# Check if something is running on port 5000
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID <PID> /F

# Install backend dependencies
cd backend && npm install

# Start backend in development mode
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

---

**Remember:** The backend MUST be running before the frontend can make API calls!
