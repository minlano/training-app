-- RLS를 일시적으로 비활성화하는 함수
CREATE OR REPLACE FUNCTION disable_rls_temporarily()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- RLS를 일시적으로 비활성화
  ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.workouts DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.weight_records DISABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE 'RLS temporarily disabled for user data tables';
END;
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION disable_rls_temporarily() TO authenticated; 