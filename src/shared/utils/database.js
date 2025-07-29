/* ===========================================
   데이터베이스 관련 JavaScript 로직
   =========================================== */

// 계정 관리 유틸리티
export const DatabaseUtils = {
  // 계정 완전 삭제
  deleteAccount: async (supabase, userId) => {
    try {
      console.log('계정 삭제 시작:', userId);

      // 1. 운동 기록 삭제
      const { error: workoutDeleteError } = await supabase
        .from('workouts')
        .delete()
        .eq('account_id', userId);

      if (workoutDeleteError) {
        console.error('운동 기록 삭제 실패:', workoutDeleteError);
        throw new Error('운동 기록 삭제에 실패했습니다.');
      }

      // 2. 체중 기록 삭제  
      const { error: weightDeleteError } = await supabase
        .from('weight_records')
        .delete()
        .eq('account_id', userId);

      if (weightDeleteError) {
        console.error('체중 기록 삭제 실패:', weightDeleteError);
        throw new Error('체중 기록 삭제에 실패했습니다.');
      }

      // 3. 프로필 삭제
      const { error: profileDeleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('account_id', userId);

      if (profileDeleteError) {
        console.error('프로필 삭제 실패:', profileDeleteError);
        throw new Error('프로필 삭제에 실패했습니다.');
      }

      // 4. 계정 삭제
      const { error: accountDeleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', userId);

      if (accountDeleteError) {
        console.error('계정 삭제 실패:', accountDeleteError);
        throw new Error('계정 삭제에 실패했습니다.');
      }

      console.log('계정 삭제 완료');
      return true;
    } catch (error) {
      console.error('계정 삭제 중 오류:', error);
      throw error;
    }
  },

  // 사용자 프로필 조회
  getUserProfile: async (supabase, userId) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('account_id', userId)
        .single();

      if (profileError) {
        console.error('프로필 조회 실패:', profileError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('프로필 조회 중 오류:', error);
      return null;
    }
  },

  // 데이터베이스 연결 상태 확인
  checkDatabaseConnection: async (supabase) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('count')
        .limit(1);

      if (error) {
        console.error('데이터베이스 연결 실패:', error);
        return false;
      }

      console.log('데이터베이스 연결 성공');
      return true;
    } catch (error) {
      console.error('데이터베이스 연결 테스트 실패:', error);
      return false;
    }
  }
};