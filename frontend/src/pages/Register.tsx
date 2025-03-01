import { useState } from "react";
import "./CSS/Register.css";
import  { useNavigate } from 'react-router-dom'
import { registerUser } from '../components/api/Api';


export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    country: "",
    gender: "",
  });
  const [error, setError] = useState("");

  const euCountries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Norway", "United Kingdom", "Non-EU"
  ];

  const genders = ["Male", "Female", "Other", "Prefer not to say"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerUser(formData)
    .then(success => {
      navigate("/");
    })
    .catch(err => {
      setError(err);
    });
  };

  return (
    <div className="register-page-container">
      <form onSubmit={handleSubmit} className="register-form">
        <label>
          Full Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </label>
        
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
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
          Gender (Optional):
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </label>

        {error? <p style={{ color: "red" }}>{error}</p> : <></>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
