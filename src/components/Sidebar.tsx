import { useState } from 'react'

interface SidebarItem {
  id: string
  name: string
  icon: string
  badge?: number
}

interface SidebarProps {
  items: SidebarItem[]
  activeItem: string
  onItemClick: (itemId: string) => void
  user?: any
}

export const Sidebar: React.FC<SidebarProps> = ({ items, activeItem, onItemClick, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-56'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-screen flex-shrink-0 shadow-sm`}>
      {/* 사이드바 헤더 */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-lg">🏋️</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Workout Tracker</h2>
                <p className="text-xs text-gray-500">AI 기반 운동 관리</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors border border-gray-200/50"
          >
            <span className="text-gray-600 text-sm">
              {isCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>
      </div>

      {/* 사용자 정보 */}
      {user && (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  안녕하세요! 👋
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeItem === item.id
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 사이드바 푸터 */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              © 2025 Workout Tracker
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">시스템 정상</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}