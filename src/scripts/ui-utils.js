/* ===========================================
   UI 관련 JavaScript 유틸리티
   =========================================== */

// UI 상태 관리
export const UIUtils = {
  // 모달 관리
  modal: {
    show: (setShowModal) => {
      setShowModal(true);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    },

    hide: (setShowModal) => {
      setShowModal(false);
      document.body.style.overflow = 'auto'; // 스크롤 복원
    },

    confirm: (message, onConfirm) => {
      if (window.confirm(message)) {
        onConfirm();
      }
    }
  },

  // 알림 메시지
  notification: {
    success: (message) => {
      console.log('✅ 성공:', message);
      alert(`✅ ${message}`);
    },

    error: (message) => {
      console.error('❌ 오류:', message);
      alert(`❌ ${message}`);
    },

    info: (message) => {
      console.info('ℹ️ 정보:', message);
      alert(`ℹ️ ${message}`);
    },

    warning: (message) => {
      console.warn('⚠️ 경고:', message);
      alert(`⚠️ ${message}`);
    }
  },

  // 폼 유효성 검사
  validation: {
    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    isValidPassword: (password) => {
      return password && password.length >= 6;
    },

    isEmpty: (value) => {
      return !value || value.trim() === '';
    }
  },

  // 날짜 포맷팅
  formatDate: (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR');
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return '날짜 오류';
    }
  },

  // 로딩 상태 표시
  loading: {
    show: (element, text = '로딩 중...') => {
      if (element) {
        element.innerHTML = `<div class="loading-spinner"></div> ${text}`;
        element.disabled = true;
      }
    },

    hide: (element, originalText) => {
      if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
      }
    }
  },

  // 스크롤 관리
  scroll: {
    toTop: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    toElement: (elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  // 클립보드 복사
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      UIUtils.notification.success('클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      UIUtils.notification.error('클립보드 복사에 실패했습니다.');
    }
  }
};