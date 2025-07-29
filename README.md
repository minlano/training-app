# Workout Tracker

**🎓 학습용 프로젝트** - AI 기반 운동 루틴 추천 및 체중 관리 애플리케이션

> ⚠️ **주의사항**: 이 프로젝트는 학습 목적으로 제작되었습니다. 실제 서비스로 사용하지 마세요.
> 
> 🐛 **버그 발견 시**: 이슈나 댓글로 알려주시면 감사합니다!

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

## 🏗️ 프로젝트 구조 (컴포넌트별 구조)

```
workout-tracker/
├── src/
│   ├── features/            # 기능별 컴포넌트 (Feature-based Architecture)
│   │   ├── auth/           # 인증 관련
│   │   │   ├── Auth.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── LoginPage.css
│   │   │   └── index.ts
│   │   ├── dashboard/      # 대시보드
│   │   │   ├── Dashboard.tsx
│   │   │   └── index.ts
│   │   ├── profile/        # 사용자 프로필
│   │   │   ├── UserProfile.tsx
│   │   │   └── index.ts
│   │   ├── workout/        # 운동 기록
│   │   │   ├── WorkoutLogger.tsx
│   │   │   └── index.ts
│   │   ├── weight/         # 체중 관리
│   │   │   ├── WeightTracker.tsx
│   │   │   └── index.ts
│   │   ├── ai-routine/     # AI 루틴
│   │   │   ├── AIRoutinePage.tsx
│   │   │   ├── AIRoutinePage.css
│   │   │   └── index.ts
│   │   └── system/         # 시스템 설정
│   │       ├── SystemPage.tsx
│   │       ├── SystemPage.css
│   │       └── index.ts
│   ├── shared/             # 공유 컴포넌트 및 유틸리티
│   │   ├── ui/            # 공통 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── styles.css
│   │   │   └── index.ts
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.tsx
│   │   │   └── Sidebar.css
│   │   ├── api/           # API 관련
│   │   │   ├── api.ts
│   │   │   └── supabase.ts
│   │   ├── utils/         # 유틸리티 함수
│   │   │   ├── auth.js
│   │   │   ├── navigation.js
│   │   │   ├── api-utils.js
│   │   │   ├── database.js
│   │   │   ├── ui-utils.js
│   │   │   └── workout-utils.js
│   │   └── types/         # TypeScript 타입 정의
│   └── App.tsx            # 메인 애플리케이션
├── backend/               # FastAPI + Python
│   ├── api/
│   ├── models/
│   └── main.py
├── supabase/             # Database migrations
├── api/                  # Vercel Functions
├── setup.bat             # Windows 자동 설치
├── run.bat               # Windows 서버 실행
├── setup.sh              # Linux/Mac 자동 설치
└── run.sh                # Linux/Mac 서버 실행
```

## 🛠️ 기술 스택

### Frontend
- React 18 (사용자 인터페이스)
- TypeScript (타입 안전성)
- Vite (빠른 개발 서버)
- Supabase (인증 및 데이터베이스)
- **일반 CSS** (Tailwind CSS 대신 이해하기 쉬운 CSS 사용)

### Backend
- FastAPI (고성능 API 서버)
- Python 3.10+ (백엔드 로직)
- Scikit-learn (AI 모델 및 예측)
- Pandas (데이터 처리 및 분석)

### Architecture
- **컴포넌트별 구조**: 기능별로 관련 파일들을 함께 관리 (Feature-based Architecture)
- **공유 컴포넌트**: 재사용 가능한 UI 컴포넌트와 유틸리티를 shared 폴더에 분리
- **관심사 분리**: 각 기능별로 독립적인 모듈 구성으로 유지보수성 향상

### Deployment
- Vercel (프론트엔드 및 API 함수 배포)
- GitHub (자동 배포 연동)

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

### 🚀 간단 설치 (권장)
```bash
# Windows 사용자
setup.bat

# Linux/Mac 사용자
chmod +x setup.sh
./setup.sh
```

### 🚀 간단 실행
```bash
# Windows 사용자
run.bat

# Linux/Mac 사용자
chmod +x run.sh
./run.sh
```

### 📋 수동 설치 (고급 사용자)

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

