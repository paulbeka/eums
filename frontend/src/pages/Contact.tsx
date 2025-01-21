import { useState, useEffect } from "react";
import { sendEmail } from '../components/api/Api';
import { CAPTCHA_SITE_KEY } from '../Config';
import ReCAPTCHA from 'react-google-recaptcha';
import "./CSS/Contact.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact';
  }, []);

  const handleCaptchaChange = (value: any) => {
    console.log(value);
  }

  const submitContact = async (e: any) => {
    e.preventDefault();  
    try {
      const response = await sendEmail({
        name,
        email,
        subject,
        message,
      });
      if (response!) {
        setIsSubmitted(true); 
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  }
  return (
    <div className="contact">
      {isSubmitted ? (
        <div className="thank-you-message">
          <h2>Thank You!</h2>
          <p>Your message has been successfully sent. We will get back to you soon.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={submitContact}>
          <div className="contact-title-div">
            <h2 className="contact-title">CONTACT US</h2>
          </div>
          <div className="input-div">
            <label htmlFor="name">Your Name</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)} 
              className="input-box" type="text" id="name" required 
            />
          </div>
          <div className="input-div">
            <label htmlFor="email">Your Email</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)} 
              className="input-box" type="email" id="email" required 
            />
          </div>
          <div className="input-div">
            <label htmlFor="subject">Subject</label>
            <input 
              value={subject} onChange={(e) => setSubject(e.target.value)} 
              className="input-box" type="text" id="subject" required 
            />
          </div>
          <div className="input-div">
            <label htmlFor="message">Your Message</label>
            <textarea 
              value={message} onChange={(e) => setMessage(e.target.value)} 
              className="input-box" id="message" required 
            />
          </div>
          <div>
            <ReCAPTCHA
              sitekey={CAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>
          {error && (
            <p style={{color: "red"}}>
              There has been an error. Please try again.
            </p>
          )}
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Contact;
