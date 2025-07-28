import axios from 'axios'

// API 클라이언트 설정
// 배포된 환경에서는 현재 도메인을 사용하고, 로컬에서는 localhost:8000 사용
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  // 배포된 환경에서는 현재 도메인 사용
  if (window.location.hostname !== 'localhost') {
    return window.location.origin
  }
  
  // 로컬 개발 환경
  return 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청/응답 타입 정의
export interface UserProfile {
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance'
  available_days: number
  time_per_session: number
  preferred_days?: string[]
}

export interface WeightRecord {
  date: string
  weight: number
}

export interface WeightPredictionRequest {
  weight_data: WeightRecord[]
  days_ahead: number
}

export interface WeightPrediction {
  date: string
  predicted_weight: number
}

export interface WorkoutRoutine {
  user_profile: UserProfile
  weekly_routine: {
    [day: string]: {
      type: string
      total_time?: string
      exercises: Array<{
        type: string
        name: string
        duration?: string
        sets?: string
        intensity?: string
      }>
    }
  }
  recommendations: string[]
}

// AI API 함수들
export const aiApi = {
  // 운동 루틴 생성
  generateRoutine: async (profile: UserProfile): Promise<WorkoutRoutine> => {
    console.log('API 클라이언트 호출:', profile)
    try {
      const response = await apiClient.post('/api/generate-routine', profile)
      console.log('API 응답 성공:', response.data)
      return response.data
    } catch (error) {
      console.error('API 호출 실패:', error)
      throw error
    }
  },

  // 체중 예측
  predictWeight: async (request: WeightPredictionRequest): Promise<{
    predictions: WeightPrediction[]
    input_data_count: number
    prediction_days: number
  }> => {
    const response = await apiClient.post('/api/predict-weight', request)
    return response.data
  },

  // AI 모델 테스트
  testModels: async () => {
    const response = await apiClient.get('/api/health')
    return response.data
  }
}

// 일반 API 함수들
export const api = {
  // 헬스 체크
  healthCheck: async () => {
    const response = await apiClient.get('/api/health')
    return response.data
  }
}