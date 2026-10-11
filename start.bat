@echo off
title BhashaBias Platform Launcher
echo ========================================================
echo   Launching BhashaBias Multilingual AI Bias Platform
echo ========================================================
echo.

echo [1/2] Starting Backend API Server (Port 5000)...
start "BhashaBias Backend (Port 5000)" cmd /k "cd server && npm start"

echo Waiting for backend initialization...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Application (Port 3000)...
start "BhashaBias Frontend (Port 3000)" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Opening BhashaBias in default browser...
start http://localhost:3000

echo.
echo ========================================================
echo   BhashaBias is now running!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:5000
echo ========================================================
