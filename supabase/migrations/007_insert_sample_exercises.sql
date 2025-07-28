-- 샘플 운동 종목 데이터 삽입

-- 유산소 운동
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
('걷기', 'Walking', 'cardio', 'low_intensity', 0.045, '가장 기본적인 유산소 운동', 'beginner', '{}', '{"legs", "core"}'),
('조깅', 'Jogging', 'cardio', 'moderate_intensity', 0.08, '중간 강도의 달리기', 'intermediate', '{}', '{"legs", "core", "cardiovascular"}'),
('러닝', 'Running', 'cardio', 'high_intensity', 0.12, '고강도 달리기', 'advanced', '{}', '{"legs", "core", "cardiovascular"}'),
('실내자전거', 'Stationary Bike', 'cardio', 'moderate_intensity', 0.07, '실내 자전거 타기', 'beginner', '{"stationary_bike"}', '{"legs", "core"}'),
('수영', 'Swimming', 'cardio', 'full_body', 0.11, '전신 유산소 운동', 'intermediate', '{"pool"}', '{"full_body", "cardiovascular"}'),
('줄넘기', 'Jump Rope', 'cardio', 'high_intensity', 0.13, '고강도 유산소 운동', 'intermediate', '{"jump_rope"}', '{"legs", "arms", "core"}');

-- 근력 운동 - 상체
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
('팔굽혀펴기', 'Push-ups', 'strength', 'upper_body', 0.06, '상체 근력 운동의 기본', 'beginner', '{}', '{"chest", "shoulders", "triceps"}'),
('벤치프레스', 'Bench Press', 'strength', 'upper_body', 0.05, '가슴 근육 강화 운동', 'intermediate', '{"barbell", "bench"}', '{"chest", "shoulders", "triceps"}'),
('풀업', 'Pull-ups', 'strength', 'upper_body', 0.07, '등과 팔 근력 강화', 'advanced', '{"pull_up_bar"}', '{"back", "biceps"}'),
('덤벨 컬', 'Dumbbell Curl', 'strength', 'upper_body', 0.04, '이두근 강화 운동', 'beginner', '{"dumbbells"}', '{"biceps"}'),
('숄더 프레스', 'Shoulder Press', 'strength', 'upper_body', 0.05, '어깨 근력 강화', 'intermediate', '{"dumbbells"}', '{"shoulders", "triceps"}');

-- 근력 운동 - 하체
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
('스쿼트', 'Squats', 'strength', 'lower_body', 0.06, '하체 근력의 기본 운동', 'beginner', '{}', '{"quadriceps", "glutes", "hamstrings"}'),
('런지', 'Lunges', 'strength', 'lower_body', 0.05, '다리와 엉덩이 근력 강화', 'beginner', '{}', '{"quadriceps", "glutes", "hamstrings"}'),
('데드리프트', 'Deadlift', 'strength', 'lower_body', 0.07, '전신 근력 강화의 핵심', 'advanced', '{"barbell"}', '{"hamstrings", "glutes", "back", "core"}'),
('레그 프레스', 'Leg Press', 'strength', 'lower_body', 0.05, '하체 근력 강화 머신 운동', 'intermediate', '{"leg_press_machine"}', '{"quadriceps", "glutes"}'),
('카프 레이즈', 'Calf Raises', 'strength', 'lower_body', 0.03, '종아리 근력 강화', 'beginner', '{}', '{"calves"}');

-- 코어 운동
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
('플랭크', 'Plank', 'strength', 'core', 0.04, '코어 안정성 강화', 'beginner', '{}', '{"core", "shoulders"}'),
('크런치', 'Crunches', 'strength', 'core', 0.04, '복근 강화 운동', 'beginner', '{}', '{"abs"}'),
('마운틴 클라이머', 'Mountain Climbers', 'strength', 'core', 0.08, '코어와 유산소를 결합한 운동', 'intermediate', '{}', '{"core", "shoulders", "legs"}'),
('러시안 트위스트', 'Russian Twists', 'strength', 'core', 0.05, '복사근 강화 운동', 'intermediate', '{}', '{"obliques", "core"}'),
('레그 레이즈', 'Leg Raises', 'strength', 'core', 0.04, '하복부 강화 운동', 'intermediate', '{}', '{"lower_abs", "hip_flexors"}');

-- 유연성 운동
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
('요가', 'Yoga', 'flexibility', 'full_body', 0.03, '전신 유연성과 균형 향상', 'beginner', '{"yoga_mat"}', '{"full_body"}'),
('스트레칭', 'Stretching', 'flexibility', 'full_body', 0.02, '근육 이완과 유연성 향상', 'beginner', '{}', '{"full_body"}'),
('필라테스', 'Pilates', 'flexibility', 'core', 0.04, '코어 강화와 유연성 향상', 'intermediate', '{"mat"}', '{"core", "full_body"}'),
('폼롤링', 'Foam Rolling', 'flexibility', 'recovery', 0.02, '근막 이완과 회복', 'beginner', '{"foam_roller"}', '{"full_body"}');

-- 스포츠 활동
INSERT INTO public.exercises (name, name_en, category, subcategory, calories_per_kg_per_minute, description, difficulty_level, equipment, muscle_groups) VALUES
('농구', 'Basketball', 'sports', 'team_sport', 0.09, '팀 스포츠 활동', 'intermediate', '{"basketball", "court"}', '{"full_body", "cardiovascular"}'),
('축구', 'Soccer', 'sports', 'team_sport', 0.10, '전신 운동과 지구력 향상', 'intermediate', '{"soccer_ball", "field"}', '{"legs", "cardiovascular"}'),
('테니스', 'Tennis', 'sports', 'racket_sport', 0.08, '순발력과 지구력 향상', 'intermediate', '{"tennis_racket", "court"}', '{"arms", "legs", "core"}'),
('배드민턴', 'Badminton', 'sports', 'racket_sport', 0.07, '민첩성과 반응속도 향상', 'beginner', '{"badminton_racket", "court"}', '{"arms", "legs", "core"}'),
('탁구', 'Table Tennis', 'sports', 'racket_sport', 0.05, '반응속도와 집중력 향상', 'beginner', '{"ping_pong_paddle", "table"}', '{"arms", "core"}')