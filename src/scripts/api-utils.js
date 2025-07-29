/* ===========================================
   API 관련 JavaScript 유틸리티
   =========================================== */

// API 연결 상태 관리
export const ApiUtils = {
  // API 연결 테스트
  testConnection: async (api) => {
    try {
      await api.healthCheck();
      console.log('API 연결 성공');
      return true;
    } catch (error) {
      console.error('API 연결 실패:', error);
      return false;
    }
  },

  // 프로필 데이터 변환 (DB → AI API 형식)
  transformProfileData: (profile) => {
    return {
      fitness_level: profile.fitness_level,
      goal: profile.primary_goal,
      available_days: profile.available_days_per_week,
      time_per_session: profile.preferred_workout_duration,
      preferred_days: profile.preferred_days || []
    };
  },

  // 샘플 프로필 생성
  createSampleProfile: () => {
    return {
      fitness_level: 'beginner',
      goal: 'weight_loss',
      available_days: 3,
      time_per_session: 45
    };
  },

  // 선호 요일 포맷팅
  formatPreferredDays: (preferredDays) => {
    console.log('선호 요일 포맷팅:', preferredDays);
    
    if (preferredDays && Array.isArray(preferredDays) && preferredDays.length > 0) {
      return preferredDays.join(', ');
    } else if (preferredDays && typeof preferredDays === 'string' && preferredDays.length > 0) {
      return preferredDays;
    } else {
      return '설정 안됨';
    }
  },

  // 에러 메시지 처리
  handleApiError: (error, context = '') => {
    console.error(`${context} API 에러:`, error);
    
    if (error.message) {
      return `오류가 발생했습니다: ${error.message}`;
    } else {
      return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
    }
  },

  // 로딩 상태 관리
  withLoading: async (asyncFunction, setLoading) => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }
};