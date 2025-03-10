import { useState } from "react";
import "./CSS/NewsletterSignup.css";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const registerUser = () => {
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    console.log("User registered with email:", email);
    // TODO: Redirect to success page
    setEmail("");
  };

  return (
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
        />
        <button className="hot-topics-button" onClick={registerUser}>
          <h3 style={{padding: "0.5em 1em"}}>Sign Up Now!</h3>
        </button>
      </div>
    </div>
  );
};
