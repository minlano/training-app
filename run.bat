@echo off
chcp 65001 >nul
echo ========================================
echo Training App 서버 시작
echo ========================================
echo.

REM 포트 사용 확인
echo [사전 확인] 포트 사용 상태 확인 중...
netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  포트 5173이 이미 사용 중입니다. 기존 프로세스를 종료해주세요.
    netstat -ano | findstr ":5173"
    pause
)

netstat -an | findstr ":8000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  포트 8000이 이미 사용 중입니다. 기존 프로세스를 종료해주세요.
    netstat -ano | findstr ":8000"
    pause
)

echo [1/2] 백엔드 서버 시작 중...
cd backend

REM 가상환경이 존재하는지 확인
if not exist "venv\Scripts\activate.bat" (
    echo ❌ 가상환경이 설치되지 않았습니다.
    echo setup.bat을 먼저 실행해주세요.
    pause
    exit /b 1
)

REM 가상환경 활성화
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ 가상환경 활성화 실패
    echo setup.bat을 다시 실행해주세요.
    pause
    exit /b 1
)

REM Python 패키지 확인
python -c "import fastapi" 2>nul
if %errorlevel% neq 0 (
    echo ❌ FastAPI가 설치되지 않았습니다.
    echo setup.bat을 다시 실행해주세요.
    pause
    exit /b 1
)

start "Backend Server" cmd /k "chcp 65001 >nul && cd /d %cd% && call venv\Scripts\activate.bat && echo 백엔드 서버 시작 중... && python main.py"
echo ✅ 백엔드 서버가 백그라운드에서 시작되었습니다.
echo.

echo [2/2] 프론트엔드 서버 시작 중...
cd ..

REM node_modules 확인
if not exist "node_modules" (
    echo ❌ node_modules가 없습니다. npm install을 실행합니다...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ npm install 실패
        pause
        exit /b 1
    )
)

start "Frontend Server" cmd /k "chcp 65001 >nul && echo 프론트엔드 서버 시작 중... && npm run dev"
echo ✅ 프론트엔드 서버가 백그라운드에서 시작되었습니다.
echo.

echo ========================================
echo 🎉 서버 시작 완료!
echo ========================================
echo.
echo 접속 URL:
echo - 프론트엔드: http://localhost:5173
echo - 백엔드 API: http://localhost:8000
echo - API 문서: http://localhost:8000/docs
echo.
echo 서버를 종료하려면 각 창을 닫거나 Ctrl+C를 누르세요.
echo.
pause 