/* ===========================================
   인증 관련 JavaScript 로직
   =========================================== */

// 사용자 상태 관리
export const AuthService = {
  // 사용자 정보 저장
  saveUser: (userData) => {
    try {
      localStorage.setItem('customUser', JSON.stringify(userData));
      console.log('사용자 정보 저장 완료:', userData.email);
    } catch (error) {
      console.error('사용자 정보 저장 실패:', error);
    }
  },

  // 사용자 정보 불러오기
  loadUser: () => {
    try {
      const savedUser = localStorage.getItem('customUser');
      
      // 로그아웃 플래그 확인
      const logoutFlag = sessionStorage.getItem('logout_flag');
      if (logoutFlag === 'true') {
        sessionStorage.removeItem('logout_flag');
        localStorage.removeItem('customUser');
        return null;
      }
      
      // 강제 로그아웃 확인
      const forceLogout = sessionStorage.getItem('force_logout');
      if (forceLogout === 'true') {
        sessionStorage.removeItem('force_logout');
        localStorage.clear();
        sessionStorage.clear();
        return null;
      }
      
      if (savedUser && savedUser !== 'null' && savedUser !== 'undefined' && savedUser !== '') {
        const userData = JSON.parse(savedUser);
        // 유효한 사용자 데이터인지 확인
        if (userData && userData.id && userData.email && userData.created_at) {
          return userData;
        } else {
          localStorage.removeItem('customUser');
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('사용자 정보 불러오기 실패:', error);
      localStorage.removeItem('customUser');
      return null;
    }
  },

  // 로그아웃 처리
  logout: () => {
    try {
      // 강제 로그아웃 플래그 설정
      sessionStorage.setItem('force_logout', 'true');
      
      // 모든 데이터 완전 제거
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('로그아웃 완료');
      
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 처리 실패:', error);
    }
  },

  // 사용자 인증 상태 확인
  isAuthenticated: () => {
    const user = AuthService.loadUser();
    return user !== null;
  },

  // 사용자 이니셜 가져오기
  getUserInitial: (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  }
};