import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: string
  gradient?: string
  children?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon = '📋',
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  children 
}) => {
  return (
    <div style={{ 
      background: gradient,
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
      border: '2px solid rgba(255,255,255,0.1)'
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {icon}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'white' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
} 