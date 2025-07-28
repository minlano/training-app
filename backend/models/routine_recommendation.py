# 운동 루틴 추천 모델
from typing import Dict, List
import random

class RoutineRecommendationModel:
    def __init__(self):
        self.exercise_database = {
            "cardio": {
                "beginner": ["걷기", "실내자전거", "수영", "요가"],
                "intermediate": ["조깅", "사이클링", "댄스", "계단오르기"],
                "advanced": ["러닝", "HIIT", "크로스핏", "복싱"]
            },
            "strength": {
                "beginner": ["팔굽혀펴기", "스쿼트", "플랭크", "런지"],
                "intermediate": ["덤벨운동", "바벨운동", "풀업", "딥스"],
                "advanced": ["데드리프트", "벤치프레스", "스쿼트(바벨)", "오버헤드프레스"]
            },
            "flexibility": {
                "all": ["스트레칭", "요가", "필라테스", "폼롤링"]
            }
        }
        
        self.goal_focus = {
            "weight_loss": {"cardio": 0.6, "strength": 0.3, "flexibility": 0.1},
            "muscle_gain": {"cardio": 0.15, "strength": 0.75, "flexibility": 0.1},
            "maintenance": {"cardio": 0.4, "strength": 0.4, "flexibility": 0.2},
            "endurance": {"cardio": 0.7, "strength": 0.2, "flexibility": 0.1}
        }
    
    def generate_weekly_routine(self, user_profile: Dict) -> Dict:
        """사용자 프로필 기반 주간 운동 루틴 생성"""
        
        # 사용자 정보 추출
        fitness_level = user_profile.get('fitness_level', 'beginner')
        goal = user_profile.get('goal', 'maintenance')
        available_days = user_profile.get('available_days', 3)
        time_per_session = user_profile.get('time_per_session', 60)  # 분
        preferred_days = user_profile.get('preferred_days', [])  # 선호 요일
        
        # 목표에 따른 운동 비율
        focus = self.goal_focus[goal]
        
        weekly_routine = {}
        days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
        
        # 선호 요일을 우선적으로 활용
        if preferred_days:
            # 선호 요일이 충분하면 그대로 사용
            if len(preferred_days) >= available_days:
                workout_days = preferred_days[:available_days]
            else:
                # 선호 요일을 우선 사용하고 부족한 만큼 다른 요일 추가
                remaining_days = [day for day in days if day not in preferred_days]
                additional_days = random.sample(remaining_days, available_days - len(preferred_days))
                workout_days = preferred_days + additional_days
        else:
            # 선호 요일이 없으면 랜덤 선택
            workout_days = random.sample(days, min(available_days, 7))
        
        # 근육 증가 목표일 때 특별한 루틴 구성
        if goal == 'muscle_gain':
            workout_days = self._optimize_muscle_gain_schedule(workout_days, available_days)
        
        for i, day in enumerate(workout_days):
            routine = self._generate_daily_routine(
                fitness_level, focus, time_per_session, i, goal
            )
            weekly_routine[day] = routine
        
        # 휴식일 추가
        for day in days:
            if day not in weekly_routine:
                weekly_routine[day] = {"type": "휴식", "exercises": []}
        
        return {
            "user_profile": user_profile,
            "weekly_routine": weekly_routine,
            "recommendations": self._generate_recommendations(user_profile)
        }
    
    def _optimize_muscle_gain_schedule(self, workout_days: List[str], available_days: int) -> List[str]:
        """근육 증가 목표를 위한 최적 스케줄 조정"""
        days_order = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
        
        if available_days >= 4:
            # 4일 이상이면 상체/하체 분할 가능
            return workout_days
        elif available_days == 3:
            # 3일이면 전신 운동으로 구성하되 하루씩 간격
            optimal_3day = ['월요일', '수요일', '금요일']
            return [day for day in optimal_3day if day in workout_days] + \
                   [day for day in workout_days if day not in optimal_3day][:3]
        else:
            return workout_days
    
    def _generate_daily_routine(self, fitness_level: str, focus: Dict, 
                              time_per_session: int, day_index: int, goal: str = 'maintenance') -> Dict:
        """일일 운동 루틴 생성"""
        
        # 시간 배분
        cardio_time = int(time_per_session * focus['cardio'])
        strength_time = int(time_per_session * focus['strength'])
        flexibility_time = int(time_per_session * focus['flexibility'])
        
        exercises = []
        
        # 유산소 운동
        if cardio_time > 0:
            cardio_exercises = self.exercise_database['cardio'][fitness_level]
            selected_cardio = random.choice(cardio_exercises)
            exercises.append({
                "type": "유산소",
                "name": selected_cardio,
                "duration": f"{cardio_time}분",
                "intensity": self._get_intensity(fitness_level)
            })
        
        # 근력 운동 (근육 증가 목표일 때 특별 처리)
        if strength_time > 0:
            if goal == 'muscle_gain':
                exercises.extend(self._generate_muscle_gain_routine(fitness_level, strength_time, day_index))
            else:
                strength_exercises = self.exercise_database['strength'][fitness_level]
                num_exercises = min(3, strength_time // 15)  # 15분당 1개 운동
                selected_strength = random.sample(strength_exercises, 
                                                min(num_exercises, len(strength_exercises)))
                
                for exercise in selected_strength:
                    exercises.append({
                        "type": "근력",
                        "name": exercise,
                        "sets": self._get_sets_reps(fitness_level),
                        "rest": "60-90초"
                    })
        
        # 유연성 운동
        if flexibility_time > 0:
            flexibility_exercises = self.exercise_database['flexibility']['all']
            selected_flexibility = random.choice(flexibility_exercises)
            exercises.append({
                "type": "유연성",
                "name": selected_flexibility,
                "duration": f"{flexibility_time}분"
            })
        
        return {
            "type": "운동",
            "total_time": f"{time_per_session}분",
            "exercises": exercises
        }
    
    def _get_intensity(self, fitness_level: str) -> str:
        intensity_map = {
            "beginner": "낮음",
            "intermediate": "중간",
            "advanced": "높음"
        }
        return intensity_map.get(fitness_level, "중간")
    
    def _get_sets_reps(self, fitness_level: str) -> str:
        sets_reps_map = {
            "beginner": "2세트 x 8-12회",
            "intermediate": "3세트 x 10-15회",
            "advanced": "4세트 x 12-20회"
        }
        return sets_reps_map.get(fitness_level, "3세트 x 10-15회")
    
    def _generate_muscle_gain_routine(self, fitness_level: str, strength_time: int, day_index: int) -> List[Dict]:
        """근육 증가 목표를 위한 특화 루틴 생성"""
        exercises = []
        
        # 근육 증가를 위한 운동 분할
        muscle_split = {
            0: {"focus": "상체", "exercises": ["팔굽혀펴기", "벤치프레스", "덤벨 컬", "숄더 프레스"]},
            1: {"focus": "하체", "exercises": ["스쿼트", "런지", "데드리프트", "카프 레이즈"]},
            2: {"focus": "전신", "exercises": ["데드리프트", "스쿼트", "풀업", "플랭크"]}
        }
        
        split_index = day_index % 3
        day_focus = muscle_split[split_index]
        
        # 수준별 운동 선택
        available_exercises = []
        if fitness_level == 'beginner':
            available_exercises = [ex for ex in day_focus["exercises"] 
                                 if ex in ["팔굽혀펴기", "스쿼트", "런지", "플랭크"]]
        elif fitness_level == 'intermediate':
            available_exercises = [ex for ex in day_focus["exercises"] 
                                 if ex not in ["데드리프트", "벤치프레스"]]
        else:
            available_exercises = day_focus["exercises"]
        
        # 운동 개수 결정 (시간에 따라)
        num_exercises = min(len(available_exercises), max(3, strength_time // 12))
        selected_exercises = random.sample(available_exercises, 
                                         min(num_exercises, len(available_exercises)))
        
        for exercise in selected_exercises:
            # 근육 증가를 위한 더 높은 세트/반복 수
            muscle_sets_reps = {
                "beginner": "3세트 x 8-12회",
                "intermediate": "4세트 x 8-12회", 
                "advanced": "4-5세트 x 6-10회"
            }
            
            exercises.append({
                "type": "근력",
                "name": exercise,
                "sets": muscle_sets_reps[fitness_level],
                "rest": "90-120초",
                "focus": day_focus["focus"]
            })
        
        return exercises
    
    def _generate_recommendations(self, user_profile: Dict) -> List[str]:
        """개인화된 추천사항 생성"""
        recommendations = []
        
        goal = user_profile.get('goal', 'maintenance')
        fitness_level = user_profile.get('fitness_level', 'beginner')
        available_days = user_profile.get('available_days', 3)
        preferred_days = user_profile.get('preferred_days', [])
        
        if goal == 'weight_loss':
            recommendations.extend([
                "유산소 운동 후 근력 운동을 하면 지방 연소에 더 효과적입니다",
                "운동 전후 충분한 수분 섭취를 권장합니다",
                "일주일에 150분 이상의 중강도 유산소 운동을 권장합니다"
            ])
        elif goal == 'muscle_gain':
            recommendations.extend([
                "근력 운동 후 30분 내 단백질 섭취를 권장합니다 (체중 1kg당 1.6-2.2g)",
                "충분한 휴식과 수면이 근육 성장에 중요합니다 (7-9시간)",
                "같은 근육군은 48-72시간 휴식 후 다시 운동하세요",
                "점진적 과부하 원칙을 적용하여 중량이나 반복수를 점차 늘려가세요"
            ])
            if available_days >= 4:
                recommendations.append("4일 이상 운동 시 상체/하체 분할 훈련을 추천합니다")
        elif goal == 'endurance':
            recommendations.extend([
                "심박수를 모니터링하며 목표 심박수 구간에서 운동하세요",
                "장시간 운동 시 중간중간 수분과 전해질을 보충하세요"
            ])
        
        if fitness_level == 'beginner':
            recommendations.append("처음에는 무리하지 말고 점진적으로 강도를 높여가세요")
        elif fitness_level == 'advanced':
            recommendations.append("고강도 운동 시 부상 예방을 위한 충분한 워밍업을 하세요")
        
        # 선호 요일 관련 추천사항
        if preferred_days:
            recommendations.append(f"선택하신 선호 요일({', '.join(preferred_days)})에 맞춰 운동 계획을 구성했습니다.")
            if len(preferred_days) < available_days:
                recommendations.append("선호 요일이 부족한 경우 다른 요일도 추가로 배정했습니다.")
        else:
            recommendations.append("프로필에서 선호하는 운동 요일을 설정하면 더 맞춤형 루틴을 제공할 수 있습니다.")
        
        return recommendations