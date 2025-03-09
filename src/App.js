import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/Admin/admin";
import Login from "./components/Admin/login";
import Register from "./components/Admin/register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Route */}
        <Route path="/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
