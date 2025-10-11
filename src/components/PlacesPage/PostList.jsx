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
          hashtags: post.metadata.tags,
          author: {
            userId: post.author.userId,
            username: post.author.username,
            profileImage: post.author.profileImage,
          },
          likes: post.stats.likes,
          comments: post.comments.length,
        };

        // 마지막 게시물에 ref 연결
        if (posts.length === index + 1) {
          return (
            <li ref={lastPostRef} key={post.id}>
              <PostBox {...postProps} />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <PostBox {...postProps} />
            </li>
          );
        }
      })}
    </ul>
  );
};

export default PostList;
