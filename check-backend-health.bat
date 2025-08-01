@echo off
echo 🏥 UniConnect Backend Health Checker
echo =====================================
echo.

REM Get backend URL from user
set /p BACKEND_URL="📝 Enter your Render backend URL (without /api/health): "

REM Remove trailing slash if present
if "%BACKEND_URL:~-1%"=="/" set BACKEND_URL=%BACKEND_URL:~0,-1%

REM Construct health check URL
set HEALTH_URL=%BACKEND_URL%/api/health

echo.
echo 🔍 Testing health endpoint: %HEALTH_URL%
echo.

REM Test with curl (if available) or provide manual instructions
curl --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 📡 Making request...
    curl -s "%HEALTH_URL%"
    echo.
    echo.
    echo ✅ If you see JSON with "status":"OK", your backend is healthy!
    echo.
    echo 🔗 Your environment variables should be:
    echo Frontend VITE_API_BASE_URL=%BACKEND_URL%/api
    echo Frontend VITE_SOCKET_URL=%BACKEND_URL%
) else (
    echo ⚠️  curl not found. Please test manually:
    echo.
    echo 🌐 Open your browser and visit:
    echo %HEALTH_URL%
    echo.
    echo Expected response:
    echo {"status":"OK","message":"UniConnect Backend is running","timestamp":"..."}
    echo.
    echo ✅ If you see this JSON response, your backend is healthy!
    echo ❌ If you see an error, check your Render service logs and environment variables
)

echo.
echo 🔧 Troubleshooting steps if backend is not healthy:
echo 1. Check your Render service logs in the dashboard
echo 2. Verify environment variables ^(MONGO_URI, JWT_SECRET^)
echo 3. Ensure service is deployed and running
echo 4. Check MongoDB connection string
echo.
echo 📖 For more help, see TROUBLESHOOTING_NOT_FOUND.md
echo.
pause
