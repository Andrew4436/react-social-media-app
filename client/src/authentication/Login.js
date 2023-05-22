import React, { useRef } from "react";
import "../styles/Auth.css";

function Login({ setUser }) {
  const usernameRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:4040/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }),
    });

    if (res.ok) {
      const jsonData = await res.json();
      if (jsonData.message === "logged in") {
        window.location.href = "/";
      }
    } else {
      alert("wrong username or password");
    }
  }
  return (
    <div id="form-container">
      <form id="Auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input ref={usernameRef} type="text" placeholder="enter username" />
        <input ref={passwordRef} type="password" placeholder="enter password" />

        <button type="submit">Login</button>

        <p>
          Don't have an Account? <a style={{ color: "blue", textDecoration: 'underline' }} href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
