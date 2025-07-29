import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Input, Select, Button, Checkbox, CheckboxGroup } from './ui'

interface CustomUser {
  id: string
  email: string
  created_at: string
}

interface UserProfileProps {
  user: CustomUser
}

interface Profile {
  id: string
  account_id: string
  email: string
  full_name: string | null
  height: number | null
  gender: 'male' | 'female' | 'other' | null
  fitness_level: 'beginner' | 'intermediate' | 'advanced'
  primary_goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance'
  target_weight: number | null
  available_days_per_week: number
  preferred_workout_duration: number
  preferred_days?: string[]
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [user])

  // AI 루틴 생성 함수
  const generatePersonalizedRoutine = async () => {
    if (!profile) {
      setMessage('프로필을 먼저 저장해주세요.')
      return
    }

    try {
      setMessage('AI 루틴 생성 중...')
      
      const routineProfile = {
        fitness_level: profile.fitness_level,
        goal: profile.primary_goal,
        available_days: profile.available_days_per_week,
        time_per_session: profile.preferred_workout_duration,
        preferred_days: profile.preferred_days || []
      }

      console.log('AI 루틴 생성 요청 데이터:', routineProfile)

      // AI API 직접 호출
      const { aiApi } = await import('../lib/api')
      const routine = await aiApi.generateRoutine(routineProfile)
      
      console.log('생성된 루틴:', routine)
      
      // 생성된 루틴을 로컬 스토리지에 저장
      localStorage.setItem('generatedRoutine', JSON.stringify({
        routine,
        generatedAt: new Date().toISOString(),
        userProfile: routineProfile
      }))
      
      setMessage('AI 맞춤 루틴이 성공적으로 생성되었습니다! 운동 기록 탭에서 확인하세요.')
      
      // 생성 완료 이벤트 발생 (선택사항)
      const event = new CustomEvent('routineGenerated', { 
        detail: { routine, profile: routineProfile }
      })
      window.dispatchEvent(event)
      
    } catch (error) {
      console.error('루틴 생성 오류:', error)
      setMessage('루틴 생성 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.')
    }
  }

  const fetchProfile = async () => {
    try {
      // 모든 프로필을 가져와서 중복 확인
      const { data: allProfiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('account_id', user.id)

      if (error) {
        console.error('프로필 조회 오류:', error)
        setMessage('프로필을 불러오는 중 오류가 발생했습니다.')
        setProfile(null)
        return
      }

      if (allProfiles && allProfiles.length > 0) {
        // 중복된 프로필이 있으면 가장 최근 것만 사용
        if (allProfiles.length > 1) {
          console.log(`${allProfiles.length}개의 중복 프로필 발견, 가장 최근 것 사용`)
          const latestProfile = allProfiles.reduce((latest, current) => 
            current.id > latest.id ? current : latest
          )
          setProfile(latestProfile)
        } else {
          // 단일 프로필
          setProfile(allProfiles[0])
        }
      } else {
        // 프로필이 없으면 null로 설정 (빈 폼 표시)
        setProfile(null)
      }
    } catch (error: any) {
      console.error('프로필 조회 오류:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    setSaving(true)
    try {
      // 먼저 중복된 프로필이 있는지 확인하고 정리
      const { data: allProfiles, error: fetchAllError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('account_id', user.id)

      if (fetchAllError) {
        console.error('프로필 조회 오류:', fetchAllError)
        throw fetchAllError
      }

      // 중복된 프로필이 있으면 가장 최근 것만 남기고 나머지 삭제
      if (allProfiles && allProfiles.length > 1) {
        console.log(`${allProfiles.length}개의 중복 프로필 발견, 정리 중...`)
        
        // 가장 최근 프로필의 ID 찾기
        const latestProfile = allProfiles.reduce((latest, current) => 
          current.id > latest.id ? current : latest
        )
        
        // 나머지 프로필들 삭제
        const { error: deleteError } = await supabase
          .from('user_profiles')
          .delete()
          .eq('account_id', user.id)
          .neq('id', latestProfile.id)

        if (deleteError) {
          console.error('중복 프로필 삭제 오류:', deleteError)
        } else {
          console.log('중복 프로필 정리 완료')
        }
      }

      // 이제 단일 프로필로 UPDATE 또는 INSERT
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('account_id', user.id)
        .maybeSingle()

      if (fetchError) {
        console.error('프로필 조회 오류:', fetchError)
        throw fetchError
      }

      if (existingProfile) {
        // 기존 프로필이 있으면 UPDATE
        console.log('기존 프로필 발견, UPDATE 실행')
        const { data: updatedData, error: updateError } = await supabase
          .from('user_profiles')
          .update({
            full_name: updates.full_name || existingProfile.full_name,
            height: updates.height || existingProfile.height,
            gender: updates.gender || existingProfile.gender,
            fitness_level: updates.fitness_level || existingProfile.fitness_level,
            primary_goal: updates.primary_goal || existingProfile.primary_goal,
            target_weight: updates.target_weight || existingProfile.target_weight,
            available_days_per_week: updates.available_days_per_week || existingProfile.available_days_per_week,
            preferred_workout_duration: updates.preferred_workout_duration || existingProfile.preferred_workout_duration,
            preferred_days: updates.preferred_days || existingProfile.preferred_days
          })
          .eq('account_id', user.id)
          .select()
          .single()

        if (updateError) {
          console.error('UPDATE 에러:', updateError)
          throw updateError
        }

        console.log('업데이트된 프로필:', updatedData)
        setProfile(updatedData)
        setMessage('프로필이 업데이트되었습니다!')
      } else {
        // 기존 프로필이 없으면 INSERT
        console.log('기존 프로필 없음, INSERT 실행')
        const newProfile = {
          account_id: user.id,
          email: user.email,
          full_name: updates.full_name || null,
          height: updates.height || null,
          gender: updates.gender || null,
          fitness_level: updates.fitness_level || 'beginner',
          primary_goal: updates.primary_goal || 'maintenance',
          target_weight: updates.target_weight || null,
          available_days_per_week: updates.available_days_per_week || 3,
          preferred_workout_duration: updates.preferred_workout_duration || 60,
          preferred_days: updates.preferred_days || []
        }

        console.log('삽입할 프로필 데이터:', newProfile)

        const { data: insertedData, error: insertError } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single()

        if (insertError) {
          console.error('INSERT 에러:', insertError)
          throw insertError
        }

        console.log('삽입된 프로필:', insertedData)
        setProfile(insertedData)
        setMessage('프로필이 생성되었습니다!')
      }
    } catch (error: any) {
      console.error('프로필 저장 오류:', error)
      console.error('전체 에러 객체:', error)
      setMessage('프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // 선호 요일 처리
    const preferredDays = formData.getAll('preferred_days') as string[]
    
    const updates: Partial<Profile> = {
      full_name: formData.get('full_name') as string || null,
      height: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
      gender: formData.get('gender') as 'male' | 'female' | 'other' | null,
      fitness_level: formData.get('fitness_level') as 'beginner' | 'intermediate' | 'advanced',
      primary_goal: formData.get('primary_goal') as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance',
      target_weight: formData.get('target_weight') ? parseFloat(formData.get('target_weight') as string) : null,
      available_days_per_week: parseInt(formData.get('available_days_per_week') as string),
      preferred_workout_duration: parseInt(formData.get('preferred_workout_duration') as string),
      preferred_days: preferredDays
    }

    console.log('프로필 업데이트 데이터:', updates)
    console.log('선호 요일:', preferredDays)

    await updateProfile(updates)
  }

  const saveWeightRecord = async (weight: number) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .insert([{
          account_id: user.id, // account_id 사용
          record_date: new Date().toISOString().split('T')[0],
          weight: weight
        }])

      if (error) throw error
      setMessage('체중 기록이 저장되었습니다!')
    } catch (error) {
      console.error('체중 기록 저장 오류:', error)
      setMessage('체중 기록 저장 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">프로필 로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    // 프로필이 없으면 빈 폼을 보여줌
    const emptyProfile: Profile = {
      id: '',
      account_id: user.id,
      email: user.email,
      full_name: null,
      height: null,
      gender: null,
      fitness_level: 'beginner',
      primary_goal: 'maintenance',
      target_weight: null,
      available_days_per_week: 3,
      preferred_workout_duration: 60,
      preferred_days: []
    }

    return (
      <div className="w-full space-y-6" style={{ color: '#ffffff' }}>
        {/* 프로필 헤더 */}
        <PageHeader
          title="👤 프로필 설정"
          subtitle={`안녕하세요, ${user.email}님! 프로필을 설정하면 더 정확한 AI 운동 추천을 받을 수 있습니다.`}
          icon={user.email.charAt(0).toUpperCase()}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />

        {/* 메인 폼 - 좌우 배치 */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* 좌측 - 기본 정보 */}
            <Card>
              <CardHeader>
                <span className="text-2xl mr-3">👤</span>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              
              <CardContent>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  defaultValue=""
                  placeholder="이름을 입력하세요"
                  label="이름"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    defaultValue=""
                    placeholder="170.0"
                    label="키 (cm)"
                  />

                  <Select
                    id="gender"
                    name="gender"
                    defaultValue=""
                    label="성별"
                  >
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </Select>
                </div>

                <Input
                  id="current_weight"
                  name="current_weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  label="현재 체중 (kg) ⚖️"
                />

                <Input
                  id="target_weight"
                  name="target_weight"
                  type="number"
                  step="0.1"
                  defaultValue=""
                  placeholder="목표 체중"
                  label="목표 체중 (kg) 🎯"
                />

                {/* 선호 운동 요일 */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid #374151' }}>
                  <div className="flex items-center mb-4">
                    <span className="text-xl mr-2">📅</span>
                    <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>선호 운동 요일</h3>
                  </div>
                  
                  <div className="flex flex-row flex-wrap gap-2 justify-start" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
                    {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map((day) => (
                      <label key={day} className="relative group flex-shrink-0" style={{ flexShrink: 0 }}>
                        <input
                          type="checkbox"
                          name="preferred_days"
                          value={day}
                          className="sr-only"
                        />
                        <div className="px-3 py-1 rounded-full border-2 border-gray-300 text-sm cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50" style={{ color: '#ffffff', borderColor: '#6b7280' }}>
                          {day}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 우측 - 운동 설정 */}
            <Card>
              <CardHeader>
                <span className="text-2xl mr-3">💪</span>
                <CardTitle>운동 설정</CardTitle>
              </CardHeader>
              
              <CardContent>
                <Select
                  id="fitness_level"
                  name="fitness_level"
                  defaultValue="beginner"
                  label="운동 수준"
                >
                  <option value="beginner">초보자</option>
                  <option value="intermediate">중급자</option>
                  <option value="advanced">고급자</option>
                </Select>

                <Select
                  id="primary_goal"
                  name="primary_goal"
                  defaultValue="maintenance"
                  label="주요 목표"
                >
                  <option value="weight_loss">체중 감량</option>
                  <option value="muscle_gain">근육 증가</option>
                  <option value="maintenance">체중 유지</option>
                  <option value="endurance">지구력 향상</option>
                </Select>

                <Select
                  id="available_days_per_week"
                  name="available_days_per_week"
                  defaultValue="3"
                  label="주간 운동 가능 일수"
                >
                  <option value="2">2일</option>
                  <option value="3">3일</option>
                  <option value="4">4일</option>
                  <option value="5">5일</option>
                  <option value="6">6일</option>
                  <option value="7">7일</option>
                </Select>

                <Select
                  id="preferred_workout_duration"
                  name="preferred_workout_duration"
                  defaultValue="60"
                  label="선호 운동 시간"
                >
                  <option value="30">30분</option>
                  <option value="45">45분</option>
                  <option value="60">60분</option>
                  <option value="90">90분</option>
                  <option value="120">120분</option>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #374151', marginTop: '32px', paddingTop: '24px' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? '저장 중...' : '프로필 저장'}
            </Button>

            <Button
              type="button"
              onClick={generatePersonalizedRoutine}
              variant="secondary"
              disabled={saving}
            >
              AI 맞춤 운동 루틴 생성
            </Button>
          </div>
        </form>

        {/* 메시지 표시 */}
        {message && (
          <div className="mt-4 p-4 rounded-lg text-center" style={{ 
            backgroundColor: message.includes('성공') || message.includes('완료') ? '#10b981' : '#ef4444',
            color: '#ffffff'
          }}>
            {message}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-6" style={{ color: '#ffffff' }}>
      {/* 프로필 헤더 */}
      <PageHeader
        title="👤 프로필 설정"
        subtitle={`안녕하세요, ${profile.full_name || profile.email}님! 프로필을 설정하면 더 정확한 AI 운동 추천을 받을 수 있습니다.`}
        icon={(profile.full_name || profile.email)?.charAt(0).toUpperCase()}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      />

      {/* 메인 폼 - 좌우 배치 */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* 좌측 - 기본 정보 */}
          <Card>
            <CardHeader>
              <span className="text-2xl mr-3">👤</span>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={profile.full_name || ''}
                placeholder="이름을 입력하세요"
                label="이름"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  defaultValue={profile.height || ''}
                  placeholder="170.0"
                  label="키 (cm)"
                />

                <Select
                  id="gender"
                  name="gender"
                  defaultValue={profile.gender || ''}
                  label="성별"
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </Select>
              </div>

              <Input
                id="current_weight"
                name="current_weight"
                type="number"
                step="0.1"
                placeholder="70.0"
                label="현재 체중 (kg) ⚖️"
              />

              <Input
                id="target_weight"
                name="target_weight"
                type="number"
                step="0.1"
                defaultValue={profile.target_weight || ''}
                placeholder="목표 체중"
                label="목표 체중 (kg) 🎯"
              />

              {/* 선호 운동 요일 */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid #374151' }}>
                <div className="flex items-center mb-4">
                  <span className="text-xl mr-2">📅</span>
                  <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>선호 운동 요일</h3>
                </div>
                
                <div className="flex flex-row flex-wrap gap-2 justify-start" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-start' }}>
                  {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map((day) => (
                    <label key={day} className="relative group flex-shrink-0" style={{ flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        name="preferred_days"
                        value={day}
                        checked={profile.preferred_days?.includes(day) || false}
                        onChange={(e) => {
                          const currentDays = profile.preferred_days || []
                          if (e.target.checked) {
                            setProfile({
                              ...profile,
                              preferred_days: [...currentDays, day]
                            })
                          } else {
                            setProfile({
                              ...profile,
                              preferred_days: currentDays.filter(d => d !== day)
                            })
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 peer-checked:scale-105 group-hover:shadow-lg peer-checked:bg-blue-500 peer-checked:border-blue-600 peer-checked:text-white hover:bg-gray-700"
                           style={{ 
                             backgroundColor: '#111827', 
                             border: '2px solid #374151',
                             color: '#d1d5db',
                             minHeight: '40px',
                             minWidth: '60px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                           }}>
                        <span className="text-sm font-bold">{day.substring(0, 1)}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: '#9ca3af' }}>
                  선호하는 운동 요일을 선택하세요. AI가 이를 고려하여 루틴을 생성합니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 우측 - 운동 설정 */}
          <Card>
            <CardHeader>
              <span className="text-2xl mr-3">🏋️</span>
              <CardTitle>운동 설정</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="fitness_level"
                  name="fitness_level"
                  defaultValue={profile.fitness_level}
                  label="운동 경험 수준"
                >
                  <option value="beginner">초보자</option>
                  <option value="intermediate">중급자</option>
                  <option value="advanced">고급자</option>
                </Select>

                <Select
                  id="primary_goal"
                  name="primary_goal"
                  defaultValue={profile.primary_goal}
                  label="주요 목표"
                >
                  <option value="weight_loss">체중 감량</option>
                  <option value="muscle_gain">근육 증가</option>
                  <option value="maintenance">체중 유지</option>
                  <option value="endurance">지구력 향상</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  id="available_days_per_week"
                  name="available_days_per_week"
                  defaultValue={profile.available_days_per_week}
                  label="주간 운동 가능일"
                >
                  <option value="1">1일</option>
                  <option value="2">2일</option>
                  <option value="3">3일</option>
                  <option value="4">4일</option>
                  <option value="5">5일</option>
                  <option value="6">6일</option>
                  <option value="7">7일</option>
                </Select>

                <Select
                  id="preferred_workout_duration"
                  name="preferred_workout_duration"
                  defaultValue={profile.preferred_workout_duration}
                  label="선호 운동 시간"
                >
                  <option value="30">30분</option>
                  <option value="45">45분</option>
                  <option value="60">60분</option>
                  <option value="90">90분</option>
                  <option value="120">120분</option>
                </Select>
              </div>

              {/* 저장 버튼 */}
              <div style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid #374151' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <Button
                    type="submit"
                    disabled={saving}
                    variant="primary"
                    size="lg"
                  >
                    {saving ? '저장 중...' : '프로필 저장'}
                  </Button>
                </div>

                {/* AI 루틴 생성 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={generatePersonalizedRoutine}
                    variant="success"
                    size="lg"
                  >
                    🤖 AI 맞춤 운동 루틴 생성
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* 메시지 표시 */}
      {message && (
        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#1f2937' }}>
          <p style={{ color: '#10b981' }}>{message}</p>
        </div>
      )}
    </div>
  )
}