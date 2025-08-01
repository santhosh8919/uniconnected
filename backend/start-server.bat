@echo off
echo Starting UniConnect Backend Server...
echo.

cd /d "C:\Users\Santhosh\Pictures\uniconnect-starter\backend"

echo Checking if Node.js is installed...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Checking MongoDB connection...
echo.

echo Starting the server...
echo Server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

node server.js
