import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(null);

  // 로컬 스토리지에서 토큰 가져오기
  const getStoredToken = () => {
    return localStorage.getItem('refreshToken');
  };

  // 로컬 스토리지에 토큰 저장
  const storeToken = (token) => {
    if (token) {
      localStorage.setItem('refreshToken', token);
      setRefreshToken(token);
    }
  };

  // 토큰 제거
  const removeToken = () => {
    localStorage.removeItem('refreshToken');
    setRefreshToken(null);
  };

  // 토큰 재발급
  const refreshAuthToken = async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setIsLoading(false);
      return null;
    }

    try {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      };
      
      // Authorization 헤더에도 토큰 추가
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        console.log('토큰 재발급 요청에 Authorization 헤더 추가');
      }

      const response = await fetch(API_ENDPOINTS.AUTH_REFRESH, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          refreshToken: storedToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.refreshToken) {
          storeToken(data.refreshToken);
          return data.refreshToken;
        }
      } else {
        // 토큰이 유효하지 않음
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
      removeToken();
      setUser(null);
    }
    
    return null;
  };

  // 사용자 정보 가져오기
  const fetchUser = async () => {
    const token = getStoredToken();
    if (!token) {
      console.log('토큰이 없어서 사용자 정보를 가져올 수 없습니다.');
      return null;
    }

    try {
      console.log('사용자 정보 요청 URL:', API_ENDPOINTS.AUTH_USER);

      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      };
      
      // 토큰이 있으면 Authorization 헤더에 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization 헤더 추가:', `Bearer ${token.substring(0, 20)}...`);
      }

      const response = await fetch(API_ENDPOINTS.AUTH_USER, {
        method: 'GET',
        headers,
        credentials: 'include', // 쿠키 기반 인증도 지원
      });

      console.log('사용자 정보 응답 상태:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('사용자 정보 응답 본문:', responseText);

      if (response.ok) {
        if (responseText.trim()) {
          try {
            const responseData = JSON.parse(responseText);
            console.log('사용자 정보 응답:', responseData);
            
            // 실제 API 응답 형식에 맞게 처리
            if (responseData.error === false && responseData.data) {
              // 성공 응답인 경우 data 객체에서 사용자 정보 추출
              const userData = responseData.data;
              console.log('사용자 정보:', userData);
              setUser(userData);
              return userData;
            } else if (responseData.name || responseData.email) {
              // 직접 사용자 정보가 최상위에 있는 경우
              console.log('사용자 정보 (직접):', responseData);
              setUser(responseData);
              return responseData;
            } else {
              console.warn('사용자 정보를 찾을 수 없습니다:', responseData);
              setUser(null);
              return null;
            }
          } catch (jsonError) {
            console.error('사용자 정보 JSON 파싱 에러:', jsonError);
            setUser(null);
            return null;
          }
        } else {
          console.warn('사용자 정보 응답이 비어있습니다.');
          setUser(null);
          return null;
        }
      } else if (response.status === 401) {
        console.log('사용자 정보 요청 시 401 에러, 토큰 재발급 시도...');
        // 토큰이 만료되었을 가능성이 있으므로 재발급 시도
        const newToken = await refreshAuthToken();
        if (newToken) {
          // 재발급 성공 시 다시 사용자 정보 요청
          console.log('토큰 재발급 성공, 사용자 정보 재요청...');
          return await fetchUser();
        } else {
          console.log('토큰 재발급 실패, 로그아웃 처리');
          setUser(null);
          return null;
        }
      } else {
        console.error('사용자 정보 요청 실패:', response.status, responseText);
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      setUser(null);
      return null;
    }
  };

  // 로그인 (토큰을 받아서 저장)
  const login = async (loginData) => {
    try {
      console.log('로그인 요청 URL:', API_ENDPOINTS.SIGN_IN);
      console.log('로그인 요청 데이터:', loginData);
      console.log('API Base URL:', import.meta.env.PROD ? 'PROD' : 'DEV', API_BASE_URL);

      const response = await fetch(API_ENDPOINTS.SIGN_IN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('로그인 응답 상태:', response.status, response.statusText);
      console.log('로그인 응답 헤더:', Object.fromEntries(response.headers.entries()));

      // 응답 본문을 텍스트로 먼저 읽어서 확인
      const responseText = await response.text();
      console.log('로그인 응답 본문:', responseText);

      if (response.ok) {
        // 응답이 비어있지 않은 경우에만 JSON 파싱 시도
        if (responseText.trim()) {
          try {
            const responseData = JSON.parse(responseText);
            console.log('로그인 응답 파싱 결과:', responseData);
            
            // 실제 API 응답 형식에 맞게 처리
            if (responseData.error === false) {
              // 성공 응답인 경우
              const data = responseData.data;
              
              if (data && data.refreshToken) {
                // refreshToken이 data 객체 안에 있는 경우
                storeToken(data.refreshToken);
                console.log('refreshToken 저장 완료:', data.refreshToken);
                // 로그인 성공 후 사용자 정보 가져오기
                await fetchUser();
                return { success: true };
              } else if (responseData.refreshToken) {
                // refreshToken이 최상위에 있는 경우 (명세서 형식)
                storeToken(responseData.refreshToken);
                console.log('refreshToken 저장 완료:', responseData.refreshToken);
                await fetchUser();
                return { success: true };
              } else {
                // refreshToken이 없는 경우
                console.warn('refreshToken이 응답에 없습니다:', responseData);
                console.warn('data 객체 내용:', data);
                
                // 로그인은 성공했지만 토큰이 없는 경우 (쿠키 기반일 수 있음)
                if (responseData.error === false) {
                  console.log('토큰 없이 로그인 성공, 사용자 정보 가져오기 시도');
                  await fetchUser();
                  return { success: true };
                } else {
                  return { success: false, message: 'refreshToken을 받지 못했습니다.' };
                }
              }
            } else {
              // 에러 응답인 경우
              const errorMessage = responseData.message || '로그인에 실패했습니다.';
              console.error('로그인 실패:', errorMessage);
              return { success: false, message: errorMessage };
            }
          } catch (jsonError) {
            console.error('JSON 파싱 에러:', jsonError);
            return { success: false, message: '서버 응답을 처리할 수 없습니다.' };
          }
        } else {
          // 응답이 비어있는 경우
          console.warn('서버에서 빈 응답을 받았습니다.');
          return { success: false, message: '서버에서 올바른 응답을 받지 못했습니다.' };
        }
      } else {
        // 에러 응답 처리
        let errorMessage = '로그인에 실패했습니다.';
        
        if (response.status === 500) {
          console.error('서버 내부 오류 발생. API 서버 상태를 확인해주세요.');
          errorMessage = '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          
          // 500 에러 추가 정보
          console.error('API 서버 응답:', responseText || '응답 없음');
        }
        
        if (responseText.trim()) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error('에러 응답 JSON 파싱 실패:', jsonError);
            errorMessage = `서버 에러 (${response.status}): ${responseText || response.statusText}`;
          }
        } else {
          errorMessage = `서버 에러 (${response.status}): ${response.statusText}`;
        }
        
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      return { success: false, message: '서버 연결에 실패했습니다.' };
    }
  };

  // 프로필 업데이트
  const updateProfile = async (profileData) => {
    const token = getStoredToken();
    if (!token) {
      return { success: false, message: '로그인이 필요합니다.' };
    }

    try {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      };
      
      // Authorization 헤더에 토큰 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('프로필 업데이트 요청에 Authorization 헤더 추가');
      }

      const response = await fetch(API_ENDPOINTS.AUTH_USER_PROFILE, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // 프로필 업데이트 성공 시 사용자 정보 다시 가져오기
        await fetchUser();
        return { success: true };
      } else if (response.status === 401) {
        // 토큰이 만료되었을 가능성이 있으므로 재발급 시도
        const newToken = await refreshAuthToken();
        if (newToken) {
          // 재발급 성공 시 다시 프로필 업데이트 요청
          return await updateProfile(profileData);
        } else {
          return { success: false, message: '인증이 만료되었습니다. 다시 로그인해주세요.' };
        }
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || '프로필 업데이트에 실패했습니다.' };
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      return { success: false, message: '서버 연결에 실패했습니다.' };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      if (user?.id) {
        await fetch(API_ENDPOINTS.AUTH_LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
            id: user.id
          }),
        });
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      removeToken();
      setUser(null);
    }
  };

  // 초기화 시 토큰 확인
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        setRefreshToken(storedToken);
        // 토큰이 있으면 사용자 정보 가져오기 시도
        await fetchUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    user,
    isLoading,
    refreshToken,
    login,
    logout,
    fetchUser,
    updateProfile,
    refreshAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
