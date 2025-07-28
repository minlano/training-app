-- Row Level Security 정책 추가 설정

-- 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 새 사용자 등록 시 프로필 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 운동 기록 통계 뷰 (사용자별)
CREATE OR REPLACE VIEW public.user_workout_stats AS
SELECT 
    w.user_id,
    COUNT(DISTINCT w.id) as total_workouts,
    COUNT(DISTINCT DATE(w.workout_date)) as workout_days,
    SUM(w.total_duration) as total_minutes,
    SUM(w.total_calories_burned) as total_calories,
    AVG(w.total_duration) as avg_workout_duration,
    AVG(w.total_calories_burned) as avg_calories_per_workout,
    -- 이번 주 운동 횟수
    COUNT(CASE WHEN w.workout_date >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as workouts_this_week,
    -- 이번 달 운동 횟수
    COUNT(CASE WHEN w.workout_date >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as workouts_this_month,
    -- 최근 운동일
    MAX(w.workout_date) as last_workout_date,
    -- 가장 많이 한 운동
    (SELECT e.name 
     FROM public.workout_exercises we 
     JOIN public.exercises e ON we.exercise_id = e.id 
     WHERE we.workout_id IN (SELECT id FROM public.workouts WHERE user_id = w.user_id)
     GROUP BY e.name 
     ORDER BY COUNT(*) DESC 
     LIMIT 1
    ) as most_frequent_exercise
FROM public.workouts w
GROUP BY w.user_id;

-- 주간 운동 통계 뷰
CREATE OR REPLACE VIEW public.weekly_workout_summary AS
SELECT 
    user_id,
    DATE_TRUNC('week', workout_date) as week_start,
    COUNT(*) as workouts_count,
    SUM(total_duration) as total_minutes,
    SUM(total_calories_burned) as total_calories,
    AVG(perceived_exertion) as avg_exertion,
    STRING_AGG(DISTINCT title, ', ') as workout_types
FROM public.workouts
WHERE workout_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY user_id, DATE_TRUNC('week', workout_date)
ORDER BY user_id, week_start DESC;

-- 월간 체중 변화 뷰
CREATE OR REPLACE VIEW public.monthly_weight_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', record_date) as month_start,
    COUNT(*) as records_count,
    AVG(weight) as avg_weight,
    MIN(weight) as min_weight,
    MAX(weight) as max_weight,
    STDDEV(weight) as weight_variation,
    -- 월 시작 체중
    (SELECT weight FROM public.weight_records wr2 
     WHERE wr2.user_id = wr.user_id 
     AND DATE_TRUNC('month', wr2.record_date) = DATE_TRUNC('month', wr.record_date)
     ORDER BY record_date ASC LIMIT 1
    ) as month_start_weight,
    -- 월 마지막 체중
    (SELECT weight FROM public.weight_records wr3 
     WHERE wr3.user_id = wr.user_id 
     AND DATE_TRUNC('month', wr3.record_date) = DATE_TRUNC('month', wr.record_date)
     ORDER BY record_date DESC LIMIT 1
    ) as month_end_weight
FROM public.weight_records wr
GROUP BY user_id, DATE_TRUNC('month', record_date)
ORDER BY user_id, month_start DESC;

-- 영양소 목표 대비 달성률 뷰
CREATE OR REPLACE VIEW public.nutrition_goal_progress AS
SELECT 
    nr.user_id,
    nr.meal_date,
    -- 일일 영양소 합계
    SUM(nr.total_calories) as daily_calories,
    SUM(nr.total_protein) as daily_protein,
    SUM(nr.total_carbs) as daily_carbs,
    SUM(nr.total_fat) as daily_fat,
    -- 목표 대비 달성률 (기본 목표값 사용)
    ROUND((SUM(nr.total_calories) / 2000.0) * 100, 1) as calories_achievement_rate,
    ROUND((SUM(nr.total_protein) / 150.0) * 100, 1) as protein_achievement_rate,
    ROUND((SUM(nr.total_carbs) / 250.0) * 100, 1) as carbs_achievement_rate,
    ROUND((SUM(nr.total_fat) / 65.0) * 100, 1) as fat_achievement_rate,
    -- 식사 균형도
    COUNT(DISTINCT nr.meal_type) as meals_variety,
    -- 식사별 칼로리 분포
    SUM(CASE WHEN nr.meal_type = 'breakfast' THEN nr.total_calories ELSE 0 END) as breakfast_calories,
    SUM(CASE WHEN nr.meal_type = 'lunch' THEN nr.total_calories ELSE 0 END) as lunch_calories,
    SUM(CASE WHEN nr.meal_type = 'dinner' THEN nr.total_calories ELSE 0 END) as dinner_calories,
    SUM(CASE WHEN nr.meal_type = 'snack' THEN nr.total_calories ELSE 0 END) as snack_calories
FROM public.nutrition_records nr
GROUP BY nr.user_id, nr.meal_date
ORDER BY nr.user_id, nr.meal_date DESC;

-- 운동 루틴 성과 분석 뷰
CREATE OR REPLACE VIEW public.routine_performance_analysis AS
SELECT 
    wr.id as routine_id,
    wr.user_id,
    wr.name as routine_name,
    wr.target_goal,
    wr.difficulty_level,
    -- 루틴 기본 정보
    wr.duration_weeks,
    wr.days_per_week,
    wr.start_date,
    wr.end_date,
    -- 진행 상황
    COUNT(rp.id) as total_scheduled_sessions,
    COUNT(CASE WHEN rp.is_completed = true THEN 1 END) as completed_sessions,
    COUNT(CASE WHEN rp.is_skipped = true THEN 1 END) as skipped_sessions,
    ROUND(
        (COUNT(CASE WHEN rp.is_completed = true THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(rp.id), 0)) * 100, 1
    ) as completion_rate,
    -- 만족도 및 난이도
    AVG(rp.difficulty_rating) as avg_difficulty_rating,
    AVG(rp.satisfaction_rating) as avg_satisfaction_rating,
    -- 날짜 정보
    MIN(rp.scheduled_date) as first_scheduled_date,
    MAX(rp.scheduled_date) as last_scheduled_date,
    MAX(rp.completed_date) as last_completed_date
FROM public.workout_routines wr
LEFT JOIN public.routine_progress rp ON wr.id = rp.routine_id
GROUP BY wr.id, wr.user_id, wr.name, wr.target_goal, wr.difficulty_level, 
         wr.duration_weeks, wr.days_per_week, wr.start_date, wr.end_date;

-- 뷰들에 대한 RLS 설정
ALTER VIEW public.user_workout_stats SET (security_barrier = true);
ALTER VIEW public.weekly_workout_summary SET (security_barrier = true);
ALTER VIEW public.monthly_weight_summary SET (security_barrier = true);
ALTER VIEW public.nutrition_goal_progress SET (security_barrier = true);
ALTER VIEW public.routine_performance_analysis SET (security_barrier = true);

-- 성능 최적화를 위한 추가 인덱스
CREATE INDEX IF NOT EXISTS idx_workouts_user_date_desc ON public.workouts(user_id, workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_weight_records_user_date_desc ON public.weight_records(user_id, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_records_user_date_desc ON public.nutrition_records(user_id, meal_date DESC);
CREATE INDEX IF NOT EXISTS idx_routine_progress_user_scheduled ON public.routine_progress(user_id, scheduled_date);

-- 데이터 정합성을 위한 추가 제약조건
ALTER TABLE public.workouts ADD CONSTRAINT check_workout_times 
    CHECK (end_time IS NULL OR start_time IS NULL OR end_time > start_time);

ALTER TABLE public.weight_records ADD CONSTRAINT check_reasonable_weight 
    CHECK (weight BETWEEN 20 AND 500);

ALTER TABLE public.nutrition_records ADD CONSTRAINT check_positive_nutrition 
    CHECK (total_calories >= 0 AND total_protein >= 0 AND total_carbs >= 0 AND total_fat >= 0);