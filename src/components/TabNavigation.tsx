import { useState } from 'react'

interface Tab {
  id: string
  name: string
  icon: string
  component: React.ReactNode
}

interface TabNavigationProps {
  tabs: Tab[]
  defaultTab?: string
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* 탭 헤더 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-6">
        {activeTabData?.component}
      </div>
    </div>
  )
}