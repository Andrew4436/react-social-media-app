import React, { useRef } from "react";
import "../styles/Auth.css";

function Register() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:4040/register", {
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
      if (jsonData.message === "user registered") {
        window.location.href = '/login'
      }
    }
  }

  return (
    <div id="form-container">
      <form id="Auth-form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input ref={usernameRef} type="text" placeholder="enter username" />
        <input ref={passwordRef} type="password" placeholder="enter password" />

        <button type="submit">Register</button>

        <p>
          Already have an Account? <a style={{ color: "blue", textDecoration: 'underline' }} href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
