#!/bin/bash

echo "========================================"
echo "Training App 자동 설치 스크립트"
echo "========================================"
echo

echo "[1/5] Node.js 의존성 설치 중..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Node.js 의존성 설치 실패"
    exit 1
fi
echo "✅ Node.js 의존성 설치 완료"
echo

echo "[2/5] Python 가상환경 생성 중..."
cd backend
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "❌ Python 가상환경 생성 실패"
    echo "Python이 설치되어 있는지 확인해주세요."
    exit 1
fi
echo "✅ Python 가상환경 생성 완료"
echo

echo "[3/5] Python 가상환경 활성화 중..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "❌ 가상환경 활성화 실패"
    exit 1
fi
echo "✅ Python 가상환경 활성화 완료"
echo

echo "[4/5] Python 의존성 설치 중..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Python 의존성 설치 실패"
    exit 1
fi
echo "✅ Python 의존성 설치 완료"
echo

echo "[5/5] 환경 변수 파일 생성 중..."
cd ..
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# Supabase 설정
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
    echo "✅ .env.local 파일 생성 완료"
    echo "⚠️  .env.local 파일에서 Supabase 설정을 업데이트해주세요."
else
    echo "✅ .env.local 파일이 이미 존재합니다."
fi
echo

echo "========================================"
echo "🎉 설치 완료!"
echo "========================================"
echo
echo "다음 단계:"
echo "1. .env.local 파일에서 Supabase 설정을 업데이트하세요"
echo "2. ./run.sh를 실행하여 서버를 시작하세요"
echo 