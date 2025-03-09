import React, { useState, useEffect } from "react";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error || success) {
        const timer = setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 5000);
        return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (formData.password !== formData.password2) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
        }

        try {
        const response = await fetch(`${baseUrl}/user_auth/register/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess("Registration successful! Redirecting to login...");
            setFormData({ name: "", email: "", password: "", password2: "" });

            setTimeout(() => {
            navigate("/login");
            }, 2000);
        } else {
            setError(data.error || "Registration failed. Please try again.");
        }
        } catch (err) {
        setError("Something went wrong. Please try again.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <div className="card bg-dark text-light p-4 shadow-lg pBorder" style={{ width: "400px", borderRadius: "12px" }}>
            <h3 className="text-center fw-bold mb-3">Register</h3>
            <hr className="border-light" />

            {error && <p className="text-danger text-center">{error}</p>}
            {success && <p className="text-success text-center">{success}</p>}

            <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" name="name" className="form-control text-light bg-dark border-light p-2"  placeholder={"Enter your Name"}
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" name="email" className="form-control text-light bg-dark border-light p-2"  placeholder={"Enter the Email Id"}
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" name="password" className="form-control text-light bg-dark border-light p-2"  placeholder={"Enter the Password"}
                value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input type="password" name="password2" className="form-control text-light bg-dark border-light p-2"  placeholder="Enter the Password again"
                value={formData.password2} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-lg bg-black w-50 mt-2 mx-auto text-white fw-bold fs-5" style={{ width: "50%" }} disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
            </form>

            <p className="mt-3 text-center">
            Already have an account?{" "}
            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                Login
            </span>
            </p>
        </div>
        </div>
    );
};

export default Register;
