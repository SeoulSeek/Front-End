import React from "react";
import $ from "./../../pages/PlacesPage/PlacesPage2.module.css";
import PostBox from "../PostBox/PostBox2";
import { DISTRICT_ENG_TO_KOR } from "../../config/mapping";

const PostList = ({ posts, lastPostRef, onLikeToggle }) => {
  return (
    <ul className={$.postList}>
      {posts.map((post, index) => {
        const apiTags = post.tags || [];
        const placeName = apiTags[0]; // API 응답: 첫 번째가 장소명 가정
        const districtEng = apiTags[1]; // API 응답: 두 번째가 영문 자치구명 가정
        const keywordTags = apiTags.slice(2); // 나머지는 키워드

        // 영문 자치구명을 한글로 변환 (없으면 영문명 그대로 또는 기본값 사용)
        const districtKor =
          DISTRICT_ENG_TO_KOR[districtEng?.toUpperCase()] || districtEng;

        // 화면 표시용 태그 배열 생성: [자치구(한글), 장소명, 키워드...]
        const displayHashtags = [];
        if (districtKor) displayHashtags.push(districtKor); // 한글 자치구명 먼저 추가
        if (placeName) displayHashtags.push(placeName); // 장소명 추가
        displayHashtags.push(...keywordTags);

        // PostBox에 필요한 props 형태로 데이터 매핑
        const postProps = {
          id: post.id,
          title: post.title,
          hashtags: displayHashtags,
          author: {
            userId: null,
            username: post.username,
            profileImage: post.fileURL || null,
          },
          likes: post.like,
          isLiked: post.isLiked || false,
          comments: post.comments,
        };

        // 마지막 게시물에 ref 연결
        const isLastElement = posts.length === index + 1;
        return (
          <li
            ref={isLastElement ? lastPostRef : null}
            key={`${post.id}-${index}`}
          >
            <PostBox {...postProps} onLikeToggle={onLikeToggle} />
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
