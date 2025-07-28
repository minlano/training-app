export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fitness_level, goal, available_days, time_per_session } = req.body

    // 간단한 AI 로직 (실제로는 더 복잡한 알고리즘 사용)
    const routine = {
      user_profile: {
        fitness_level,
        goal,
        available_days,
        time_per_session
      },
      weekly_routine: {
        monday: {
          type: 'cardio',
          total_time: '30분',
          exercises: [
            { type: 'cardio', name: '조깅', duration: '20분' },
            { type: 'strength', name: '스쿼트', sets: '3세트', reps: '15회' }
          ]
        },
        wednesday: {
          type: 'strength',
          total_time: '45분',
          exercises: [
            { type: 'strength', name: '푸시업', sets: '3세트', reps: '10회' },
            { type: 'strength', name: '플랭크', duration: '1분 x 3세트' }
          ]
        },
        friday: {
          type: 'flexibility',
          total_time: '30분',
          exercises: [
            { type: 'stretch', name: '요가 스트레칭', duration: '20분' },
            { type: 'cardio', name: '걷기', duration: '10분' }
          ]
        }
      },
      recommendations: [
        '규칙적인 운동 습관을 만들어보세요!',
        '충분한 휴식과 영양 섭취를 잊지 마세요.',
        '점진적으로 운동 강도를 높여가세요.'
      ]
    }

    res.status(200).json(routine)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
} 