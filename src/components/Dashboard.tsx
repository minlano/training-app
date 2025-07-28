import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PageHeader, Card, CardHeader, CardTitle, CardContent } from './ui'

interface CustomUser {
  id: string
  email: string
  created_at: string
}

interface DashboardProps {
  user: CustomUser
}

interface DashboardStats {
  totalWorkouts: number
  totalCalories: number
  totalMinutes: number
  currentWeight?: number
  weightChange?: number
  recentWorkouts: any[]
  weeklyStats: {
    thisWeek: number
    lastWeek: number
  }
  goalProgress: {
    targetWeight?: number
    currentWeight?: number
    progress?: number
  }
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkouts: 0,
    totalCalories: 0,
    totalMinutes: 0,
    recentWorkouts: [],
    weeklyStats: { thisWeek: 0, lastWeek: 0 },
    goalProgress: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // 병렬로 데이터 조회
      const [workoutStats, weightStats, recentWorkouts] = await Promise.all([
        fetchWorkoutStats(),
        fetchWeightStats(),
        fetchRecentWorkouts()
      ])

      setStats({
        ...workoutStats,
        ...weightStats,
        goalProgress: {
          targetWeight: undefined,
          currentWeight: weightStats.currentWeight,
          progress: undefined
        },
        recentWorkouts
      })
    } catch (error) {
      console.error('대시보드 데이터 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkoutStats = async () => {
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('total_duration, total_calories_burned, workout_date, created_at')
      .eq('account_id', user.id)
      .order('workout_date', { ascending: false })

    if (error) throw error

    const totalWorkouts = workouts?.length || 0
    const totalCalories = workouts?.reduce((sum, w) => sum + (w.total_calories_burned || 0), 0) || 0
    const totalMinutes = workouts?.reduce((sum, w) => sum + (w.total_duration || 0), 0) || 0

    // 주간 통계
    const now = new Date()
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000)

    const thisWeek = workouts?.filter(w =>
      new Date(w.workout_date) >= thisWeekStart
    ).length || 0

    const lastWeek = workouts?.filter(w => {
      const workoutDate = new Date(w.workout_date)
      return workoutDate >= lastWeekStart && workoutDate < thisWeekStart
    }).length || 0

    return {
      totalWorkouts,
      totalCalories,
      totalMinutes,
      weeklyStats: { thisWeek, lastWeek }
    }
  }

  const fetchWeightStats = async () => {
    const { data: weights, error } = await supabase
      .from('weight_records')
      .select('weight, record_date')
      .eq('account_id', user.id)
      .order('record_date', { ascending: false })
      .limit(2)

    if (error) throw error

    const currentWeight = weights?.[0]?.weight
    const previousWeight = weights?.[1]?.weight
    const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : undefined

    return { currentWeight, weightChange }
  }



  const fetchRecentWorkouts = async () => {
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select(`
        id,
        title,
        workout_date,
        total_duration,
        total_calories_burned,
        workout_exercises (
          exercises (name)
        )
      `)
      .eq('account_id', user.id)
      .order('workout_date', { ascending: false })
      .limit(5)

    if (error) throw error
    return workouts || []
  }



  const getMotivationalMessage = () => {
    const messages = [
      "오늘도 건강한 하루 보내세요! 💪",
      "꾸준함이 가장 큰 힘입니다! 🌟",
      "작은 변화가 큰 결과를 만듭니다! 🚀",
      "당신의 노력이 결실을 맺고 있어요! 🎯",
      "건강한 습관이 최고의 투자입니다! 💎"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">대시보드 로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full" style={{ color: '#ffffff' }}>
      {/* 환영 메시지 */}
      <PageHeader
        title="🚀 완전히 새로운 Dashboard! 🚀"
        subtitle={`${getMotivationalMessage()} - 새로운 UI가 적용되었습니다!`}
        icon="📊"
        gradient="linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)"
      >
        <div className="text-sm font-semibold" style={{ color: '#ffff00' }}>
          ⚡ API 연결 상태: {loading ? '로딩 중...' : '연결됨'} ⚡
        </div>
      </PageHeader>

      {/* 주요 통계 - 모던 카드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 운동 통계 카드 */}
        <Card borderColor="#3b82f6">
          <CardHeader>
            <CardTitle>🏋️ 운동 통계</CardTitle>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span style={{ color: '#d1d5db' }}>총 운동 횟수</span>
              <span className="text-xl font-bold" style={{ color: '#ffffff' }}>{stats.totalWorkouts}회</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: '#d1d5db' }}>총 소모 칼로리</span>
              <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>{stats.totalCalories.toLocaleString()}kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: '#d1d5db' }}>총 운동 시간</span>
              <span className="text-xl font-bold" style={{ color: '#10b981' }}>{Math.round(stats.totalMinutes / 60)}시간</span>
            </div>
          </CardContent>
        </Card>

        {/* 체중 관리 카드 */}
        <Card borderColor="#8b5cf6">
          <CardHeader>
            <CardTitle>⚖️ 체중 관리</CardTitle>
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: '#ffffff' }}>
                {stats.currentWeight ? `${stats.currentWeight.toFixed(1)}kg` : '미기록'}
              </div>
              <p style={{ color: '#d1d5db' }}>현재 체중</p>
            </div>
            {stats.weightChange && (
              <div className="text-center">
                <div className={`text-lg font-semibold flex items-center justify-center gap-2`} 
                     style={{ color: stats.weightChange > 0 ? '#dc2626' : '#059669' }}>
                  <span>{stats.weightChange > 0 ? '↗️' : '↘️'}</span>
                  <span>{Math.abs(stats.weightChange).toFixed(1)}kg</span>
                </div>
                <p style={{ color: '#9ca3af' }}>지난 기록 대비</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 주간 비교 및 목표 진행률 - 모던 카드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* 주간 운동 비교 */}
        <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>📊 주간 운동 비교</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span style={{ color: '#d1d5db' }}>이번 주</span>
                <span className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{stats.weeklyStats.thisWeek}회</span>
              </div>
              <div className="h-3 rounded-full" style={{ backgroundColor: '#374151' }}>
                <div
                  style={{ 
                    width: `${Math.min(100, (stats.weeklyStats.thisWeek / 7) * 100)}%`,
                    backgroundColor: '#3b82f6'
                  }}
                  className="h-full rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span style={{ color: '#d1d5db' }}>지난 주</span>
                <span className="text-2xl font-bold" style={{ color: '#6b7280' }}>{stats.weeklyStats.lastWeek}회</span>
              </div>
              <div className="h-3 rounded-full" style={{ backgroundColor: '#374151' }}>
                <div
                  style={{ 
                    width: `${Math.min(100, (stats.weeklyStats.lastWeek / 7) * 100)}%`,
                    backgroundColor: '#6b7280'
                  }}
                  className="h-full rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid #374151' }}>
              <div className="text-center">
                {stats.weeklyStats.thisWeek > stats.weeklyStats.lastWeek ? (
                  <div>
                    <div className="text-2xl mb-2">📈</div>
                    <p className="text-sm font-medium" style={{ color: '#10b981' }}>
                      지난 주보다 {stats.weeklyStats.thisWeek - stats.weeklyStats.lastWeek}회 더 운동했어요!
                    </p>
                  </div>
                ) : stats.weeklyStats.thisWeek < stats.weeklyStats.lastWeek ? (
                  <div>
                    <div className="text-2xl mb-2">📉</div>
                    <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                      지난 주보다 {stats.weeklyStats.lastWeek - stats.weeklyStats.thisWeek}회 적게 운동했어요
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl mb-2">➡️</div>
                    <p className="text-sm font-medium" style={{ color: '#3b82f6' }}>
                      지난 주와 동일한 횟수로 운동했어요
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 목표 진행률 */}
        <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>🎯 목표 진행률</h3>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
          
          {stats.goalProgress.targetWeight && stats.goalProgress.currentWeight ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>
                  {stats.goalProgress.progress || 0}%
                </div>
                <p style={{ color: '#d1d5db' }}>목표 달성률</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: '#d1d5db' }}>목표 체중</span>
                  <span className="font-semibold" style={{ color: '#ffffff' }}>{stats.goalProgress.targetWeight}kg</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#d1d5db' }}>현재 체중</span>
                  <span className="font-semibold" style={{ color: '#ffffff' }}>{stats.goalProgress.currentWeight.toFixed(1)}kg</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#d1d5db' }}>남은 거리</span>
                  <span className="font-semibold" style={{ color: '#f59e0b' }}>
                    {Math.abs(stats.goalProgress.targetWeight - stats.goalProgress.currentWeight).toFixed(1)}kg
                  </span>
                </div>
              </div>

              {stats.goalProgress.progress !== undefined && (
                <div>
                  <div className="h-4 rounded-full" style={{ backgroundColor: '#374151' }}>
                    <div
                      style={{ 
                        width: `${stats.goalProgress.progress}%`,
                        backgroundColor: '#10b981'
                      }}
                      className="h-full rounded-full transition-all duration-1000"
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                목표 체중을 설정하고 체중을 기록하면<br />
                진행률을 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 최근 운동 기록 - 모던 카드 레이아웃 */}
      <div className="p-6 rounded-xl shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>📝 최근 운동 기록</h3>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        </div>
        
        {stats.recentWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              아직 운동 기록이 없습니다.<br />
              첫 번째 운동을 기록해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentWorkouts.map((workout, index) => (
              <div key={workout.id} className="p-4 rounded-lg transition-all duration-200 hover:shadow-md" 
                   style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" 
                           style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-lg" style={{ color: '#ffffff' }}>
                        {workout.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: '#d1d5db' }}>
                      <span className="flex items-center gap-1">
                        📅 {new Date(workout.workout_date).toLocaleDateString('ko-KR')}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {workout.total_duration}분
                      </span>
                      <span className="flex items-center gap-1">
                        🔥 {workout.total_calories_burned}kcal
                      </span>
                    </div>
                    
                    {workout.workout_exercises && workout.workout_exercises.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {workout.workout_exercises.slice(0, 3).map((we: any, idx: number) => (
                          <span key={idx} className="inline-block text-xs px-3 py-1 rounded-full font-medium" 
                                style={{ backgroundColor: '#1e40af', color: '#dbeafe' }}>
                            {we.exercises?.name}
                          </span>
                        ))}
                        {workout.workout_exercises.length > 3 && (
                          <span className="inline-block text-xs px-3 py-1 rounded-full font-medium" 
                                style={{ backgroundColor: '#374151', color: '#d1d5db' }}>
                            +{workout.workout_exercises.length - 3}개 더
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>
                      {workout.total_calories_burned}
                    </div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>
                      칼로리
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}