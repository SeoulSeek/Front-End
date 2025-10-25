// 방명록 단일 조회 페이지

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiLinkAlt } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { FaRegComment } from "react-icons/fa";
// useAuth 훅과 API 엔드포인트 import
import { useAuth } from "../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

import $ from "./PlacesDetail2.module.css";
import ScrollToTopBtn from "../../components/ScrollToTop/ScrollToTop";
import defaultProfileImg from "../../assets/PlacePage/profile_a.jpg"; // 기본 프로필 이미지
import HashTag from "../../components/global/HashTag/HashTag";

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  // --- API 데이터를 위한 상태 관리 ---
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLiked, setIsLiked] = useState(false); // 현재 유저의 좋아요 여부
  const [likeCount, setLikeCount] = useState(0); // 좋아요 개수
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 보이는 이미지 인덱스

  const [toastMessage, setToastMessage] = useState("");

  // --- useEffect를 사용한 데이터 Fetching ---
  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setError(null);
      console.log("PlaceDetail: 게시물 상세 정보 요청 시작, ID:", id);

      try {
        const token = localStorage.getItem("refreshToken");
        const headers = {
          "Content-Type": "application/json;charset=UTF-8",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_ENDPOINTS.REVIEW_DETAIL}/${id}`, {
          headers: headers,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `게시물을 불러오는 데 실패했습니다 (${response.status})`
          );
        }

        const result = await response.json();
        console.log("PlaceDetail: 데이터 조회 성공:", result.data);
        setPost(result.data);
        // API 응답에 현재 유저의 좋아요 여부(ex: isLiked)가 포함되있어야함.
        // 일단은 false로 초기화
        setLikeCount(result.data.like);
        setIsLiked(result.data.isLiked || false);
        // 작성자 확인: 로그인된 사용자의 ID와 게시물 작성자의 userId를 비교
      } catch (err) {
        console.error("PlaceDetail: 게시물 상세 정보 조회 중 에러:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostDetails();
  }, [id, auth]); // id나 로그인 상태가 변경되면 다시 데이터를 불러옴

  // --- 이벤트 핸들러 ---
  const handleLikeClick = async () => {
    // 좋아요 클릭 핸들러(추후 api연동 필요)
    if (!auth.user) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }

    // 좋아요 ui를 먼저 변경 후
    const originalLiked = isLiked;
    const originalLikeCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    // try {} api 요청 -> 실패시 ui 원복
  };

  const handleEdit = () => {
    navigate(`/places/edit/${id}`); // 수정 페이지로 이동
  };

  const handleDelete = async () => {
    // 방명록 삭제 핸들러(추후 api연동 필요)
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("refreshToken");
        const response = await fetch(`${API_ENDPOINTS.REVIEW_DELETE}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          alert("게시물이 삭제되었습니다.");
          navigate("/places"); // 삭제 후 목록 페이지로 이동
        } else {
          throw new Error("삭제에 실패했습니다.");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleKeyDown = (e) => {
    // 댓글 작성 핸들러
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 클립보드 복사 핸들러 함수
  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // 토스트 메시지 설정
      setToastMessage("URL이 클립보드에 복사되었습니다!");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      setToastMessage("복사에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      // 3초
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };
  // 프로필 클릭 핸들러
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${post.userId}`);
  };

  // --- 이미지 슬라이드 기능 ---
  const goToPrevious = () => {
    const isFirstImage = currentImageIndex === 0;
    const newIndex = isFirstImage
      ? allImages.length - 1
      : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentImageIndex === allImages.length - 1;
    const newIndex = isLastImage ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  // --- 로딩 및 에러 처리 ---
  if (isLoading) return <div className={$.statusMessage}>로딩 중...</div>;
  if (error) return <div className={$.statusMessage}>{error}</div>;
  if (!post)
    return <div className={$.statusMessage}>게시물을 찾을 수 없습니다.</div>;

  const isAuthor = auth.user && auth.user.id === post.userId;
  // fileURL이 배열이 아니면 배열로 감싸서 처리
  const allImages = Array.isArray(post.fileURL)
    ? post.fileURL
    : post.fileURL
    ? [post.fileURL]
    : [];
  const tags = post.tagList?.tagList?.map((tag) => tag.name) || [];

  return (
    <>
      <div className={$.placeDetailPage}>
        {/* 이미지 갤러리 */}
        <div className={$.imageGallery}>
          {/* 이미지가 1개 초과일 때만 화살표 표시 */}
          {allImages.length > 0 ? (
            <>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className={`${$.arrow} ${$.leftArrow}`}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={goToNext}
                    className={`${$.arrow} ${$.rightArrow}`}
                  >
                    &gt;
                  </button>
                </>
              )}
              <img
                src={allImages[currentImageIndex]}
                alt={`${post.title} 이미지 ${currentImageIndex + 1}`}
              />
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 게시물 콘텐츠 (댓글 영역 제외) */}
        <div className={$.postContent}>
          <h1 className={$.postTitle}>{post.title}</h1>
          <div className={$.postUserWrap}>
            <div className={$.miniProfile} onClick={handleProfileClick}>
              <img
                src={defaultProfileImg}
                alt={`${post.username} profile`}
                className={$.profileImage}
              />
              <span className={$.username}>{post.username}</span>
            </div>

            {/* 정보 (좋아요 + 댓글) */}
            <div className={$.postInfo}>
              <span className={$.postedDate}>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <div className={$.postCounts}>
                <button className={$.infoButton} onClick={handleLikeClick}>
                  {isLiked ? (
                    <AiFillHeart color="#ff4d4d" />
                  ) : (
                    <AiOutlineHeart />
                  )}
                  <span>{likeCount}</span>
                </button>
                <div className={$.infoItem}>
                  <FaRegComment />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={$.text}>{post.content}</div>

          {isAuthor && (
            <div className={$.authorActions}>
              <button onClick={handleEdit} className={$.editBtn}>
                수정
              </button>
              <button onClick={handleDelete} className={$.deleteBtn}>
                삭제
              </button>
            </div>
          )}

          <div className={$.hashtagContainer}>
            {post.tagList?.territory && (
              <HashTag text={post.tagList.territory} color="#91C6FF" />
            )}
            {post.tagList?.locationName && (
              <HashTag text={post.tagList.locationName} color="#968C6E" />
            )}
            {tags.map((tag, index) => {
              return <HashTag key={index} text={tag} color="#D3D9DF" />;
            })}
          </div>

          <div className={$.mapLink}>
            <button className={$.mapLinkBtn}>지도에서 보기</button>
            <BiLinkAlt size={25} onClick={handleCopyClipBoard} />
          </div>
        </div>

        {/* 댓글 영역 (postContent 밖으로 이동)*/}
        {/*<div className={$.comments}>
          <div className={$.commentFormWrap}>
            <form onSubmit={handleSubmit} className={$.commentForm}>
              <textarea
                value={newComment}
                rows="1"
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="댓글을 입력해 주세요."
              ></textarea>
              <button type="submit">등록</button>
            </form>
          </div>
          <ul className={$.commentList}>
            {comments.map((comment) => (
              <li key={comment.id} className={$.commentItem}>
                <span className={$.commentAuthor}>
                  {comment.author.username}
                </span>
                <span className={$.commentText}>{comment.content}</span>
                {comment.author.userId === currentUser.userId && (
                  <CgClose className={$.commentDelete} size={15} />
                )}
              </li>
            ))}
          </ul>
          <div className={$.commentEnd}>댓글 목록이 끝났어요.</div>
        </div>*/}
      </div>
      {toastMessage && <div className={$.toast}>{toastMessage}</div>}
      <ScrollToTopBtn />
    </>
  );
};

export default PlaceDetail;
