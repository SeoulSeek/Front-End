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
  REVIEWS_AUTH: `${API_BASE_URL}/auth/review`,
  REVIEWS: `${API_BASE_URL}/optional/review`,
  COMMENTS: `${API_BASE_URL}/auth/review/comment`,
  LOCATION_LIST: `${API_BASE_URL}/location`,
  DAILY_LOCATION: `${API_BASE_URL}/location/daily`,
  WEEKLY_COURSE: `${API_BASE_URL}/courses/weekly`,
  COURSES: `${API_BASE_URL}/optional/courses`,
  COURSE_DETAIL: (id) => `${API_BASE_URL}/optional/courses/${id}`,
  COURSE_SCRAP: (id) => `${API_BASE_URL}/auth/courses/${id}/scrap`,
  COURSE_SCRAP_LIST: `${API_BASE_URL}/auth/user/scrap`,
  LOCATION: `${API_BASE_URL}/location`,
  LOCATION_BOOKMARK: (id) => `${API_BASE_URL}/auth/location/${id}/book-mark`,
  LOCATION_DETAIL: (id) => `${API_BASE_URL}/optional/location/${id}`,
  LOCATION_VIEW: (id) => `${API_BASE_URL}/location/${id}/view`,
  LOCATION_RELATED_PLACES: (id) =>
    `${API_BASE_URL}/optional/location/${id}/places`,
  LOCATION_TEXT: (id) => `${API_BASE_URL}/location/${id}/text`,
  LOCATION_AUDIO: (id) => `${API_BASE_URL}/location/${id}/repaudio`,
  USER_BOOKMARK: `${API_BASE_URL}/auth/user/book-mark`,
  MINI_MAP: `${API_BASE_URL}/mini-map`,
};
