import React, { useState } from "react";
import { useParams } from "react-router";
import { BiLinkAlt } from "react-icons/bi";

import $ from "./PlacesDetail.module.css";
import sampleImg from "../../assets/PlacePage/sample.jpg";
import dummyPosts from "../../data/dummyPosts";
import MiniProfile from "../../components/MiniProfile/MiniProfile";
import PostInfo from "../../components/MiniProfile/PostInfo";
import HashTag from "../../components/HashTag/HashTag";

const PlaceDetail = () => {
  const { id } = useParams();
  const post = dummyPosts.find((p) => p.id === parseInt(id));

  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [likes, setLikes] = useState(post.likes);
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
        author: "익명",
        date: new Date().toLocaleDateString(),
        text: newComment,
      },
    ]);
    setNewComment("");
  };

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <div className={$.placeDetailPage}>
        <div className={$.imageGallery}>
          {post.images?.map((img, index) => (
            <img key={index} src={img} alt={`이미지 ${index + 1}`} />
          ))}
          <img src={sampleImg} alt="sample image" />
        </div>

        <div className={$.postContent}>
          <h1 className={$.postTitle}>{post.title}</h1>
          <div className={$.postUserWrap}>
            <MiniProfile username={post.username} />
            <PostInfo
              postedDate={/*post.date*/ "2025.02.27. 16:10"}
              isLiked={liked}
              likes={likes}
              comments={post.comments}
              onClick={handleLikeClick}
            />
          </div>

          <div className={$.text}>
            오늘 가족과 함께 덕수궁 나들이를 다녀왔어요! 도심 한가운데 위치한
            덕수궁은 전통과 근대가 어우러진 매력적인 공간이었어요. 정문인
            대한문을 지나 석조전과 중화전을 둘러보며 조선과 근대의 역사를 함께
            느낄 수 있었답니다. 특히, 돌담길을 따라 걷는 시간이 가장 좋았어요.
            고즈넉한 분위기 속에서 가족과 이야기를 나누며 여유로운 시간을 보낼
            수 있었어요. 마지막으로 정원에서 사진도 찍으며 추억을 남겼습니다.
            역사와 자연이 조화로운 덕수궁, 가족 나들이 코스로 추천합니다!
          </div>

          <div className={$.hashtagContainer}>
            {post.district && <HashTag text={post.district} type="district" />}
            {post.place && <HashTag text={post.place} type="place" />}
            {post.hashtags.map((tag, index) => (
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
                  placeholder="댓글을 입력해 주세요."
                ></textarea>
                <button type="submit">등록</button>
              </form>
            </div>
            <ul className={$.commentList}>
              {/*comments.map((comment) => (
                <li key={comment.id} className={$.commentItem}>
                  <span className={$.commentAuthor}>{comment.author}</span>
                  <span className={$.commentText}>{}comment.text</span>
                </li>
              ))*/}
              <li className={$.commentItem}>
                <span className={$.commentAuthor}>user01</span>
                <span className={$.commentText}>저도한번가고싶네요</span>
              </li>
              <li className={$.commentItem}>
                <span className={$.commentAuthor}>user01</span>
                <span className={$.commentText}>
                  댓글이 엄청 길 경우에는 어떻게 표시되나요? 이런 식으로
                  표시되고, 댓글에 유해한 정보를 표시하는 것을 방지하기 위해
                  공백포함 100자는 어떤지요 현재는 93자입니다.
                </span>
              </li>
            </ul>
            <div className={$.commentEnd}>댓글 목록이 끝났어요.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceDetail;
