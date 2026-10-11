@echo off
title BhashaBias Platform Launcher
echo ========================================================
echo   Launching BhashaBias Multilingual AI Bias Platform
echo ========================================================
echo.
echo Starting Backend (Port 5000) and Frontend (Port 3000)...
echo.
start http://localhost:3000
npm run dev
