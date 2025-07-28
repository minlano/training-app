#!/bin/bash

echo "========================================"
echo "Training App 서버 시작"
echo "========================================"
echo

echo "[1/2] 백엔드 서버 시작 중..."
cd backend
source venv/bin/activate
nohup python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 백엔드 서버가 백그라운드에서 시작되었습니다. (PID: $BACKEND_PID)"
echo

echo "[2/2] 프론트엔드 서버 시작 중..."
cd ..
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 프론트엔드 서버가 백그라운드에서 시작되었습니다. (PID: $FRONTEND_PID)"
echo

echo "========================================"
echo "🎉 서버 시작 완료!"
echo "========================================"
echo
echo "접속 URL:"
echo "- 프론트엔드: http://localhost:5173"
echo "- 백엔드 API: http://localhost:8000"
echo "- API 문서: http://localhost:8000/docs"
echo
echo "서버를 종료하려면:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo
echo "로그 확인:"
echo "tail -f backend.log frontend.log"
echo 