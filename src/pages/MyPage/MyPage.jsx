import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPage.module.css";
import defaultProfile from "../../assets/MyPage/defaultProfile.png";
import MyEditBtn from "../../components/MyEditBtn/MyEditBtn";
import MyPublicBtn from "../../components/MyPublicBtn/MyPublicBtn";
import {
  AiFillCheckSquare,
  AiOutlineCheckSquare,
} from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";
import { mapLanguageToUI } from "../../hooks/auth";
import CoursesBox from "../../components/CoursesBox/CoursesBox";
import { API_ENDPOINTS } from "../../config/api";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import Pagination from "../../components/PlacesPage/Pagination";
import PostList from "../../components/PlacesPage/PostList";
import PostBox from "../../components/PostBox/PostBox2";
import { DISTRICT_ENG_TO_KOR } from "../../config/mapping";

const LANGUAGES = ["한국어", "English", "中國語", "日本語"];

// API 언어 코드를 UI 언어로 매핑하는 함수
const mapApiLanguagesToUI = (apiLanguages) => {
  if (!Array.isArray(apiLanguages)) return [];
  return apiLanguages.map(lang => mapLanguageToUI(lang));
};

// UI 언어를 API 언어 코드로 매핑하는 함수
const mapUILanguagesToAPI = (uiLanguages) => {
  const reverseMap = {
    '한국어': 'Korean',
    'English': 'English',
    '日本語': 'Japanese',
    '中國語': 'Chinese'
  };
  return uiLanguages.map(lang => reverseMap[lang] || lang);
};

