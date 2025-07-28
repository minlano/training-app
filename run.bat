@echo off
chcp 65001 >nul
echo ========================================
echo Training App 서버 시작
echo ========================================
echo.

echo [1/2] 백엔드 서버 시작 중...
cd backend
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ 가상환경 활성화 실패
    echo 가상환경이 설치되어 있는지 확인해주세요.
    echo setup.bat을 먼저 실행하세요.
    pause
    exit /b 1
)
start "Backend Server" cmd /k "chcp 65001 >nul && cd /d %cd% && call venv\Scripts\activate.bat && python main.py"
echo ✅ 백엔드 서버가 백그라운드에서 시작되었습니다.
echo.

echo [2/2] 프론트엔드 서버 시작 중...
cd ..
start "Frontend Server" cmd /k "chcp 65001 >nul && npm run dev"
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