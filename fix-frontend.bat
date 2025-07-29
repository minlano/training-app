@echo off
chcp 65001 >nul
echo ========================================
echo 프론트엔드 문제 해결 스크립트
echo ========================================
echo.

echo [1/4] 기존 프로세스 종료...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
echo ✅ 기존 프로세스 종료 완료
echo.

echo [2/4] npm 캐시 정리 및 재설치...
if exist "node_modules" (
    echo node_modules 폴더 삭제 중...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo package-lock.json 삭제 중...
    del package-lock.json
)
echo npm 캐시 정리 중...
call npm cache clean --force
echo npm 재설치 중...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install 실패
    pause
    exit /b 1
)
echo ✅ npm 재설치 완료
echo.

echo [3/4] 환경변수 확인...
if exist ".env.local" (
    echo .env.local 내용:
    type .env.local
    echo.
    echo ⚠️  위 설정이 올바른지 확인해주세요.
) else (
    echo .env.local 파일이 없습니다. 생성 중...
    echo # Supabase 설정 ^(개발용 임시 설정^) > .env.local
    echo VITE_SUPABASE_URL=https://your-project.supabase.co >> .env.local
    echo VITE_SUPABASE_ANON_KEY=your-anon-key-here >> .env.local
    echo ✅ .env.local 파일 생성 완료
)
echo.

echo [4/4] 프론트엔드 서버 직접 시작...
echo 프론트엔드 서버를 시작합니다...
echo 브라우저에서 http://localhost:5173 을 열어주세요.
echo.
call npm run dev
pause