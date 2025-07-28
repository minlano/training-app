@echo off
chcp 65001 >nul
echo ========================================
echo Training App 자동 설치 스크립트
echo ========================================
echo.

echo [1/5] Node.js 의존성 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Node.js 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ Node.js 의존성 설치 완료
echo.

echo [2/5] Python 가상환경 생성 중...
cd backend

REM 기존 가상환경 삭제 (깨끗한 설치를 위해)
if exist "venv" (
    echo 기존 가상환경을 삭제하고 새로 생성합니다...
    rmdir /s /q venv
)

python -m venv venv
if %errorlevel% neq 0 (
    echo ❌ Python 가상환경 생성 실패
    echo Python이 설치되어 있는지 확인해주세요.
    pause
    exit /b 1
)
echo ✅ Python 가상환경 생성 완료
echo.

echo [3/5] Python 가상환경 활성화 중...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ 가상환경 활성화 실패
    pause
    exit /b 1
)
echo ✅ Python 가상환경 활성화 완료
echo.

echo [4/5] Python 의존성 설치 중...
pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Python 의존성 설치 실패
    pause
    exit /b 1
)
echo ✅ Python 의존성 설치 완료
echo.

echo [5/5] 환경 변수 파일 생성 중...
cd ..
if not exist .env.local (
    echo # Supabase 설정 > .env.local
    echo VITE_SUPABASE_URL=your_supabase_url >> .env.local
    echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env.local
    echo ✅ .env.local 파일 생성 완료
    echo ⚠️  .env.local 파일에서 Supabase 설정을 업데이트해주세요.
) else (
    echo ✅ .env.local 파일이 이미 존재합니다.
)
echo.

echo ========================================
echo 🎉 설치 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. .env.local 파일에서 Supabase 설정을 업데이트하세요
echo 2. run.bat를 실행하여 서버를 시작하세요
echo.
pause 