/* ===========================================
   네비게이션 관련 JavaScript 로직
   =========================================== */

// 탭 메뉴 구성
export const TAB_CONFIG = [
  { id: 'dashboard', name: '대시보드', icon: '📊' },
  { id: 'profile', name: '프로필', icon: '👤' },
  { id: 'workout', name: '운동 기록', icon: '📝' },
  { id: 'weight', name: '체중 관리', icon: '⚖️' },
  { id: 'ai', name: 'AI 추천', icon: '🤖' },
  { id: 'system', name: '시스템', icon: '⚙️' }
];

// 네비게이션 유틸리티
export const NavigationUtils = {
  // 탭 제목 가져오기
  getTabTitle: (activeTab) => {
    switch (activeTab) {
      case 'dashboard': return '대시보드';
      case 'profile': return '프로필';
      case 'workout-log': return '운동 기록';
      case 'workout-history': return '운동 히스토리';
      case 'workout': return '운동 기록';
      case 'weight': return '체중 관리';
      case 'nutrition': return '영양 관리';
      case 'ai': return 'AI 추천';
      case 'system': return '시스템';
      default: return '대시보드';
    }
  },

  // 탭 설명 가져오기
  getTabDescription: (activeTab) => {
    switch (activeTab) {
      case 'dashboard': return '운동 현황과 통계를 한눈에 확인하세요';
      case 'profile': return '개인 정보와 운동 목표를 설정하세요';
      case 'workout-log': return '운동 세션을 기록하고 관리하세요';
      case 'workout-history': return '과거 운동 기록을 확인하세요';
      case 'workout': return '운동 세션을 기록하고 관리하세요';
      case 'weight': return '체중 변화를 추적하고 AI 예측을 확인하세요';
      case 'nutrition': return '영양 섭취를 기록하고 관리하세요';
      case 'ai': return 'AI가 생성하는 맞춤형 운동 계획';
      case 'system': return '연결 상태 및 시스템 정보';
      default: return '운동 현황과 통계를 한눈에 확인하세요';
    }
  },

  // 활성 탭 스타일 적용
  applyActiveTabStyle: (tabId, activeTab) => {
    return tabId === activeTab ? 'nav-button active' : 'nav-button';
  },

  // 탭 변경 이벤트 처리
  handleTabChange: (newTab, setActiveTab) => {
    console.log(`탭 변경: ${newTab}`);
    setActiveTab(newTab);
    
    // 탭 변경 시 스크롤을 맨 위로
    window.scrollTo(0, 0);
  }
};