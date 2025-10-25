const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "https://seoulseek.com";
  } else {
    return "https://seoulseek.com";
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
  REVIEW_CREATE: `${API_BASE_URL}/auth/review`,
  REVIEW_DETAIL: `${API_BASE_URL}/auth/review`,
  REVIEW_DELETE: `${API_BASE_URL}/review/delete`,
  DAILY_LOCATION: `${API_BASE_URL}/location/daily`,
  WEEKLY_COURSE: `${API_BASE_URL}/courses/weekly`,
  COURSES: `${API_BASE_URL}/courses`,
  COURSE_DETAIL: (id) => `${API_BASE_URL}/courses/${id}`,
  COURSE_SCRAP: (id) => `${API_BASE_URL}/auth/courses/${id}/scrap`,
};
