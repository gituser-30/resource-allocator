import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link import
import "../pages/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear old errors

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ Save token in localStorage (for PrivateRoute)
        localStorage.setItem("token", res.data.token);

        // ✅ Optional: also save user info
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect to home page
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Background */}
      <div className="background-svg">
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0C250.667 0 450.667 400 720 400C989.333 400 1189.33 0 1440 0V800H0V0Z"
            fill="url(#blue-gradient)"
          />
          <defs>
            <linearGradient
              id="blue-gradient"
              x1="0"
              y1="0"
              x2="1440"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0077b6" />
              <stop offset="1" stopColor="#00b4d8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Card */}
      <div className="login-card animated-card">
        <div className="login-header animated-header">
          <div className="icon-circle animated-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="animated-heading">Welcome Back!</h1>
          <p className="animated-text">DBATU Scholar Hub</p>
        </div>

        {/* ✅ Corrected onSubmit */}
        <form onSubmit={handleSubmit} className="animated-form">
          {/* ✅ Error Message */}
          {error && <p className="error-message">{error}</p>}

          <div className="form-group animated-input">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group animated-input delay-1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/forgot-password" className="forgot-link">
              Forgot?
            </Link>
          </div>

          <button type="submit" className="btn-primary animated-button delay-3">
            Sign In
          </button>
        </form>

        <div className="signup-text animated-signup-text delay-2">
          <p>
            Are you a new user?{" "}
            <Link to="/Register" className="login-link-text">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;  