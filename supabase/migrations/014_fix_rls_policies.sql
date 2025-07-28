-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

-- 새로운 정책 생성 (모든 작업 허용)
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = id);

-- 운동 기록 정책
DROP POLICY IF EXISTS "Users can view own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can insert own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can update own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can delete own workouts" ON public.workouts;

CREATE POLICY "Users can manage own workouts" ON public.workouts
    FOR ALL USING (auth.uid() = user_id);

-- 체중 기록 정책
DROP POLICY IF EXISTS "Users can view own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can insert own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can update own weight records" ON public.weight_records;
DROP POLICY IF EXISTS "Users can delete own weight records" ON public.weight_records;

CREATE POLICY "Users can manage own weight records" ON public.weight_records
    FOR ALL USING (auth.uid() = user_id); 