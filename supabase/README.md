# Supabase Database Schema

운동 기록 트래커를 위한 Supabase 데이터베이스 스키마 및 설정 파일들입니다.

## 데이터베이스 구조

### 주요 테이블

#### 1. users (사용자)
- 사용자 기본 정보 및 프로필
- Supabase Auth와 연동

#### 2. workouts (운동 기록)
- 개별 운동 세션 기록
- 운동 종류, 시간, 강도 등

#### 3. exercises (운동 종목)
- 운동 종목 마스터 데이터
- 칼로리 소모량, 카테고리 등

#### 4. weight_records (체중 기록)
- 일별 체중 기록
- 체중 변화 추적용

#### 5. nutrition_records (식단 기록)
- 식사별 영양 정보
- 칼로리, 영양소 분석용

#### 6. workout_routines (운동 루틴)
- AI가 생성한 운동 계획
- 사용자별 맞춤 루틴

## 설정 방법

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 데이터베이스 비밀번호 설정
3. 프로젝트 URL과 anon key 복사

### 2. 환경 변수 설정
프론트엔드와 백엔드에 다음 환경 변수 추가:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

### 3. 데이터베이스 스키마 적용
```bash
# Supabase CLI 설치 (선택사항)
npm install -g supabase

# 마이그레이션 실행
supabase db push
```

또는 Supabase 대시보드의 SQL Editor에서 마이그레이션 파일을 직접 실행

### 4. Row Level Security (RLS) 설정
- 사용자별 데이터 접근 제어
- 보안 정책 적용

## 마이그레이션 파일

### 실행 순서
1. `001_create_users_table.sql` - 사용자 테이블
2. `002_create_exercises_table.sql` - 운동 종목 테이블
3. `003_create_workouts_table.sql` - 운동 기록 테이블
4. `004_create_weight_records_table.sql` - 체중 기록 테이블
5. `005_create_nutrition_records_table.sql` - 식단 기록 테이블
6. `006_create_workout_routines_table.sql` - 운동 루틴 테이블
7. `007_insert_sample_exercises.sql` - 샘플 운동 데이터
8. `008_create_rls_policies.sql` - 보안 정책

## API 사용 예시

### JavaScript (Frontend)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)

// 운동 기록 조회
const { data, error } = await supabase
  .from('workouts')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Python (Backend)
```python
from supabase import create_client, Client

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# 체중 기록 조회
response = supabase.table('weight_records').select('*').eq('user_id', user_id).execute()
```

## 백업 및 복원

### 백업
```bash
# 데이터베이스 덤프
supabase db dump --file backup.sql
```

### 복원
```bash
# 백업 파일로부터 복원
supabase db reset --file backup.sql
```

## 성능 최적화

### 인덱스 생성
- 자주 조회되는 컬럼에 인덱스 추가
- 복합 인덱스 활용

### 쿼리 최적화
- 필요한 컬럼만 선택
- 적절한 필터링 조건 사용
- 페이지네이션 구현

## 모니터링

### Supabase 대시보드
- 실시간 사용량 모니터링
- 쿼리 성능 분석
- 에러 로그 확인

### 알림 설정
- 사용량 임계치 알림
- 에러 발생 알림
- 성능 저하 알림