// 언어 매핑 함수
export const mapLanguageToUI = (apiLanguage) => {
  const languageMap = {
    'Korean': '한국어',
    'English': 'English',
    'Japanese': '日本語',
    'Chinese': '中國語'
  };
  return languageMap[apiLanguage] || apiLanguage;
};

// 토큰 유틸리티 함수들
export const getStoredToken = () => {
  return localStorage.getItem('refreshToken');
};

export const storeToken = (token) => {
  if (token) {
    localStorage.setItem('refreshToken', token);
  }
};

export const removeToken = () => {
  localStorage.removeItem('refreshToken');
};

// 토큰 유효성 검사 (필요시 사용)
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // JWT 토큰인 경우 만료 시간 확인 (실제 구현은 토큰 형식에 따라 다름)
    // 현재는 단순히 토큰 존재 여부만 확인
    return true;
  } catch (error) {
    return false;
  }
};
