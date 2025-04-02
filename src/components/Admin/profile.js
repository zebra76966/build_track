import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../config";
import { AuthContext } from "./auth/authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken, clearToken, saveToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = accessToken;
        if (!token) {
          // navigate("/login");
          return;
        }

        const response = await fetch(`${baseUrl}/user_auth/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <div className="card bg-dark text-light p-4 shadow-lg pBorder" style={{ width: "400px", borderRadius: "12px" }}>
        <h3 className="text-center fw-bold mb-3">Profile</h3>
        <hr className="border-light" />

        {error && <p className="text-danger text-center">{error}</p>}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : user ? (
          <div className="d-flex flex-column text-center">
            <p>
              <strong>Name:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        ) : (
          <p className="text-center">No profile data found</p>
        )}

        <button
          className="btn btn-lg bg-black w-50 mt-3 mx-auto text-danger fw-bold fs-5"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
