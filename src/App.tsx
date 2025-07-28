import { useState, useEffect } from 'react'
import { Auth } from './components/Auth'
import { UserProfile } from './components/UserProfile'
import { WorkoutLogger } from './components/WorkoutLogger'
import { WeightTracker } from './components/WeightTracker'
import { Dashboard } from './components/Dashboard'
import { api, aiApi, type UserProfile as UserProfileType } from './lib/api'
import { supabase } from './lib/supabase'
interface CustomUser {
    id: string
    email: string
    created_at: string
}
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button, Modal } from './components/ui'
import './App.css'
import './components/ui/styles.css'

function App() {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [routine, setRoutine] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 사용자 상태 복원 및 API 연결 테스트
  useEffect(() => {
    // localStorage에서 사용자 정보 복원 (로그아웃 후에는 복원하지 않음)
    const savedUser = localStorage.getItem('customUser')
    console.log('localStorage에서 읽은 사용자 데이터:', savedUser)
    
    // 로그아웃 플래그 확인
    const logoutFlag = sessionStorage.getItem('logout_flag')
    if (logoutFlag === 'true') {
      console.log('로그아웃 플래그 감지, 사용자 데이터 복원하지 않음')
      sessionStorage.removeItem('logout_flag')
      localStorage.removeItem('customUser')
      setUser(null)
      return
    }
    
    // 강제 로그아웃 확인
    const forceLogout = sessionStorage.getItem('force_logout')
    if (forceLogout === 'true') {
      console.log('강제 로그아웃 감지, 모든 데이터 클리어')
      sessionStorage.removeItem('force_logout')
      localStorage.clear()
      sessionStorage.clear()
      setUser(null)
      return
    }
    
    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined' && savedUser !== '') {
      try {
        const userData = JSON.parse(savedUser)
        // 유효한 사용자 데이터인지 확인
        if (userData && userData.id && userData.email && userData.created_at) {
          setUser(userData)
          console.log('저장된 사용자 정보 복원:', userData)
        } else {
          console.log('유효하지 않은 사용자 데이터, 로그아웃 처리')
          localStorage.removeItem('customUser')
          setUser(null)
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error)
        localStorage.removeItem('customUser')
        setUser(null)
      }
    } else {
      console.log('localStorage에 사용자 데이터 없음, 로그인 필요')
      setUser(null)
    }

    // API 연결 테스트
    const testConnection = async () => {
      try {
        await api.healthCheck()
        setIsConnected(true)
      } catch (error) {
        console.error('API 연결 실패:', error)
        setIsConnected(false)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  // 프로필 기반 AI 루틴 생성 이벤트 리스너
  useEffect(() => {
    const handleGenerateRoutine = (event: CustomEvent) => {
      console.log('App.tsx에서 generateRoutine 이벤트 수신:', event.detail)
      generateRoutineFromProfile(event.detail)
    }

    console.log('generateRoutine 이벤트 리스너 등록')
    window.addEventListener('generateRoutine', handleGenerateRoutine as EventListener)

    return () => {
      console.log('generateRoutine 이벤트 리스너 제거')
      window.removeEventListener('generateRoutine', handleGenerateRoutine as EventListener)
    }
  }, [])

  // 사용자 인증 상태 변경 핸들러
  const handleAuthChange = (user: CustomUser | null) => {
    console.log('인증 상태 변경:', user ? '로그인' : '로그아웃')
    setUser(user)
  }

  // 프로필 기반 운동 루틴 생성
  const generateRoutineFromProfile = async (profileData: UserProfileType) => {
    console.log('generateRoutineFromProfile 호출됨:', profileData)
    setLoading(true)
    try {
      console.log('AI API 호출 시작...')
      const result = await aiApi.generateRoutine(profileData)
      console.log('AI API 응답:', result)
      setRoutine(result)
      console.log('루틴 상태 업데이트 완료')
    } catch (error) {
      console.error('프로필 기반 루틴 생성 실패:', error)
    } finally {
      setLoading(false)
      console.log('로딩 상태 해제')
    }
  }

  // 계정 삭제 확인 모달 표시
  const showDeleteAccountModal = () => {
    if (!user) {
      alert('사용자 정보를 찾을 수 없습니다.')
      return
    }
    setShowDeleteModal(true)
  }

  // 실제 계정 삭제 실행
  const executeDeleteAccount = async () => {
    if (!user) return

    try {
      console.log('계정 삭제 시작:', user.id)
      
      // 자체 계정 시스템에서 완전한 계정 삭제
      console.log('자체 계정 시스템에서 완전한 계정 삭제 시도...')
      
      // 1. 운동 기록 삭제
      const { error: workoutDeleteError } = await supabase
        .from('workouts')
        .delete()
        .eq('account_id', user.id)
      
      console.log('운동 기록 삭제 결과:', workoutDeleteError)

      // 2. 체중 기록 삭제  
      const { error: weightDeleteError } = await supabase
        .from('weight_records')
        .delete()
        .eq('account_id', user.id)
      
      console.log('체중 기록 삭제 결과:', weightDeleteError)

      // 3. 프로필 삭제
      const { error: profileDeleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('account_id', user.id)
      
      console.log('프로필 삭제 결과:', profileDeleteError)

      // 4. 계정 삭제
      const { error: accountDeleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', user.id)
      
      console.log('계정 삭제 결과:', accountDeleteError)

      if (workoutDeleteError || weightDeleteError || profileDeleteError || accountDeleteError) {
        console.error('삭제 실패:', { workoutDeleteError, weightDeleteError, profileDeleteError, accountDeleteError })
        alert('계정 삭제에 실패했습니다. 다시 시도해주세요.')
        setShowDeleteModal(false)
        return
      }

      console.log('모든 데이터 및 계정 삭제 완료')

      // 삭제 후 확인
      const { data: afterWorkouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
      console.log('삭제 후 운동 기록 수:', afterWorkouts?.length || 0)

      const { data: afterWeights } = await supabase
        .from('weight_records')
        .select('*')
        .eq('user_id', user.id)
      console.log('삭제 후 체중 기록 수:', afterWeights?.length || 0)

      const { data: afterProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
      console.log('삭제 후 프로필 존재:', !!afterProfile)

      // 계정 삭제 완료
      alert('계정이 완전히 삭제되었습니다.')
      setShowDeleteModal(false)
      
      // 로그아웃 처리
      console.log('로그아웃 처리 시작')
      localStorage.removeItem('customUser')
      setUser(null) // 사용자 상태 초기화
      console.log('로그아웃 완료')
    } catch (error) {
      console.error('계정 삭제 오류:', error)
      alert('계정 삭제 중 오류가 발생했습니다.')
      setShowDeleteModal(false)
    }
  }

  // 프로필 기반 루틴 생성 (AI 추천 메뉴용)
  const generateRoutineFromProfileMenu = async () => {
    setLoading(true)
    try {
      // 사용자 프로필 조회 (account_id로 조회)
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('account_id', user?.id)
        .single()

      if (profileError || !profile) {
        alert('프로필 정보를 찾을 수 없습니다.\n\n프로필 메뉴에서 먼저 프로필을 작성해주세요.')
        setLoading(false)
        return
      }

      // 프로필 데이터를 AI API 형식으로 변환
      const profileData: UserProfileType = {
        fitness_level: profile.fitness_level,
        goal: profile.primary_goal,
        available_days: profile.available_days_per_week,
        time_per_session: profile.preferred_workout_duration,
        preferred_days: profile.preferred_days || []
      }

      console.log('프로필 데이터:', profile)
      console.log('AI API 전송 데이터:', profileData)
      console.log('선호 요일 타입:', typeof profile.preferred_days)
      console.log('선호 요일 값:', profile.preferred_days)

      const result = await aiApi.generateRoutine(profileData)
      setRoutine(result)
    } catch (error) {
      console.error('프로필 기반 루틴 생성 실패:', error)
      alert('루틴 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }



  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl">🏋️</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Workout Tracker
            </h1>
            <p className="text-gray-600">AI 기반 개인 맞춤형 운동 관리 플랫폼</p>
          </div>
          <Auth onAuthChange={handleAuthChange} />
        </div>
      </div>
    )
  }

  // AI 루틴 컴포넌트
  const AIRoutineComponent = () => (
    <div className="w-full space-y-6" style={{ color: '#ffffff' }}>
      {/* AI 추천 헤더 */}
      <PageHeader
        title="AI 운동 루틴 추천"
        subtitle="AI가 당신의 목표와 수준에 맞는 운동 계획을 생성합니다"
        icon="🤖"
        gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      >
        <Button
          onClick={generateRoutineFromProfileMenu}
          disabled={loading || !isConnected}
          variant="primary"
        >
          {loading ? '🔄 생성 중...' : '✨ 맞춤 루틴 생성'}
        </Button>
      </PageHeader>

      {/* 생성된 루틴 표시 */}
      {routine && (
        <div className="p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)', border: '1px solid #3730a3' }}>
          <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: '#ffffff' }}>
            ✨ 생성된 운동 계획
          </h3>

          <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#1f2937' }}>
            <h4 className="font-medium mb-2" style={{ color: '#ffffff' }}>📋 사용자 프로필</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center p-2 rounded" style={{ backgroundColor: '#1e40af' }}>
                <p className="font-medium" style={{ color: '#dbeafe' }}>수준</p>
                <p style={{ color: '#ffffff' }}>{routine.user_profile.fitness_level}</p>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: '#059669' }}>
                <p className="font-medium" style={{ color: '#d1fae5' }}>목표</p>
                <p style={{ color: '#ffffff' }}>{routine.user_profile.goal}</p>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: '#d97706' }}>
                <p className="font-medium" style={{ color: '#fef3c7' }}>주간 일수</p>
                <p style={{ color: '#ffffff' }}>{routine.user_profile.available_days}일</p>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: '#7c3aed' }}>
                <p className="font-medium" style={{ color: '#ede9fe' }}>시간/회</p>
                <p style={{ color: '#ffffff' }}>{routine.user_profile.time_per_session}분</p>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: '#dc2626' }}>
                <p className="font-medium" style={{ color: '#fee2e2' }}>선호 요일</p>
                <p style={{ color: '#ffffff' }}>
                  {(() => {
                    const preferredDays = routine.user_profile.preferred_days;
                    console.log('AI 루틴에서 선호 요일:', preferredDays);
                    if (preferredDays && Array.isArray(preferredDays) && preferredDays.length > 0) {
                      return preferredDays.join(', ');
                    } else if (preferredDays && typeof preferredDays === 'string' && preferredDays.length > 0) {
                      return preferredDays;
                    } else {
                      return '설정 안됨';
                    }
                  })()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {Object.entries(routine.weekly_routine).map(([day, dayRoutine]: [string, any]) => (
              <div key={day} className="p-4 rounded-lg hover:shadow-md transition-shadow" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                <h5 className="font-semibold mb-3 text-center" style={{ color: '#ffffff' }}>{day}</h5>
                {dayRoutine.type === '휴식' ? (
                  <div className="text-center py-4">
                    <span className="text-2xl">🛌</span>
                    <p className="mt-2" style={{ color: '#9ca3af' }}>휴식일</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs mb-3 text-center py-1 px-2 rounded" style={{ color: '#d1d5db', backgroundColor: '#374151' }}>
                      ⏱️ {dayRoutine.total_time}
                    </p>
                    <div className="space-y-2">
                      {dayRoutine.exercises.map((exercise: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                          <span style={{ color: '#ffffff' }}>{exercise.name}</span>
                          <span className="text-xs" style={{ color: '#9ca3af' }}>({exercise.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#1f2937' }}>
            <h4 className="font-medium mb-3 flex items-center" style={{ color: '#ffffff' }}>
              <span className="text-lg mr-2">💡</span>
              추천사항
            </h4>
            <ul className="space-y-2">
              {routine.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span style={{ color: '#d1d5db' }}>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )

  // 시스템 상태 컴포넌트
  const SystemStatusComponent = () => (
    <div className="space-y-6">
      <PageHeader
        title="⚙️ 시스템 상태"
        subtitle="시스템 연결 상태 및 개발자 도구"
        icon="⚙️"
        gradient="linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🔗 연결 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span style={{ color: '#d1d5db' }}>백엔드 API</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {isConnected ? '연결됨' : '연결 실패'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#d1d5db' }}>사용자 인증</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm font-medium text-green-400">활성</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#d1d5db' }}>데이터베이스</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm font-medium text-green-400">연결됨</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👤 사용자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm" style={{ color: '#d1d5db' }}>이메일</span>
                <p className="font-medium" style={{ color: '#ffffff' }}>{user.email}</p>
              </div>
              <div>
                <span className="text-sm" style={{ color: '#d1d5db' }}>가입일</span>
                <p className="font-medium" style={{ color: '#ffffff' }}>
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <span className="text-sm" style={{ color: '#d1d5db' }}>마지막 로그인</span>
                <p className="font-medium" style={{ color: '#ffffff' }}>
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 계정 관리 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>⚠️ 계정 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 로그아웃 섹션 */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
              <div className="flex-1">
                <h3 className="text-sm font-medium" style={{ color: '#ffffff' }}>
                  로그아웃
                </h3>
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                  현재 계정에서 로그아웃합니다.
                </p>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    console.log('로그아웃 시작')
                    
                    // 강제 로그아웃 플래그 설정
                    sessionStorage.setItem('force_logout', 'true')
                    
                    // 모든 데이터 완전 제거
                    localStorage.clear()
                    sessionStorage.clear()
                    
                    // 사용자 상태 초기화
                    setUser(null)
                    setRoutine(null)
                    setLoading(false)
                    
                    console.log('로그아웃 완료')
                    
                    // 강제로 페이지 새로고침하여 모든 상태 초기화
                    window.location.reload()
                  }}
                  variant="secondary"
                  size="sm"
                >
                  🚪 로그아웃
                </Button>
              </div>
            </div>

            {/* 계정 삭제 섹션 */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #dc2626' }}>
              <div className="flex-1">
                <h3 className="text-sm font-medium" style={{ color: '#ffffff' }}>
                  계정 삭제
                </h3>
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </p>
              </div>
              <div className="mt-4">
                <Button
                  onClick={showDeleteAccountModal}
                  variant="danger"
                  size="sm"
                >
                  🗑️ 계정 삭제
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 탭 메뉴 구성
  const tabs = [
    { id: 'dashboard', name: '대시보드', icon: '📊' },
    { id: 'profile', name: '프로필', icon: '👤' },
    { id: 'workout', name: '운동 기록', icon: '📝' },
    { id: 'weight', name: '체중 관리', icon: '⚖️' },
    { id: 'ai', name: 'AI 추천', icon: '🤖' },
    { id: 'system', name: '시스템', icon: '⚙️' }
  ]

  // 현재 활성 탭의 콘텐츠 렌더링
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'profile':
        return <UserProfile user={user} />
      case 'workout':
        return <WorkoutLogger user={user} />
      case 'weight':
        return <WeightTracker user={user} />
      case 'ai':
        return <AIRoutineComponent />
      case 'system':
        return <SystemStatusComponent />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#000000'
    }}>
      {/* 사이드바 - 다크 테마 */}
      <div style={{
        width: '240px',
        backgroundColor: '#1f2937',
        borderRight: '1px solid #374151',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
      }}>
        {/* 로고 헤더 */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              🏋️
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Workout Tracker</h1>
              <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>AI 기반 운동 관리</p>
            </div>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #374151',
          backgroundColor: '#111827'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#ffffff' }}>안녕하세요! 👋</p>
              <p style={{ 
                margin: 0, 
                fontSize: '11px', 
                color: '#d1d5db',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <div style={{ flex: 1, padding: '12px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                marginBottom: '4px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#ffffff',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(59, 130, 246, 0.25)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* 사이드바 푸터 */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid #374151',
          textAlign: 'center',
          backgroundColor: '#111827'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ fontSize: '10px', color: '#d1d5db', fontWeight: '500' }}>
              {isConnected ? 'API 연결됨' : 'API 연결 실패'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af' }}>
            © 2025 Workout Tracker
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 - 다크 테마 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000000',
        minWidth: 0
      }}>
        {/* 상단 헤더 - 다크 테마 */}
        <div style={{
          backgroundColor: '#1f2937',
          borderBottom: '1px solid #374151',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '-0.025em'
            }}>
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h2>
            <p style={{
              margin: '6px 0 0 0',
              fontSize: '15px',
              color: '#d1d5db',
              fontWeight: '400'
            }}>
              {activeTab === 'dashboard' && '운동 현황과 통계를 한눈에 확인하세요'}
              {activeTab === 'profile' && '개인 정보와 운동 목표를 설정하세요'}
              {activeTab === 'workout' && '운동 세션을 기록하고 관리하세요'}
              {activeTab === 'weight' && '체중 변화를 추적하고 AI 예측을 확인하세요'}
              {activeTab === 'ai' && 'AI가 생성하는 맞춤형 운동 계획'}
              {activeTab === 'system' && '연결 상태 및 시스템 정보'}
            </p>
          </div>
          <button
            onClick={() => {
              console.log('우측 상단 로그아웃 시작')
              
              // 강제 로그아웃 플래그 설정
              sessionStorage.setItem('force_logout', 'true')
              
              // 모든 데이터 완전 제거
              localStorage.clear()
              sessionStorage.clear()
              
              // 사용자 상태 초기화
              setUser(null)
              setRoutine(null)
              setLoading(false)
              
              console.log('우측 상단 로그아웃 완료')
              
              // 강제로 페이지 새로고침하여 모든 상태 초기화
              window.location.reload()
            }}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563'
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.borderColor = '#6b7280'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#374151'
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.borderColor = '#4b5563'
            }}
          >
            로그아웃
          </button>
        </div>

        {/* 콘텐츠 영역 - 전체 너비 활용 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0',
          backgroundColor: '#000000',
          width: '100%'
        }}>
          <div style={{
            padding: '16px',
            width: '100%',
            minWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {renderActiveContent()}
          </div>
        </div>
      </div>

      {/* 계정 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDeleteAccount}
        title="계정 삭제 확인"
        message="정말로 계정을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다."
        type="danger"
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  )
}

export default App
