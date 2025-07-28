# 🏋️‍♂️ 트레이닝 앱 (Training App)

개인 맞춤형 운동 관리 및 AI 추천 시스템

## 📋 프로젝트 개요

이 프로젝트는 개인 학습 목적으로 개발된 웹 기반 트레이닝 관리 애플리케이션입니다. 사용자의 운동 기록, 체중 관리, AI 기반 운동 루틴 추천 기능을 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 기능
- **개인 프로필 관리**: 키, 체중, 운동 목표, 선호 요일 등 설정
- **운동 기록**: 운동 세션별 상세 기록 및 칼로리 계산
- **체중 관리**: 체중 변화 추적 및 AI 기반 체중 예측
- **AI 운동 루틴 추천**: 개인 프로필 기반 맞춤형 운동 계획 생성
- **계정 관리**: 회원가입, 로그인, 계정 삭제 기능

### 🤖 AI 기능
- **개인화된 운동 루틴**: 사용자 프로필 기반 맞춤형 운동 계획
- **체중 예측**: 기존 데이터를 활용한 AI 체중 변화 예측
- **운동 강도 분석**: 개인 체력 수준에 맞는 운동 강도 추천

## 🛠️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Vite** - 빌드 도구

### Backend
- **Python FastAPI** - REST API 서버
- **Supabase** - 데이터베이스 및 인증
- **PostgreSQL** - 관계형 데이터베이스
- **scikit-learn** - AI/ML 기능

### AI/ML
- **pandas** - 데이터 처리
- **numpy** - 수치 계산
- **scikit-learn** - 머신러닝 모델

## 📁 프로젝트 구조

```
training-app/
├── backend/                 # Python FastAPI 백엔드
│   ├── api/                # API 라우트
│   ├── models/             # 데이터 모델
│   ├── main.py             # 서버 진입점
│   ├── requirements.txt    # Python 의존성
│   └── venv/              # 가상환경
├── src/                    # React 프론트엔드
│   ├── components/         # React 컴포넌트
│   ├── lib/               # 유틸리티 함수
│   └── App.tsx            # 메인 앱 컴포넌트
├── supabase/              # 데이터베이스 마이그레이션
├── start_servers.py       # 서버 시작 스크립트
└── README.md              # 프로젝트 문서
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd training-app
```

### 2. 환경 설정
```bash
# 환경 변수 파일 복사
cp .env.example .env

# .env 파일에서 Supabase 설정 업데이트
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 백엔드 설정
```bash
cd backend

# 가상환경 생성 (Windows)
python -m venv venv
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 4. 프론트엔드 설정
```bash
# 프로젝트 루트로 이동
cd ..

# Node.js 의존성 설치
npm install
```

### 5. 데이터베이스 마이그레이션
```bash
# Supabase CLI 설치 (선택사항)
npm install -g supabase

# 마이그레이션 실행
supabase db push
```

### 6. 서버 시작
```bash
# 자동 시작 스크립트 사용 (권장)
python start_servers.py

# 또는 수동으로 시작
# 백엔드: cd backend && python main.py
# 프론트엔드: npm run dev
```

### 7. 접속
- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 📖 사용법

### 1. 계정 생성
- 로그인 화면에서 "Need an account? Sign Up" 클릭
- 이메일과 비밀번호 입력 후 회원가입

### 2. 프로필 설정
- 프로필 메뉴에서 개인 정보 입력
- 키, 체중, 운동 목표, 선호 요일 설정
- "프로필 저장" 버튼 클릭

### 3. 운동 기록
- 운동 기록 메뉴에서 새로운 세션 생성
- 운동 종류, 세트, 횟수, 무게 입력
- "세션 저장" 버튼으로 기록 저장

### 4. 체중 관리
- 체중 관리 메뉴에서 현재 체중 입력
- "AI 체중 예측" 버튼으로 미래 체중 예측

### 5. AI 운동 루틴
- 프로필 메뉴에서 "AI 맞춤 운동 루틴 생성" 클릭
- 개인화된 주간 운동 계획 확인

## 🔧 개발 가이드

### 백엔드 개발
```bash
cd backend
venv\Scripts\activate
python main.py
```

### 프론트엔드 개발
```bash
npm run dev
```

### 데이터베이스 스키마 변경
```bash
# 새로운 마이그레이션 파일 생성
# supabase/migrations/XXX_description.sql

# 마이그레이션 적용
supabase db push
```

