@echo off
echo Starting Backend Server...
echo.
cd backend
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create a .env file in the backend folder with your MongoDB connection.
    echo.
    pause
    exit /b 1
)
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting server on port 5000...
echo.
call npm run dev

