@echo off
echo 🔍 UniConnect Backend Diagnostic Tool
echo ======================================
echo.

REM Get backend URL from user
set /p BACKEND_URL="📝 Enter your Render backend URL (no trailing slash): "

if "%BACKEND_URL%"=="" (
    echo ❌ ERROR: No URL provided
    pause
    exit /b 1
)

REM Remove trailing slash if present
if "%BACKEND_URL:~-1%"=="/" set BACKEND_URL=%BACKEND_URL:~0,-1%

echo.
echo 🧪 Running diagnostic tests...
echo.

REM Test 1: Root endpoint
echo TEST 1: Root Endpoint
echo 🔗 Testing: %BACKEND_URL%

curl --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('curl -s -o nul -w "%%{http_code}" "%BACKEND_URL%" --max-time 10') do set ROOT_CODE=%%i
    if "%ROOT_CODE%"=="200" (
        echo    ✅ SUCCESS ^(HTTP %ROOT_CODE%^)
        set ROOT_OK=1
    ) else if "%ROOT_CODE%"=="000" (
        echo    ❌ NO RESPONSE ^(Connection failed/timeout^)
        set ROOT_OK=0
    ) else (
        echo    ❌ ERROR ^(HTTP %ROOT_CODE%^)
        set ROOT_OK=0
    )
) else (
    echo    ⚠️  CURL NOT FOUND - Test manually in browser
    set ROOT_OK=2
)

echo.

REM Test 2: Health endpoint
echo TEST 2: Health Endpoint
echo 🔗 Testing: %BACKEND_URL%/api/health

curl --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('curl -s -o nul -w "%%{http_code}" "%BACKEND_URL%/api/health" --max-time 10') do set HEALTH_CODE=%%i
    if "%HEALTH_CODE%"=="200" (
        echo    ✅ SUCCESS ^(HTTP %HEALTH_CODE%^)
        set HEALTH_OK=1
    ) else if "%HEALTH_CODE%"=="000" (
        echo    ❌ NO RESPONSE ^(Connection failed/timeout^)
        set HEALTH_OK=0
    ) else (
        echo    ❌ ERROR ^(HTTP %HEALTH_CODE%^)
        set HEALTH_OK=0
    )
) else (
    echo    ⚠️  CURL NOT FOUND - Test manually in browser
    set HEALTH_OK=2
)

echo.
echo 📊 DIAGNOSTIC RESULTS
echo ====================
echo.

if "%ROOT_OK%"=="1" if "%HEALTH_OK%"=="1" (
    echo ✅ BACKEND IS WORKING CORRECTLY
    echo.
    echo 🎉 Your backend is healthy! Environment variables for frontend:
    echo.
    echo VITE_API_BASE_URL=%BACKEND_URL%/api
    echo VITE_SOCKET_URL=%BACKEND_URL%
    echo.
) else if "%ROOT_OK%"=="0" (
    echo ❌ BACKEND HAS ISSUES
    echo.
    echo 🔧 TROUBLESHOOTING STEPS:
    echo.
    echo 🚨 Backend server is not responding:
    echo    • Backend server is not running or crashed
    echo    • Check Render service status in dashboard
    echo    • Review service logs for errors
    echo    • Verify environment variables are set
    echo.
    echo 📋 CHECK THESE IN RENDER DASHBOARD:
    echo    1. Service Status: Should show 'Live'
    echo    2. Environment Variables:
    echo       - NODE_ENV=production
    echo       - MONGO_URI=^(your MongoDB connection string^)
    echo       - JWT_SECRET=^(32+ character secret^)
    echo    3. Service Logs: Look for startup errors
    echo    4. MongoDB Atlas: Network access allows 0.0.0.0/0
    echo.
    echo 🔄 QUICK FIXES TO TRY:
    echo    1. Manual redeploy in Render dashboard
    echo    2. Clear build cache and deploy
    echo    3. Check MongoDB Atlas cluster is running
    echo    4. Verify all environment variables are set
    echo.
) else (
    echo ⚠️  COULD NOT TEST ^(curl not available^)
    echo.
    echo 🌐 MANUAL TESTING:
    echo    Open these URLs in your browser:
    echo    • Root: %BACKEND_URL%
    echo    • Health: %BACKEND_URL%/api/health
    echo.
    echo ✅ Expected responses:
    echo    • Root: JSON with 'Welcome to UniConnect API'
    echo    • Health: JSON with 'status': 'OK'
    echo.
)

echo 📖 For detailed troubleshooting, see:
echo    • CANNOT_GET_ERROR_FIX.md
echo    • HOW_TO_CHECK_BACKEND.md
echo    • TROUBLESHOOTING_NOT_FOUND.md
echo.
pause
