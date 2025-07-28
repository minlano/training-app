import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const SupabaseTest: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Supabase 연결 테스트
  useEffect(() => {
    const testConnection = async () => {
      try {
        // 간단한 쿼리로 연결 테스트
        const { data, error } = await supabase
          .from('exercises')
          .select('count')
          .limit(1)

        if (error) {
          console.error('Supabase 연결 오류:', error)
          setError(error.message)
          setIsConnected(false)
        } else {
          setIsConnected(true)
          setError(null)
        }
      } catch (err) {
        console.error('연결 테스트 실패:', err)
        setError('연결 테스트 실패')
        setIsConnected(false)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  // 운동 종목 데이터 가져오기
  const fetchExercises = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .limit(10)

      if (error) {
        setError(error.message)
        console.error('운동 데이터 조회 오류:', error)
      } else {
        setExercises(data || [])
        setError(null)
      }
    } catch (err) {
      setError('데이터 조회 실패')
      console.error('데이터 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          🗄️ Supabase 데이터베이스 연동
        </h3>
        
        {/* 연결 상태 */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              데이터베이스: {isConnected ? '연결됨' : '연결 실패'}
            </span>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">
              오류: {error}
            </p>
          )}
        </div>

        {/* 데이터 테스트 */}
        <div className="space-y-4">
          <button
            onClick={fetchExercises}
            disabled={loading || !isConnected}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? '로딩 중...' : '운동 데이터 조회'}
          </button>

          {/* 조회된 데이터 표시 */}
          {exercises.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                운동 종목 데이터 ({exercises.length}개)
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {exercises.map((exercise, idx) => (
                  <div key={exercise.id || idx} className="mb-2 p-2 bg-white rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {exercise.name} {exercise.name_en && `(${exercise.name_en})`}
                        </h5>
                        <p className="text-sm text-gray-600">
                          카테고리: {exercise.category} | 
                          난이도: {exercise.difficulty_level} |
                          칼로리: {exercise.calories_per_kg_per_minute}/kg/분
                        </p>
                        {exercise.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {exercise.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 데이터베이스 설정 안내 */}
          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                📋 데이터베이스 설정 필요
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                Supabase SQL Editor에서 다음 마이그레이션 파일들을 순서대로 실행해주세요:
              </p>
              <ol className="text-xs text-yellow-700 space-y-1 ml-4">
                <li>1. supabase/migrations/001_create_users_table.sql</li>
                <li>2. supabase/migrations/002_create_exercises_table.sql</li>
                <li>3. supabase/migrations/003_create_workouts_table.sql</li>
                <li>4. supabase/migrations/004_create_weight_records_table.sql</li>
                <li>5. supabase/migrations/005_create_nutrition_records_table.sql</li>
                <li>6. supabase/migrations/006_create_workout_routines_table.sql</li>
                <li>7. supabase/migrations/007_insert_sample_exercises.sql</li>
                <li>8. supabase/migrations/008_create_rls_policies.sql</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}