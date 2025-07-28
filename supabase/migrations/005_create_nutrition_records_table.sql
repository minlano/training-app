-- 식단 기록 테이블
CREATE TABLE IF NOT EXISTS public.nutrition_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- 식사 정보
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    meal_time TIME,
    
    -- 음식 정보
    food_name TEXT NOT NULL,
    food_category TEXT, -- 음식 카테고리 (곡물, 단백질, 채소 등)
    brand TEXT, -- 브랜드명 (가공식품의 경우)
    
    -- 양 정보
    serving_size DECIMAL(8,2), -- 1회 제공량 (g 또는 ml)
    serving_unit TEXT DEFAULT 'g', -- 단위 (g, ml, 개, 컵 등)
    quantity DECIMAL(6,2) DEFAULT 1, -- 섭취량 (serving_size의 배수)
    
    -- 영양 정보 (100g 기준)
    calories_per_100g DECIMAL(6,1),
    protein_per_100g DECIMAL(5,2),
    carbs_per_100g DECIMAL(5,2),
    fat_per_100g DECIMAL(5,2),
    fiber_per_100g DECIMAL(5,2),
    sugar_per_100g DECIMAL(5,2),
    sodium_per_100g DECIMAL(7,2), -- mg
    
    -- 실제 섭취 영양소 (자동 계산)
    total_calories DECIMAL(7,1),
    total_protein DECIMAL(6,2),
    total_carbs DECIMAL(6,2),
    total_fat DECIMAL(6,2),
    total_fiber DECIMAL(6,2),
    total_sugar DECIMAL(6,2),
    total_sodium DECIMAL(8,2),
    
    -- 추가 정보
    preparation_method TEXT, -- 조리 방법
    notes TEXT,
    
    -- 이미지 (향후 AI 분석용)
    image_url TEXT,
    
    -- 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 영양소 자동 계산 함수
CREATE OR REPLACE FUNCTION calculate_nutrition()
RETURNS TRIGGER AS $$
BEGIN
    -- 실제 섭취량 기준으로 영양소 계산
    IF NEW.serving_size IS NOT NULL AND NEW.quantity IS NOT NULL THEN
        NEW.total_calories = (NEW.calories_per_100g * NEW.serving_size * NEW.quantity) / 100;
        NEW.total_protein = (NEW.protein_per_100g * NEW.serving_size * NEW.quantity) / 100;
        NEW.total_carbs = (NEW.carbs_per_100g * NEW.serving_size * NEW.quantity) / 100;
        NEW.total_fat = (NEW.fat_per_100g * NEW.serving_size * NEW.quantity) / 100;
        NEW.total_fiber = (NEW.fiber_per_100g * NEW.serving_size * NEW.quantity) / 100;
        NEW.total_sugar = (NEW.sugar_per_100g * NEW.serving_size * NEW.quantity) / 100;
        NEW.total_sodium = (NEW.sodium_per_100g * NEW.serving_size * NEW.quantity) / 100;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 영양소 계산 트리거
CREATE TRIGGER calculate_nutrition_trigger
    BEFORE INSERT OR UPDATE ON public.nutrition_records
    FOR EACH ROW
    EXECUTE FUNCTION calculate_nutrition();

-- 업데이트 트리거
CREATE TRIGGER update_nutrition_records_updated_at 
    BEFORE UPDATE ON public.nutrition_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성
CREATE INDEX idx_nutrition_records_user_id ON public.nutrition_records(user_id);
CREATE INDEX idx_nutrition_records_date ON public.nutrition_records(meal_date);
CREATE INDEX idx_nutrition_records_user_date ON public.nutrition_records(user_id, meal_date);
CREATE INDEX idx_nutrition_records_meal_type ON public.nutrition_records(meal_type);

-- RLS 설정
ALTER TABLE public.nutrition_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition records" ON public.nutrition_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition records" ON public.nutrition_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition records" ON public.nutrition_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition records" ON public.nutrition_records
    FOR DELETE USING (auth.uid() = user_id);

-- 일일 영양 통계 뷰
CREATE OR REPLACE VIEW public.daily_nutrition_summary AS
SELECT 
    user_id,
    meal_date,
    SUM(total_calories) as daily_calories,
    SUM(total_protein) as daily_protein,
    SUM(total_carbs) as daily_carbs,
    SUM(total_fat) as daily_fat,
    SUM(total_fiber) as daily_fiber,
    SUM(total_sugar) as daily_sugar,
    SUM(total_sodium) as daily_sodium,
    COUNT(*) as total_meals,
    -- 식사별 칼로리
    SUM(CASE WHEN meal_type = 'breakfast' THEN total_calories ELSE 0 END) as breakfast_calories,
    SUM(CASE WHEN meal_type = 'lunch' THEN total_calories ELSE 0 END) as lunch_calories,
    SUM(CASE WHEN meal_type = 'dinner' THEN total_calories ELSE 0 END) as dinner_calories,
    SUM(CASE WHEN meal_type = 'snack' THEN total_calories ELSE 0 END) as snack_calories
FROM public.nutrition_records
GROUP BY user_id, meal_date;

-- 음식 데이터베이스 테이블 (공통 음식 정보)
CREATE TABLE IF NOT EXISTS public.food_database (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT,
    
    -- 영양 정보 (100g 기준)
    calories_per_100g DECIMAL(6,1) NOT NULL,
    protein_per_100g DECIMAL(5,2) DEFAULT 0,
    carbs_per_100g DECIMAL(5,2) DEFAULT 0,
    fat_per_100g DECIMAL(5,2) DEFAULT 0,
    fiber_per_100g DECIMAL(5,2) DEFAULT 0,
    sugar_per_100g DECIMAL(5,2) DEFAULT 0,
    sodium_per_100g DECIMAL(7,2) DEFAULT 0,
    
    -- 추가 영양소
    calcium_per_100g DECIMAL(6,2) DEFAULT 0,
    iron_per_100g DECIMAL(5,2) DEFAULT 0,
    vitamin_c_per_100g DECIMAL(5,2) DEFAULT 0,
    
    -- 메타데이터
    is_verified BOOLEAN DEFAULT false,
    source TEXT, -- 데이터 출처
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 음식 데이터베이스 인덱스
CREATE INDEX idx_food_database_name ON public.food_database(name);
CREATE INDEX idx_food_database_category ON public.food_database(category);
CREATE INDEX idx_food_database_verified ON public.food_database(is_verified);

-- 음식 데이터베이스 RLS (모든 사용자 읽기 가능)
ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified foods" ON public.food_database
    FOR SELECT USING (is_verified = true);