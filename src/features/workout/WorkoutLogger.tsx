import { useState, useEffect } from 'react'
import { supabase } from '../../shared/api/supabase'
import type { User } from '@supabase/supabase-js'
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../shared/ui'

interface WorkoutLoggerProps {
  user: User
}

interface Exercise {
  id: string
  name: string
  category: string
  calories_per_kg_per_minute: number
}

interface WorkoutRecord {
  id?: string
  user_id: string
  workout_date: string
  title: string
  notes?: string
  total_duration?: number
  total_calories_burned: number
  exercises: WorkoutExercise[]
}

interface WorkoutExercise {
  exercise_id: string
  exercise_name?: string
  sets?: number
  reps?: number[]
  weight?: number[]
  duration?: number
  calories_burned?: number
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ user }) => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [generatedRoutine, setGeneratedRoutine] = useState<any>(null)
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutRecord>({
    user_id: user.id,
    workout_date: new Date().toISOString().split('T')[0],
    title: '',
    notes: '',
    total_duration: 0,
    total_calories_burned: 0,
    exercises: []
  })

  useEffect(() => {
    fetchExercises()
    fetchWorkouts()
    loadGeneratedRoutine()
    
    // 루틴 생성 이벤트 리스너 추가
    const handleRoutineGenerated = (event: any) => {
      console.log('루틴 생성 이벤트 수신:', event.detail)
      loadGeneratedRoutine()
    }
    
    window.addEventListener('routineGenerated', handleRoutineGenerated)
    
    return () => {
      window.removeEventListener('routineGenerated', handleRoutineGenerated)
    }
  }, [])

  const loadGeneratedRoutine = () => {
    try {
      const savedRoutine = localStorage.getItem('generatedRoutine')
      if (savedRoutine) {
        const routineData = JSON.parse(savedRoutine)
        console.log('저장된 루틴 로드:', routineData)
        setGeneratedRoutine(routineData)
      }
    } catch (error) {
      console.error('루틴 로드 오류:', error)
    }
  }

  const clearGeneratedRoutine = () => {
    localStorage.removeItem('generatedRoutine')
    setGeneratedRoutine(null)
  }

  const applyRoutineToWorkout = (dayRoutine: any, dayName: string) => {
    const newWorkout: WorkoutRecord = {
      user_id: user.id,
      workout_date: new Date().toISOString().split('T')[0],
      title: `AI 추천 - ${dayName} (${dayRoutine.type})`,
      notes: `AI가 생성한 맞춤 운동 루틴입니다.`,
      total_duration: parseInt(dayRoutine.total_time) || 60,
      total_calories_burned: 0,
      exercises: dayRoutine.exercises.map((ex: any) => ({
        exercise_id: '',
        exercise_name: ex.name,
        sets: ex.sets ? parseInt(ex.sets.split('세트')[0]) : 1,
        duration: ex.duration ? parseInt(ex.duration) : 30,
        calories_burned: 0
      }))
    }
    
    setCurrentWorkout(newWorkout)
    setShowForm(true)
    
    // 칼로리 계산
    setTimeout(() => calculateTotalCalories(), 100)
  }

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('id, name, category, calories_per_kg_per_minute')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setExercises(data || [])
    } catch (error) {
      console.error('운동 종목 조회 오류:', error)
    }
  }

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          id,
          workout_date,
          title,
          notes,
          total_duration,
          total_calories_burned,
          workout_exercises (
            exercise_id,
            sets,
            reps,
            weight,
            duration,
            calories_burned,
            exercises (name)
          )
        `)
        .eq('account_id', user.id)
        .order('workout_date', { ascending: false })
        .limit(10)

      if (error) throw error
      
      const formattedWorkouts = data?.map(workout => ({
        ...workout,
        user_id: user.id,
        exercises: workout.workout_exercises?.map((we: any) => ({
          exercise_id: we.exercise_id,
          exercise_name: we.exercises?.name,
          sets: we.sets,
          reps: we.reps,
          weight: we.weight,
          duration: we.duration,
          calories_burned: we.calories_burned
        })) || []
      })) || []

      setWorkouts(formattedWorkouts)
    } catch (error) {
      console.error('운동 기록 조회 오류:', error)
    }
  }

  const addExerciseToWorkout = () => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        exercise_id: '',
        sets: 1,
        reps: [10],
        weight: [0],
        duration: 30, // 기본 30분으로 설정 (더 현실적인 시간)
        calories_burned: 0
      }]
    }))
  }

  const updateExerciseInWorkout = (index: number, updates: Partial<WorkoutExercise>) => {
    setCurrentWorkout(prev => {
      const updatedExercises = prev.exercises.map((ex, i) => 
        i === index ? { ...ex, ...updates } : ex
      )
      
      // 운동 시간이나 운동 종목이 변경되면 칼로리 자동 계산
      if (updates.duration || updates.exercise_id) {
        setTimeout(() => calculateTotalCalories(), 100)
      }
      
      return {
        ...prev,
        exercises: updatedExercises
      }
    })
  }

  const removeExerciseFromWorkout = (index: number) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }))
  }

  const deleteWorkout = async (workoutId: string) => {
    if (!confirm('정말로 이 운동 기록을 삭제하시겠습니까?')) {
      return
    }

    try {
      // 먼저 관련된 운동 항목들 삭제
      const { error: exerciseError } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('workout_id', workoutId)

      if (exerciseError) throw exerciseError

      // 운동 기록 삭제
      const { error: workoutError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)

      if (workoutError) throw workoutError

      // 목록 새로고침
      fetchWorkouts()
      alert('운동 기록이 삭제되었습니다!')
    } catch (error) {
      console.error('운동 기록 삭제 오류:', error)
      alert('운동 기록 삭제 중 오류가 발생했습니다.')
    }
  }

  const calculateTotalCalories = () => {
    console.log('칼로리 계산 시작:', { exercises: currentWorkout.exercises, totalDuration: currentWorkout.total_duration })
    
    // 칼로리 계산 로직 개선
    let totalCalories = 0
    
    // 개별 운동 항목별 칼로리 계산
    currentWorkout.exercises.forEach((exercise, index) => {
      const exerciseData = exercises.find(e => e.id === exercise.exercise_id)
      console.log(`운동 ${index + 1}:`, { 
        exerciseId: exercise.exercise_id, 
        exerciseName: exerciseData?.name, 
        duration: exercise.duration,
        caloriesPerKgPerMinute: exerciseData?.calories_per_kg_per_minute 
      })
      
      if (exercise.duration && exercise.duration > 0) {
        if (exerciseData) {
          // 운동 종목이 선택된 경우
          const baseCalories = exerciseData.calories_per_kg_per_minute * 70 * exercise.duration
          totalCalories += baseCalories
          console.log(`운동 ${index + 1} 칼로리 (선택됨):`, baseCalories)
        } else {
          // 운동 종목이 선택되지 않은 경우 기본 칼로리 계산 (조깅 기준)
          const defaultCalories = 0.12 * 70 * exercise.duration
          totalCalories += defaultCalories
          console.log(`운동 ${index + 1} 칼로리 (기본값):`, defaultCalories)
        }
      }
    })

    // 총 운동 시간이 설정되어 있고 개별 운동 시간이 없으면 기본 칼로리 계산
    if (currentWorkout.total_duration && currentWorkout.total_duration > 0) {
      const hasIndividualExercises = currentWorkout.exercises.some(ex => ex.duration && ex.duration > 0)
      
      if (!hasIndividualExercises) {
        // 개별 운동 시간이 없으면 총 시간으로 기본 칼로리 계산 (조깅 기준)
        const additionalCalories = Math.round(0.12 * 70 * currentWorkout.total_duration)
        totalCalories += additionalCalories
        console.log('총 시간 기준 칼로리:', additionalCalories)
      }
    }

    // 최소 칼로리 보장 (운동 시간이 있으면 최소 100kcal)
    if (currentWorkout.total_duration && currentWorkout.total_duration > 0 && totalCalories < 100) {
      totalCalories = Math.round(0.12 * 70 * currentWorkout.total_duration)
      console.log('최소 칼로리 적용:', totalCalories)
    }

    const finalCalories = Math.round(totalCalories)
    console.log('최종 칼로리:', finalCalories)
    
    setCurrentWorkout(prev => ({
      ...prev,
      total_calories_burned: finalCalories
    }))
  }

  const saveWorkout = async () => {
    setLoading(true)
    try {
      // 총 칼로리 계산
      calculateTotalCalories()

      // 운동 세션 저장
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert([{
          account_id: user.id, // account_id 사용
          workout_date: currentWorkout.workout_date,
          title: currentWorkout.title,
          notes: currentWorkout.notes,
          total_duration: currentWorkout.total_duration,
          total_calories_burned: currentWorkout.total_calories_burned
        }])
        .select()
        .single()

      if (workoutError) throw workoutError

      // 개별 운동 항목 저장
      if (currentWorkout.exercises.length > 0) {
        // 빈 exercise_id를 가진 운동 필터링
        const validExercises = currentWorkout.exercises.filter(exercise => 
          exercise.exercise_id && exercise.exercise_id.trim() !== ''
        )
        
        if (validExercises.length > 0) {
          const exerciseRecords = validExercises.map((exercise, index) => ({
            workout_id: workoutData.id,
            exercise_id: exercise.exercise_id,
            exercise_order: index + 1,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
            calories_burned: exercise.calories_burned
          }))

          const { error: exerciseError } = await supabase
            .from('workout_exercises')
            .insert(exerciseRecords)

          if (exerciseError) throw exerciseError
        }
      }

      // 폼 초기화
      setCurrentWorkout({
        user_id: user.id,
        workout_date: new Date().toISOString().split('T')[0],
        title: '',
        notes: '',
        total_duration: 0,
        total_calories_burned: 0,
        exercises: []
      })
      setShowForm(false)
      
      // 목록 새로고침
      fetchWorkouts()
      
      alert('운동 기록이 저장되었습니다!')
    } catch (error) {
      console.error('운동 기록 저장 오류:', error)
      alert('운동 기록 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6" style={{ color: '#ffffff' }}>
      {/* 운동 기록 헤더 */}
      <PageHeader
        title="운동 기록"
        subtitle="오늘의 운동을 기록하고 진행 상황을 추적하세요!"
        icon="📝"
        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      >
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
        >
          {showForm ? '❌ 취소' : '➕ 새 운동 기록'}
        </Button>
      </PageHeader>

      {/* AI 생성 루틴 표시 */}
      {generatedRoutine && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#1f2937', border: '2px solid #10b981' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🤖</span>
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>AI 맞춤 운동 루틴</h2>
                <p className="text-sm" style={{ color: '#10b981' }}>
                  생성일: {new Date(generatedRoutine.generatedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <button
              onClick={clearGeneratedRoutine}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none'
              }}
            >
              🗑️ 루틴 삭제
            </button>
          </div>

          {/* 프로필 정보 */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#ffffff' }}>📊 프로필 기반 설정</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span style={{ color: '#9ca3af' }}>운동 수준:</span>
                <div style={{ color: '#ffffff' }}>{generatedRoutine.userProfile.fitness_level}</div>
              </div>
              <div>
                <span style={{ color: '#9ca3af' }}>목표:</span>
                <div style={{ color: '#ffffff' }}>{generatedRoutine.userProfile.goal}</div>
              </div>
              <div>
                <span style={{ color: '#9ca3af' }}>주간 운동일:</span>
                <div style={{ color: '#ffffff' }}>{generatedRoutine.userProfile.available_days}일</div>
              </div>
              <div>
                <span style={{ color: '#9ca3af' }}>세션 시간:</span>
                <div style={{ color: '#ffffff' }}>{generatedRoutine.userProfile.time_per_session}분</div>
              </div>
            </div>
            {generatedRoutine.userProfile.preferred_days && generatedRoutine.userProfile.preferred_days.length > 0 && (
              <div className="mt-3">
                <span style={{ color: '#9ca3af' }}>선호 요일:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {generatedRoutine.userProfile.preferred_days.map((day: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 주간 루틴 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#ffffff' }}>📅 주간 운동 스케줄</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(generatedRoutine.routine.weekly_routine).map(([day, routine]: [string, any]) => (
                <div key={day} className="p-4 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold" style={{ color: '#ffffff' }}>
                      {day === 'monday' ? '월요일' :
                       day === 'tuesday' ? '화요일' :
                       day === 'wednesday' ? '수요일' :
                       day === 'thursday' ? '목요일' :
                       day === 'friday' ? '금요일' :
                       day === 'saturday' ? '토요일' :
                       day === 'sunday' ? '일요일' : day}
                    </h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: routine.type === 'cardio' ? '#f59e0b' :
                                           routine.type === 'strength' ? '#dc2626' :
                                           routine.type === 'hiit' ? '#8b5cf6' : '#10b981',
                            color: '#ffffff' 
                          }}>
                      {routine.type}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm" style={{ color: '#9ca3af' }}>총 시간: </span>
                    <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{routine.total_time}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {routine.exercises.map((exercise: any, idx: number) => (
                      <div key={idx} className="text-sm p-2 rounded" style={{ backgroundColor: '#1f2937' }}>
                        <div className="font-medium" style={{ color: '#ffffff' }}>{exercise.name}</div>
                        <div style={{ color: '#9ca3af' }}>
                          {exercise.duration && `${exercise.duration}`}
                          {exercise.sets && exercise.reps && ` ${exercise.sets} ${exercise.reps}`}
                          {exercise.intensity && ` (${exercise.intensity})`}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => applyRoutineToWorkout(routine, day === 'monday' ? '월요일' :
                                                                day === 'tuesday' ? '화요일' :
                                                                day === 'wednesday' ? '수요일' :
                                                                day === 'thursday' ? '목요일' :
                                                                day === 'friday' ? '금요일' :
                                                                day === 'saturday' ? '토요일' :
                                                                day === 'sunday' ? '일요일' : day)}
                    className="w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    📝 이 루틴으로 기록하기
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 추천사항 */}
          {generatedRoutine.routine.recommendations && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#ffffff' }}>💡 AI 추천사항</h3>
              <ul className="space-y-2">
                {generatedRoutine.routine.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span style={{ color: '#10b981' }}>•</span>
                    <span style={{ color: '#d1d5db' }}>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 운동 기록 폼 */}
      {showForm && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">🏋️</span>
            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>새 운동 세션 기록</h2>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                운동 제목 ✨
              </label>
              <input
                type="text"
                value={currentWorkout.title}
                onChange={(e) => setCurrentWorkout(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                style={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151', 
                  color: '#ffffff' 
                }}
                placeholder="예: 상체 운동, 유산소 운동"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                운동 날짜 📅
              </label>
              <input
                type="date"
                value={currentWorkout.workout_date}
                onChange={(e) => setCurrentWorkout(prev => ({ ...prev, workout_date: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                style={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151', 
                  color: '#ffffff' 
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                총 운동 시간 ⏱️
              </label>
              <input
                type="number"
                value={currentWorkout.total_duration || ''}
                onChange={(e) => {
                  const duration = Number(e.target.value)
                  setCurrentWorkout(prev => ({ ...prev, total_duration: duration }))
                  // 총 운동 시간이 변경되면 칼로리 자동 계산
                  setTimeout(() => calculateTotalCalories(), 100)
                }}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                style={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151', 
                  color: '#ffffff' 
                }}
                placeholder="60분"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
              운동 메모 📝 (선택사항)
            </label>
            <textarea
              value={currentWorkout.notes || ''}
              onChange={(e) => setCurrentWorkout(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none"
              style={{ 
                backgroundColor: '#111827', 
                borderColor: '#374151', 
                color: '#ffffff' 
              }}
              placeholder="오늘 운동에 대한 느낌이나 특별한 점을 기록해보세요..."
            />
          </div>

          {/* 예상 칼로리 표시 */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔥</span>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>예상 소모 칼로리</h3>
                  <p className="text-sm" style={{ color: '#9ca3af' }}>운동 시간과 종목에 따라 자동 계산됩니다</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                  {currentWorkout.total_calories_burned || 0}
                </div>
                <div className="text-sm" style={{ color: '#9ca3af' }}>kcal</div>
              </div>
            </div>
          </div>

          {/* 운동 항목들 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🏋️‍♂️</span>
                <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>운동 항목</h3>
              </div>
              <button
                onClick={addExerciseToWorkout}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                ➕ 운동 추가
              </button>
            </div>

            {currentWorkout.exercises.map((exercise, index) => (
              <div key={index} className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>
                      운동 종목
                    </label>
                    <select
                      value={exercise.exercise_id}
                      onChange={(e) => updateExerciseInWorkout(index, { exercise_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      style={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#4b5563', 
                        color: '#ffffff' 
                      }}
                    >
                      <option value="">운동 선택</option>
                      {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>
                      세트 수
                    </label>
                    <input
                      type="number"
                      placeholder="3"
                      value={exercise.sets || ''}
                      onChange={(e) => updateExerciseInWorkout(index, { sets: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      style={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#4b5563', 
                        color: '#ffffff' 
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>
                      시간 (분)
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      value={exercise.duration || ''}
                      onChange={(e) => updateExerciseInWorkout(index, { duration: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      style={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#4b5563', 
                        color: '#ffffff' 
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>
                      삭제
                    </label>
                    <button
                      onClick={() => removeExerciseFromWorkout(index)}
                      className="w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none'
              }}
            >
              ❌ 취소
            </button>
            <button
              onClick={saveWorkout}
              disabled={loading || !currentWorkout.title}
              className="flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              style={{
                background: loading || !currentWorkout.title ? '#6b7280' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                boxShadow: loading || !currentWorkout.title ? 'none' : '0 8px 20px rgba(240, 147, 251, 0.4)'
              }}
            >
              {loading ? '💾 저장 중...' : '🚀 운동 세션 저장'}
            </button>
          </div>
          </div>
        )}

      {/* 최근 운동 기록 목록 */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
        <div className="flex items-center mb-6">
          <span className="text-2xl mr-3">📋</span>
          <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>최근 운동 기록</h2>
        </div>
        
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <p className="text-lg font-medium mb-2" style={{ color: '#ffffff' }}>
              아직 운동 기록이 없습니다
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              첫 번째 운동을 기록해서 여정을 시작해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout, index) => (
              <div key={workout.id} className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg" 
                   style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" 
                           style={{ 
                             backgroundColor: index % 4 === 0 ? '#3b82f6' : 
                                              index % 4 === 1 ? '#10b981' : 
                                              index % 4 === 2 ? '#f59e0b' : '#8b5cf6',
                             color: '#ffffff' 
                           }}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: '#ffffff' }}>
                          {workout.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm" style={{ color: '#d1d5db' }}>
                          <span className="flex items-center gap-1">
                            📅 {workout.workout_date}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {workout.total_duration}분
                          </span>
                          <span className="flex items-center gap-1">
                            🔥 {workout.total_calories_burned}kcal
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 삭제 버튼 */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => deleteWorkout(workout.id!)}
                        className="px-3 py-1 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                    
                    {workout.exercises.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                          🏋️ 운동 항목:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {workout.exercises.map((exercise, idx) => (
                            <span key={idx} className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                                  style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                              {exercise.exercise_name}
                              {exercise.sets && ` ${exercise.sets}세트`}
                              {exercise.duration && ` ${exercise.duration}분`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {workout.notes && (
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <p className="text-sm" style={{ color: '#d1d5db' }}>
                          💭 {workout.notes}
                        </p>
                      </div>
                    )}
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