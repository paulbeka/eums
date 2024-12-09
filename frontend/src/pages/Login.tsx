import React, { useState, useEffect } from "react";
import "./CSS/Login.css";
import axios from "axios";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const submitLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/token", {
        username,
        password,
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("access_token", response.data.access_token);
      // todo: redirect to home page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-component-div">
          <label>Username:</label>
          <input className="input-box" value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
        </div>
        <div className="login-component-div">
          <label>Password:</label>
          <input className="input-box" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <button type="submit" onClick={submitLogin} className="submit-btn">Submit</button>
      </div>
    </div>
  )
}

export default Login;