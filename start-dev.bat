@echo off
echo Starting KwikM Development Environment...
echo.

echo Starting kwikm-api backend...
cd /d "%~dp0\..\kwikm-api"
start "KwikM API" cmd /k "npm run start:dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Color-Wave client...
cd /d "%~dp0"
start "Color-Wave Client" cmd /k "npm run dev"

echo.
echo Development servers starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5000
echo API Docs: http://localhost:3000/api/docs
echo.
pause