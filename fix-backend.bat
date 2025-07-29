@echo off
chcp 65001 >nul
echo ========================================
echo 백엔드 문제 해결 스크립트
echo ========================================
echo.

echo [1/3] 기존 프로세스 종료...
taskkill /f /im python.exe >nul 2>&1
echo ✅ 기존 Python 프로세스 종료 완료
echo.

echo [2/3] Python 가상환경 재생성...
cd backend
if exist "venv" (
    echo 기존 가상환경 삭제 중...
    rmdir /s /q venv
)
echo 새 가상환경 생성 중...
python -m venv venv
if %errorlevel% neq 0 (
    echo ❌ Python 가상환경 생성 실패
    echo Python이 올바르게 설치되어 있는지 확인해주세요.
    pause
    exit /b 1
)
echo ✅ 가상환경 생성 완료
echo.

echo [3/3] Python 의존성 재설치...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Python 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ Python 의존성 설치 완료
echo.

echo 백엔드 서버를 시작합니다...
echo API 문서: http://localhost:8000/docs
echo.
python main.py
pause