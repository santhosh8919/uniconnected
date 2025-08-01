@echo off
echo 🚀 Setting up UniConnect Environment Variables
echo =============================================

REM Backend Environment Variables
echo.
echo 📋 Setting up Backend Environment (.env)...
cd backend

if not exist .env (
    echo Creating backend .env file...
    (
        echo # MongoDB Connection - Replace with your actual MongoDB URI
        echo MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect?retryWrites=true^&w=majority
        echo.
        echo # JWT Secret Key - Replace with a secure random string
        echo JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
        echo.
        echo # Environment
        echo NODE_ENV=development
        echo.
        echo # Port
        echo PORT=5000
        echo.
        echo # Frontend URL ^(for CORS^)
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo ✅ Backend .env file created!
    echo ⚠️  Please update MONGO_URI and JWT_SECRET with your actual values
) else (
    echo ⚠️  Backend .env file already exists
)

cd ..

REM Frontend Environment Variables
echo.
echo 📋 Setting up Frontend Environment (.env)...
cd frontend

if not exist .env (
    echo Creating frontend .env file...
    (
        echo # Backend API URL
        echo VITE_API_BASE_URL=http://localhost:5000/api
        echo.
        echo # Socket.IO URL
        echo VITE_SOCKET_URL=http://localhost:5000
    ) > .env
    echo ✅ Frontend .env file created!
) else (
    echo ⚠️  Frontend .env file already exists
)

cd ..

echo.
echo 🎉 Environment setup complete!
echo.
echo 📝 Next steps:
echo 1. Update backend\.env with your MongoDB URI and JWT secret
echo 2. Install dependencies: npm install (in both backend\ and frontend\ directories)
echo 3. Start backend: cd backend ^&^& npm start
echo 4. Start frontend: cd frontend ^&^& npm run dev
echo.
echo 🔗 Local URLs:
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo API Health: http://localhost:5000/api/health
echo.
pause
