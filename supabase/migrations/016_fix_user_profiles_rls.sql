-- user_profiles 테이블 RLS 정책 수정
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

-- 새로운 정책 생성 (account_id 기반)
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (account_id = auth.uid()::uuid);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (account_id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (account_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own profile" ON public.user_profiles
    FOR DELETE USING (account_id = auth.uid()::uuid);

-- 또는 RLS를 일시적으로 비활성화 (테스트용)
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY; 