@echo off
echo.
echo =====================================================
echo   Meeting Summarizer - Deployment Preparation
echo =====================================================
echo.

echo [1/4] Checking project structure...
if not exist "frontend" (
    echo ❌ Error: frontend directory not found
    pause
    exit /b 1
)
if not exist "backend" (
    echo ❌ Error: backend directory not found
    pause
    exit /b 1
)
echo ✅ Project structure OK

echo.
echo [2/4] Checking environment files...
if not exist "backend\.env" (
    echo ❌ Error: backend\.env file not found
    echo Please create backend\.env with your API keys
    pause
    exit /b 1
)
echo ✅ Environment files OK

echo.
echo [3/4] Checking git repository...
if not exist ".git" (
    echo 🔧 Initializing git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo [4/4] Creating deployment checklist...
echo.
echo =====================================================
echo   Ready for Deployment! 🚀
echo =====================================================
echo.
echo Next steps:
echo 1. Push to GitHub:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git remote add origin https://github.com/YOUR_USERNAME/meeting-summarizer.git
echo    git push -u origin main
echo.
echo 2. Deploy on Render:
echo    - Go to https://dashboard.render.com/
echo    - Create new Web Service for backend
echo    - Create new Static Site for frontend
echo    - Set environment variables
echo.
echo 3. Check DEPLOYMENT.md for detailed instructions
echo.
echo =====================================================
echo.
echo 🔐 IMPORTANT: Your API keys in backend\.env
echo     GEMINI_API_KEY: %GEMINI_API_KEY:~0,20%...
echo     EMAIL_ADDRESS: %EMAIL_ADDRESS%
echo.
echo ⚠️  Remember to set these in Render dashboard!
echo    Never commit your .env file to GitHub.
echo.
pause
