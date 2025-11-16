@echo off
setlocal enabledelayedexpansion

echo.
echo === Quiz Master - Deployment Helper ===
echo.

REM Check if git is initialized
if not exist .git (
    echo [ERROR] Git not initialized. Run:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    exit /b 1
)

echo [OK] Git repository found
echo.

REM Check git remote
for /f "tokens=*" %%i in ('git remote get-url origin 2^>nul') do set REMOTE_URL=%%i

if "%REMOTE_URL%"=="" (
    echo [ERROR] Git remote 'origin' not set. Run:
    echo    git remote add origin https://github.com/YOUR_USERNAME/quiz-master.git
    echo    git push -u origin main
    exit /b 1
)

echo [OK] Remote URL: %REMOTE_URL%
echo.

echo.
echo Choose deployment option:
echo 1 - Render (Backend) + Vercel (Frontend) - Recommended
echo 2 - Railway (All-in-one)
echo 3 - Docker Compose (Local)
echo.

set /p choice="Enter choice (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo === RENDER BACKEND SETUP ===
    echo 1. Go to render.com - Sign up with GitHub
    echo 2. Create New Web Service
    echo 3. Select your repository
    echo 4. Configure:
    echo    - Name: quiz-master-api
    echo    - Build Command: npm install
    echo    - Start Command: cd server ^&^& npm start
    echo 5. Add Environment Variables:
    echo    MONGODB_URI=your-mongodb-uri
    echo    JWT_SECRET=your-secret
    echo.
    echo === VERCEL FRONTEND SETUP ===
    echo 1. Go to vercel.com - Sign up with GitHub
    echo 2. Import your repository
    echo 3. Configure:
    echo    - Root Directory: ./client
    echo    - Build Command: npm run build
    echo 4. Add Environment Variable:
    echo    VITE_API_BASE=https://your-render-url.onrender.com
    echo.
    echo See DEPLOYMENT.md for full instructions
)

if "%choice%"=="2" (
    echo.
    echo === RAILWAY SETUP ===
    echo 1. Go to railway.app - Sign up with GitHub
    echo 2. Create New Project - Deploy from GitHub
    echo 3. Select your repository
    echo 4. Configure services in Railway dashboard
    echo.
    echo See DEPLOYMENT.md for full instructions
)

if "%choice%"=="3" (
    echo.
    echo === DOCKER COMPOSE SETUP ===
    echo Ensure Docker Desktop is installed and running
    echo.
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Docker Compose not installed
        echo Download from: https://docker.com/products/docker-desktop
        exit /b 1
    )
    
    echo Building containers...
    docker-compose build
    
    echo.
    echo Starting services...
    docker-compose up
    
    echo.
    echo [OK] Services running:
    echo  Frontend: http://localhost:3000
    echo  Backend: http://localhost:5000
    echo  Database: localhost:27017
)

echo.
echo === Next Steps ===
echo 1. Read DEPLOYMENT.md for detailed instructions
echo 2. Set up MongoDB Atlas (if not using local Mongo)
echo 3. Deploy!
echo.
pause
