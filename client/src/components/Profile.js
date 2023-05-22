import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./helperComponents/Post";
import "../styles/Profile.css";

function Profile({ User }) {
  const [user, setUser] = useState(null);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const param = useParams();

  useEffect(() => {
    fetch("http://localhost:4040/profile", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: param.id,
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setUser(jsonData.user);
      })
      .finally(() => {
        setFetchCompleted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (user && user.pfp) {
      setPfp();
    }
  }, [user]);

  if (!fetchCompleted) {
    return <h1>Loading...</h1>;
  }

  async function followUser() {
    const res = await fetch("http://localhost:4040/followUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        following: User._id,
        followed: user._id,
      }),
    });

    if (res.ok) {
      const jsonData = await res.json();
      if (jsonData.message === "request successful") {
        window.location.reload();
      }
    }
  }

  async function unfollowUser() {
    const res = await fetch("http://localhost:4040/unfollowUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unfollowing: User._id,
        unfollowed: user._id,
      }),
    });

    if (res.ok) {
      const jsonData = await res.json();
      if (jsonData.message === "request successful") {
        window.location.reload();
      }
    }
  }

  function GenerateRandomKey() {
    return Math.random() * 100000000000;
  }

  function updataProfilePic() {
    var input = document.getElementById("file-upload");
    var file = input.files[0];

    if (file) {
      var reader = new FileReader();
      let imageData;

      reader.onload = function (e) {
        imageData = e.target.result;

        setProfilePic(imageData);
        document.getElementById(
          "profile-img-container"
        ).style.backgroundImage = `url(${imageData})`;

        fetch("http://localhost:4040/updatepfp", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pfp: imageData,
          }),
        });
      };

      reader.readAsDataURL(file);
    }
  }

  function setPfp() {
    document.getElementById(
      "profile-img-container"
    ).style.backgroundImage = `url(${user.pfp})`;
  }

  return (
    <>
      <div id="profile-container">
        <div id="user-info">
          <div id="profile-img-container">
            <label htmlFor="file-upload">
              +
              <input onChange={updataProfilePic} id="file-upload" type="file" />
            </label>
          </div>

          <div id="user-info-inner">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h1>{user.username}</h1>
              {user.followers.includes(User._id) ? (
                <button
                  style={{ display: User._id === user._id ? "none" : "block" }}
                  id="unfollow-btn"
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  style={{ display: User._id === user._id ? "none" : "block" }}
                  id="follow-btn"
                  onClick={followUser}
                >
                  Follow
                </button>
              )}
            </div>
            <div id="user-info-inner-inner">
              <h1>{user.posts.length} posts</h1>
              <h1>{user.followers.length} followers</h1>
              <h1>{user.following.length} following</h1>
            </div>
          </div>
        </div>
        <div id="user-posts">
          {user.posts.length ? (
            <div id="posts-container">
              {user.posts.map((post) => {
                return (
                  <Post key={GenerateRandomKey()} user={user} post={post} />
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h1>This person currently doens't have any post</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
