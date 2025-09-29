const getApiBaseUrl = () => {
  // 이전에 작동하던 IP 주소로 되돌리기
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
  AUTH_USER_PROFILE: `${API_BASE_URL}/auth/user/profile`,
  AUTH_REFRESH: `${API_BASE_URL}/auth/refresh`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  EMAIL_VALID: `${API_BASE_URL}/valid`,
};
