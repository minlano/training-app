from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import sys
import os

# 모델 import를 위한 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.routine_recommendation import RoutineRecommendationModel
from models.weight_prediction_model import WeightPredictionModel

router = APIRouter(prefix="/ai", tags=["AI"])

# 요청 모델들
class UserProfile(BaseModel):
    fitness_level: str = "beginner"  # beginner, intermediate, advanced
    goal: str = "maintenance"  # weight_loss, muscle_gain, maintenance
    available_days: int = 3
    time_per_session: int = 60
    preferred_days: List[str] = []  # 선호 요일

class WeightRecord(BaseModel):
    date: str  # YYYY-MM-DD 형식
    weight: float

class WeightPredictionRequest(BaseModel):
    weight_data: List[WeightRecord]
    days_ahead: int = 14

# AI 모델 인스턴스
routine_model = RoutineRecommendationModel()

@router.post("/generate-routine")
async def generate_workout_routine(profile: UserProfile):
    """사용자 프로필 기반 운동 루틴 생성"""
    try:
        user_profile = {
            "fitness_level": profile.fitness_level,
            "goal": profile.goal,
            "available_days": profile.available_days,
            "time_per_session": profile.time_per_session,
            "preferred_days": profile.preferred_days
        }
        
        routine = routine_model.generate_weekly_routine(user_profile)
        return routine
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"루틴 생성 중 오류 발생: {str(e)}")

@router.post("/predict-weight")
async def predict_weight(request: WeightPredictionRequest):
    """체중 예측"""
    try:
        # 데이터 변환
        weight_data = [
            {"date": record.date, "weight": record.weight}
            for record in request.weight_data
        ]
        
        if len(weight_data) < 5:
            raise HTTPException(
                status_code=400, 
                detail="체중 예측을 위해서는 최소 5개의 데이터가 필요합니다"
            )
        
        # 모델 학습 및 예측
        model = WeightPredictionModel()
        model.train(weight_data)
        predictions = model.predict_future_weight(weight_data, request.days_ahead)
        
        return {
            "predictions": predictions,
            "input_data_count": len(weight_data),
            "prediction_days": request.days_ahead
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"체중 예측 중 오류 발생: {str(e)}")

@router.get("/test")
async def test_ai_models():
    """AI 모델 테스트"""
    try:
        # 루틴 추천 테스트
        test_profile = {
            "fitness_level": "beginner",
            "goal": "weight_loss",
            "available_days": 3,
            "time_per_session": 45
        }
        
        routine = routine_model.generate_weekly_routine(test_profile)
        
        # 체중 예측 테스트 (샘플 데이터)
        sample_weight_data = [
            {"date": "2025-01-01", "weight": 70.0},
            {"date": "2025-01-02", "weight": 69.8},
            {"date": "2025-01-03", "weight": 69.5},
            {"date": "2025-01-04", "weight": 69.7},
            {"date": "2025-01-05", "weight": 69.3},
            {"date": "2025-01-06", "weight": 69.1},
            {"date": "2025-01-07", "weight": 68.9}
        ]
        
        weight_model = WeightPredictionModel()
        weight_model.train(sample_weight_data)
        weight_predictions = weight_model.predict_future_weight(sample_weight_data, 7)
        
        return {
            "routine_test": {
                "status": "success",
                "sample_routine": routine
            },
            "weight_prediction_test": {
                "status": "success",
                "sample_predictions": weight_predictions[:3]  # 처음 3개만 반환
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 모델 테스트 중 오류 발생: {str(e)}")