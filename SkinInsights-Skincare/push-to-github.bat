@echo off
title Push SkinInsights Lab to GitHub
color 0B
echo ==============================================================================
echo        PUSH SKININSIGHTS LAB TO GITHUB
echo ==============================================================================
echo.
echo Your local Git repository is already initialized and all files are committed.
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/skininsights.git): "
if "%REPO_URL%"=="" (
    echo No URL entered. Aborting.
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo.
echo Pushing to %REPO_URL%...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================================================
    echo  SUCCESS! Your project has been pushed to GitHub!
    echo ==============================================================================
) else (
    echo.
    echo If GitHub asks for authentication, sign in with your browser or Personal Access Token (PAT).
)
pause
