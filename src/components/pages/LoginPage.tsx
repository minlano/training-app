import React from 'react'
import { Auth } from '../Auth'
import '../../styles/pages.css'

interface LoginPageProps {
  onAuthChange: (user: any) => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthChange }) => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="app-logo">
            <span className="logo-emoji">🏋️</span>
          </div>
          <h1 className="app-title">Workout Tracker</h1>
          <p className="app-subtitle">AI 기반 개인 맞춤형 운동 관리 플랫폼</p>
        </div>
        <Auth onAuthChange={onAuthChange} />
      </div>
    </div>
  )
}