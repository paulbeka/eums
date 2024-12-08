import React from "react";
import "./CSS/Contact.css";

const Contact = () => {
  return (
    <div className="contact">
      <form className="contact-form">
        <div className="contact-title-div">
          <h2 className="contact-title">CONTACT US</h2>
        </div>
        <div className="input-div">
          <label htmlFor="name">Your Name</label>
          <input className="input-box" type="text" id="name" required />
        </div>
        <div className="input-div">
          <label htmlFor="email">Your Email</label>
          <input className="input-box" type="email" id="email" required />
        </div>
        <div className="input-div">
          <label htmlFor="subject">Subject</label>
          <input className="input-box" type="text" id="subject" required />
        </div>
        <div className="input-div">
          <label htmlFor="message">Your Message</label>
          <textarea className="input-box" id="message" required />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
