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
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>(defaultProfilePic);
  const [newsletterTicked, setNewsletterTicked] = useState<boolean>(false);

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

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long."); 
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
          api.post("/newsletter-subscribe", { "email": formData.email })
            .then(() => {
              console.log("Subscribed to newsletter.");
            })
            .catch((err) => {
              console.error("Failed to subscribe to newsletter:", err);
            });
        }

        navigate("/");
      })
      .catch((err) => {
        setError(err);
      });
  };

  console.log(preview);

  return (
    <div className="register-page-container">
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          <span>Username:</span>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        
        <label>
          <span>Full Name:</span>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </label>
        
        <label>
          <span>Email:</span>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          <span>Date of Birth:</span>
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
        </label>

        <label>
          <span>Password:</span>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>

        <label>
          <span>Confirm Password:</span>
          <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
        </label>

        <label>
          <span>Country of Origin (Optional):</span>
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Select a country</option>
            {euCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Profile Picture (Optional):</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <img src={preview} alt="Profile Preview" className="profile-preview" />

        <label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5em", marginTop: "1em" }}> 
            <input type="checkbox" className="input-checkbox" checked={newsletterTicked} onChange={() => setNewsletterTicked(!newsletterTicked)}/>
            <span>Subscibe to the EUMS newsletter, where we send you the latest news and updates! (Optional)</span>
          </div>
        </label>

        <label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5em", marginTop: "1em" }}> 
            <input type="checkbox" className="input-checkbox" checked={newsletterTicked} onChange={() => setNewsletterTicked(!newsletterTicked)}/>
            <span>I agree to the Terms & Services.</span>
          </div>
        </label>
        
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
