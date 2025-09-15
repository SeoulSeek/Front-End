const getApiBaseUrl = () => {
  // 개발 환경에서는 HTTP 사용, 프로덕션에서는 HTTPS 사용합니다
  if (import.meta.env.PROD) {
    return 'https://43.203.7.11:8080';
  } else {
    return 'http://43.203.7.11:8080';
  }
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  SIGN_IN: `${API_BASE_URL}/sign-in`,
  SIGN_UP: `${API_BASE_URL}/sign-up`,
  AUTH_USER: `${API_BASE_URL}/auth/user`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  EMAIL_VALID: `${API_BASE_URL}/valid`,
};
