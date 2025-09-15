import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // 사용자 정보 가져오기
  const fetchUser = async () => {
    try {
      const response = await fetch('https://43.203.7.11:8080/auth/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = (userData) => {
    setUser(userData);
  };

  // 로그아웃
  const logout = async () => {
    try {
      if (user?.id) {
        await fetch('https://43.203.7.11:8080/auth/logout', {
          method: 'POST',
          credentials: 'include',
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
      setUser(null);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    isLoading,
    login,
    logout,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
