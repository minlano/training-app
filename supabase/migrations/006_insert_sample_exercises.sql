-- 샘플 운동 데이터 삽입
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
-- 유산소 운동
('조깅', 'Jogging', 'cardio', 'running', 0.12, '천천히 뛰기', 'beginner', ARRAY['운동화'], ARRAY['전신']),
('달리기', 'Running', 'cardio', 'running', 0.15, '빠르게 뛰기', 'intermediate', ARRAY['운동화'], ARRAY['전신']),
('자전거', 'Cycling', 'cardio', 'cycling', 0.10, '실내/외 자전거', 'beginner', ARRAY['자전거'], ARRAY['하체']),
('수영', 'Swimming', 'cardio', 'swimming', 0.13, '자유형 수영', 'intermediate', ARRAY['수영복'], ARRAY['전신']),
('걷기', 'Walking', 'cardio', 'walking', 0.08, '빠른 걷기', 'beginner', ARRAY['운동화'], ARRAY['하체']),
('등산', 'Hiking', 'cardio', 'hiking', 0.11, '산을 오르기', 'intermediate', ARRAY['등산화'], ARRAY['하체']),
('줄넘기', 'Jump Rope', 'cardio', 'jumping', 0.14, '줄넘기 운동', 'intermediate', ARRAY['줄넘기'], ARRAY['전신']),

-- 근력 운동
('푸시업', 'Push-up', 'strength', 'upper_body', 0.06, '팔굽혀펴기', 'beginner', ARRAY['없음'], ARRAY['가슴', '삼두근']),
('스쿼트', 'Squat', 'strength', 'lower_body', 0.07, '앉았다 일어서기', 'beginner', ARRAY['없음'], ARRAY['대퇴사두근', '둔근']),
('플랭크', 'Plank', 'strength', 'core', 0.05, '코어 강화 운동', 'beginner', ARRAY['없음'], ARRAY['복근', '등근육']),
('런지', 'Lunge', 'strength', 'lower_body', 0.08, '한발씩 앞으로 내딛기', 'beginner', ARRAY['없음'], ARRAY['대퇴사두근', '둔근']),
('버피', 'Burpee', 'strength', 'full_body', 0.12, '전신 운동', 'intermediate', ARRAY['없음'], ARRAY['전신']),

-- 스포츠
('농구', 'Basketball', 'sports', 'team_sports', 0.13, '농구 경기', 'intermediate', ARRAY['농구공', '농구장'], ARRAY['전신']),
('축구', 'Soccer', 'sports', 'team_sports', 0.12, '축구 경기', 'intermediate', ARRAY['축구공', '축구장'], ARRAY['전신']),
('테니스', 'Tennis', 'sports', 'racket_sports', 0.11, '테니스 경기', 'intermediate', ARRAY['테니스 라켓', '테니스공'], ARRAY['상체', '하체']),
('배드민턴', 'Badminton', 'sports', 'racket_sports', 0.10, '배드민턴 경기', 'beginner', ARRAY['배드민턴 라켓', '셔틀콕'], ARRAY['상체', '하체']),

-- 기타
('요가', 'Yoga', 'flexibility', 'mind_body', 0.04, '요가 수련', 'beginner', ARRAY['요가 매트'], ARRAY['전신']),
('필라테스', 'Pilates', 'flexibility', 'core', 0.05, '필라테스 운동', 'intermediate', ARRAY['매트'], ARRAY['코어']),
('스트레칭', 'Stretching', 'flexibility', 'flexibility', 0.03, '근육 스트레칭', 'beginner', ARRAY['매트'], ARRAY['전신'])

ON CONFLICT (name) DO UPDATE SET
    calories_per_kg_per_minute = EXCLUDED.calories_per_kg_per_minute,
    updated_at = NOW(); 