@echo off
chcp 65001 >nul
echo ========================================
echo 백엔드 문제 해결 스크립트
echo ========================================
echo.

echo [1/3] 기존 가상환경 삭제 중...
cd backend
if exist "venv" (
    rmdir /s /q venv
    echo ✅ 기존 가상환경 삭제 완료
) else (
    echo ✅ 가상환경이 없습니다.
)
echo.

echo [2/3] 새 가상환경 생성 중...
python -m venv venv
if %errorlevel% neq 0 (
    echo ❌ 가상환경 생성 실패
    pause
    exit /b 1
)
echo ✅ 새 가상환경 생성 완료
echo.

echo [3/3] Python 패키지 설치 중...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ 패키지 설치 실패
    pause
    exit /b 1
)
echo ✅ Python 패키지 설치 완료
echo.

echo ========================================
echo 🎉 백엔드 문제 해결 완료!
echo ========================================
echo.
echo 이제 run.bat을 실행해보세요.
echo.
pause 