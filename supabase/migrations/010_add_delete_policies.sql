-- 사용자가 자신의 프로필을 삭제할 수 있도록 정책 추가
CREATE POLICY "Users can delete own profile" ON public.user_profiles
    FOR DELETE USING (auth.uid() = id);

-- 사용자가 자신의 운동 기록을 삭제할 수 있도록 정책 추가
CREATE POLICY "Users can delete own workouts" ON public.workouts
    FOR DELETE USING (auth.uid() = user_id);

-- 사용자가 자신의 체중 기록을 삭제할 수 있도록 정책 추가
CREATE POLICY "Users can delete own weight records" ON public.weight_records
    FOR DELETE USING (auth.uid() = user_id); 