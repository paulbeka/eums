import { useState } from "react";
import "./CSS/NewsletterSignup.css";
import { BrowserView, MobileView } from "react-device-detect";
import api from "../components/api/Api";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    if (email.trim() === "") {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/newsletter-subscribe", { email });

      if (response.status === 200 || response.status === 201) {
        setMessage("Subscription successful! Check your inbox.");
        setEmail("");
      } else {
        setMessage("Subscription failed. Please try again.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BrowserView>
        <div className="newsletter-signup-container">
          <h1 className="newsletter-title">EU Made Simple Newspaper</h1>
          <p className="newsletter-description">Stay informed with our latest updates!</p>
          <div className="newsletter-form">
            <input
              id="email"
              type="email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
            <button 
              className="hot-topics-button" 
              onClick={registerUser}
              disabled={loading}
            >
              <h3 style={{ padding: "0.5em 1em" }}>{loading ? "Signing Up..." : "Sign Up Now!"}</h3>
            </button>
          </div>
          {message && <p className="newsletter-message">{message}</p>}
        </div>
      </BrowserView>

      <MobileView>
        <div className="newsletter-signup-container">
          <h1 className="newsletter-title">EU Made Simple Newspaper</h1>
          <p className="newsletter-description">Stay informed with our latest updates!</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              id="email"
              type="email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: "100%", marginBottom: "1em" }}
              disabled={loading}
            />
            <button 
              className="hot-topics-button" 
              onClick={registerUser}
              style={{ textAlign: "center" }}
              disabled={loading}
            >
              <h3 style={{ padding: "0.5em 1em", width: "100%" }}>{loading ? "Signing Up..." : "Sign Up Now!"}</h3>
            </button>
          </div>
          {message && <p className="newsletter-message">{message}</p>}
        </div>
      </MobileView>
    </>
  );
};
