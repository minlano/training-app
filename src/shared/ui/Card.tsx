import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  borderColor?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  borderColor = '#374151',
  hover = true 
}) => {
  return (
    <div 
      className={`p-6 rounded-xl shadow-lg ${hover ? 'transition-all duration-200 hover:shadow-xl hover:scale-[1.02]' : ''} ${className}`}
      style={{ 
        backgroundColor: '#1f2937', 
        border: `1px solid ${borderColor}`,
        backdropFilter: 'blur(10px)'
      }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center mb-6 ${className}`}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-xl font-bold ${className}`} style={{ color: '#ffffff' }}>
      {children}
    </h2>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  )
} 