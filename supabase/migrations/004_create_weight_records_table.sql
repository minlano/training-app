-- 체중 기록 테이블
CREATE TABLE IF NOT EXISTS public.weight_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- 측정 정보
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0 AND weight < 1000), -- kg
    body_fat_percentage DECIMAL(4,1) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
    muscle_mass DECIMAL(5,2) CHECK (muscle_mass > 0),
    
    -- 측정 조건
    measurement_time TIME, -- 측정 시간
    measurement_condition TEXT CHECK (measurement_condition IN ('morning_empty', 'evening', 'after_workout', 'other')),
    
    -- BMI 자동 계산 (트리거로 처리)
    bmi DECIMAL(4,1),
    
    -- 메모
    notes TEXT,
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMI 자동 계산 함수
CREATE OR REPLACE FUNCTION calculate_bmi()
RETURNS TRIGGER AS $$
DECLARE
    user_height DECIMAL(5,2);
BEGIN
    -- 사용자 키 조회
    SELECT height INTO user_height 
    FROM public.user_profiles 
    WHERE id = NEW.user_id;
    
    -- BMI 계산 (키가 있는 경우만)
    IF user_height IS NOT NULL AND user_height > 0 THEN
        NEW.bmi = ROUND(NEW.weight / POWER(user_height / 100, 2), 1);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- BMI 계산 트리거
CREATE TRIGGER calculate_bmi_trigger
    BEFORE INSERT OR UPDATE ON public.weight_records
    FOR EACH ROW
    EXECUTE FUNCTION calculate_bmi();

-- 업데이트 트리거
CREATE TRIGGER update_weight_records_updated_at 
    BEFORE UPDATE ON public.weight_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 유니크 제약조건 (사용자별 날짜별 하나의 기록만)
CREATE UNIQUE INDEX idx_weight_records_user_date ON public.weight_records(user_id, record_date);

-- 인덱스 생성
CREATE INDEX idx_weight_records_user_id ON public.weight_records(user_id);
CREATE INDEX idx_weight_records_date ON public.weight_records(record_date);
CREATE INDEX idx_weight_records_user_date_desc ON public.weight_records(user_id, record_date DESC);

-- RLS 설정
ALTER TABLE public.weight_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weight records" ON public.weight_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight records" ON public.weight_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight records" ON public.weight_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight records" ON public.weight_records
    FOR DELETE USING (auth.uid() = user_id);

-- 체중 변화 통계 뷰 생성
CREATE OR REPLACE VIEW public.weight_statistics AS
SELECT 
    user_id,
    COUNT(*) as total_records,
    MIN(weight) as min_weight,
    MAX(weight) as max_weight,
    AVG(weight) as avg_weight,
    STDDEV(weight) as weight_stddev,
    MIN(record_date) as first_record_date,
    MAX(record_date) as last_record_date,
    -- 최근 30일 평균
    (SELECT AVG(weight) 
     FROM public.weight_records wr2 
     WHERE wr2.user_id = wr.user_id 
     AND wr2.record_date >= CURRENT_DATE - INTERVAL '30 days'
    ) as avg_weight_30d,
    -- 체중 변화 (최근 기록 - 첫 기록)
    (SELECT weight FROM public.weight_records wr3 
     WHERE wr3.user_id = wr.user_id 
     ORDER BY record_date DESC LIMIT 1
    ) - 
    (SELECT weight FROM public.weight_records wr4 
     WHERE wr4.user_id = wr.user_id 
     ORDER BY record_date ASC LIMIT 1
    ) as total_weight_change
FROM public.weight_records wr
GROUP BY user_id;