### 🤖 AI 운동 루틴 생성
- **개인 맞춤형 루틴**: 사용자의 운동 수준, 목표, 선호 요일을 분석하여 최적의 운동 계획 생성
- **다양한 운동 타입**: 유산소, 근력, HIIT, 스트레칭 등 목표에 따른 운동 조합
- **스케줄링**: 선호하는 요일에 맞춰 주간 운동 스케줄 자동 배치
- **강도 조절**: 초보자/중급자/고급자에 따른 운동 강도 및 시간 조정

### 📊 체중 예측 및 관리
- **AI 체중 예측**: 과거 체중 데이터를 기반으로 미래 체중 변화 예측
- **체중 기록**: 일별 체중 변화 추적 및 시각화
- **목표 설정**: 목표 체중 설정 및 달성률 모니터링
- **BMI 계산**: 자동 BMI 계산 및 건강 상태 평가

### 📈 운동 로그 기록
- **상세 운동 기록**: 운동 종목, 세트, 횟수, 시간, 칼로리 소모량 기록
- **칼로리 자동 계산**: 운동 종목과 시간에 따른 칼로리 소모량 자동 계산
- **운동 히스토리**: 과거 운동 기록 조회 및 분석
- **AI 루틴 적용**: 생성된 AI 루틴을 바로 운동 기록으로 적용 가능

### 📈 진행 상황 추적
- **대시보드**: 운동 통계, 체중 변화, 주간 비교 등 종합 현황 제공
- **주간 분석**: 이번 주와 지난 주 운동 횟수 비교
- **목표 진행률**: 체중 목표 달성률 시각화
- **동기부여 메시지**: AI가 생성하는 개인화된 격려 메시지

### 🔐 사용자 인증 및 프로필
- **간편 회원가입/로그인**: 이메일 기반 계정 시스템
- **개인 프로필**: 신체 정보, 운동 목표, 선호도 설정
- **데이터 보안**: Supabase를 통한 안전한 데이터 저장
- **개인화**: 사용자별 맞춤형 경험 제공

## 🔧 문제 해결

### 일반적인 문제들

#### 1. 로그인이 안 될 때
```bash
# 환경 변수 확인
cat .env.local

# Supabase URL과 키가 올바른지 확인
# 브라우저 개발자 도구에서 네트워크 탭 확인
```

#### 2. 화면이 안 나올 때
```bash
# 진단 스크립트 실행
diagnose.bat  # Windows
./diagnose.sh  # Linux/Mac

# 포트 충돌 확인
netstat -an | findstr :5173  # Windows
lsof -i :5173  # Linux/Mac
```

#### 3. AI 루틴 생성이 안 될 때
- 프로필을 먼저 저장했는지 확인
- 네트워크 연결 상태 확인
- 브라우저 콘솔에서 에러 메시지 확인

#### 4. 데이터베이스 연결 오류
```bash
# Supabase 연결 테스트
# 앱에서 "Supabase 테스트" 탭 확인
# 데이터베이스 마이그레이션 실행 필요할 수 있음
```

### 빠른 수정 스크립트

#### Windows
```bash
# 프론트엔드 문제 해결
fix-frontend.bat

# 백엔드 문제 해결
fix-backend.bat
```

#### Linux/Mac
```bash
# 권한 부여 후 실행
chmod +x fix-frontend.sh fix-backend.sh
./fix-frontend.sh
./fix-backend.sh
```

## 🔧 JavaScript 유틸리티 모듈

