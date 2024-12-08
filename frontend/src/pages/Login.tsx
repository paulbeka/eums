import React, { useState } from "react";
import "./CSS/Login.css";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = () => {

  }

  return (
    <div className="login-page">
      <form className="login-container">
        <div className="login-component-div">
          <label>Username:</label>
          <input className="input-box" value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
        </div>
        <div className="login-component-div">
          <label>Password:</label>
          <input className="input-box" value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
        </div>
        <button type="submit" onClick={submitLogin} className="submit-btn">Submit</button>
      </form>
    </div>
  )
}

export default Login;