import React from 'react'
import { PageHeader, Button } from '../../shared/ui'
import '../../styles/pages.css'

interface AIRoutinePageProps {
  routine: any
  loading: boolean
  isConnected: boolean
  onGenerateRoutine: () => void
}

export const AIRoutinePage: React.FC<AIRoutinePageProps> = ({ 
  routine, 
  loading, 
  isConnected, 
  onGenerateRoutine 
}) => {
  return (
    <div className="ai-routine-page">
      {/* AI 추천 헤더 */}
      <PageHeader
        title="AI 운동 루틴 추천"
        subtitle="AI가 당신의 목표와 수준에 맞는 운동 계획을 생성합니다"
        icon="🤖"
        gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      >
        <Button
          onClick={onGenerateRoutine}
          disabled={loading || !isConnected}
          variant="primary"
        >
          {loading ? '🔄 생성 중...' : '✨ 맞춤 루틴 생성'}
        </Button>
      </PageHeader>

      {/* 생성된 루틴 표시 */}
      {routine && (
        <div className="routine-container">
          <h3 className="routine-title">✨ 생성된 운동 계획</h3>

          {/* 사용자 프로필 */}
          <div className="profile-section">
            <h4 className="profile-title">📋 사용자 프로필</h4>
            <div className="profile-grid">
              <div className="profile-item level">
                <p className="profile-label">수준</p>
                <p className="profile-value">{routine.user_profile.fitness_level}</p>
              </div>
              <div className="profile-item goal">
                <p className="profile-label">목표</p>
                <p className="profile-value">{routine.user_profile.goal}</p>
              </div>
              <div className="profile-item days">
                <p className="profile-label">주간 일수</p>
                <p className="profile-value">{routine.user_profile.available_days}일</p>
              </div>
              <div className="profile-item time">
                <p className="profile-label">시간/회</p>
                <p className="profile-value">{routine.user_profile.time_per_session}분</p>
              </div>
              <div className="profile-item preferred">
                <p className="profile-label">선호 요일</p>
                <p className="profile-value">
                  {(() => {
                    const preferredDays = routine.user_profile.preferred_days;
                    if (preferredDays && Array.isArray(preferredDays) && preferredDays.length > 0) {
                      return preferredDays.join(', ');
                    } else if (preferredDays && typeof preferredDays === 'string' && preferredDays.length > 0) {
                      return preferredDays;
                    } else {
                      return '설정 안됨';
                    }
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* 주간 루틴 */}
          <div className="weekly-routine">
            {Object.entries(routine.weekly_routine).map(([day, dayRoutine]: [string, any]) => (
              <div key={day} className="day-routine">
                <h5 className="day-title">{day}</h5>
                {dayRoutine.type === '휴식' ? (
                  <div className="rest-day">
                    <span className="rest-emoji">🛌</span>
                    <p className="rest-text">휴식일</p>
                  </div>
                ) : (
                  <div className="workout-day">
                    <p className="workout-time">⏱️ {dayRoutine.total_time}</p>
                    <div className="exercise-list">
                      {dayRoutine.exercises.map((exercise: any, idx: number) => (
                        <div key={idx} className="exercise-item">
                          <span className="exercise-dot"></span>
                          <span className="exercise-name">{exercise.name}</span>
                          <span className="exercise-type">({exercise.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 추천사항 */}
          <div className="recommendations">
            <h4 className="recommendations-title">
              <span className="recommendations-icon">💡</span>
              추천사항
            </h4>
            <ul className="recommendations-list">
              {routine.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="recommendation-item">
                  <span className="recommendation-dot"></span>
                  <span className="recommendation-text">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}