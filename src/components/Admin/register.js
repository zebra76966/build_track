import React, { useState } from "react";
import { baseUrl } from "../config";

const Register = ({setActive}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(baseUrl+"/user_auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! You can now log in.");
        setFormData({ name: "", email: "", password: "" ,password2: ""}); // Reset form
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="password2" placeholder="Password2" value={formData.password} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <span 
          style={{ cursor: "pointer", color: "blue" }} 
          onClick={() => setActive(5)} // Switch to login
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
