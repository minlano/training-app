-- weight_records 테이블 완전 수정
-- 기존 테이블을 삭제하고 새로 생성

-- 1. 기존 테이블 삭제 (데이터 백업 후)
DROP TABLE IF EXISTS public.weight_records CASCADE;

-- 2. 새 테이블 생성 (account_id 기반)
CREATE TABLE IF NOT EXISTS public.weight_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    
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

-- 3. 인덱스 생성
CREATE INDEX idx_weight_records_account_id ON public.weight_records(account_id);
CREATE INDEX idx_weight_records_date ON public.weight_records(record_date);
CREATE INDEX idx_weight_records_account_date_desc ON public.weight_records(account_id, record_date DESC);

-- 4. 유니크 제약조건 (계정별 날짜별 하나의 기록만)
CREATE UNIQUE INDEX idx_weight_records_account_date ON public.weight_records(account_id, record_date);

-- 5. 업데이트 트리거
CREATE TRIGGER update_weight_records_updated_at 
    BEFORE UPDATE ON public.weight_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS 비활성화 (커스텀 인증 시스템과 호환성을 위해)
ALTER TABLE public.weight_records DISABLE ROW LEVEL SECURITY; 