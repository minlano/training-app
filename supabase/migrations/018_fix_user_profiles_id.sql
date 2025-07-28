-- user_profiles 테이블의 id 컬럼을 자동 증가로 수정
-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- user_profiles 테이블 재생성 (id 자동 증가 포함)
CREATE TABLE public.user_profiles (
    id SERIAL PRIMARY KEY,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    height NUMERIC(5,2),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    fitness_level TEXT DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    primary_goal TEXT DEFAULT 'maintenance' CHECK (primary_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'endurance')),
    target_weight NUMERIC(5,2),
    available_days_per_week INTEGER DEFAULT 3,
    preferred_workout_duration INTEGER DEFAULT 60,
    preferred_days TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 비활성화
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY; 