### 📁 shared/utils/ 폴더 구조
```javascript
src/shared/utils/
├── auth.js          # 인증 관련 로직
│   ├── AuthService.saveUser()      # 사용자 정보 저장
│   ├── AuthService.loadUser()      # 사용자 정보 불러오기
│   ├── AuthService.logout()        # 로그아웃 처리
│   └── AuthService.isAuthenticated() # 인증 상태 확인
├── navigation.js    # 네비게이션 유틸리티
│   ├── NavigationUtils.getTabTitle()       # 탭 제목 가져오기
│   ├── NavigationUtils.getTabDescription() # 탭 설명 가져오기
│   └── NavigationUtils.handleTabChange()   # 탭 변경 처리
├── api-utils.js     # API 유틸리티
│   ├── ApiUtils.testConnection()      # API 연결 테스트
│   ├── ApiUtils.transformProfileData() # 데이터 변환
│   ├── ApiUtils.handleApiError()      # 에러 처리
│   └── ApiUtils.withLoading()         # 로딩 상태 관리
├── database.js      # 데이터베이스 로직
│   ├── DatabaseUtils.deleteAccount()     # 계정 삭제
│   ├── DatabaseUtils.getUserProfile()    # 프로필 조회
│   └── DatabaseUtils.checkDatabaseConnection() # DB 연결 확인
├── ui-utils.js      # UI 유틸리티
│   ├── UIUtils.modal.*              # 모달 관리
│   ├── UIUtils.notification.*       # 알림 메시지
│   ├── UIUtils.validation.*         # 폼 유효성 검사
│   └── UIUtils.formatDate()         # 날짜 포맷팅
└── workout-utils.js # 운동 관련 로직
    ├── WorkoutUtils.generateRoutine()    # 루틴 생성
    ├── WorkoutUtils.formatWorkoutTime()  # 시간 포맷팅
    ├── WorkoutUtils.calculateIntensity() # 강도 계산
    └── WorkoutUtils.getWeeklyStats()     # 주간 통계
```

### 🎯 자바 스타일 아키텍처 비교

#### Java Spring Boot 구조:
```java
src/main/java/com/example/
├── controller/     # REST 컨트롤러
├── service/        # 비즈니스 로직
├── util/          # 유틸리티 클래스
├── config/        # 설정 클래스
└── Application.java # 메인 클래스

src/main/resources/
├── static/css/    # CSS 파일
├── static/js/     # JavaScript 파일
└── templates/     # HTML 템플릿
```

#### 현재 React 구조 (컴포넌트별 구조 적용):
```typescript
src/
├── features/      # 기능별 컴포넌트 (각 기능의 완전한 모듈)
│   ├── auth/      # 인증 관련 모든 파일
│   ├── dashboard/ # 대시보드 관련 모든 파일
│   └── ...        # 기타 기능별 폴더
├── shared/        # 공유 리소스
│   ├── ui/        # 공통 UI 컴포넌트
│   ├── utils/     # 유틸리티 함수 (service/util 역할)
│   ├── api/       # API 관련 파일
│   └── layout/    # 레이아웃 컴포넌트
└── App.tsx       # 메인 애플리케이션 (Application.java 역할)
```

### ✨ 코드 사용 예시

#### 1. 인증 처리
```javascript
// 기존 방식 (App.tsx에 모든 로직)
const handleLogout = () => {
  sessionStorage.setItem('force_logout', 'true')
  localStorage.clear()
  sessionStorage.clear()
  setUser(null)
  window.location.reload()
}

// 새로운 방식 (JavaScript 유틸리티 사용)
import { AuthService } from './shared/utils/auth.js'
const handleLogout = () => AuthService.logout()
```

#### 2. API 에러 처리
```javascript
// 기존 방식
try {
  const result = await api.call()
} catch (error) {
  console.error('API 에러:', error)
  alert('오류가 발생했습니다.')
}

// 새로운 방식
import { ApiUtils, UIUtils } from './shared/utils/'
try {
  const result = await api.call()
} catch (error) {
  const message = ApiUtils.handleApiError(error, '데이터 로드')
  UIUtils.notification.error(message)
}
```

#### 3. 데이터베이스 작업
```javascript
// 기존 방식 (복잡한 삭제 로직)
const deleteAccount = async () => {
  // 50줄의 복잡한 삭제 로직...
}

// 새로운 방식
import { DatabaseUtils } from './shared/utils/database.js'
const deleteAccount = async () => {
  await DatabaseUtils.deleteAccount(supabase, userId)
}
```

## 📱 사용법

### 1. 회원가입 및 로그인
1. 앱 접속 후 이메일과 비밀번호로 회원가입
2. 로그인하여 대시보드 접근

