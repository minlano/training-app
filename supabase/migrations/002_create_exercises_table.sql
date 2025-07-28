-- 운동 종목 마스터 테이블
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_en TEXT, -- 영문명
    category TEXT NOT NULL CHECK (category IN ('cardio', 'strength', 'flexibility', 'sports', 'other')),
    subcategory TEXT, -- 세부 카테고리 (예: upper_body, lower_body, full_body)
    
    -- 칼로리 정보 (체중 1kg당 1분당 소모 칼로리)
    calories_per_kg_per_minute DECIMAL(4,3) DEFAULT 0.05,
    
    -- 운동 정보
    description TEXT,
    instructions TEXT[], -- 운동 방법 단계별 설명
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    
    -- 필요 장비
    equipment TEXT[], -- 필요한 장비 목록
    muscle_groups TEXT[], -- 주요 운동 부위
    
    -- 메타데이터
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 트리거
CREATE TRIGGER update_exercises_updated_at 
    BEFORE UPDATE ON public.exercises 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성
CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_exercises_difficulty ON public.exercises(difficulty_level);
CREATE INDEX idx_exercises_name ON public.exercises(name);
CREATE INDEX idx_exercises_active ON public.exercises(is_active);

-- RLS 설정 (모든 사용자가 읽기 가능, 관리자만 수정 가능)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises" ON public.exercises
    FOR SELECT USING (is_active = true);

-- 관리자 정책은 나중에 추가 예정