-- workouts와 weight_records 테이블의 account_id 데이터 마이그레이션
-- 기존 user_id 데이터를 account_id로 복사

-- 1. 기존 데이터 마이그레이션 (user_profiles의 account_id를 사용)
UPDATE public.workouts 
SET account_id = user_profiles.account_id 
FROM public.user_profiles 
WHERE workouts.user_id = user_profiles.id 
AND workouts.account_id IS NULL;

UPDATE public.weight_records 
SET account_id = user_profiles.account_id 
FROM public.user_profiles 
WHERE weight_records.user_id = user_profiles.id 
AND weight_records.account_id IS NULL;

-- 2. account_id를 NOT NULL로 설정 (데이터가 있는 경우에만)
ALTER TABLE public.workouts ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE public.weight_records ALTER COLUMN account_id SET NOT NULL;

-- 3. 인덱스 생성 (이미 존재하지 않는 경우에만)
CREATE INDEX IF NOT EXISTS idx_workouts_account_id ON public.workouts(account_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_account_id ON public.weight_records(account_id);

-- 4. RLS 정책 업데이트 (account_id 기반으로 변경)
DROP POLICY IF EXISTS "Users can view own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can insert own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can update own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can delete own workouts" ON public.workouts;

CREATE POLICY "Users can view own workouts" ON public.workouts
    FOR SELECT USING (account_id = auth.uid()::text::uuid);

CREATE POLICY "Users can insert own workouts" ON public.workouts
    FOR INSERT WITH CHECK (account_id = auth.uid()::text::uuid);

CREATE POLICY "Users can update own workouts" ON public.workouts
    FOR UPDATE USING (account_id = auth.uid()::text::uuid);

CREATE POLICY "Users can delete own workouts" ON public.workouts
    FOR DELETE USING (account_id = auth.uid()::text::uuid);

-- weight_records 정책 업데이트
DROP POLICY IF EXISTS "Users can view own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can insert own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can update own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can delete own weight records" ON public.weight_records;

CREATE POLICY "Users can view own weight records" ON public.weight_records
    FOR SELECT USING (account_id = auth.uid()::text::uuid);

CREATE POLICY "Users can insert own weight records" ON public.weight_records
    FOR INSERT WITH CHECK (account_id = auth.uid()::text::uuid);

CREATE POLICY "Users can update own weight records" ON public.weight_records
    FOR UPDATE USING (account_id = auth.uid()::text::uuid);

CREATE POLICY "Users can delete own weight records" ON public.weight_records
    FOR DELETE USING (account_id = auth.uid()::text::uuid); 