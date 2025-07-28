# Workout Tracker Backend

Python FastAPI 기반의 운동 기록 트래커 백엔드 서버입니다.

## 주요 기능

### 🤖 AI/ML 기능
- **체중 예측 모델**: 과거 체중 데이터를 기반으로 향후 2주간 체중 변화 예측
- **운동 루틴 추천**: 사용자 프로필(체형, 목적, 시간)에 맞는 주간 운동 계획 자동 생성
- **식단 분석**: 입력된 식단 정보 분석 및 영양소 피드백 (향후 구현)
- **자연어 처리**: "30분 달렸고 팔굽혀펴기 20개" 같은 자연어를 구조화된 데이터로 변환 (향후 구현)

### 📊 데이터 분석
- 운동 통계 자동 계산
- 칼로리 소모량 자동 계산
- 목표 체중 도달률 계산
- 운동 일지 요약 및 피드백

## 설치 및 실행

### 1. 가상환경 생성 및 활성화
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key  # AI 기능용 (선택사항)
```

### 4. 서버 실행
```bash
python main.py
```

서버는 `http://localhost:8000`에서 실행됩니다.

## API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 프로젝트 구조

```
backend/
├── main.py                 # FastAPI 앱 진입점
├── requirements.txt        # Python 의존성
├── models/                 # AI/ML 모델
│   ├── weight_prediction_model.py    # 체중 예측
│   └── routine_recommendation.py     # 운동 루틴 추천
├── api/                    # API 라우터 (향후 추가)
├── services/               # 비즈니스 로직 (향후 추가)
└── utils/                  # 유틸리티 함수 (향후 추가)
```

## 개발 로드맵

### Phase 1: 기본 기능
- [x] 프로젝트 구조 설정
- [x] 체중 예측 모델 기본 구현
- [x] 운동 루틴 추천 시스템 기본 구현
- [ ] Supabase 연동
- [ ] 기본 CRUD API 구현

### Phase 2: AI 기능 강화
- [ ] 식단 분석 AI 구현
- [ ] 자연어 처리 기능 추가
- [ ] 운동 일지 요약 AI 구현
- [ ] 더 정교한 예측 모델 (Prophet 활용)

### Phase 3: 고급 기능
- [ ] 이미지 기반 식단 분석
- [ ] 실시간 피드백 시스템
- [ ] 개인화된 목표 설정 AI
- [ ] 소셜 기능 (친구와 경쟁 등)

## 기여하기

1. 이슈를 생성하여 기능 제안이나 버그 리포트
2. 브랜치를 생성하여 개발
3. 테스트 코드 작성
4. Pull Request 생성

## 라이선스

MIT License