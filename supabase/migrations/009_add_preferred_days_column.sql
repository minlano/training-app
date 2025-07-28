-- user_profiles 테이블에 preferred_days 컬럼 추가
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS preferred_days TEXT[] DEFAULT '{}';

-- 기존 데이터에 대해 빈 배열로 초기화
UPDATE public.user_profiles 
SET preferred_days = '{}' 
WHERE preferred_days IS NULL; 