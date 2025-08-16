import { useState } from "react";
import api from "../api/Api";
import { useTranslation } from "react-i18next";
import "./CSS/NewsletterRegistrationForm.css";

export const NewsletterRegistrationForm = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/newsletter-subscribe-homepage", { 
        email
       });

      if (response.status === 200 || response.status === 201) {
        setMessage(t("newsletter.success"));
        setEmail("");
      } else {
        setMessage(t("newsletter.failure"));
      }
    } catch (error: any) {
      setMessage(error.response?.data?.detail || t("newsletter.error.generic"));
    } finally {
      setLoading(false);
    }
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
      {loading && <p className="newsletter-loading">{t("newsletter.loading")}</p>}
      {message && <p className="newsletter-message">{message}</p>}
    </form>
  );
}
