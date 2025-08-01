@echo off
echo 🧪 Testing UniConnect Backend Locally
echo ====================================
echo.

echo 📁 Checking if we're in the correct directory...
if not exist "backend\server.js" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Expected to find: backend\server.js
    pause
    exit /b 1
)

echo ✅ Project structure found
echo.

echo 🔍 Checking environment file...
if exist "backend\.env" (
    echo ✅ Found backend\.env file
    echo 📋 Environment variables:
    type "backend\.env"
) else (
    echo ❌ backend\.env file not found
    echo Please make sure you have the .env file with MONGO_URI and JWT_SECRET
    pause
    exit /b 1
)

echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install

echo.
echo 🚀 Starting backend server...
echo 📝 Press Ctrl+C to stop the server
echo.
echo 🔗 Once started, test these URLs:
echo    • Health check: http://localhost:5000/api/health
echo    • Root endpoint: http://localhost:5000
echo.

call npm start
