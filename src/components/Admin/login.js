import React, { useState, useEffect } from "react";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(baseUrl + "/user_auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/");
            } else {
                setError(data.error || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
            <div className="card bg-dark text-light p-4 shadow-lg pBorder" style={{ width: "400px", borderRadius: "12px" }}>
                <h3 className="text-center fw-bold mb-3">Login</h3>
                <hr className="border-light" />
                
                {error && <p className="text-danger text-center">{error}</p>}

                <form onSubmit={handleLogin} className="d-flex flex-column">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" >Email</label>
                        <input type="email" className="form-control text-light bg-dark border-light p-2" placeholder={"Enter the Email Id"}
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control text-light bg-dark border-light p-2" placeholder={"Enter the Password"}
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-lg bg-black w-50 mt-2 mx-auto text-white fw-bold fs-5" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-3 text-center">
                    Don't have an account?{" "}
                    <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
