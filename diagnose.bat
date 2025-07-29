@echo off
chcp 65001 >nul
echo ========================================
echo Training App 문제 진단 스크립트
echo ========================================
echo.

echo [1/6] Node.js 설치 확인...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되지 않았습니다.
    echo https://nodejs.org에서 Node.js를 설치해주세요.
) else (
    node --version
    echo ✅ Node.js 설치 확인됨
)
echo.

echo [2/6] Python 설치 확인...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python이 설치되지 않았습니다.
    echo https://python.org에서 Python을 설치해주세요.
) else (
    python --version
    echo ✅ Python 설치 확인됨
)
echo.

echo [3/6] npm 의존성 확인...
if exist "node_modules" (
    echo ✅ node_modules 폴더 존재
) else (
    echo ❌ node_modules 폴더가 없습니다. npm install을 실행해주세요.
)
echo.

echo [4/6] Python 가상환경 확인...
if exist "backend\venv\Scripts\activate.bat" (
    echo ✅ Python 가상환경 존재
) else (
    echo ❌ Python 가상환경이 없습니다. setup.bat을 실행해주세요.
)
echo.

echo [5/6] 환경변수 파일 확인...
if exist ".env.local" (
    echo ✅ .env.local 파일 존재
    echo 내용:
    type .env.local
) else (
    echo ❌ .env.local 파일이 없습니다.
)
echo.

echo [6/6] 포트 사용 확인...
netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  포트 5173이 이미 사용 중입니다.
    echo 사용 중인 프로세스:
    netstat -ano | findstr ":5173"
) else (
    echo ✅ 포트 5173 사용 가능
)
echo.

netstat -an | findstr ":8000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  포트 8000이 이미 사용 중입니다.
    echo 사용 중인 프로세스:
    netstat -ano | findstr ":8000"
) else (
    echo ✅ 포트 8000 사용 가능
)
echo.

echo ========================================
echo 진단 완료
echo ========================================
pause