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
import Loading from "../../components/Loading/Loading";
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
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // --- useEffect를 사용한 데이터 Fetching ---
  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setError(null);
      console.log("[방명록 단일페이지]: 게시물 상세 정보 요청 시작, ID:", id);

      try {
        const token = localStorage.getItem("refreshToken");
        const headers = {
          "Content-Type": "application/json;charset=UTF-8",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        console.log(
          `[방명록 단일페이지] 요청 URL: ${API_ENDPOINTS.REVIEWS}/${id}`
        );
        const response = await fetch(`${API_ENDPOINTS.REVIEWS}/${id}`, {
          headers: headers,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `게시물을 불러오는 데 실패했습니다 (${response.status})`
          );
        }

        const result = await response.json();
        console.log("[방명록 단일페이지] 데이터 조회 성공:", result.data);
        setPost(result.data);
        // API 응답에 현재 유저의 좋아요 여부(ex: isLiked)가 포함되있어야함.
        // 일단은 false로 초기화
        setLikeCount(result.data.like || 0);
        setIsLiked(result.data.isLiked || false);
        setComments(result.data.commentList || []); // 댓글 상태 설정
      } catch (err) {
        console.error(
          "[방명록 단일페이지]: 게시물 상세 정보 조회 중 에러:",
          err
        );
        setError(err.message);
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

    try {
      const token = localStorage.getItem("refreshToken");
      if (!token) throw new Error("로그인이 필요합니다.");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${API_ENDPOINTS.REVIEWS_AUTH}/${id}/like`, {
        method: "PATCH",
        headers: headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`좋아요 처리 실패: (${response.status})`);
      }

      const result = await response.json();
      console.log("[좋아요] API 응답:", result);
      // 흠
    } catch (error) {
      console.error("[좋아요] 에러:", error);
      alert(error.message);
      setIsLiked(originalLiked);
      setLikeCount(originalLikeCount);
    }
  };

  const handleEdit = () => {
    navigate(`/places/edit/${id}`); // 수정 페이지로 이동
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("refreshToken");
        if (!token) {
          alert("삭제 권한이 없습니다. 다시 로그인해주세요.");
          auth.logout(); // 로그아웃 처리
          navigate("/login");
          return;
        }

        console.log(`[상세페이지] 삭제 방명록 ID: ${id}`);

        const response = await fetch(`${API_ENDPOINTS.REVIEWS_AUTH}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        console.log(`[상세페이지] 삭제 응답 상태: ${response.status}`);

        if (response.ok) {
          alert("게시물이 삭제되었습니다.");
          navigate("/places"); // 삭제 후 목록 페이지로 이동
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "작성에 실패했습니다.");
        }
      } catch (err) {
        console.error("[상세페이지] Error handleDelete:", err);
        alert(err.message || "삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmitComment = async (e, retryToken = null) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;
    if (!auth.user) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setIsSubmittingComment(true);
    const commentContent = newComment;

    // 댓글 작성 api
    try {
      const token = retryToken || localStorage.getItem("refreshToken");
      if (!token) throw new Error("로그인이 필요합니다.");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Beare ${token}`,
      };

      const response = await fetch(
        `${API_ENDPOINTS.REVIEWS_AUTH}/${id}/comment`,
        {
          method: "POST",
          headers: headers,
          credentials: "include",
          body: JSON.stringify({ content: commentContent }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setComments((prev) => [...prev, result.data]);
        setNewComment("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `댓글 작성 실패 (${response.status})`
        );
      }
    } catch (err) {
      console.error("[CommentSubmit] Error:", err);
      alert(err.message);
      setNewComment(commentContent);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleKeyDown = (e) => {
    // 댓글 작성 핸들러
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(e);
    }
  };

  const handleDeleteComment = async (commentIdToDelete, retryToken = null) => {
    if (!auth.user) return;
    const commentToDelete = comments.find(
      (c) => c.commentId === commentIdToDelete
    );
    if (auth.user.name !== commentToDelete?.userName) return;

    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        const token = retryToken || localStorage.getItem("refreshToken");
        if (!token) throw new Error("로그인이 필요합니다.");

        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(
          `${API_ENDPOINTS.COMMENTS}/${commentIdToDelete}`,
          {
            method: "DELETE",
            headers: headers,
            credentials: "include",
          }
        );

        if (response.ok) {
          setComments((prev) =>
            prev.filter((comment) => comment.commentId !== commentIdToDelete)
          );
          alert("댓글이 삭제되었습니다.");
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `댓글 삭제 실패 (${response.status})`
          );
        }
      } catch (err) {
        console.error("[댓글삭제] 에러:", err);
        alert(err.message);
      }
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
  if (isLoading) return <Loading />;
  if (error) return <div className={$.statusMessage}>{error}</div>;
  if (!post)
    return <div className={$.statusMessage}>게시물을 찾을 수 없습니다.</div>;

  const isAuthor = auth.user.name === post.username;
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
                src={post.userFileURL || defaultProfileImg}
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
        <div className={$.comments}>
          <div className={$.commentFormWrap}>
            <form onSubmit={handleSubmitComment} className={$.commentForm}>
              <textarea
                value={newComment}
                rows="1"
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="댓글을 입력해 주세요."
                disabled={!auth.user || isSubmittingComment}
              ></textarea>
              <button
                type="submit"
                disabled={
                  !auth.user || !newComment.trim() || isSubmittingComment
                }
              >
                등록
              </button>
            </form>
          </div>
          {comments.length > 0 ? (
            <ul className={$.commentList}>
              {comments.map((comment) => (
                <li key={comment.commentId} className={$.commentItem}>
                  <span className={$.commentAuthor}>{comment.userName}</span>
                  <span className={$.commentText}>{comment.content}</span>
                  {auth.user && auth.user.name === comment.userName && (
                    <CgClose
                      className={$.commentDelete}
                      size={15}
                      onClick={() => handleDeleteComment(comment.commentId)}
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className={$.commentEnd}>아직 댓글이 없습니다.</div>
          )}
          {comments.length > 0 && (
            <div className={$.commentEnd}>댓글 목록이 끝났어요.</div>
          )}
        </div>
      </div>
      {toastMessage && <div className={$.toast}>{toastMessage}</div>}
      <ScrollToTopBtn />
    </>
  );
};

export default PlaceDetail;
