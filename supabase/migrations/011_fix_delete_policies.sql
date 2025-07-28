-- 기존 DELETE 정책이 있다면 삭제
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can delete own weight records" ON public.weight_records;

-- 새로운 DELETE 정책 생성
CREATE POLICY "Users can delete own profile" ON public.user_profiles
    FOR DELETE USING (auth.uid() = id);

CREATE POLICY "Users can delete own workouts" ON public.workouts
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight records" ON public.weight_records
    FOR DELETE USING (auth.uid() = user_id);

-- 또는 RLS를 일시적으로 비활성화 (테스트용)
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.workouts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.weight_records DISABLE ROW LEVEL SECURITY; 