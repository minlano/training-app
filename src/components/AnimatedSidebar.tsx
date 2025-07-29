import { useState, useEffect } from 'react'
import './AnimatedSidebar.css'

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

export const AnimatedSidebar = ({ activeTab, onTabChange, user, isConnected }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', name: '대시보드', icon: 'fa-chart-line', subItems: [] },
    { 
      id: 'workout', 
      name: '운동', 
      icon: 'fa-dumbbell', 
      subItems: [
        { id: 'workout-log', name: '운동 기록', parent: 'workout' },
        { id: 'workout-history', name: '운동 히스토리', parent: 'workout' }
      ]
    },
    { 
      id: 'health', 
      name: '건강관리', 
      icon: 'fa-heart', 
      subItems: [
        { id: 'weight', name: '체중 관리', parent: 'health' },
        { id: 'nutrition', name: '영양 관리', parent: 'health' }
      ]
    },
    { id: 'ai', name: 'AI 추천', icon: 'fa-robot', subItems: [] },
    { id: 'profile', name: '프로필', icon: 'fa-user', subItems: [] },
    { id: 'system', name: '시스템', icon: 'fa-cog', subItems: [] }
  ]

  const handleMenuClick = (itemId: string) => {
    // 서브메뉴가 있는 경우 첫 번째 서브메뉴로 이동
    const item = menuItems.find(m => m.id === itemId)
    if (item && item.subItems.length > 0) {
      onTabChange(item.subItems[0].id)
    } else {
      onTabChange(itemId)
    }
  }

  const handleSubMenuClick = (subItemId: string) => {
    onTabChange(subItemId)
  }

  const getActiveParent = () => {
    for (const item of menuItems) {
      if (item.subItems.some(sub => sub.id === activeTab)) {
        return item.id
      }
    }
    return activeTab
  }

  return (
    <nav id="side-nav" className={isCollapsed ? 'width' : ''}>
      {/* 로고 */}
      <a id="logo" href="#">
        <i className="fa fa-dumbbell"></i>
      </a>

      {/* 메뉴 리스트 */}
      <ul>
        {menuItems.map((item) => {
          const isSelected = item.id === activeTab || getActiveParent() === item.id
          const hasSubItems = item.subItems.length > 0

          return (
            <li key={item.id} className={isSelected ? 'selected' : ''}>
              <a href="#" onClick={(e) => {
                e.preventDefault()
                handleMenuClick(item.id)
              }}>
                <i className={`fa ${item.icon}`}></i>
                <span>{item.name}</span>
              </a>
              
              {/* 서브메뉴 */}
              {hasSubItems && (
                <ul>
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault()
                        handleSubMenuClick(subItem.id)
                      }}>
                        {subItem.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      {/* 사용자 정보 (축소 시 숨김) */}
      {!isCollapsed && (
        <div className="user-info">
          <div className="user-avatar">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-email">{user.email}</span>
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● 연결됨' : '● 연결 실패'}
            </span>
          </div>
        </div>
      )}

      {/* 토글 버튼 */}
      <a id="toggle" href="#" onClick={(e) => {
        e.preventDefault()
        setIsCollapsed(!isCollapsed)
      }}>
        <i className={`fa ${isCollapsed ? 'fa-chevron-circle-right' : 'fa-chevron-circle-left'}`}></i>
      </a>
    </nav>
  )
}