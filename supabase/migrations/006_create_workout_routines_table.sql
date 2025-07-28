-- AI 생성 운동 루틴 테이블
CREATE TABLE IF NOT EXISTS public.workout_routines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- 루틴 정보
    name TEXT NOT NULL,
    description TEXT,
    routine_type TEXT CHECK (routine_type IN ('ai_generated', 'custom', 'template')) DEFAULT 'ai_generated',
    
    -- 루틴 설정
    duration_weeks INTEGER DEFAULT 4, -- 루틴 지속 기간 (주)
    days_per_week INTEGER DEFAULT 3,
    target_goal TEXT CHECK (target_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'endurance')),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- AI 생성 정보
    ai_model_version TEXT, -- 사용된 AI 모델 버전
    generation_parameters JSONB, -- AI 생성 시 사용된 파라미터
    
    -- 상태
    is_active BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    start_date DATE,
    end_date DATE,
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 루틴 상세 계획 테이블 (주별, 일별 계획)
CREATE TABLE IF NOT EXISTS public.routine_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    routine_id UUID REFERENCES public.workout_routines(id) ON DELETE CASCADE NOT NULL,
    
    -- 스케줄 정보
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=일요일, 6=토요일
    day_name TEXT, -- 월요일, 화요일 등
    
    -- 운동 계획
    is_rest_day BOOLEAN DEFAULT false,
    workout_title TEXT,
    estimated_duration INTEGER, -- 예상 소요 시간 (분)
    workout_focus TEXT, -- 운동 초점 (상체, 하체, 유산소 등)
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 루틴 운동 항목 테이블
CREATE TABLE IF NOT EXISTS public.routine_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID REFERENCES public.routine_schedules(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
    
    -- 운동 순서
    exercise_order INTEGER NOT NULL DEFAULT 1,
    
    -- 계획된 운동량
    planned_sets INTEGER,
    planned_reps INTEGER[],
    planned_weight DECIMAL(6,2)[],
    planned_duration INTEGER, -- 분
    planned_distance DECIMAL(8,2), -- km
    
    -- 휴식 시간
    planned_rest_time INTEGER[], -- 세트간 휴식 (초)
    
    -- 운동 지시사항
    instructions TEXT,
    intensity_level TEXT CHECK (intensity_level IN ('low', 'moderate', 'high')),
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 루틴 진행 상황 추적 테이블
CREATE TABLE IF NOT EXISTS public.routine_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    routine_id UUID REFERENCES public.workout_routines(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL, -- 실제 수행한 운동과 연결
    
    -- 진행 정보
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    is_completed BOOLEAN DEFAULT false,
    is_skipped BOOLEAN DEFAULT false,
    skip_reason TEXT,
    
    -- 완료도
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- 피드백
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    notes TEXT,
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 트리거들
CREATE TRIGGER update_workout_routines_updated_at 
    BEFORE UPDATE ON public.workout_routines 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routine_progress_updated_at 
    BEFORE UPDATE ON public.routine_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성
CREATE INDEX idx_workout_routines_user_id ON public.workout_routines(user_id);
CREATE INDEX idx_workout_routines_active ON public.workout_routines(is_active);
CREATE INDEX idx_routine_schedules_routine_id ON public.routine_schedules(routine_id);
CREATE INDEX idx_routine_schedules_week_day ON public.routine_schedules(week_number, day_of_week);
CREATE INDEX idx_routine_exercises_schedule_id ON public.routine_exercises(schedule_id);
CREATE INDEX idx_routine_exercises_exercise_id ON public.routine_exercises(exercise_id);
CREATE INDEX idx_routine_progress_routine_id ON public.routine_progress(routine_id);
CREATE INDEX idx_routine_progress_user_id ON public.routine_progress(user_id);
CREATE INDEX idx_routine_progress_date ON public.routine_progress(scheduled_date);

-- RLS 설정
ALTER TABLE public.workout_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_progress ENABLE ROW LEVEL SECURITY;

-- 운동 루틴 정책
CREATE POLICY "Users can view own routines" ON public.workout_routines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines" ON public.workout_routines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines" ON public.workout_routines
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines" ON public.workout_routines
    FOR DELETE USING (auth.uid() = user_id);

-- 루틴 스케줄 정책
CREATE POLICY "Users can view own routine schedules" ON public.routine_schedules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_routines 
            WHERE workout_routines.id = routine_schedules.routine_id 
            AND workout_routines.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own routine schedules" ON public.routine_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workout_routines 
            WHERE workout_routines.id = routine_schedules.routine_id 
            AND workout_routines.user_id = auth.uid()
        )
    );

-- 루틴 운동 정책
CREATE POLICY "Users can view own routine exercises" ON public.routine_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.routine_schedules rs
            JOIN public.workout_routines wr ON rs.routine_id = wr.id
            WHERE rs.id = routine_exercises.schedule_id 
            AND wr.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own routine exercises" ON public.routine_exercises
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.routine_schedules rs
            JOIN public.workout_routines wr ON rs.routine_id = wr.id
            WHERE rs.id = routine_exercises.schedule_id 
            AND wr.user_id = auth.uid()
        )
    );

-- 루틴 진행상황 정책
CREATE POLICY "Users can view own routine progress" ON public.routine_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own routine progress" ON public.routine_progress
    FOR ALL USING (auth.uid() = user_id);

-- 루틴 통계 뷰
CREATE OR REPLACE VIEW public.routine_statistics AS
SELECT 
    r.id as routine_id,
    r.user_id,
    r.name as routine_name,
    COUNT(rp.id) as total_scheduled_workouts,
    COUNT(CASE WHEN rp.is_completed = true THEN 1 END) as completed_workouts,
    COUNT(CASE WHEN rp.is_skipped = true THEN 1 END) as skipped_workouts,
    ROUND(
        (COUNT(CASE WHEN rp.is_completed = true THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(rp.id), 0)) * 100, 1
    ) as completion_rate,
    AVG(rp.difficulty_rating) as avg_difficulty_rating,
    AVG(rp.satisfaction_rating) as avg_satisfaction_rating,
    MIN(rp.scheduled_date) as first_workout_date,
    MAX(rp.scheduled_date) as last_workout_date
FROM public.workout_routines r
LEFT JOIN public.routine_progress rp ON r.id = rp.routine_id
GROUP BY r.id, r.user_id, r.name;