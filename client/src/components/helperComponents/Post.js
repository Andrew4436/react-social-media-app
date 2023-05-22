import React from "react";
import "../../styles/Post.css";

function Post({ user, post }) {
  return (
    <div id="post">
      <div id="post-img-container">
        <img id="post-img" src={post.img} />
      </div>
      <div id="post-caption-container">
        <h1>post from: {user.username}</h1>
        <p>{post.caption}</p>
      </div>
    </div>
  );
}

export default Post;
