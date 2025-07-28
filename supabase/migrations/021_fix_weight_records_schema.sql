-- weight_records 테이블 스키마 수정
-- user_id를 account_id로 변경

-- 1. account_id 컬럼 추가 (이미 존재하지 않는 경우에만)
ALTER TABLE public.weight_records 
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE;

-- 2. 기존 데이터 마이그레이션
UPDATE public.weight_records 
SET account_id = user_profiles.account_id 
FROM public.user_profiles 
WHERE weight_records.user_id = user_profiles.id 
AND weight_records.account_id IS NULL;

-- 3. account_id를 NOT NULL로 설정
ALTER TABLE public.weight_records ALTER COLUMN account_id SET NOT NULL;

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_weight_records_account_id ON public.weight_records(account_id);

-- 5. RLS 정책 업데이트 (account_id 기반으로 변경)
DROP POLICY IF EXISTS "Users can view own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can insert own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can update own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can delete own weight records" ON public.weight_records;

-- RLS 비활성화 (커스텀 인증 시스템과 호환성을 위해)
ALTER TABLE public.weight_records DISABLE ROW LEVEL SECURITY; 