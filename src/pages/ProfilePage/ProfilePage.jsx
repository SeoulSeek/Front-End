import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import defaultProfile from "../../assets/MyPage/defaultProfile.png";
import { useAuth } from "../../contexts/AuthContext";
import { mapLanguageToUI } from "../../hooks/auth";
import { API_ENDPOINTS } from "../../config/api";
import PlaceCard from "../../components/PlaceCard/PlaceCard";
import Pagination from "../../components/PlacesPage/Pagination";
import PostList from "../../components/PlacesPage/PostList";
import { DISTRICT_ENG_TO_KOR } from "../../config/mapping";

// API 언어 코드를 UI 언어로 매핑하는 함수
const mapApiLanguagesToUI = (apiLanguages) => {
  if (!Array.isArray(apiLanguages)) return [];
  return apiLanguages.map(lang => mapLanguageToUI(lang));
};

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshAuthToken } = useAuth();
  
  const [activeTab, setActiveTab] = useState("places");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [bookmarkedPlaces, setBookmarkedPlaces] = useState([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [userReviews, setUserReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewCurrentPage, setReviewCurrentPage] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);

  // 닉네임 길이 체크 (10자 이상이면 작은 크기 적용)
  const isVeryLongNickname = userData?.name && userData.name.length >= 10;

  // 현재 로그인한 유저가 본인의 프로필을 보려고 할 때 마이페이지로 리다이렉트
  useEffect(() => {
    if (currentUser && userId && String(currentUser.id) === String(userId)) {
      navigate('/mypage', { replace: true });
    }
  }, [currentUser, userId, navigate]);

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const response = await fetch(API_ENDPOINTS.OTHER_USER(userId), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setUserData(result.data);
          }
        } else if (response.status === 404) {
          alert('존재하지 않는 유저입니다.');
          navigate('/');
        }
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // 북마크한 장소 목록 가져오기
  useEffect(() => {
    const fetchBookmarkedPlaces = async () => {
      if (!userId || !userData || activeTab !== "places") {
        return;
      }

      // 장소가 비공개인 경우 API 호출하지 않음
      if (!userData.openLocation) {
        return;
      }

      try {
        setIsLoadingBookmarks(true);
        
        const response = await fetch(
          `${API_ENDPOINTS.OTHER_USER_BOOKMARK(userId)}?mobile=true&pageNumber=${currentPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setBookmarkedPlaces(result.data);
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
  }, [userId, userData, activeTab, currentPage]);

  // 방명록 목록 가져오기
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!userId || !userData || activeTab !== "guestbook") {
        return;
      }

      // 방명록이 비공개인 경우 API 호출하지 않음
      if (!userData.openReview) {
        return;
      }

      try {
        setIsLoadingReviews(true);
        
        const response = await fetch(
          `${API_ENDPOINTS.OTHER_USER_REVIEW(userId)}?mobile=true&pageNumber=${reviewCurrentPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.error === false && result.data) {
            setUserReviews(result.data);
            if (result.pageInfo && result.pageInfo.totalPages !== undefined) {
              setReviewTotalPages(result.pageInfo.totalPages);
            }
          }
        }
      } catch (error) {
        console.error('방명록 목록 가져오기 실패:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchUserReviews();
  }, [userId, userData, activeTab, reviewCurrentPage]);

  // 방명록 좋아요 토글 핸들러
  const handleReviewLikeToggle = async (postId, newIsLiked) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // UI 먼저 업데이트
    setUserReviews((prevReviews) =>
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
    } catch (error) {
      console.error('방명록 좋아요 토글 실패:', error);
      // 에러 발생 시 UI 롤백
      setUserReviews((prevReviews) =>
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

  // 유저 정보가 없는 경우
  if (!userData) {
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
              <span>유저 정보를 불러올 수 없습니다.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileImage = (userData.file && (
    userData.file.startsWith('http') || 
    userData.file.startsWith('/') ||
    userData.file.startsWith('blob:')
  )) ? userData.file : defaultProfile;

  const uiLanguages = mapApiLanguagesToUI(userData.language || []);

  return (
    <div className={styles.myContainer}>
      <div className={styles.myInfoContainer}>
        <div className={styles.profileWrapper}>
          <img
            src={profileImage}
            className={styles.profilePic}
            alt="프로필 이미지"
            onError={(e) => { e.target.src = defaultProfile; }}
          />
        </div>
        <div className={styles.myInfo}>
          <div className={styles.myName}>
            <span className={isVeryLongNickname ? styles.myNameSmall : ''}>
              <span className={styles.blue}>{userData.name || "사용자"}</span>님의 역사 탐험록
            </span>
          </div>

          <div className={styles.myLang}>
            {uiLanguages.map((lang) => (
              <span key={lang} className={styles.lang}>
                {lang}
              </span>
            ))}
          </div>

          <div className={styles.myStats}>
            <span className={styles.stats}>
              북마크 개수 {userData.bookmark || 0}
            </span>
            <span className={styles.stats}>
              좋아요 개수 {userData.like || 0}
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
              color: activeTab === "places" ? "#000000" : "#D3D9DF",
            }}
          >
            {userData.name}님의 장소
          </span>
          <span
            className={styles.tab}
            onClick={() => setActiveTab("guestbook")}
            style={{
              color: activeTab === "guestbook" ? "#000000" : "#D3D9DF",
            }}
          >
            {userData.name}님의 방명록
          </span>
        </div>
      </div>

      <div className={styles.listContainer}>
        {activeTab === "places" && (
          <div className={styles.placesList}>
            {!userData.openLocation ? (
              <span className={styles.emptyText}>목록 비공개 유저입니다.</span>
            ) : isLoadingBookmarks ? (
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
                        initialBookmarked={false}
                        disableBookmark={true}
                      />
                    ))}
                  </div>
                ) : currentPage === 0 ? (
                  <span className={styles.emptyText}>
                    북마크한 장소가 없습니다.
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
            {!userData.openReview ? (
              <span className={styles.emptyText}>목록 비공개 유저입니다.</span>
            ) : isLoadingReviews ? (
              <span className={styles.emptyText}>로딩 중...</span>
            ) : (
              <>
                {userReviews.length > 0 ? (
                  <div className={styles.reviewsContainer}>
                    <PostList
                      posts={userReviews}
                      lastPostRef={null}
                      onLikeToggle={handleReviewLikeToggle}
                    />
                  </div>
                ) : reviewCurrentPage === 0 ? (
                  <span className={styles.emptyText}>
                    작성한 방명록이 없습니다.
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
      </div>
    </div>
  );
};

export default ProfilePage;

