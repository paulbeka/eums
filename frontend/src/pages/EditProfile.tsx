import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import api from "../components/api/Api";
import "./CSS/EditProfile.css";

interface FormData {
  full_name: string;
  email: string;
  date_of_birth: string;
  country: string;
  profilePicture: File | null;
}

export const EditProfile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    date_of_birth: "",
    country: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [preview, setPreview] = useState<string>("");

  const euCountries: string[] = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Norway", "United Kingdom", "Non-EU"
  ];

  useEffect(() => {
    // Fetch user data to prefill the form
    if (userId) {
      api.get(`/users/${userId}`)
        .then((response) => {
          const { full_name, email, date_of_birth, country, profilePicture } = response.data;
          setFormData({ full_name, email, date_of_birth, country, profilePicture: null });
          setPreview(profilePicture || "");
        })
        .catch((err) => console.error("Failed to fetch user data:", err));
    }
  }, [userId]);

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

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format.";
    }

    const dob = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 13) {
      newErrors.date_of_birth = "You must be at least 13 years old.";
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
      if (value !== "" && value !== null) {
        formDataToSend.append(key, value);
      }
    });

    api.put(`/users/${userId}`, formDataToSend)
      .then(() => {
        navigate("/");
      })
      .catch((err) => setErrors({ general: err.message || "Failed to update profile." }));
  };

  return (
    <div className="edit-profile-page-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h1>Edit Profile</h1>

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

        {/* General Error Message */}
        {Object.keys(errors).length !== 0 && <p style={{ color: "red" }}>Please fill out all the required fields.</p>}

        {/* Submit Button */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};