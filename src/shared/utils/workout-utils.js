/* ===========================================
   운동 관련 JavaScript 유틸리티
   =========================================== */

// 운동 루틴 관리
export const WorkoutUtils = {
  // 운동 루틴 생성
  generateRoutine: async (aiApi, profileData) => {
    try {
      console.log('AI 루틴 생성 시작:', profileData);
      const result = await aiApi.generateRoutine(profileData);
      console.log('AI 루틴 생성 완료:', result);
      return result;
    } catch (error) {
      console.error('AI 루틴 생성 실패:', error);
      throw new Error('루틴 생성 중 오류가 발생했습니다.');
    }
  },

  // 운동 타입별 아이콘 가져오기
  getExerciseIcon: (exerciseType) => {
    const iconMap = {
      '상체': '💪',
      '하체': '🦵',
      '코어': '🔥',
      '유산소': '🏃',
      '스트레칭': '🧘',
      '전신': '🏋️',
      '휴식': '🛌'
    };
    return iconMap[exerciseType] || '💪';
  },

  // 운동 시간 포맷팅
  formatWorkoutTime: (minutes) => {
    if (minutes < 60) {
      return `${minutes}분`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
    }
  },

  // 운동 강도 계산
  calculateIntensity: (exerciseCount, totalTime) => {
    const intensityScore = (exerciseCount * 10) + (totalTime * 0.5);
    
    if (intensityScore < 30) return { level: '낮음', color: '#10b981' };
    if (intensityScore < 60) return { level: '보통', color: '#f59e0b' };
    return { level: '높음', color: '#ef4444' };
  },

  // 주간 운동 통계
  getWeeklyStats: (weeklyRoutine) => {
    let totalWorkoutDays = 0;
    let totalExercises = 0;
    let totalTime = 0;
    let restDays = 0;

    Object.values(weeklyRoutine).forEach(dayRoutine => {
      if (dayRoutine.type === '휴식') {
        restDays++;
      } else {
        totalWorkoutDays++;
        totalExercises += dayRoutine.exercises ? dayRoutine.exercises.length : 0;
        
        // 시간 파싱 (예: "45분" → 45)
        const timeMatch = dayRoutine.total_time?.match(/(\d+)/);
        if (timeMatch) {
          totalTime += parseInt(timeMatch[1]);
        }
      }
    });

    return {
      totalWorkoutDays,
      totalExercises,
      totalTime: WorkoutUtils.formatWorkoutTime(totalTime),
      restDays,
      averageExercisesPerDay: totalWorkoutDays > 0 ? Math.round(totalExercises / totalWorkoutDays) : 0
    };
  },

  // 운동 추천사항 카테고리별 분류
  categorizeRecommendations: (recommendations) => {
    const categories = {
      safety: [],      // 안전 관련
      nutrition: [],   // 영양 관련
      recovery: [],    // 회복 관련
      technique: [],   // 기술 관련
      general: []      // 일반
    };

    recommendations.forEach(rec => {
      const lowerRec = rec.toLowerCase();
      
      if (lowerRec.includes('안전') || lowerRec.includes('부상') || lowerRec.includes('워밍업')) {
        categories.safety.push(rec);
      } else if (lowerRec.includes('영양') || lowerRec.includes('단백질') || lowerRec.includes('수분')) {
        categories.nutrition.push(rec);
      } else if (lowerRec.includes('휴식') || lowerRec.includes('수면') || lowerRec.includes('회복')) {
        categories.recovery.push(rec);
      } else if (lowerRec.includes('자세') || lowerRec.includes('기술') || lowerRec.includes('폼')) {
        categories.technique.push(rec);
      } else {
        categories.general.push(rec);
      }
    });

    return categories;
  }
};