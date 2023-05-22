import React from "react";
import "../styles/Nav.css";

function Nav({ user }) {
  if(!user) return
  async function logout() {
    const res = await fetch("http://localhost:4040/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      const jsonData = await res.json();
      if (jsonData.message === "logout successful") {
        window.location.href = "/";
      }
    }
  }

  return (
    <nav>
      <div id="nav-item-left">
        <h1>
          <a href="/">home</a>
        </h1>

        <h1>
        <a href={`/profile/` + user._id}>profile</a>
        </h1>

        <h1>
          <a href="/createPost">create post</a>
        </h1>

      </div>
      <div id="nav-item-right">
        {user ? (
          <div id="nav-profile-container">
            <h1>
              <a href={`/profile/` + user._id}>{user.username}</a>
            </h1>
            <button id="logout" onClick={logout}>
              logout
            </button>
          </div>
        ) : (
          <h1>
            <a href="/login">login</a>
          </h1>
        )}
      </div>
    </nav>
  );
}

export default Nav;
