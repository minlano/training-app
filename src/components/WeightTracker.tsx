import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { aiApi } from '../lib/api'
import type { User } from '@supabase/supabase-js'
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Input, Button, Modal } from './ui'

interface WeightTrackerProps {
  user: User
}

interface WeightRecord {
  id?: string
  user_id: string
  record_date: string
  weight: number
  bmi?: number
  notes?: string
  created_at?: string
}

interface WeightPrediction {
  date: string
  predicted_weight: number
}

export const WeightTracker: React.FC<WeightTrackerProps> = ({ user }) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([])
  const [predictions, setPredictions] = useState<WeightPrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [showPredictionModal, setShowPredictionModal] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<WeightRecord>({
    user_id: user.id,
    record_date: new Date().toISOString().split('T')[0],
    weight: 0,
    notes: ''
  })

  useEffect(() => {
    fetchWeightRecords()
  }, [])

  const fetchWeightRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('account_id', user.id)
        .order('record_date', { ascending: false })
        .limit(30)

      if (error) throw error
      setWeightRecords(data || [])
    } catch (error) {
      // 에러 처리
    }
  }

  const saveWeightRecord = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('weight_records')
        .insert([{
          account_id: user.id,
          record_date: currentRecord.record_date,
          weight: currentRecord.weight,
          notes: currentRecord.notes
        }])

      if (error) throw error

      setCurrentRecord({
        user_id: user.id,
        record_date: new Date().toISOString().split('T')[0],
        weight: 0,
        notes: ''
      })
      setShowForm(false)
      
      fetchWeightRecords()
      
      alert('체중 기록이 저장되었습니다!')
    } catch (error) {
      alert('체중 기록 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const predictWeight = async () => {
    if (weightRecords.length < 5) {
      alert('체중 예측을 위해서는 최소 5개의 기록이 필요합니다.')
      return
    }

    setPredicting(true)
    try {
      const weightData = weightRecords
        .slice(0, 14)
        .reverse()
        .map(record => ({
          date: record.record_date,
          weight: record.weight
        }))

      const result = await aiApi.predictWeight({
        weight_data: weightData,
        days_ahead: 14
      })

      setPredictions(result.predictions)
      setShowPredictionModal(true)
    } catch (error) {
      alert('체중 예측 중 오류가 발생했습니다.')
    } finally {
      setPredicting(false)
    }
  }

  const deleteWeightRecord = async (recordId: string) => {
    if (!confirm('정말로 이 체중 기록을 삭제하시겠습니까?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', recordId)

      if (error) throw error

      fetchWeightRecords()
      alert('체중 기록이 삭제되었습니다!')
    } catch (error) {
      alert('체중 기록 삭제 중 오류가 발생했습니다.')
    }
  }

  const getWeightTrend = () => {
    if (weightRecords.length < 2) return null
    
    const recent = weightRecords[0].weight
    const previous = weightRecords[1].weight
    const diff = recent - previous
    
    if (Math.abs(diff) < 0.1) return { trend: 'stable', diff: 0, color: 'text-gray-600' }
    if (diff > 0) return { trend: 'up', diff: diff, color: 'text-red-600' }
    return { trend: 'down', diff: Math.abs(diff), color: 'text-green-600' }
  }

  const getWeightStats = () => {
    if (weightRecords.length === 0) return null

    const weights = weightRecords.map(r => r.weight)
    const min = Math.min(...weights)
    const max = Math.max(...weights)
    
    const recent30Days = weightRecords.slice(0, Math.min(30, weightRecords.length))
    const avg30Days = recent30Days.reduce((sum, r) => sum + r.weight, 0) / recent30Days.length

    return { min, max, avg: avg30Days, total: weights.length }
  }

  const trend = getWeightTrend()
  const stats = getWeightStats()

  return (
    <div className="w-full space-y-6" style={{ color: '#ffffff' }}>
      <PageHeader
        title="체중 관리"
        subtitle="체중을 기록하고 AI 예측으로 목표를 달성하세요!"
        icon="⚖️"
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        <div className="flex gap-2">
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'secondary' : 'primary'}
          >
            {showForm ? '❌ 취소' : '📊 체중 기록'}
          </Button>
          <Button
            onClick={predictWeight}
            disabled={predicting || weightRecords.length < 5}
            variant="success"
          >
            {predicting ? '🔮 예측 중...' : '🤖 AI 예측'}
          </Button>
        </div>
      </PageHeader>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          height: 'fit-content'
        }}>
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">📈</span>
              <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>최근 체중 기록</h2>
            </div>
            
            {weightRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚖️</div>
                <p className="text-lg font-medium mb-2" style={{ color: '#ffffff' }}>
                  아직 체중 기록이 없습니다
                </p>
                <p className="text-sm" style={{ color: '#9ca3af' }}>
                  첫 번째 체중을 기록해서 건강 관리를 시작해보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {weightRecords.map((record, index) => (
                  <div key={record.id} className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg" 
                       style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" 
                             style={{ 
                               backgroundColor: index % 4 === 0 ? '#3b82f6' : 
                                                index % 4 === 1 ? '#10b981' : 
                                                index % 4 === 2 ? '#f59e0b' : '#8b5cf6',
                               color: '#ffffff' 
                             }}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                            {record.weight.toFixed(1)}kg
                          </p>
                          <div className="flex items-center gap-3 text-sm" style={{ color: '#d1d5db' }}>
                            <span className="flex items-center gap-1">
                              📅 {new Date(record.record_date).toLocaleDateString('ko-KR')}
                            </span>
                            {record.bmi && (
                              <span className="flex items-center gap-1">
                                📊 BMI: {record.bmi.toFixed(1)}
                              </span>
                            )}
                          </div>
                          {record.notes && (
                            <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                              <p className="text-sm" style={{ color: '#d1d5db' }}>
                                💭 "{record.notes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>
                          기록일: {new Date(record.created_at!).toLocaleDateString('ko-KR')}
                        </p>
                        <button
                          onClick={() => deleteWeightRecord(record.id!)}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          height: 'fit-content',
          alignSelf: 'flex-start'
        }}>
          {stats && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '16px',
              height: 'fit-content'
            }}>
              <div className="p-4 rounded-xl transition-all duration-200 hover:shadow-lg" 
                   style={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', minHeight: '120px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚖️</span>
                  <p className="text-xs font-medium" style={{ color: '#93c5fd' }}>현재 체중</p>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: '#3b82f6' }}>
                  {weightRecords[0]?.weight.toFixed(1)}kg
                </p>
                {trend && (
                  <p className="text-xs" style={{ 
                    color: trend.trend === 'up' ? '#ef4444' : 
                           trend.trend === 'down' ? '#10b981' : '#6b7280' 
                  }}>
                    {trend.trend === 'up' && '↗️'} 
                    {trend.trend === 'down' && '↘️'} 
                    {trend.trend === 'stable' && '➡️'} 
                    {trend.diff > 0 ? `${trend.diff.toFixed(1)}kg` : '변화없음'}
                  </p>
                )}
              </div>
              
              <div className="p-4 rounded-xl transition-all duration-200 hover:shadow-lg" 
                   style={{ backgroundColor: '#1f2937', border: '1px solid #10b981', minHeight: '120px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📊</span>
                  <p className="text-xs font-medium" style={{ color: '#6ee7b7' }}>30일 평균</p>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#10b981' }}>
                  {stats.avg.toFixed(1)}kg
                </p>
              </div>
              
              <div className="p-4 rounded-xl transition-all duration-200 hover:shadow-lg" 
                   style={{ backgroundColor: '#1f2937', border: '1px solid #f59e0b', minHeight: '120px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📈</span>
                  <p className="text-xs font-medium" style={{ color: '#fbbf24' }}>최고/최저</p>
                </div>
                <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>
                  {stats.max.toFixed(1)} / {stats.min.toFixed(1)}kg
                </p>
              </div>
              
              <div className="p-4 rounded-xl transition-all duration-200 hover:shadow-lg" 
                   style={{ backgroundColor: '#1f2937', border: '1px solid #8b5cf6', minHeight: '120px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📝</span>
                  <p className="text-xs font-medium" style={{ color: '#c4b5fd' }}>총 기록</p>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>
                  {stats.total}회
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">📊</span>
            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>새 체중 기록</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                기록 날짜 📅
              </label>
              <input
                type="date"
                value={currentRecord.record_date}
                onChange={(e) => setCurrentRecord(prev => ({ ...prev, record_date: e.target.value }))}
                className="w-full px-4 py-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-lg"
                style={{ 
                  backgroundColor: '#111827', 
                  borderColor: '#374151', 
                  color: '#ffffff' 
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                현재 체중 ⚖️
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={currentRecord.weight || ''}
                  onChange={(e) => setCurrentRecord(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full px-4 py-4 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-lg font-semibold"
                  style={{ 
                    backgroundColor: '#111827', 
                    borderColor: '#8b5cf6', 
                    color: '#ffffff' 
                  }}
                  placeholder="70.5"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium" style={{ color: '#9ca3af' }}>
                  kg
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                정확한 체중을 입력하면 더 나은 분석을 받을 수 있습니다
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
              체중 변화 메모 📝 (선택사항)
            </label>
            <input
              type="text"
              value={currentRecord.notes || ''}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              style={{ 
                backgroundColor: '#111827', 
                borderColor: '#374151', 
                color: '#ffffff' 
              }}
              placeholder="예: 아침 공복 측정, 운동 후, 컨디션 좋음 등"
            />
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
              onClick={saveWeightRecord}
              disabled={loading || !currentRecord.weight}
              className="flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              style={{
                background: loading || !currentRecord.weight ? '#6b7280' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                boxShadow: loading || !currentRecord.weight ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.4)'
              }}
            >
              {loading ? '💾 저장 중...' : '📊 체중 기록 저장'}
            </button>
          </div>
        </div>
      )}

      {/* AI 예측 모달 - 이것만 남기고 하단 표시는 완전 제거 */}
      {showPredictionModal && (
        <Modal
          isOpen={showPredictionModal}
          onClose={() => {
            setShowPredictionModal(false)
          }}
          title="🔮 AI 체중 예측 (향후 14일)"
          message={`예측 결과:\n${predictions.slice(0, 7).map((pred, index) => 
            `${new Date(pred.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}: ${pred.predicted_weight.toFixed(1)}kg`
          ).join('\n')}\n\n⚠️ 예측은 과거 데이터를 기반으로 한 참고용입니다. 실제 결과와 다를 수 있습니다.`}
          type="info"
        />
      )}

      {/* 도움말 */}
      {weightRecords.length < 5 && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#451a03', border: '1px solid #f59e0b' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold mb-1" style={{ color: '#fbbf24' }}>
                AI 예측 기능을 활용해보세요!
              </p>
              <p className="text-sm" style={{ color: '#fbbf24' }}>
                체중을 5회 이상 기록하면 AI가 미래 체중 변화를 예측해드립니다!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}