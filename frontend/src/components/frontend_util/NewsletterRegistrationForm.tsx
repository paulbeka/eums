import { useState } from "react";
import "./CSS/NewsletterRegistrationForm.css";

export const NewsletterRegistrationForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        className="newsletter-input"
        required 
      />
      <button className="newsletter-button" type="submit">Subscribe</button>
    </form>
  );
}
