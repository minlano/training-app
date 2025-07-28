-- 사용자 데이터 삭제 함수 생성
CREATE OR REPLACE FUNCTION delete_user_data(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- RLS를 우회하여 데이터 삭제
  DELETE FROM public.workouts WHERE user_id = user_id_param;
  DELETE FROM public.weight_records WHERE user_id = user_id_param;
  DELETE FROM public.user_profiles WHERE id = user_id_param;
  
  RAISE NOTICE 'User data deleted for user_id: %', user_id_param;
END;
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated; 