const MyPage = () => {
  const { user, isLoading, updateProfile, refreshAuthToken, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("places");
  const [isPublic, setIsPublic] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [tempName, setTempName] = useState(name);

  const [savedProfile, setSavedProfile] = useState(user?.file || defaultProfile);
  const [tempProfile, setTempProfile] = useState(savedProfile);
  const [tempProfileFile, setTempProfileFile] = useState(null); // 새로 선택된 파일 객체
  const fileInputRef = useRef(null);

  const [selectedLangs, setSelectedLangs] = useState([]);
  
  const [scrapCourses, setScrapCourses] = useState([]);
  const [isLoadingScrap, setIsLoadingScrap] = useState(false);
  
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [myReviews, setMyReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewCurrentPage, setReviewCurrentPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);

  const [likedReviews, setLikedReviews] = useState([]);
  const [isLoadingLikedReviews, setIsLoadingLikedReviews] = useState(false);
  const [likedReviewCurrentPage, setLikedReviewCurrentPage] = useState(0);
  const [likedReviewTotalPages, setLikedReviewTotalPages] = useState(0);

  // 닉네임 길이 체크 (10자 이상이면 작은 크기 적용)
  const isVeryLongNickname = name && name.length >= 10;

  // 페이지 진입 시 최신 사용자 정보 가져오기
  useEffect(() => {
    if (!isLoading) {
      fetchUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 사용자 정보가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTempName(user.name || "");
      
      // user.file이 유효한 URL인지 확인
      const profileImage = (user.file && (
        user.file.startsWith('http') || 
        user.file.startsWith('/') ||
        user.file.startsWith('blob:')
      )) ? user.file : defaultProfile;
      
      setSavedProfile(profileImage);
      setTempProfile(profileImage);
      
      // API에서 받은 영어 언어 코드를 UI 언어로 변환
      const uiLanguages = mapApiLanguagesToUI(user.language || []);
      setSelectedLangs(uiLanguages);
      
      // 공개 여부 초기화 (openLocation과 openReview가 모두 true일 때만 공개로 설정)
      setIsPublic(user.openLocation && user.openReview);
    }
  }, [user]);

  // 스크랩한 코스 목록 가져오기
  useEffect(() => {
    const fetchScrapCourses = async () => {
      if (!user) {
        return;
      }

      try {
        setIsLoadingScrap(true);
        const token = localStorage.getItem('refreshToken');
        
        if (!token) {
          return;
        }

        const response = await fetch(API_ENDPOINTS.COURSE_SCRAP_LIST, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          // 토큰 재발급 시도
          const newToken = await refreshAuthToken();
          if (newToken) {
            const retryResponse = await fetch(API_ENDPOINTS.COURSE_SCRAP_LIST, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${newToken}`,
              },
              credentials: 'include',
            });
            
            if (retryResponse.ok) {
              const result = await retryResponse.json();
              if (result.error === false && result.data) {
                setScrapCourses(result.data);
              }
            }
          }
          return;
        }

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setScrapCourses(result.data);
          }
        }
      } catch (error) {
        console.error('스크랩 코스 목록 가져오기 실패:', error);
      } finally {
        setIsLoadingScrap(false);
      }
    };

    fetchScrapCourses();
  }, [user, refreshAuthToken]);

  // 북마크한 장소 목록 가져오기
  useEffect(() => {
    const fetchBookmarkedPlaces = async () => {
      if (!user || activeTab !== "places") {
        return;
      }

      try {
        setIsLoadingBookmarks(true);
        const token = localStorage.getItem('refreshToken');
        
        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_ENDPOINTS.USER_BOOKMARK}?mobile=true&pageNumber=${currentPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );

        if (response.status === 401) {
          // 토큰 재발급 시도
          const newToken = await refreshAuthToken();
          if (newToken) {
            const retryResponse = await fetch(
              `${API_ENDPOINTS.USER_BOOKMARK}?mobile=true&pageNumber=${currentPage}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': `Bearer ${newToken}`,
                },
                credentials: 'include',
              }
            );
            
            if (retryResponse.ok) {
              const result = await retryResponse.json();
              if (result.error === false && result.data) {
                setBookmarkedPlaces(result.data);
                // pageInfo에서 전체 페이지 수 가져오기
                if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
                  setTotalPages(result.pageInfo.totalPages);
                }
              }
            }
          }
          return;
        }

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setBookmarkedPlaces(result.data);
            // pageInfo에서 전체 페이지 수 가져오기
            if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
              setTotalPages(result.pageInfo.totalPages);
            }
          }
        }
      } catch (error) {
        console.error('북마크 장소 목록 가져오기 실패:', error);
      } finally {
        setIsLoadingBookmarks(false);
      }
    };

    fetchBookmarkedPlaces();
  }, [user, activeTab, currentPage, refreshAuthToken]);

  // 나의 방명록 목록 가져오기
  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!user || activeTab !== "guestbook") {
        return;
      }

      try {
        setIsLoadingReviews(true);
        const token = localStorage.getItem('refreshToken');
        
        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_ENDPOINTS.USER_REVIEW}?mobile=true&pageNumber=${reviewCurrentPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );

        if (response.status === 401) {
          // 토큰 재발급 시도
          const newToken = await refreshAuthToken();
          if (newToken) {
            const retryResponse = await fetch(
              `${API_ENDPOINTS.USER_REVIEW}?mobile=true&pageNumber=${reviewCurrentPage}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': `Bearer ${newToken}`,
                },
                credentials: 'include',
              }
            );
            
            if (retryResponse.ok) {
              const result = await retryResponse.json();
              if (result.error === false && result.data) {
                setMyReviews(result.data);
                // pageInfo에서 전체 페이지 수 가져오기
                if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
                  setReviewTotalPages(result.pageInfo.totalPages);
                }
              }
            }
          }
          return;
        }

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setMyReviews(result.data);
            // pageInfo에서 전체 페이지 수 가져오기
            if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
              setReviewTotalPages(result.pageInfo.totalPages);
            }
          }
        }
      } catch (error) {
        console.error('나의 방명록 목록 가져오기 실패:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchMyReviews();
  }, [user, activeTab, reviewCurrentPage, refreshAuthToken]);

  // 좋아요한 방명록 목록 가져오기
  useEffect(() => {
    const fetchLikedReviews = async () => {
      if (!user) {
        return;
      }

      try {
        setIsLoadingLikedReviews(true);
        const token = localStorage.getItem('refreshToken');
        
        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_ENDPOINTS.USER_REVIEW_LIKE}?mobile=true&pageNumber=${likedReviewCurrentPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );

        if (response.status === 401) {
          // 토큰 재발급 시도
          const newToken = await refreshAuthToken();
          if (newToken) {
            const retryResponse = await fetch(
              `${API_ENDPOINTS.USER_REVIEW_LIKE}?mobile=true&pageNumber=${likedReviewCurrentPage}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': `Bearer ${newToken}`,
                },
                credentials: 'include',
              }
            );
            
            if (retryResponse.ok) {
              const result = await retryResponse.json();
              if (result.error === false && result.data) {
                setLikedReviews(result.data);
                // pageInfo에서 전체 페이지 수 가져오기
                if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
                  setLikedReviewTotalPages(result.pageInfo.totalPages);
                }
              }
            }
          }
          return;
        }

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setLikedReviews(result.data);
            // pageInfo에서 전체 페이지 수 가져오기
            if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
              setLikedReviewTotalPages(result.pageInfo.totalPages);
            }
          }
        }
      } catch (error) {
        console.error('좋아요한 방명록 목록 가져오기 실패:', error);
      } finally {
        setIsLoadingLikedReviews(false);
      }
    };

    fetchLikedReviews();
  }, [user, likedReviewCurrentPage, refreshAuthToken]);

  const handleEditClick = async () => {
    if (isEditing) {
      // 닉네임 길이 체크
      const trimmedName = tempName.trim();
      const nameToUse = trimmedName || name;
      
      // 닉네임이 20자를 초과하면 alert 표시하고 API 호출 중단
      if (nameToUse.length > 20) {
        alert('닉네임은 20자 이내로 작성해 주세요.');
        return;
      }
      
      try {
        // API에 전송할 데이터 준비
        const apiLanguages = mapUILanguagesToAPI(selectedLangs);
        
        const profileData = {
          name: nameToUse,
          file: tempProfileFile || savedProfile, // 새 파일 객체 또는 기존 URL
          languages: apiLanguages
        };

        // API 호출
        const result = await updateProfile(profileData);
        
        if (result.success) {
          // 성공 시 로컬 상태 업데이트
          setName(nameToUse);
          setSavedProfile(tempProfile);
          setTempProfileFile(null); // 파일 객체 초기화
          setIsEditing(false);
          alert('프로필이 성공적으로 업데이트되었습니다.');
        } else {
          alert(result.message || '프로필 업데이트에 실패했습니다.');
        }
      } catch (error) {
        console.error('프로필 업데이트 중 오류:', error);
        alert('프로필 업데이트 중 오류가 발생했습니다.');
      }
    } else {
      setTempName(name);
      setTempProfile(savedProfile);
      setTempProfileFile(null);
      setIsEditing(true);
    }
  };

  const toggleLang = (lang) => {
    setSelectedLangs((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 미리보기용 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setTempProfile(previewUrl);
      // 실제 파일 객체 저장
      setTempProfileFile(file);
    }
  };

  const handleContainerClick = () => {
    if (!user) {
      navigate('/login');
    }
  };

  // 공개/비공개 토글 핸들러
  const handlePublicToggle = async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 현재 상태의 반대값으로 설정
      const newPublicState = !isPublic;
      const requestBody = {
        openLocation: newPublicState,
        openReview: newPublicState,
      };

      const response = await fetch(API_ENDPOINTS.USER_LOCATION_PUBLIC, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        // 토큰 재발급 시도
        const newToken = await refreshAuthToken();
        if (newToken) {
          const retryResponse = await fetch(API_ENDPOINTS.USER_LOCATION_PUBLIC, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${newToken}`,
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
          });
          
          if (retryResponse.ok) {
            setIsPublic(newPublicState);
            fetchUser(); // 사용자 정보 업데이트
            return;
          }
        }
        alert('인증에 실패했습니다.');
        return;
      }

      if (response.ok) {
        setIsPublic(newPublicState);
        fetchUser(); // 사용자 정보 업데이트
      } else {
        alert('공개 설정 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('공개 설정 변경 중 오류:', error);
      alert('공개 설정 변경 중 오류가 발생했습니다.');
    }
  };

  // 방명록 좋아요 토글 핸들러
  const handleReviewLikeToggle = async (postId, newIsLiked) => {
    // UI 먼저 업데이트
    setMyReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === postId
          ? {
              ...review,
              isLiked: newIsLiked,
              like: newIsLiked ? review.like + 1 : review.like - 1,
            }
          : review
      )
    );

    try {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch(
        `${API_ENDPOINTS.REVIEWS_AUTH}/${postId}/like`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (response.status === 401) {
        // 토큰 재발급 시도
        const newToken = await refreshAuthToken();
        if (newToken) {
          const retryResponse = await fetch(
            `${API_ENDPOINTS.REVIEWS_AUTH}/${postId}/like`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${newToken}`,
              },
              credentials: 'include',
            }
          );
          
          if (!retryResponse.ok) {
            throw new Error('좋아요 처리에 실패했습니다.');
          }
        } else {
          throw new Error('인증에 실패했습니다.');
        }
      } else if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }

      // 사용자 정보 업데이트 (좋아요 개수 갱신)
      fetchUser();
    } catch (error) {
      console.error('방명록 좋아요 토글 실패:', error);
      // 에러 발생 시 UI 롤백
      setMyReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === postId
            ? {
                ...review,
                isLiked: !newIsLiked,
                like: !newIsLiked ? review.like + 1 : review.like - 1,
              }
            : review
        )
      );
    }
  };

  // 좋아요한 방명록의 좋아요 토글 핸들러 (해제 시 리스트에서 제거)
  const handleLikedReviewToggle = async (postId, newIsLiked) => {
    if (!newIsLiked) {
      // 좋아요 해제 시 즉시 리스트에서 제거
      setLikedReviews(prev => prev.filter(review => review.id !== postId));
      
      // 현재 페이지에 데이터가 없으면 이전 페이지로 이동
      const filtered = likedReviews.filter(review => review.id !== postId);
      if (filtered.length === 0 && likedReviewCurrentPage > 0) {
        setLikedReviewCurrentPage(likedReviewCurrentPage - 1);
      }
    } else {
      // 좋아요 추가 시 UI 업데이트
      setLikedReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === postId
            ? {
                ...review,
                isLiked: newIsLiked,
                like: review.like + 1,
              }
            : review
        )
      );
    }

    try {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch(
        `${API_ENDPOINTS.REVIEWS_AUTH}/${postId}/like`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (response.status === 401) {
        // 토큰 재발급 시도
        const newToken = await refreshAuthToken();
        if (newToken) {
          const retryResponse = await fetch(
            `${API_ENDPOINTS.REVIEWS_AUTH}/${postId}/like`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${newToken}`,
              },
              credentials: 'include',
            }
          );
          
          if (!retryResponse.ok) {
            throw new Error('좋아요 처리에 실패했습니다.');
          }
        } else {
          throw new Error('인증에 실패했습니다.');
        }
      } else if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.');
      }

      // 사용자 정보 업데이트 (좋아요 개수 갱신)
      fetchUser();
    } catch (error) {
      console.error('좋아요한 방명록 토글 실패:', error);
      
      // 에러 발생 시 UI 롤백
      if (!newIsLiked) {
        // 좋아요 해제 실패 시 다시 리스트에 추가해야 하므로 전체 다시 로드
        // (순서를 유지하기 어려우므로)
        // 간단하게는 페이지를 다시 로드하도록 트리거
        setLikedReviewCurrentPage(prev => prev); // 강제로 재로드 트리거
      } else {
        // 좋아요 추가 실패 시 롤백
        setLikedReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === postId
              ? {
                  ...review,
                  isLiked: false,
                  like: review.like - 1,
                }
              : review
          )
        );
      }
    }
  };

  // 로그인하지 않은 경우
  if (!isLoading && !user) {
    return (
      <div 
        className={styles.myContainer}
        onClick={handleContainerClick}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.myInfoContainer}>
          <div className={styles.profileWrapper}>
            <img
              src={defaultProfile}
              className={styles.profilePic}
              alt="기본 프로필 이미지"
              onError={(e) => { e.target.src = defaultProfile; }}
            />
          </div>
          <div className={styles.myInfo}>
            <div className={styles.myName}>
              <span>로그인해주세요.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className={styles.myContainer}>
        <div className={styles.myInfoContainer}>
          <div className={styles.profileWrapper}>
            <img
              src={defaultProfile}
              className={styles.profilePic}
              alt="기본 프로필 이미지"
              onError={(e) => { e.target.src = defaultProfile; }}
            />
          </div>
          <div className={styles.myInfo}>
            <div className={styles.myName}>
              <span>로딩 중...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인한 경우
  return (
    <div className={styles.myContainer}>
      <div className={styles.myInfoContainer}>
        <div className={styles.profileWrapper}>
          <img
            src={isEditing ? tempProfile : savedProfile}
            className={styles.profilePic}
            alt="프로필 이미지"
            onError={(e) => { e.target.src = defaultProfile; }}
          />
          {isEditing && tempProfile === savedProfile && (
            <div
              className={styles.overlay}
              onClick={() => fileInputRef.current.click()}
            >
              업로드
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className={styles.myInfo}>
          <div className={styles.myName}>
            {isEditing ? (
              <input
                type="text"
                className={styles.nameInput}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="닉네임을 입력해 주세요"
              />
            ) : (
              <span className={isVeryLongNickname ? styles.myNameSmall : ''}>
                <span className={styles.blue}>{name || "사용자"}</span>님의 역사 탐험록
              </span>
            )}
          </div>

          {isEditing ? (
            <div className={styles.langSelector}>
              {LANGUAGES.map((lang) => (
                <div
                  key={lang}
                  className={styles.langItem}
                  onClick={() => toggleLang(lang)}
                >
                  {selectedLangs.includes(lang) ? (
                    <AiFillCheckSquare size={20} color="#000" />
                  ) : (
                    <AiOutlineCheckSquare size={20} color="#91C6FF" />
                  )}
                  <span
                    className={styles.langText}
                    style={{
                      color: selectedLangs.includes(lang)
                        ? "#000"
                        : "#91C6FF",
                    }}
                  >
                    {lang}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.myLang}>
              {selectedLangs.map((lang) => (
                <span key={lang} className={styles.lang}>
                  {lang}
                </span>
              ))}
            </div>
          )}

          <div className={styles.myStats}>
            <span className={styles.stats}>
              북마크 개수 {user?.bookmark || 0}
            </span>
            <span className={styles.stats}>
              작성한 방명록 수 {user?.like || 0}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.myMenuContainer}>
        <div className={styles.tabMenu}>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("places")}
            style={{
              color:
                activeTab === "places" ? "#000000" : "#D3D9DF",
            }}
          >
            나의 장소
          </span>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("guestbook")}
            style={{
              color:
                activeTab === "guestbook"
                  ? "#000000"
                  : "#D3D9DF",
            }}
          >
            나의 방명록
          </span>
        </div>
        <div className={styles.btnMenu}>
          <MyPublicBtn
            isPublic={isPublic}
            onClick={handlePublicToggle}
          />
          <MyEditBtn
            isEditing={isEditing}
            onClick={handleEditClick}
          />
        </div>
      </div>

      <div className={styles.listContainer}>
        {activeTab === "places" && (
          <div className={styles.placesList}>
            {isLoadingBookmarks ? (
              <span className={styles.emptyText}>로딩 중...</span>
            ) : (
              <>
                {bookmarkedPlaces.length > 0 ? (
                  <div className={styles.bookmarkedPlacesContainer}>
                    {bookmarkedPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        id={place.id}
                        placeName={place.name}
                        imageUrl={place.file}
                        hideDistance={true}
                        variant="light"
                        initialBookmarked={true}
                        onBookmarkChange={(placeId, isBookmarked) => {
                          if (!isBookmarked) {
                            // 북마크 해제 시 리스트에서 제거
                            setBookmarkedPlaces(prev => prev.filter(p => p.id !== placeId));
                            // 현재 페이지에 데이터가 없으면 이전 페이지로 이동
                            const filtered = bookmarkedPlaces.filter(p => p.id !== placeId);
                            if (filtered.length === 0 && currentPage > 0) {
                              setCurrentPage(currentPage - 1);
                            }
                            // 사용자 정보 업데이트 (북마크 개수 갱신)
                            fetchUser();
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : currentPage === 0 ? (
                  <span className={styles.emptyText}>
                    지도에서 다양한 서울을 경험해 보세요!
                  </span>
                ) : null}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageClick={(page) => setCurrentPage(page - 1)}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "guestbook" && (
          <div className={styles.logList}>
            {isLoadingReviews ? (
              <span className={styles.emptyText}>로딩 중...</span>
            ) : (
              <>
                {myReviews.length > 0 ? (
                  <div className={styles.reviewsContainer}>
                    <PostList
                      posts={myReviews}
                      lastPostRef={null}
                      onLikeToggle={handleReviewLikeToggle}
                    />
                  </div>
                ) : reviewCurrentPage === 0 ? (
                  <span className={styles.emptyText}>
                    관광 기록을 방명록으로 남겨 보는 건 어떨까요?
                  </span>
                ) : null}
                {reviewTotalPages > 1 && (
                  <Pagination
                    currentPage={reviewCurrentPage + 1}
                    totalPages={reviewTotalPages}
                    onPageClick={(page) => setReviewCurrentPage(page - 1)}
                  />
                )}
              </>
            )}
          </div>
        )}

        <span className={styles.listTitle}>스크랩한 관광코스</span>
        <div className={styles.scrapList}>
          {isLoadingScrap ? (
            <span className={styles.emptyText}>로딩 중...</span>
          ) : scrapCourses.length > 0 ? (
            scrapCourses.map((course) => (
              <CoursesBox
                key={course.id}
                id={course.id}
                title={course.title}
                content={course.content}
                image={course.imageUrl}
                scrapped={course.scrapped}
                totalLocations={course.totalLocations}
                landmarkTourElements={course.landmarkTourElements}
                specialTourElements={course.specialTourElements}
                missionTourElements={course.missionTourElements}
                onScrapChange={(courseId, isScrapped) => {
                  if (!isScrapped) {
                    // 스크랩 해제 시 리스트에서 제거
                    setScrapCourses(prev => prev.filter(c => c.id !== courseId));
                    // 사용자 정보 업데이트
                    fetchUser();
                  }
                }}
              />
            ))
          ) : (
            <span className={styles.emptyText}>
              스크랩한 관광코스가 없습니다.
            </span>
          )}
        </div>

        <span className={styles.listTitle}>좋아요를 누른 방명록</span>
        <div className={styles.likeList}>
          {isLoadingLikedReviews ? (
            <span className={styles.emptyText}>로딩 중...</span>
          ) : (
            <>
              {likedReviews.length > 0 ? (
                likedReviews.map((post) => {
                  const apiTags = post.tags || [];
                  const placeName = apiTags[0];
                  const districtEng = apiTags[1];
                  const keywordTags = apiTags.slice(2);

                  const districtKor = DISTRICT_ENG_TO_KOR[districtEng?.toUpperCase()] || districtEng;

                  const displayHashtags = [];
                  if (districtKor) displayHashtags.push(districtKor);
                  if (placeName) displayHashtags.push(placeName);
                  displayHashtags.push(...keywordTags);

                  const postProps = {
                    id: post.id,
                    title: post.title,
                    hashtags: displayHashtags,
                    author: {
                      userId: post.userId,
                      username: post.username,
                      profileImage: post.fileURL || null,
                    },
                    likes: post.like,
                    isLiked: post.isLiked || false,
                    comments: post.comments,
                  };

                  return (
                    <PostBox 
                      key={post.id}
                      {...postProps}
                      onLikeToggle={handleLikedReviewToggle}
                    />
                  );
                })
              ) : likedReviewCurrentPage === 0 ? (
                <span className={styles.emptyText}>
                  좋아요한 방명록이 없습니다.
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
