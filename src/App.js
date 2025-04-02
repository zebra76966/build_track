import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/Admin/admin";
import Login from "./components/Admin/auth/login";

import Profile from "./components/Admin/profile";
// import ProtectedRoute from "./components/Admin/ProtectedRoute";
import { AuthProvider } from "./components/Admin/auth/authContext";
import { CookiesProvider } from "react-cookie";
import SignUp from "./components/Admin/auth/signup";

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<SignUp />} />

            {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/> */}
            <Route path="/profile" element={<Profile />} />

            {/* Dashboard Route */}
            <Route path="/dashboard/:tab" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
