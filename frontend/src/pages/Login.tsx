import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config";
import axios from "axios";
import { Helmet } from 'react-helmet-async';
import { useAuth } from "../components/auth/AuthContext";
import "./CSS/Login.css";
import { Link } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitLogin = async (e: any) => {
    e.preventDefault();
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
        login(response.data.access_token);
        navigate("/");
      } else {
        setError("Login failed. Contact an admin or try inputting your password again.");
      }
    } catch (error) {
      setError("Login failed. Contact an admin or try inputting your password again.");
      console.error("Login failed:", error);
    }
  };

  return (<>
    <Helmet>
      <title>EUMS - Login</title>
      <meta name="description" content="Login to EU Made Simple to post, interact with, and share EU news and content!" />
    </Helmet>
    <div className="login-page">
      <form onSubmit={submitLogin} className="login-container">
        <div className="login-component-div">
          <span>Username:</span>
          <input className="input-box" value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
        </div>
        <div className="login-component-div">
          <span>Password:</span>
          <input className="input-box" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        {error && <p style={{ color: "red", marginBottom: "1em" }}>{error}</p>}
        <button type="submit" className="submit-btn">Submit</button>
        <p className="click-to-register">No account? <u style={{ fontWeight: "bold" }}><Link to={"/register"}>Register</Link></u></p>
      </form>
    </div>
  </>);
}

export default Login;
