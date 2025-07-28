# PowerShell용 Training App 서버 시작 스크립트

# 한글 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Green
Write-Host "Training App 서버 시작" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "[1/2] 백엔드 서버 시작 중..." -ForegroundColor Yellow
Set-Location backend
& .\venv\Scripts\Activate.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$OutputEncoding = [System.Text.Encoding]::UTF8; python main.py" -WindowStyle Normal
Write-Host "✅ 백엔드 서버가 백그라운드에서 시작되었습니다." -ForegroundColor Green
Write-Host ""

Write-Host "[2/2] 프론트엔드 서버 시작 중..." -ForegroundColor Yellow
Set-Location ..
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$OutputEncoding = [System.Text.Encoding]::UTF8; npm run dev" -WindowStyle Normal
Write-Host "✅ 프론트엔드 서버가 백그라운드에서 시작되었습니다." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 서버 시작 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "접속 URL:" -ForegroundColor Cyan
Write-Host "- 프론트엔드: http://localhost:5173" -ForegroundColor White
Write-Host "- 백엔드 API: http://localhost:8000" -ForegroundColor White
Write-Host "- API 문서: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "서버를 종료하려면 각 창을 닫거나 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host "" 