import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sendEmail } from "../components/api/Api";
import { Helmet } from 'react-helmet-async';
import "./CSS/Contact.css";
import Loading from "../components/frontend_util/Loading";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const submitContact = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    if (!executeRecaptcha) {
      console.error("ReCAPTCHA has not been loaded.");
      setError(true);
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("contactFormSubmit");
      if (!captchaToken) {
        setError(true);
        setIsLoading(false);
        return;
      }

      const response = await sendEmail({
        name,
        email,
        subject,
        message,
        captcha: captchaToken,
      });

      if (response) {
        setIsLoading(false);
        setIsSubmitted(true);
      } else {
        setIsLoading(false);
        setError(true);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error submitting form:", err);
      setError(true);
    }
  };

  if (isLoading && !isSubmitted) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{t("contact.pageTitle")}</title>
        <meta name="description" content={t("contact.pageDescription")} />
      </Helmet>
      <div className="contact">
        {isSubmitted ? (
          <div className="thank-you-message">
            <h2>{t("contact.thankYouTitle")}</h2>
            <p>{t("contact.thankYouMessage")}</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submitContact}>
            <div className="contact-title-div">
              <h2 className="contact-title">{t("contact.title")}</h2>
            </div>
            <div className="input-div">
              <label htmlFor="name">{t("contact.nameLabel")}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-box"
                type="text"
                id="name"
                required
              />
            </div>
            <div className="input-div">
              <label htmlFor="email">{t("contact.emailLabel")}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-box"
                type="email"
                id="email"
                required
              />
            </div>
            <div className="input-div">
              <label htmlFor="subject">{t("contact.subjectLabel")}</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-box"
                type="text"
                id="subject"
                required
              />
            </div>
            <div className="input-div">
              <label htmlFor="message">{t("contact.messageLabel")}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-box"
                id="message"
                required
              />
            </div>
            {error && (
              <p style={{ color: "red" }}>
                {t("contact.errorMessage")}
              </p>
            )}
            <button type="submit" className="submit-btn">
              {t("contact.submitButton")}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Contact;