### 2. 프로필 설정
1. **프로필** 탭에서 개인 정보 입력
   - 이름, 키, 성별, 현재 체중
   - 운동 수준 (초보자/중급자/고급자)
   - 운동 목표 (체중 감량/근육 증가/유지/지구력)
   - 주간 운동 가능 일수
   - 선호 운동 시간
   - **선호 운동 요일** (중요!)

2. **프로필 저장** 버튼 클릭

### 3. AI 맞춤 루틴 생성
1. 프로필 설정 완료 후 **AI 맞춤 운동 루틴 생성** 버튼 클릭
2. 생성된 루틴은 **운동 기록** 탭에서 확인
3. 각 요일별 운동을 **이 루틴으로 기록하기** 버튼으로 바로 적용

### 4. 운동 기록
1. **운동 기록** 탭에서 **새 운동 기록** 버튼 클릭
2. 운동 제목, 날짜, 총 시간 입력
3. 개별 운동 항목 추가 (종목, 세트, 시간)
4. 칼로리는 자동 계산됨
5. **운동 세션 저장** 버튼 클릭

### 5. 체중 관리
1. **체중 추적** 탭에서 일별 체중 기록
2. AI 체중 예측 기능으로 미래 체중 변화 확인
3. 목표 체중 설정 및 진행률 모니터링

### 6. 진행 상황 확인
1. **대시보드**에서 종합 현황 확인
   - 총 운동 횟수, 칼로리, 시간
   - 주간 운동 비교
   - 체중 변화 추이
   - 목표 달성률

## 🎯 개발 로드맵

### 현재 버전 (v1.0)
- ✅ **기본 사용자 인증**: 이메일 기반 회원가입/로그인 시스템
- ✅ **프로필 관리**: 개인 정보, 운동 목표, 선호 요일 설정
- ✅ **AI 운동 루틴 생성**: 개인 맞춤형 주간 운동 계획 자동 생성
- ✅ **운동 기록 및 추적**: 상세한 운동 로그 및 칼로리 계산
- ✅ **체중 관리**: AI 기반 체중 예측 및 목표 추적
- ✅ **대시보드**: 종합 운동 통계 및 진행 상황 시각화

### 계획된 기능 (v2.0)(진행중인 수업 종료 후)
- 🔄 **운동 영상 가이드**: 각 운동별 올바른 자세 및 방법 영상 제공
- 🔄 **운동 챌린지**: 개인 목표 달성 챌린지 및 성취 시스템
- 🔄 **영양 관리 (식단 분석 & 추천)**:
  - 사용자가 식단을 입력하거나 사진 업로드 시 식단 점수화
  - AI 분석을 통한 영양소 부족/과다 알림
  - "단백질이 부족해요. 계란이나 두부를 추가해보세요!" 등의 맞춤형 추천
  - 칼로리 및 영양소 균형 분석
- 🔄 **자연어 입력 해석 (NLP)**:
  - "오늘 30분 달렸고 팔굽혀펴기 20개 했어요" 같은 자연어 입력
  - AI가 자동으로 운동 항목, 시간, 세트 수 파싱
  - 파싱된 데이터를 자동으로 운동 기록 DB에 저장
- 🔄 **적정 체중 계산**: 현재 체중과 키에 따른 비만율 고려한 건강한 목표 체중 제안
- 🔄 **모바일 앱 (React Native)**: 모바일 환경 최적화된 앱 버전

### 미래 계획 (v3.0)(공부좀 열심히 해야함!!!!)
- 🔄 **웨어러블 기기 연동**: Apple Watch, Fitbit 등과 실시간 데이터 동기화
- 🔄 **실시간 운동 코칭**: 운동 중 실시간 피드백 및 자세 교정 알림
- 🔄 **커뮤니티 기능**: 사용자 간 운동 팁 공유 및 질문/답변 게시판
- 🔄 **전문가 상담**: 전문 트레이너 및 영양사와의 1:1 상담 예약 시스템
- 🔄 **AI 음성 코치**: 음성 인식을 통한 운동 가이드 및 동기부여 메시지
- 🔄 **고급 분석**: 운동 패턴 분석, 부상 위험도 예측, 개인화된 회복 시간 추천



## 🔍 API 문서

