import React from 'react'
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button } from '../../shared/ui'
import '../../styles/pages.css'

interface SystemPageProps {
  user: {
    id: string
    email: string
    created_at: string
  }
  onLogout: () => void
  onDeleteAccount: () => void
}

export const SystemPage: React.FC<SystemPageProps> = ({ user, onLogout, onDeleteAccount }) => {
  return (
    <div className="system-page">
      <PageHeader
        title="⚙️ 시스템 상태"
        subtitle="시스템 연결 상태 및 개발자 도구"
        icon="⚙️"
        gradient="linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
      />

      <div className="system-grid">
        <Card>
          <CardHeader>
            <CardTitle>👤 사용자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="user-info-list">
              <div className="user-info-item">
                <span className="info-label">이메일</span>
                <p className="info-value">{user.email}</p>
              </div>
              <div className="user-info-item">
                <span className="info-label">가입일</span>
                <p className="info-value">
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="user-info-item">
                <span className="info-label">마지막 로그인</span>
                <p className="info-value">
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
          <div className="account-management">
            {/* 로그아웃 섹션 */}
            <div className="management-section logout-section">
              <div className="section-content">
                <h3 className="section-title">로그아웃</h3>
                <p className="section-description">현재 계정에서 로그아웃합니다.</p>
              </div>
              <div className="section-action">
                <Button onClick={onLogout} variant="secondary" size="sm">
                  🚪 로그아웃
                </Button>
              </div>
            </div>

            {/* 계정 삭제 섹션 */}
            <div className="management-section delete-section">
              <div className="section-content">
                <h3 className="section-title">계정 삭제</h3>
                <p className="section-description">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </p>
              </div>
              <div className="section-action">
                <Button onClick={onDeleteAccount} variant="danger" size="sm">
                  🗑️ 계정 삭제
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}