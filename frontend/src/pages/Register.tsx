import { useState } from "react";
import "./CSS/Register.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../components/api/Api";
import api from "../components/api/Api";


interface FormData {
  username: string
  full_name: string;
  email: string;
  date_of_birth: string;
  password: string;
  confirm_password: string;
  country: string;
  profilePicture: File | null;
}

export const Register = () => {
  const navigate = useNavigate();

  const defaultProfilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"; // Preset profile picture

  const [formData, setFormData] = useState<FormData>({
    username: "",
    full_name: "",
    email: "",
    date_of_birth: "",
    password: "",
    confirm_password: "",
    country: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [preview, setPreview] = useState<string>(defaultProfilePic);
  const [newsletterTicked, setNewsletterTicked] = useState<boolean>(false);
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] = useState<boolean>(false);

  const euCountries: string[] = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Norway", "United Kingdom", "Non-EU"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
  
      if (ctx) {
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
  
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, { type: file.type });
            setFormData((prev) => ({ ...prev, profilePicture: croppedFile }));
            setPreview(URL.createObjectURL(croppedFile));
          }
        }, file.type);
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 

    const newErrors: { [key: string]: string } = {};

    if (!termsAndConditionsChecked) {
      newErrors.terms = "You must agree to the Terms & Services to register.";
    }

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format.";
    }

    const dob = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 13) {
      newErrors.date_of_birth = "You must be at least 13 years old to register.";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
    }

    if (formData.country && !euCountries.includes(formData.country)) {
      newErrors.country = "Country must be an EU member state.";
    }

    if (formData.profilePicture) {
        const fileSize = formData.profilePicture.size / 1024 / 1024; // Convert bytes to MB
        if (fileSize > 2) {
            newErrors.profilePicture = "Profile picture must be less than 2MB.";
        }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirm_password" && value !== "" && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    registerUser(formDataToSend)
      .then(() => {
        if (newsletterTicked) {
          api.post("/newsletter-subscribe", { email: formData.email })
            .then(() => console.log("Subscribed to newsletter."))
            .catch((err) => console.error("Failed to subscribe:", err));
        }
        navigate("/");
      })
      .catch((err) => setErrors({ general: err.message || "Registration failed." }));
  };

  return (
    <div className="register-page-container">
      <form onSubmit={handleSubmit} className="register-form">
        {/* Username Field */}
        <label>
          <span>Username:</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? "error-input" : ""}
            required
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </label>

        {/* Full Name Field */}
        <label>
          <span>Full Name:</span>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </label>

        {/* Email Field */}
        <label>
          <span>Email:</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </label>

        {/* Date of Birth Field */}
        <label>
          <span>Date of Birth:</span>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={errors.date_of_birth ? "error-input" : ""}
            required
          />
          {errors.date_of_birth && <p className="error-text">{errors.date_of_birth}</p>}
        </label>

        {/* Password Field */}
        <label>
          <span>Password:</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error-input" : ""}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </label>

        {/* Confirm Password Field */}
        <label>
          <span>Confirm Password:</span>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className={errors.confirm_password ? "error-input" : ""}
            required
          />
          {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
        </label>

        {/* Country Dropdown */}
        <label>
          <span>Country of Origin (Optional):</span>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={errors.country ? "error-input" : ""}
          >
            <option value="">Select a country</option>
            {euCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && <p className="error-text">{errors.country}</p>}
        </label>

        {/* Profile Picture Upload */}
        <label>
          <span>Profile Picture (Optional):</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={errors.profilePicture ? "error-input" : ""}
          />
          {errors.profilePicture && <p className="error-text">{errors.profilePicture}</p>}
        </label>

        {/* Profile Picture Preview */}
        {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}

        {/* Newsletter Checkbox */}
        <label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5em", marginTop: "1em" }}>
            <input
              type="checkbox"
              className="input-checkbox"
              checked={newsletterTicked}
              onChange={() => setNewsletterTicked(!newsletterTicked)}
            />
            <span>Subscribe to the EUMS newsletter, where we send you the latest news and updates! (Optional)</span>
          </div>
        </label>

        {/* Terms and Conditions Checkbox */}
        <label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5em", marginTop: "1em" }}>
            <input
              type="checkbox"
              className={`input-checkbox ${errors.terms ? "error-input" : ""}`}
              checked={termsAndConditionsChecked}
              onChange={() => setTermsAndConditionsChecked(!termsAndConditionsChecked)}
            />
            <span>I agree to the <u onClick={() => {
              console.log("Display the terms and conditions.");
            }} style={{ color: "blue", cursor: "pointer" }}>Terms & Services.</u></span>
          </div>
          {errors.terms && <p className="error-text">{errors.terms}</p>}
        </label>

        {/* General Error Message */}
        {Object.keys(errors).length && <p style={{ color: "red" }}>Please fill out all the required fields.</p>}

        {/* Submit Button */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
