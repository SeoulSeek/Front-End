import React, { useState } from "react";
import { useParams } from "react-router";
import { BiLinkAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

import $ from "./PlacesDetail.module.css";
import sampleImg from "../../assets/PlacePage/sample.jpg";
import dummyPosts from "../../data/dummyPosts";
import MiniProfile from "../../components/MiniProfile/MiniProfile";
import PostInfo from "../../components/MiniProfile/PostInfo";
import HashTag from "../../components/global/HashTag/HashTag";

const PlaceDetail = () => {
  const { id } = useParams();
  const post = dummyPosts.find((p) => p.id === parseInt(id));

  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likes, setLikes] = useState(post.stats.likes);
  // 좋아요 상태 업뎃 함수
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
    // Shift + Enter: 줄바꿈
    // Enter만: 댓글 제출
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <div className={$.placeDetailPage}>
        <div className={$.imageGallery}>
          {post.content.images?.map((img, index) => (
            <img key={index} src={img} alt={`이미지 ${index + 1}`} />
          ))}
          <img src={sampleImg} alt="sample image" />
        </div>

        <div className={$.postContent}>
          <h1 className={$.postTitle}>{post.title}</h1>
          <div className={$.postUserWrap}>
            <MiniProfile username={post.author.username} />
            <PostInfo
              postedDate={post.metadata.createdAt}
              isLiked={liked}
              likes={likes}
              comments={post.comments.length}
              onClick={handleLikeClick}
            />
          </div>

          <div className={$.text}>{post.content.text}</div>

          <div className={$.hashtagContainer}>
            {post.metadata.location.district && (
              <HashTag text={post.metadata.location.district} type="district" />
            )}
            {post.metadata.location.name && (
              <HashTag text={post.metadata.location.name} type="place" />
            )}
            {post.metadata.tags.map((tag, index) => (
              <HashTag key={index} text={tag} />
            ))}
          </div>

          <div className={$.comments}>
            <div className={$.mapLink}>
              <button className={$.mapLinkBtn}>지도에서 보기</button>
              <BiLinkAlt size={25} />
            </div>
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
                  {<CgClose className={$.commentDelete} size={15} />}
                  <span className={$.space}></span>
                </li>
              ))}
            </ul>
            <div className={$.commentEnd}>댓글 목록이 끝났어요.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceDetail;
