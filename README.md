# Training App

AI 기반 운동 루틴 추천 및 체중 관리 애플리케이션

## 🚀 배포

**프로덕션 URL**: https://training-app-minjaes-projects-e8f56dd8.vercel.app

## ⚡ 빠른 시작

### Windows 사용자
```bash
# 1. 자동 설치
setup.bat

# 2. 환경 변수 설정 (.env.local 파일 수정)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. 서버 시작
run.bat
```

### Linux/Mac 사용자
```bash
# 1. 실행 권한 부여
chmod +x setup.sh run.sh

# 2. 자동 설치
./setup.sh

# 3. 환경 변수 설정 (.env.local 파일 수정)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. 서버 시작
./run.sh
```

## 🏗️ 프로젝트 구조

```
training-app/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── App.tsx
├── backend/           # FastAPI + Python
│   ├── api/
│   ├── models/
│   └── main.py
├── supabase/          # Database migrations
├── api/               # Vercel Functions
├── setup.bat          # Windows 자동 설치
├── run.bat            # Windows 서버 실행
├── setup.sh           # Linux/Mac 자동 설치
└── run.sh             # Linux/Mac 서버 실행
```

## 🛠️ 기술 스택

### Frontend
- React 18
- TypeScript
- Vite
- Supabase (Auth, Database)

### Backend
- FastAPI
- Python 3.10+
- Scikit-learn (AI models)
- Pandas

### Deployment
- Vercel (Frontend + API Functions)
- GitHub (Auto deployment)

## 🚀 수동 설치 (고급 사용자)

### Frontend 실행
```bash
npm install
npm run dev
```

### Backend 실행
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

## 📦 설치

1. **Repository 클론**
```bash
git clone https://github.com/minlano/training-app.git
cd training-app
```

2. **Frontend 의존성 설치**
```bash
npm install
```

3. **Backend 의존성 설치**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

4. **환경 변수 설정**
```bash
# .env.local 파일 생성
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 환경 변수

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 주요 기능

- 🤖 AI 운동 루틴 생성
- 📊 체중 예측 및 관리
- 📈 운동 로그 기록
- 📈 진행 상황 추적
- 🔐 사용자 인증

## 🚀 배포

### 자동 배포
GitHub에 push하면 자동으로 Vercel에 배포됩니다.

### 수동 배포
```bash
vercel --prod
```

## 📄 라이선스

MIT License
