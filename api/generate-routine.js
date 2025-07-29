export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fitness_level, goal, available_days, time_per_session, preferred_days = [] } = req.body

    console.log('AI 루틴 생성 요청 받음:', {
      fitness_level,
      goal,
      available_days,
      time_per_session,
      preferred_days
    })

    // 선호 요일을 영어로 변환
    const dayMapping = {
      '월요일': 'monday',
      '화요일': 'tuesday', 
      '수요일': 'wednesday',
      '목요일': 'thursday',
      '금요일': 'friday',
      '토요일': 'saturday',
      '일요일': 'sunday'
    }

    const preferredDaysEn = preferred_days.map(day => dayMapping[day] || day.toLowerCase())
    
    // 운동 타입을 목표에 따라 결정
    const getWorkoutTypes = (goal, level) => {
      const workoutTypes = {
        weight_loss: ['cardio', 'strength', 'hiit'],
        muscle_gain: ['strength', 'strength', 'cardio'],
        maintenance: ['cardio', 'strength', 'flexibility'],
        endurance: ['cardio', 'cardio', 'strength']
      }
      return workoutTypes[goal] || ['cardio', 'strength', 'flexibility']
    }

    // 운동 강도를 레벨에 따라 조정
    const getIntensity = (level) => {
      const intensities = {
        beginner: { reps: '10-12회', sets: '2-3세트', duration: '20-30분' },
        intermediate: { reps: '12-15회', sets: '3-4세트', duration: '30-45분' },
        advanced: { reps: '15-20회', sets: '4-5세트', duration: '45-60분' }
      }
      return intensities[level] || intensities.beginner
    }

    const intensity = getIntensity(fitness_level)
    const workoutTypes = getWorkoutTypes(goal, fitness_level)

    // 선호 요일이 있으면 해당 요일에 운동 배치, 없으면 기본 스케줄
    const defaultDays = ['monday', 'wednesday', 'friday']
    const scheduleDays = preferredDaysEn.length > 0 ? 
      preferredDaysEn.slice(0, available_days) : 
      defaultDays.slice(0, available_days)

    // 주간 루틴 생성
    const weekly_routine = {}
    
    scheduleDays.forEach((day, index) => {
      const workoutType = workoutTypes[index % workoutTypes.length]
      
      let exercises = []
      
      if (workoutType === 'cardio') {
        exercises = [
          { type: 'cardio', name: '유산소 운동', duration: `${Math.floor(time_per_session * 0.7)}분` },
          { type: 'stretch', name: '스트레칭', duration: `${Math.floor(time_per_session * 0.3)}분` }
        ]
      } else if (workoutType === 'strength') {
        exercises = [
          { type: 'strength', name: '스쿼트', sets: intensity.sets, reps: intensity.reps },
          { type: 'strength', name: '푸시업', sets: intensity.sets, reps: intensity.reps },
          { type: 'strength', name: '플랭크', duration: `${Math.floor(time_per_session / 10)}분 x ${intensity.sets.split('-')[0]}세트` },
          { type: 'stretch', name: '마무리 스트레칭', duration: '10분' }
        ]
      } else if (workoutType === 'hiit') {
        exercises = [
          { type: 'hiit', name: 'HIIT 운동', duration: `${Math.floor(time_per_session * 0.6)}분` },
          { type: 'strength', name: '코어 운동', sets: intensity.sets, reps: intensity.reps },
          { type: 'stretch', name: '쿨다운', duration: `${Math.floor(time_per_session * 0.2)}분` }
        ]
      } else {
        exercises = [
          { type: 'stretch', name: '요가/스트레칭', duration: `${Math.floor(time_per_session * 0.8)}분` },
          { type: 'cardio', name: '가벼운 유산소', duration: `${Math.floor(time_per_session * 0.2)}분` }
        ]
      }

      weekly_routine[day] = {
        type: workoutType,
        total_time: `${time_per_session}분`,
        exercises
      }
    })

    // 목표별 추천사항
    const getRecommendations = (goal, level) => {
      const baseRecommendations = [
        '규칙적인 운동 습관을 만들어보세요!',
        '충분한 휴식과 영양 섭취를 잊지 마세요.',
        '점진적으로 운동 강도를 높여가세요.'
      ]

      const goalSpecific = {
        weight_loss: [
          '유산소 운동과 근력 운동을 병행하세요.',
          '식단 관리도 함께 진행하면 더 효과적입니다.',
          '꾸준한 칼로리 소모가 중요합니다.'
        ],
        muscle_gain: [
          '단백질 섭취를 충분히 하세요.',
          '근력 운동 후 적절한 휴식을 취하세요.',
          '점진적으로 중량을 늘려가세요.'
        ],
        maintenance: [
          '현재 체중을 유지하며 건강을 관리하세요.',
          '다양한 운동을 통해 전신 균형을 맞추세요.',
          '스트레스 관리도 중요합니다.'
        ],
        endurance: [
          '심폐 지구력 향상에 집중하세요.',
          '운동 강도를 서서히 높여가세요.',
          '충분한 수분 섭취를 하세요.'
        ]
      }

      return [...baseRecommendations, ...(goalSpecific[goal] || [])]
    }

    const routine = {
      user_profile: {
        fitness_level,
        goal,
        available_days,
        time_per_session,
        preferred_days
      },
      weekly_routine,
      recommendations: getRecommendations(goal, fitness_level),
      generated_at: new Date().toISOString(),
      schedule_info: {
        total_days: available_days,
        preferred_days: preferred_days,
        scheduled_days: scheduleDays
      }
    }

    console.log('생성된 루틴:', routine)
    res.status(200).json(routine)
  } catch (error) {
    console.error('루틴 생성 오류:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
} 