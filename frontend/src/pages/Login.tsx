import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config";
import axios from "axios";
import "./CSS/Login.css";


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const submitLogin = async (e: any) => {
    e.preventDefault();  // Prevents page refresh
    try {
      const response = await axios.post(`${BASE_URL}/token`, {
        username,
        password,
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token);
        navigate("/");
      } else {
        setError("Login failed. Contact an admin or try inputting your password again.");
      }
    } catch (error) {
      setError("Login failed. Contact an admin or try inputting your password again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={submitLogin} className="login-container">
        <div className="login-component-div">
          <label>Username:</label>
          <input className="input-box" value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
        </div>
        <div className="login-component-div">
          <label>Password:</label>
          <input className="input-box" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        {error && <p style={{ color: "red", marginBottom: "1em" }}>{error}</p>}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default Login;
