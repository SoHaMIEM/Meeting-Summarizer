@echo off
echo.
echo =====================================================
echo   Meeting Summarizer - Setup Script
echo =====================================================
echo.

:: Check if we're in the right directory
if not exist "frontend" (
    echo Error: Please run this script from the project root directory
    echo The directory should contain 'frontend' and 'backend' folders
    pause
    exit /b 1
)

echo [1/4] Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed ✓
)

echo.
echo [2/4] Checking backend dependencies...
cd ..\backend

:: Check if .env file exists
if not exist ".env" (
    echo.
    echo ⚠️  WARNING: No .env file found!
    echo Please create a .env file with your configuration.
    echo You can copy .env.template as a starting point:
    echo.
    echo   copy .env.template .env
    echo.
    echo Then edit .env with your actual API keys and credentials.
    echo.
)

echo.
echo [3/4] Creating startup script...
cd ..
echo @echo off > start-app.bat
echo echo Starting Meeting Summarizer... >> start-app.bat
echo echo. >> start-app.bat
echo echo Starting backend server... >> start-app.bat
echo start "Backend" cmd /k "cd backend && python app.py" >> start-app.bat
echo echo. >> start-app.bat
echo echo Waiting 3 seconds for backend to start... >> start-app.bat
echo timeout /t 3 /nobreak ^>nul >> start-app.bat
echo echo. >> start-app.bat
echo echo Starting frontend... >> start-app.bat
echo start "Frontend" cmd /k "cd frontend && npm start" >> start-app.bat
echo echo. >> start-app.bat
echo echo ✓ Both servers are starting! >> start-app.bat
echo echo   Frontend: http://localhost:3000 >> start-app.bat
echo echo   Backend:  http://localhost:5000 >> start-app.bat
echo pause >> start-app.bat

echo.
echo [4/4] Setup complete! ✓
echo.
echo =====================================================
echo   Next Steps:
echo =====================================================
echo.
echo 1. Configure your environment:
echo    • Copy backend\.env.template to backend\.env
echo    • Add your Gemini API key and email credentials
echo.
echo 2. Start the application:
echo    • Run: start-app.bat
echo    • Or manually start frontend and backend
echo.
echo 3. Access the application:
echo    • Frontend: http://localhost:3000
echo    • Backend API: http://localhost:5000
echo.
echo =====================================================
echo   Need Help?
echo =====================================================
echo.
echo • Check README.md for detailed setup instructions
echo • Verify your .env configuration
echo • Ensure Python and Node.js are installed
echo.
pause
