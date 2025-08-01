@echo off
echo 🔧 Fixing UniConnect Deployment Issues...
echo ========================================

REM Check if we're in the right directory
if not exist "backend" if not exist "frontend" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Project structure detected

REM Create missing directories and files
echo 📁 Creating missing files and directories...

REM Ensure public directory exists
if not exist "frontend\public" mkdir "frontend\public"

REM Create _redirects file for Render static site
echo 📝 Creating _redirects file for SPA routing...
echo /*    /index.html   200 > "frontend\public\_redirects"
echo ✅ Created frontend\public\_redirects

REM Check if environment example files exist
if not exist "frontend\.env.example" (
    echo 📝 Creating frontend\.env.example...
    (
        echo # Backend API URL
        echo VITE_API_BASE_URL=http://localhost:5000/api
        echo.
        echo # Socket.IO URL
        echo VITE_SOCKET_URL=http://localhost:5000
        echo.
        echo # For production, use your Render URLs:
        echo # VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
        echo # VITE_SOCKET_URL=https://your-backend-app.onrender.com
    ) > "frontend\.env.example"
    echo ✅ Created frontend\.env.example
)

if not exist "backend\.env.example" (
    echo 📝 Creating backend\.env.example...
    (
        echo # MongoDB Connection
        echo MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect
        echo.
        echo # JWT Secret Key ^(minimum 32 characters^)
        echo JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
        echo.
        echo # Environment
        echo NODE_ENV=development
        echo.
        echo # Port
        echo PORT=5000
    ) > "backend\.env.example"
    echo ✅ Created backend\.env.example
)

REM Check render.yaml
if exist "render.yaml" (
    echo ✅ render.yaml found
    findstr /C:"type: static" render.yaml >nul
    if %errorlevel% equ 0 (
        echo ✅ Frontend configured as static site
    ) else (
        echo ⚠️  Frontend should be configured as static site in render.yaml
    )
) else (
    echo ⚠️  render.yaml not found - manual deployment required
)

echo.
echo 🎉 Deployment fix complete!
echo.
echo 📋 Next steps for Render deployment:
echo 1. Commit and push these changes to GitHub
echo 2. In Render dashboard, ensure frontend is deployed as 'Static Site'
echo 3. Set environment variables in Render:
echo    Backend: MONGO_URI, JWT_SECRET, NODE_ENV=production
echo    Frontend: VITE_API_BASE_URL, VITE_SOCKET_URL
echo 4. Redeploy both services
echo.
echo 🔗 After deployment, test:
echo    Backend health: https://your-backend-app.onrender.com/api/health
echo    Frontend: https://your-frontend-app.onrender.com
echo.
echo 📖 For detailed troubleshooting, see TROUBLESHOOTING_NOT_FOUND.md
echo.
pause
