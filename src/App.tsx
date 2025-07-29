import { useState, useEffect } from 'react'
import { UserProfile } from './features/profile'
import { WorkoutLogger } from './features/workout'
import { WeightTracker } from './features/weight'
import { Dashboard } from './features/dashboard'
import { Sidebar } from './shared/layout/Sidebar'
import { Header } from './shared/layout/Header'
import { LoginPage } from './features/auth'
import { AIRoutinePage } from './features/ai-routine'
import { SystemPage } from './features/system'
import { Modal } from './shared/ui'
import { api, aiApi, type UserProfile as UserProfileType } from './shared/api/api'
import { supabase } from './shared/api/supabase'

// JavaScript 유틸리티 import
import { AuthService } from './shared/utils/auth.js'
import { NavigationUtils } from './shared/utils/navigation.js'
import { ApiUtils } from './shared/utils/api-utils.js'
import { DatabaseUtils } from './shared/utils/database.js'
import { UIUtils } from './shared/utils/ui-utils.js'
import { WorkoutUtils } from './shared/utils/workout-utils.js'

// CSS import
import './App.css'
import './shared/ui/styles.css'
import './shared/layout/Header.css'
import './shared/layout/Sidebar.css'

interface CustomUser {
  id: string
  email: string
  created_at: string
}

function App() {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [routine, setRoutine] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 사용자 상태 복원 및 API 연결 테스트
  useEffect(() => {
    // JavaScript 유틸리티를 사용한 사용자 정보 복원
    const userData = AuthService.loadUser()
    setUser(userData)

    // API 연결 테스트
    const testConnection = async () => {
      const connected = await ApiUtils.testConnection(api)
      setIsConnected(connected)
      setLoading(false)
    }

    testConnection()
  }, [])

  // 프로필 기반 AI 루틴 생성 이벤트 리스너
  useEffect(() => {
    const handleGenerateRoutine = (event: CustomEvent) => {
      generateRoutineFromProfile(event.detail)
    }

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
    setLoading(true)
    try {
      const result = await aiApi.generateRoutine(profileData)
      setRoutine(result)
    } catch (error) {
      // 에러 처리
    } finally {
      setLoading(false)
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

  // 실제 계정 삭제 실행 (JavaScript 유틸리티 사용)
  const executeDeleteAccount = async () => {
    if (!user) return

    try {
      await DatabaseUtils.deleteAccount(supabase, user.id)
      UIUtils.notification.success('계정이 완전히 삭제되었습니다.')
      setShowDeleteModal(false)
      AuthService.logout()
    } catch (error) {
      const errorMessage = ApiUtils.handleApiError(error, '계정 삭제')
      UIUtils.notification.error(errorMessage)
      setShowDeleteModal(false)
    }
  }

  // 프로필 기반 루틴 생성 (JavaScript 유틸리티 사용)
  const generateRoutineFromProfileMenu = async () => {
    if (!user) return

    try {
      await ApiUtils.withLoading(async () => {
        // 사용자 프로필 조회
        const profile = await DatabaseUtils.getUserProfile(supabase, user.id)
        
        if (!profile) {
          UIUtils.notification.error('프로필 정보를 찾을 수 없습니다.\n\n프로필 메뉴에서 먼저 프로필을 작성해주세요.')
          return
        }

        // 프로필 데이터 변환
        const profileData = ApiUtils.transformProfileData(profile)
        console.log('프로필 데이터:', profile)
        console.log('AI API 전송 데이터:', profileData)

        // AI 루틴 생성
        const result = await WorkoutUtils.generateRoutine(aiApi, profileData)
        setRoutine(result)
      }, setLoading)
    } catch (error) {
      const errorMessage = ApiUtils.handleApiError(error, '루틴 생성')
      UIUtils.notification.error(errorMessage)
    }
  }

  // 로그아웃 핸들러 (JavaScript 유틸리티 사용)
  const handleLogout = () => {
    AuthService.logout()
  }

  // 로그인하지 않은 경우
  if (!user) {
    return <LoginPage onAuthChange={handleAuthChange} />
  }





  // 현재 활성 탭의 콘텐츠 렌더링
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'profile':
        return <UserProfile user={user} />
      case 'workout-log':
      case 'workout':
        return <WorkoutLogger user={{ id: user.id, email: user.email, created_at: user.created_at }} />
      case 'weight':
        return <WeightTracker user={{ id: user.id, email: user.email, created_at: user.created_at }} />
      case 'ai':
        return (
          <AIRoutinePage
            routine={routine}
            loading={loading}
            isConnected={isConnected}
            onGenerateRoutine={generateRoutineFromProfileMenu}
          />
        )
      case 'system':
        return (
          <SystemPage
            user={user}
            onLogout={handleLogout}
            onDeleteAccount={showDeleteAccountModal}
          />
        )
      default:
        return <Dashboard user={user} />
    }
  }

  // JavaScript 유틸리티를 사용한 탭 정보 가져오기
  const getTabTitle = () => NavigationUtils.getTabTitle(activeTab)
  const getTabDescription = () => NavigationUtils.getTabDescription(activeTab)

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        isConnected={isConnected}
      />

      <div className="main-content">
        <Header
          title={getTabTitle()}
          description={getTabDescription()}
          onLogout={handleLogout}
        />

        <div className="content-area">
          {renderActiveContent()}
        </div>
      </div>

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
