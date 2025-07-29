import React from 'react'
import '../../styles/layout.css'

interface HeaderProps {
  title: string
  description: string
  onLogout: () => void
}

export const Header: React.FC<HeaderProps> = ({ title, description, onLogout }) => {
  return (
    <div className="header">
      <div className="header-content">
        <h2 className="header-title">{title}</h2>
        <p className="header-description">{description}</p>
      </div>
      <button className="logout-button" onClick={onLogout}>
        로그아웃
      </button>
    </div>
  )
}