## 🐛 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 포트 사용 확인
   netstat -ano | findstr :8000
   netstat -ano | findstr :5173
   
   # 프로세스 종료
   taskkill /f /pid <PID>
   ```

2. **가상환경 문제**
   ```bash
   # 가상환경 재생성
   cd backend
   rmdir /s venv
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **의존성 문제**
   ```bash
   # Node.js 캐시 정리
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

## 📈 향후 개발 계획

### 🍽️ 1. 식단 분석 & 추천
- **기능**: 사용자가 식단을 입력하거나 사진 업로드 시 식단 점수화
- **AI 기능**: "단백질이 부족해요. 계란이나 두부를 추가해보세요!" 등의 개인화된 추천
- **기술**: 이미지 인식, 영양소 분석 AI

### 📊 2. 운동 일지 요약 및 피드백
- **하루 운동 기록 AI 피드백**:
  - 키에 따른 체중 확인으로 근력운동/유산소 운동 비율 분석
  - 이번주 운동 기록의 개선점 제시
- **기술**: 자연어 처리, 운동 패턴 분석

### 🎯 3. 운동 수행 분석 (폼 교정/자세 피드백)
- **방법**: 사용자가 운동 영상 업로드 시, 자세 분석 → 피드백 제공
- **기술 스택**: 
  - MediaPipe나 OpenPose를 통한 포즈 추정
  - 간단한 Rule-based 모델 또는 posture classification 모델
- **예시**: "스쿼트 시 무릎이 발끝보다 앞으로 나가고 있어요. 자세를 다시 확인해보세요!"

### 🔮 확장 가능성 있는 기능들

#### 📊 체성분 관리
- **BMI, 골격근량 등 입력 시각화**
- **용도**: 헬스장 인바디 기록을 정리해두는 용도
- **기능**: 체성분 변화 그래프, 목표 설정

#### 📅 운동 스케줄 캘린더
- **Google Calendar와 연동**
- **기능**: 미리 알림 가능, 운동 일정 관리
- **확장**: 다른 캘린더 서비스 연동

## 🤝 기여하기

이 프로젝트는 학습 목적으로 개발되었습니다. 

### 기여 방법
1. **이슈 리포트**: 버그나 개선사항을 발견하시면 댓글로 알려주세요
2. **기능 제안**: 새로운 기능 아이디어가 있으시면 댓글로 제안해주세요
3. **코드 개선**: 코드 개선사항이 있으시면 댓글로 공유해주세요

### 개발 환경 설정
```bash
# 저장소 포크 후 클론
git clone <your-fork-url>
cd training-app

# 개발 브랜치 생성
git checkout -b feature/your-feature-name

# 변경사항 커밋
git add .
git commit -m "Add: 새로운 기능 설명"

# Pull Request 생성
```

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다.

```
MIT License

Copyright (c) 2024 Training App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 문의

프로젝트에 대한 문의사항이나 개선 제안이 있으시면 **댓글로 남겨주세요**. 

- 🐛 **버그 리포트**: 문제가 발생한 상황과 재현 방법을 자세히 설명해주세요
- 💡 **기능 제안**: 새로운 기능 아이디어를 구체적으로 설명해주세요
- 📚 **문서 개선**: README나 코드 주석 개선 제안을 해주세요

## 🙏 감사의 말

이 프로젝트는 개인 학습 목적으로 개발되었으며, 다음과 같은 오픈소스 프로젝트들의 도움을 받았습니다:

- React.js 커뮤니티
- FastAPI 개발팀
- Supabase 팀
- Tailwind CSS 팀

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**

## ✅ 정리 완료!

### 현재 작동하는 배포 URL:
```
https://training-7uico3sxf-minjaes-projects-e8f56dd8.vercel.app
```

### 이전 작동하는 배포 URL:
```
https://training-mutxhg75d-minjaes-projects-e8f56dd8.vercel.app
```

### 다음 단계:
1. **Vercel 대시보드**에서 환경 변수를 업데이트하세요:
   ```
   VITE_API_BASE_URL=https://training-7uico3sxf-minjaes-projects-e8f56dd8.vercel.app
   ```

2. **브라우저에서 테스트**해보세요!

실패한 배포들은 정리했으니 이제 깔끔하게 관리됩니다. 🚀
