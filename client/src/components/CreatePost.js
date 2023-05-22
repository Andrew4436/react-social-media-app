import React, { useRef, useState } from "react";
import "../styles/createPost.css";

function CreatePost({ user }) {
  const [Img, setImg] = useState(null)
  const captionRef = useRef();

  function uploadImg() {
    var input = document.getElementById("input-file");
    var file = input.files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) { 
        var imageData = e.target.result;
        
        setImg(imageData)
        document.getElementById('add-img').style.backgroundImage = `url(${imageData})`
      };

      reader.readAsDataURL(file);
    }
  }

  async function addPost(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:4040/createPost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img: Img,
        caption: captionRef.current.value,
      }),
    });

    if(res.ok) {
      const jsonData = await res.json()
      if(jsonData.message === 'post added') {
        window.location.href = `/profile/${user._id}`
      }
    }
  }

  return (
    <form id="create-post-container" onSubmit={addPost}>
      <div>
        <div id="add-img"></div>
        <input
          onChange={uploadImg}
          type="file"
          id="input-file"
          accept="image/jpg, image/png"
          required
        />
      </div>
      <textarea
        ref={captionRef}
        type="text"
        placeholder="enter caption"
        id="caption"
      />
      <button type="submit" id="post-btn">
        Post
      </button>
    </form>
  );
}

export default CreatePost;
