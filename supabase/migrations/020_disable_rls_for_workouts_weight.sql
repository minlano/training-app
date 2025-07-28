-- workouts와 weight_records 테이블의 RLS 비활성화
-- 커스텀 인증 시스템과 호환성을 위해

-- 1. workouts 테이블 RLS 비활성화
ALTER TABLE public.workouts DISABLE ROW LEVEL SECURITY;

-- 2. weight_records 테이블 RLS 비활성화
ALTER TABLE public.weight_records DISABLE ROW LEVEL SECURITY;

-- 3. workout_exercises 테이블 RLS 비활성화
ALTER TABLE public.workout_exercises DISABLE ROW LEVEL SECURITY; 