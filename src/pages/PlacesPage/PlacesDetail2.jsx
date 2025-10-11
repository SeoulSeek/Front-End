import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { BiLinkAlt } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { FaRegComment } from "react-icons/fa";

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
  const post = dummyPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

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
