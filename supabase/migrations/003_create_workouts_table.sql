-- 운동 기록 테이블
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- 운동 세션 정보
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    total_duration INTEGER, -- 총 운동 시간 (분)
    
    -- 운동 내용
    title TEXT, -- 운동 세션 제목 (예: "아침 러닝", "헬스장 운동")
    notes TEXT, -- 운동 메모
    
    -- 전체 세션 통계
    total_calories_burned INTEGER DEFAULT 0,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    
    -- 운동 강도 (1-10)
    perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10),
    
    -- 기분/컨디션
    mood_before TEXT CHECK (mood_before IN ('excellent', 'good', 'average', 'poor', 'terrible')),
    mood_after TEXT CHECK (mood_after IN ('excellent', 'good', 'average', 'poor', 'terrible')),
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 개별 운동 항목 테이블 (한 세션 내 여러 운동)
CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
    
    -- 운동 순서
    exercise_order INTEGER NOT NULL DEFAULT 1,
    
    -- 운동량 정보
    sets INTEGER,
    reps INTEGER[],  -- 세트별 반복 횟수 배열
    weight DECIMAL(6,2)[], -- 세트별 중량 배열 (kg)
    distance DECIMAL(8,2), -- 거리 (km)
    duration INTEGER, -- 지속 시간 (분)
    
    -- 휴식 시간
    rest_time INTEGER[], -- 세트간 휴식 시간 배열 (초)
    
    -- 칼로리 (자동 계산 또는 수동 입력)
    calories_burned INTEGER,
    
    -- 메모
    notes TEXT,
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 트리거 설정
CREATE TRIGGER update_workouts_updated_at 
    BEFORE UPDATE ON public.workouts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_date ON public.workouts(workout_date);
CREATE INDEX idx_workouts_user_date ON public.workouts(user_id, workout_date);
CREATE INDEX idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);

-- RLS 설정
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- 운동 기록 정책
CREATE POLICY "Users can view own workouts" ON public.workouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON public.workouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON public.workouts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON public.workouts
    FOR DELETE USING (auth.uid() = user_id);

-- 운동 항목 정책
CREATE POLICY "Users can view own workout exercises" ON public.workout_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE workouts.id = workout_exercises.workout_id 
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own workout exercises" ON public.workout_exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE workouts.id = workout_exercises.workout_id 
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own workout exercises" ON public.workout_exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE workouts.id = workout_exercises.workout_id 
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own workout exercises" ON public.workout_exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workouts 
            WHERE workouts.id = workout_exercises.workout_id 
            AND workouts.user_id = auth.uid()
        )
    );