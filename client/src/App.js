import { useState, useEffect } from "react";
import "./styles.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost" 

function App() {
  const [user, setUser] = useState(null);
  const [done, setDone] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:4040/getUser", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.message === "not authenticated") {
          setUser(null);
        } else {
          setUser(jsonData.user);
        }
      })
      .finally(() => {
        setDone(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!done) {
    return <h1>Loading...</h1>;
  }

  function ConditionalNav() {
    if (location.pathname === "/register" || location.pathname === "/login") {
      return;
    } else {
      return <Nav user={user} />;
    }
  }

  return (
    <>
      <ConditionalNav />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/" element={<Home User={user} />} />
        <Route path="/profile/:id" element={<Profile User={user} />} />
        <Route path="/createPost" element={<CreatePost user={user} />} />
      </Routes>
    </>
  );
}

export default App;
