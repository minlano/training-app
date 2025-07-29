import React from 'react'
import '../../styles/layout.css'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  user: {
    id: string
    email: string
    created_at: string
  }
  isConnected: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user, isConnected }) => {
  const tabs = [
    { id: 'dashboard', name: '대시보드', icon: '📊' },
    { id: 'profile', name: '프로필', icon: '👤' },
    { id: 'workout', name: '운동 기록', icon: '📝' },
    { id: 'weight', name: '체중 관리', icon: '⚖️' },
    { id: 'ai', name: 'AI 추천', icon: '🤖' },
    { id: 'system', name: '시스템', icon: '⚙️' }
  ]

  return (
    <div className="sidebar">
      {/* 로고 헤더 */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            🏋️
          </div>
          <div className="logo-text">
            <h1>Workout Tracker</h1>
            <p>AI 기반 운동 관리</p>
          </div>
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="user-info">
        <div className="user-container">
          <div className="user-avatar">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p className="user-greeting">안녕하세요! 👋</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-text">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* 사이드바 푸터 */}
      <div className="sidebar-footer">
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span className="status-text">
            {isConnected ? 'API 연결됨' : 'API 연결 실패'}
          </span>
        </div>
        <p className="copyright">© 2025 Workout Tracker</p>
      </div>
    </div>
  )
}