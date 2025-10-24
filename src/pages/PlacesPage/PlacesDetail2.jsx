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
import sampleImg from "../../assets/PlacePage/sample.jpg";
import defaultProfileImg from "../../assets/PlacePage/profile_a.jpg"; // 기본 프로필 이미지
import dummyPosts from "../../data/dummyPosts";
import HashTag from "../../components/global/HashTag/HashTag";

// 현재 로그인한 사용자를 가정하는 데이터 (실제 앱에서는 Redux, Context API 등으로 관리)
const currentUser = {
  userId: "user456",
  username: "산책러버",
  profileImage: "/images/profiles/user456.jpg",
};

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  // --- API 데이터를 위한 상태 관리 ---
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  // const post = dummyPosts.find((p) => p.id === parseInt(id));

  // --- useEffect를 사용한 데이터 Fetching ---
  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_ENDPOINTS.REVIEW_DETAIL}/${id}`);
        if (!response.ok) {
          throw new Error("게시물을 불러오는 데 실패했습니다.");
        }
        const result = await response.json();
        setPost(result.data);

        // 작성자 확인: 로그인된 사용자의 ID와 게시물 작성자의 userId를 비교
        if (auth.user && auth.user.id === result.data.userId) {
          setIsAuthor(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostDetails();
  }, [id, auth.user]); // id나 로그인 상태가 변경되면 다시 데이터를 불러옴

  // --- 이벤트 핸들러 ---
  const handleEdit = () => {
    navigate(`/places/edit/${id}`); // 수정 페이지로 이동
  };

  const handleDelete = async () => {
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

  // --- 로딩 및 에러 처리 ---
  if (isLoading) return <div className={$.statusMessage}>로딩 중...</div>;
  if (error) return <div className={$.statusMessage}>{error}</div>;
  if (!post)
    return <div className={$.statusMessage}>게시물을 찾을 수 없습니다.</div>;

  // --- API 데이터와 컴포넌트 데이터 매핑 ---
  //const allImages = post.fileURL ? [post.fileURL] : [];
  const tags = post.tagList?.tagList?.map((tag) => tag.name) || [];

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.stats.likes);
  const handleLikeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
  };

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: {
          userId: "user456",
          username: "산책러버",
          profileImage: "/images/profiles/user456.jpg",
        },
        content: newComment,
        createdAt: new Date().toLocaleDateString(),
      },
    ]);
    setNewComment("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const [toastMessage, setToastMessage] = useState("");

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
    navigate(`/profile/${author.userId}`);
  };
  // --- 이미지 슬라이드 기능 추가 ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // post.content.images와 sampleImg를 합쳐서 하나의 배열로
  // useMemo를 사용해 post가 변경될 때만 배열을 다시 생성.
  const allImages = useMemo(() => {
    const images = post.content.images || [];
    return [...images, sampleImg];
  }, [post]);

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

  return (
    <>
      {/* 전체 페이지를 감싸는 컨테이너 */}
      <div className={$.placeDetailPage}>
        {/* 1. 이미지 갤러리 */}
        <div className={$.imageGallery}>
          {/* 이미지가 1개 초과일 때만 화살표 표시 */}
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
            alt={`이미지 ${currentImageIndex + 1}`}
          />
        </div>

        {/* 2. 게시물 콘텐츠 (댓글 영역 제외) */}
        <div className={$.postContent}>
          <h1 className={$.postTitle}>{post.title}</h1>
          <div className={$.postUserWrap}>
            <div className={$.miniProfile} onClick={handleProfileClick}>
              <img
                src={post.author.profileImage || defaultProfileImg}
                alt={`${post.author.username} profile`}
                className={$.profileImage}
              />
              <span className={$.username}>{post.author.username}</span>
            </div>

            {/* 2. 정보 (좋아요 + 댓글) */}
            <div className={$.postInfo}>
              <span className={$.postedDate}>{post.metadata.createdAt}</span>
              <div className={$.postCounts}>
                <button className={$.infoButton} onClick={handleLikeClick}>
                  {liked ? <AiFillHeart color="#ff4d4d" /> : <AiOutlineHeart />}
                  <span>{likes}</span>
                </button>
                <div className={$.infoItem}>
                  <FaRegComment />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={$.text}>{post.content.text}</div>

          <div className={$.hashtagContainer}>
            {post.metadata.tags.map((tag, index) => {
              let tagColor;
              if (index === 0) {
                tagColor = "#91C6FF"; // 첫 번째 태그 색상
              } else if (index === 1) {
                tagColor = "#968C6E"; // 두 번째 태그 색상
              } else {
                tagColor = "#D3D9DF";
              }
              // 세 번째 태그부터는 tagColor가 undefined이므로 기본색이 적용됨
              return <HashTag key={index} text={tag} color={tagColor} />;
            })}
          </div>

          <div className={$.mapLink}>
            <button className={$.mapLinkBtn}>지도에서 보기</button>
            <BiLinkAlt size={25} onClick={handleCopyClipBoard} />
          </div>
        </div>

        {/* 3. 댓글 영역 (postContent 밖으로 이동)*/}
        <div className={$.comments}>
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
        </div>
      </div>
      {toastMessage && <div className={$.toast}>{toastMessage}</div>}
      <ScrollToTopBtn />
    </>
  );
};

export default PlaceDetail;
