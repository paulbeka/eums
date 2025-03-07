import { useState } from "react";
import "./CSS/Register.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../components/api/Api";

interface FormData {
  full_name: string;
  email: string;
  date_of_birth: string;
  password: string;
  country: string;
  gender: string;
  profilePicture: File | null;
}

export const Register = () => {
  const navigate = useNavigate();

  const defaultProfilePic = "https://via.placeholder.com/100"; // Preset profile picture

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    date_of_birth: "",
    password: "",
    country: "",
    gender: "",
    profilePicture: null,
  });
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>(defaultProfilePic);

  const euCountries: string[] = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Norway", "United Kingdom", "Non-EU"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prevData) => ({ ...prevData, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerUser(formData)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="register-page-container">
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Full Name:
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </label>
        
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Date of Birth:
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
        </label>

        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>

        <label>
          Country of Origin (Optional):
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Select a country</option>
            {euCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </label>

        <label>
          Profile Picture (Optional):
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <img src={preview} alt="Profile Preview" className="profile-preview" />

        {error ? <p style={{ color: "red" }}>{error}</p> : null}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
