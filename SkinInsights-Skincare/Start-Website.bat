@echo off
title SkinInsights Lab - Clinical AI Skincare
echo ========================================================
echo   SKININSIGHTS LAB - Launching Local Web Application
echo ========================================================
echo.
echo Starting local web server on port 3000 for full webcam support...
start "" "http://localhost:3000"
node server.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Node.js not detected in PATH, opening index.html directly...
    start "" index.html
)
pause
