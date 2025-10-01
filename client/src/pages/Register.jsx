import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../pages/register.css"; // ✅ Dark theme CSS

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePhoto(file);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("dob", formData.dob);
      data.append("password", formData.password);
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      await axios.post("http://localhost:5000/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Account created successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
      setMessageType("error");
    }
  };

  return (
    <div className="register-container">
      {/* Background */}
      <div className="background-svg">
        <svg viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0C250 0 450 400 720 400C1000 400 1200 0 1440 0V800H0V0Z"
            fill="url(#purple-gradient)"
          />
          <defs>
            <linearGradient
              id="purple-gradient"
              x1="0"
              y1="0"
              x2="1440"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3a0ca3" />
              <stop offset="1" stopColor="#4361ee" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Card */}
      <div className="register-card animated-card">
        <div className="register-header animated-header">
          <div className="icon-circle animated-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" />
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            </svg>
          </div>
          <h1>Create Account</h1>
          <p className="animated-text">Join DBATU Scholar Hub</p>
        </div>

        {/* Error/Success Message */}
        {message && (
          <p className={`message-box ${messageType}`}>{message}</p>
        )}

        <form onSubmit={handleSubmit} className="animated-form">
          <div className="form-group animated-input">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group animated-input delay-1">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group animated-input delay-2">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group animated-input delay-3">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group animated-input delay-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group animated-input delay-5">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary animated-button delay-6"
          >
            Sign Up
          </button>
        </form>

        <div className="signup-text animated-signup-text delay-2">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link-text">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