### AI 루틴 생성 API
```javascript
POST /api/generate-routine
Content-Type: application/json

{
  "fitness_level": "beginner|intermediate|advanced",
  "goal": "weight_loss|muscle_gain|maintenance|endurance",
  "available_days": 3,
  "time_per_session": 60,
  "preferred_days": ["월요일", "수요일", "금요일"]
}
```

### 체중 예측 API
```javascript
POST /api/predict-weight
Content-Type: application/json

{
  "weight_data": [
    {"date": "2024-01-01", "weight": 70.0},
    {"date": "2024-01-02", "weight": 69.8}
  ],
  "days_ahead": 30
}
```

### 헬스 체크 API
```javascript
GET /api/health
```

## 🗄️ 데이터베이스 스키마

### 주요 테이블

#### accounts (사용자 계정)
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### user_profiles (사용자 프로필)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  full_name VARCHAR,
  height DECIMAL,
  gender VARCHAR CHECK (gender IN ('male', 'female', 'other')),
  fitness_level VARCHAR DEFAULT 'beginner',
  primary_goal VARCHAR DEFAULT 'maintenance',
  target_weight DECIMAL,
  available_days_per_week INTEGER DEFAULT 3,
  preferred_workout_duration INTEGER DEFAULT 60,
  preferred_days TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### workouts (운동 기록)
```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  workout_date DATE NOT NULL,
  title VARCHAR NOT NULL,
  notes TEXT,
  total_duration INTEGER,
  total_calories_burned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### weight_records (체중 기록)
```sql
CREATE TABLE weight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  record_date DATE NOT NULL,
  weight DECIMAL NOT NULL,
  bmi DECIMAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 테스트

### 프론트엔드 테스트
```bash
# 단위 테스트 실행
npm test

# 커버리지 확인
npm run test:coverage

# E2E 테스트 (Cypress)
npm run test:e2e
```

### 백엔드 테스트
```bash
cd backend

# 단위 테스트 실행
python -m pytest

# 커버리지 확인
python -m pytest --cov=.

# API 테스트
python -m pytest tests/test_api.py
```

## 🔒 보안

### 데이터 보호
- **암호화**: 모든 비밀번호는 해시화되어 저장
- **HTTPS**: 모든 통신은 SSL/TLS로 암호화
- **환경 변수**: 민감한 정보는 환경 변수로 관리
- **RLS**: Supabase Row Level Security로 데이터 접근 제어

### 인증 및 권한
- **JWT 토큰**: 세션 관리를 위한 JWT 사용
- **사용자별 데이터 격리**: 각 사용자는 자신의 데이터만 접근 가능
- **API 레이트 리미팅**: API 남용 방지

## 🚀 성능 최적화

### 프론트엔드
- **코드 스플리팅**: 라우트별 번들 분할
- **이미지 최적화**: WebP 포맷 및 lazy loading
- **캐싱**: 브라우저 캐시 및 Service Worker 활용
- **번들 최적화**: Tree shaking 및 minification

### 백엔드
- **데이터베이스 인덱싱**: 쿼리 성능 최적화
- **API 캐싱**: Redis를 통한 응답 캐싱
- **비동기 처리**: FastAPI의 async/await 활용
- **연결 풀링**: 데이터베이스 연결 최적화

## 🌍 다국어 지원

### 현재 지원 언어
- 🇰🇷 한국어 (기본)

### 추가 예정 언어
- 🇺🇸 English
- 🇯🇵 日本語
- 🇨🇳 中文

## 📄 라이선스

MIT License

---

## 🎓 학습 목적

이 프로젝트는 다음과 같은 기술들을 학습하기 위해 제작되었습니다:

- Node.js, React + TypeScript 개발
- AI 모델 통합 (Scikit-learn)
- 업무자동화 및 AI자동화
- Supabase를 활용한 백엔드 개발
- Vercel 배포
- 실시간 데이터베이스 관리

## 🐛 버그 리포트

버그를 발견하셨다면 다음 방법으로 알려주세요:

1. **GitHub Issues**: 새로운 이슈를 생성해주세요
2. **댓글**: 프로젝트 페이지에 댓글을 남겨주세요
3. **Pull Request**: 직접 수정사항을 제안해주세요

모든 피드백은 학습에 큰 도움이 됩니다! 🙏
