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

// 사용자 정보 가져오기
export const fetchUserInfo = async () => {
  try {
    const response = await fetch('http://43.203.7.11:8080/auth/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return {
        ...userData,
        language: userData.language?.map(mapLanguageToUI) || []
      };
    } else {
      throw new Error('사용자 정보를 가져올 수 없습니다.');
    }
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    throw error;
  }
};
