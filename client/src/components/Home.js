import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Post from "./helperComponents/Post";

function Home({ User }) {
  const [users, setUsers] = useState(null);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  if (!User) {
    window.location.href = "/login";
  }

  function GenerateRandomKey() {
    return Math.random() * 100000000;
  }

  useEffect(() => {
    fetch("http://localhost:4040/getUsers", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((jsonData) => {
        setUsers(jsonData.users);
      })
      .finally(() => {
        setFetchCompleted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (users) {
      users.map((user) => {
        setPfp(user);
      });
    }
  }, [users]);

  function setPfp(user) {
    document.getElementById(
      "suggested-user-profile"
    ).style.backgroundImage = `url(${user.pfp})`;
  }

  if (!fetchCompleted) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {User ? (
        <div id="home">
          <div id="home-inner-container">
            <div id="user-suggestions-container">
              <h1>Follow other people to see thier posts</h1>
              <div id="user-suggestions">
                <p>user suggestions: </p>
                <div id="users">
                  <>
                    {users.map((user) => {
                      return (
                        <div
                          onClick={() => {
                            window.location.href = `/profile/${user._id}`;
                          }}
                          key={GenerateRandomKey()}
                          id="suggested-user"
                        >
                          <div id="suggested-user-profile"></div>
                          <h2>{user.username}</h2>
                        </div>
                      );
                    })}
                  </>
                </div>
              </div>
            </div>
            {User.following.length > 0 ? (
              <div id="home-posts-container">
                <h1>Posts: </h1>
                {users.map((user) => {
                  if (user.followers.includes(User._id)) {
                    return user.posts.map((post) => (
                      <Post key={GenerateRandomKey()} user={user} post={post} />
                    ));
                  } else {
                    return null;
                  }
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <h1>Login first</h1>
      )}
    </>
  );
}

export default Home;
