import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin2/Admindashboard");
      } else {
        setError("Invalid email or password ❌");
      }
    } catch (err) {
      console.error("Login Error Details:", err);

      if (
        err.code === "ERR_NETWORK" ||
        err.message.includes("Network Error") ||
        err.response?.status >= 500
      ) {
        setError(
          "Server connection failed. Is the backend running on port 5000? Check MongoDB."
        );
      } else if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Invalid email or password ❌");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Styles (kept same as your original)
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f2ff, #cfe8ff)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    background: "#fff",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    width: "350px",
    transition: "transform 0.3s",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1d4ed8",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1d4ed8",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#1e40af",
    transform: "translateY(-3px)",
  };

  const errorStyle = {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "10px",
  };

  const forgotStyle = {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "10px",
  };

  const forgotLinkStyle = {
    color: "#1d4ed8",
    cursor: "pointer",
    textDecoration: "underline",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...cardStyle,
          transform: hover ? "scale(1.05)" : "scale(1)",
        }}
      >
        <h2 style={titleStyle}>Admin Login</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your admin email"
            required
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={inputStyle}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={
              hover && !loading
                ? { ...buttonStyle, ...buttonHoverStyle }
                : buttonStyle
            }
            onMouseEnter={() => !loading && setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={forgotStyle}>
          Forgot password? <span style={forgotLinkStyle}>Reset here</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
