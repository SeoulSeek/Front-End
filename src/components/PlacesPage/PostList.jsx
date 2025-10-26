import React from "react";
import $ from "./../../pages/PlacesPage/PlacesPage2.module.css";
import PostBox from "../PostBox/PostBox2";

const PostList = ({ posts, lastPostRef }) => {
  return (
    <ul className={$.postList}>
      {posts.map((post, index) => {
        // PostBox에 필요한 props 형태로 데이터 매핑
        const postProps = {
          id: post.id,
          title: post.title,
          hashtags: post.tags || [],
          author: {
            userId: null,
            username: post.username,
            profileImage: post.fileURL,
          },
          likes: post.like,
          comments: post.comments,
        };

        // 마지막 게시물에 ref 연결
        const isLastElement = posts.length === index + 1;
        return (
          <li
            ref={isLastElement ? lastPostRef : null}
            key={`${post.id}-${index}`}
          >
            <PostBox {...postProps} />
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
