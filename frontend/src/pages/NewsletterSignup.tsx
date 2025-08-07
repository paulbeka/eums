import { useState } from "react";
import { useTranslation } from "react-i18next";  // assuming react-i18next
import "./CSS/NewsletterSignup.css";
import { BrowserView, MobileView } from "react-device-detect";
import api from "../components/api/Api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";  // assuming you are using this package

export const NewsletterSignup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const registerUser = async () => {
    if (!executeRecaptcha) {
      console.error("ReCAPTCHA has not been loaded.");
      return;
    }
    if (email.trim() === "") {
      setMessage(t("newsletter.error.invalidEmail"));
      return;
    }
    
    const captchaToken = await executeRecaptcha("contactFormSubmit");

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/newsletter-subscribe", { 
        email,
        captcha: captchaToken
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
    <>
      <BrowserView>
        <div className="newsletter-signup-container">
          <h1 className="newsletter-title">{t("newsletter.title")}</h1>
          <p className="newsletter-description">{t("newsletter.description")}</p>
          <div className="newsletter-form">
            <input
              id="email"
              type="email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.emailPlaceholder")}
              disabled={loading}
            />
            <button 
              className="hot-topics-button" 
              onClick={registerUser}
              disabled={loading}
            >
              <h3 style={{ padding: "0.5em 1em" }}>
                {loading ? t("newsletter.button.loading") : t("newsletter.button.default")}
              </h3>
            </button>
          </div>
          {message && <p className="newsletter-message">{message}</p>}
        </div>
      </BrowserView>

      <MobileView style={{ height: "100vh", display: "flex" }}>
        <div className="newsletter-mobile-signup-container">
          <h1 className="newsletter-title">{t("newsletter.title")}</h1>
          <p className="newsletter-description">{t("newsletter.description")}</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              id="email"
              type="email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.emailPlaceholder")}
              style={{ width: "100%", marginBottom: "1em" }}
              disabled={loading}
            />
            <button 
              className="hot-topics-button" 
              onClick={registerUser}
              style={{ textAlign: "center" }}
              disabled={loading}
            >
              <h3 style={{ padding: "0.5em 1em", width: "100%" }}>
                {loading ? t("newsletter.button.loading") : t("newsletter.button.default")}
              </h3>
            </button>
          </div>
          {message && <p className="newsletter-message">{message}</p>}
        </div>
      </MobileView>
    </>
  );
};
